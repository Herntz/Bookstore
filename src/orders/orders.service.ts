import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
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

@Injectable()
export class OrdersService {
  constructor(@InjectRepository(Order) private readonly orderRepository:Repository<Order>,
  @InjectRepository(OrdersBooksEntity) private readonly opRepository:Repository<OrdersBooksEntity>,
  private readonly bookService:BooksService
  ){}
 
  async create(createOrderDto: CreateOrderDto, currentUser:UserEntity):Promise<Order>  {
   const shippingEntity= new ShippingEntity();
   Object.assign(shippingEntity,createOrderDto.shippingAdress);

   const orderEntity= new Order();
   orderEntity.shippingAdress=shippingEntity;
   orderEntity.user=currentUser;

   const orderEn= await this.orderRepository.save(orderEntity);

   let opEntity:{
    order:Order,
    books:Book,
    book_quantity:number,
    book_unit_price:number
   }[]=[];

   for(let i=0; i<createOrderDto.orderedBooks.length;i++){
    const order=orderEn;
    const books=await this.bookService.findOne(createOrderDto.orderedBooks[i].id);
    const book_quantity=createOrderDto.orderedBooks[i].book_quantity;
    const book_unit_price=createOrderDto.orderedBooks[i].book_unit_price;
    opEntity.push({order,books,book_quantity,book_unit_price});
  }

    const op= await this.opRepository.createQueryBuilder()
    .insert()
    .into(OrdersBooksEntity)
    .values(opEntity)
    .execute();
  return  await this.findOne(orderEn.id);
  }

 async findAll():Promise<Order[]>  {
  return await this.orderRepository.find({
    relations:{
      shippingAdress:true, user:true,books:{books:true}
    }
  });
  }

 async findOne(id: number):Promise<Order>  {
    return await this.orderRepository.findOne({
      where:{id},relations:{
        shippingAdress:true, user:true,books:{books:true}
      }
    });
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
}
