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
import { ApiCreatedResponse, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
@ApiTags('orders')
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @UseGuards(AuthenticationGuard)
  @Post()
  @ApiOperation({ description: 'this is the endpoint for Creating  a order' })
  @ApiCreatedResponse({
    description: 'The record has been successfully created.',
    type: CreateOrderDto,
  })
 async create(@Body() createOrderDto: CreateOrderDto,
 @CurrentUser() currentUser:UserEntity)  {
    return await this.ordersService.create(createOrderDto,currentUser);
  }

  @Get()
   @ApiResponse({
    status: 200,
    description: 'The found record',
    type: CreateOrderDto,
    isArray: true,
    })
    @ApiOperation({
      description: 'this is the endpoint for retrieving  all orders',
      })
  async findAll():Promise<Order[]>  {
    return await this.ordersService.findAll();
  }

  @Get(':id')
  @ApiResponse({
    status: 200,
    description: 'The found record',
    type: CreateOrderDto,
    isArray: true,
    })
    @ApiParam({
      name: 'id',
        type: 'string',
      description:'id order'
    })
    @ApiOperation({
      description: 'this is the endpoint for retrieving  one order',
    })
  async findOne(@Param('id') id: string):Promise<Order> {
    return await this.ordersService.findOne(+id);
  }
 
  @UseGuards(AuthenticationGuard,AuthorizeGuard([Roles.ADMIN]))
  @Put(':id')
  @ApiParam({
    name: 'id',
      type: 'number',
    description:'id order'
  })
  @ApiResponse({ type: UpdateOrderStatusDto })
  @ApiOperation({
    description: 'this is the endpoint for updating  a order status',
  })
  async update(@Param('id') id: string, @Body() updateOrderStatusDto: UpdateOrderStatusDto,@CurrentUser() currentUser:UserEntity) {

    return await this.ordersService.update(+id, updateOrderStatusDto,currentUser);
  }

  @Patch('cart/:id')
  @ApiParam({
    name: 'id',
      type: 'number',
    description:'id order'
  })
  @ApiResponse({ type: UpdateCartDto })
  @ApiOperation({
    description: 'this is the endpoint for updating  cart items',
  })
  async updateCartItem(@Param('id') id: string, @Body() updateCartDto: UpdateCartDto,@CurrentUser() currentUser:UserEntity) {
    return await this.ordersService.updateCartItem(+id, updateCartDto,currentUser);
    }
  @UseGuards(AuthenticationGuard,AuthorizeGuard([Roles.ADMIN]))
  @Put('cancel/:id')
   @ApiParam({
    name: 'id',
    type: 'number',
    description:'id order'})
  @ApiOperation({ description: 'this is the endpoint for cancelling  a order',})
  async cancelled(@Param('id') id: string,@CurrentUser() currentUser:UserEntity) {
    return await this.ordersService.cancelled(+id,currentUser);
   
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ordersService.remove(+id);
  }
}
