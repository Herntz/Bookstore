import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Put } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { AuthenticationGuard } from 'src/utility/guards/authentication.guards';
import { CurrentUser } from 'src/utility/decorators/current-user.decorator';
import { UserEntity } from 'src/users/entities/user.entity';
import { Order } from './entities/order.entity';
import { AuthorizeGuard } from 'src/utility/guards/authorization.guards';
import { Roles } from 'src/utility/common/user.roles.enum';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { UpdateCartDto } from './dto/update-cart.dto';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @UseGuards(AuthenticationGuard)
  @Post()
 async create(@Body() createOrderDto: CreateOrderDto,
 @CurrentUser() currentUser:UserEntity)  {
    return await this.ordersService.create(createOrderDto,currentUser);
  }

  @Get()
  async findAll():Promise<Order[]>  {
    return await this.ordersService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string):Promise<Order> {
    return await this.ordersService.findOne(+id);
  }
 
  @UseGuards(AuthenticationGuard,AuthorizeGuard([Roles.ADMIN]))
  @Put(':id')
  async update(@Param('id') id: string, @Body() updateOrderStatusDto: UpdateOrderStatusDto,@CurrentUser() currentUser:UserEntity) {

    return await this.ordersService.update(+id, updateOrderStatusDto,currentUser);
  }

  @Patch('cart/:id')
  async updateCartItem(@Param('id') id: string, @Body() updateCartDto: UpdateCartDto,@CurrentUser() currentUser:UserEntity) {
    return await this.ordersService.updateCartItem(+id, updateCartDto,currentUser);
    }
  @UseGuards(AuthenticationGuard,AuthorizeGuard([Roles.ADMIN]))
  @Put('cancel/:id')
  async cancelled(@Param('id') id: string,@CurrentUser() currentUser:UserEntity) {
    return await this.ordersService.cancelled(+id,currentUser);
   
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ordersService.remove(+id);
  }
}
