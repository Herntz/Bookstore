import { BadRequestException, Inject, Injectable, NotFoundException, forwardRef } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UserEntity } from 'src/users/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { Repository } from 'typeorm';
import { OrdersBooksEntity } from './entities/orders-products.entity';
import { ShippingEntity } from './entities/shipping.entity';
import { Book } from 'src/books/entities/book.entity';
import { BooksService } from 'src/books/books.service';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { OrderStatus } from './enums/order-status.enum';
import { UpdateCartDto } from './dto/update-cart.dto';

@Injectable()
export class OrdersService {

  constructor(
    @InjectRepository(Order) private readonly orderRepository:Repository<Order>,
    @InjectRepository(OrdersBooksEntity) private readonly opRepository:Repository<OrdersBooksEntity>,
    @Inject(forwardRef(()=>BooksService))private readonly bookService:BooksService
  ){}
 
 
  async create(createOrderDto: CreateOrderDto, currentUser: UserEntity): Promise<Order> {
    const shippingEntity = new ShippingEntity();
    Object.assign(shippingEntity, createOrderDto.shippingAdress);
  
    const orderEntity = new Order();
    orderEntity.shippingAdress = shippingEntity;
    orderEntity.user = currentUser;
  
    const orderEn = await this.orderRepository.save(orderEntity);
  
    let opEntity: {
      order: Order,
      books: Book,
      book_quantity: number,
      book_unit_price: number
    }[] = [];
  
    for (let i = 0; i < createOrderDto.orderedBooks.length; i++) {
      const order = orderEn;
      const books = await this.bookService.findOne(createOrderDto.orderedBooks[i].id);
      const book_quantity = createOrderDto.orderedBooks[i].book_quantity;
      const book_unit_price= books.book_price;
      opEntity.push({ order, books, book_quantity, book_unit_price });
    }
    
    const op = await this.opRepository.createQueryBuilder()
      .insert()
      .into(OrdersBooksEntity)
      .values(opEntity)
      .execute();
    const finalOrder = await this.findOne(orderEn.id);
    let totalPanier = await this.dynamicTotalPrice(orderEn.id);
    finalOrder.total_Panier = totalPanier;
  
    return finalOrder; // Retournez le nouvel objet de type Order
  }
  

  async findAll(): Promise<Order[]> {
    const orders = await this.orderRepository.find({
      relations: {
        shippingAdress: true,
        user: true,
        books: { books: true }
      }
    });
  
    for (const order of orders) {
      const total = await this.dynamicTotalPrice(order.id);
      order.total_Panier = total;
    }
  
    return orders;
  }
  

 async findOne(id: number):Promise<Order>  {
  const order=await this.orderRepository.findOne({
    where:{id},relations:{
      shippingAdress:true, user:true,books:{books:true}
    }
  });
    order.total_Panier= await this.dynamicTotalPrice(id);
    return  order;
  }

  async findOneBookById(id:number) {
    return await this.opRepository.findOne({
      relations:{books:true},
      where:{books:{id:id}}
    })
  }
async dynamicTotalPrice(id:number){
  let total=0;
  const book= await this.opRepository.find({
    relations:{order:true},
    where:{order:{id:id}}
  })
  for(let i=0;i<book.length;i++){
    total+=book[i].book_quantity*book[i].book_unit_price;
  }

  return total;
}
 async update(id: number, updateOrderStatusDto: UpdateOrderStatusDto, currentUser) {
      let order=await this.findOne(id);
      if(!order)throw new NotFoundException('Order not found');
      
      if((order.status===OrderStatus.DELIVERED)||
       (order.status===OrderStatus.CANCELLED))
    { throw new BadRequestException(`Order already ${order.status}`);}
    
      if((order.status===OrderStatus.PROCESSING)&&
      (updateOrderStatusDto.status!=OrderStatus.SHIPPED))
    { throw new BadRequestException(`Delivery before shipped !!!`);}
      
    if((updateOrderStatusDto.status===OrderStatus.PROCESSING)&&(order.status===OrderStatus.SHIPPED))
    { return order;}

    if(updateOrderStatusDto.status===OrderStatus.SHIPPED){ 
      order.shippedAt=new Date();
    }

    if(updateOrderStatusDto.status===OrderStatus.DELIVERED){
      order.deliveredAt=new Date();
    }
    order.status=updateOrderStatusDto.status;
    order.updatedBy=currentUser;
    order= await this.orderRepository.save(order);
    if(updateOrderStatusDto.status=== OrderStatus.DELIVERED)
    {await this.stockUpdate(order,OrderStatus.DELIVERED);}

  return order;
  }
 
  async cancelled(id:number,currentUser:UserEntity){
    let  order =await this.findOne(id);
    if(!order) throw new NotFoundException('Order not found');

    if(order.status===OrderStatus.CANCELLED) return order;

    order.status=OrderStatus.CANCELLED;
    order.updatedBy=currentUser;
    order =await this.orderRepository.save(order);
    await this.stockUpdate(order,OrderStatus.CANCELLED);
    return order;
  }

  remove(id: number) {
    return `This action removes a #${id} order`;
  }

  
  async stockUpdate(order:Order,status:string){
    for(const op of order.books){
      await this.bookService.updateStock(op.books.id,op.book_quantity,status);
    }
  }

  async updateCartItem(orderId: number, updateCartDto: UpdateCartDto, currentUser: UserEntity): Promise<Order> {
    const order = await this.findOne(orderId);
  
    if (!order) {
      throw new NotFoundException(`Order with ID ${orderId} not found`);
    }
  
    // Convertissez order.status en chaîne de caractères
    const orderStatusString = order.status.toString();
  
    // Vérifiez si la commande est dans un état valide pour la modification des livres
    const allowedStatusesForProductUpdate: string[] = [OrderStatus.PROCESSING.toString(), OrderStatus.SHIPPED.toString()];
  
    if (!allowedStatusesForProductUpdate.includes(orderStatusString)) {
      throw new BadRequestException(`Cannot update book for an order with status ${order.status}`);
    }
  
    // Recherchez l'élément du panier spécifique dans la commande en fonction de l'ID du livre
    const cartItem = order.books.find((item) => item.books.id === updateCartDto.id);
  
    if (!cartItem) {
      throw new NotFoundException(`Product with ID ${updateCartDto.id} not found in the order`);
    }
  
    // Mettez à jour la quantité de l'élément du panier
    cartItem.book_quantity = updateCartDto.book_quantity;
  
    // Enregistrez les modifications dans la base de données
    const updatedOrder = await this.orderRepository.save(order);
  
    // Mettez à jour le total du panier
    updatedOrder.total_Panier = await this.dynamicTotalPrice(orderId);
  
    return updatedOrder;
  }
  
}
