import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { OrdersBooksEntity } from './entities/orders-products.entity';
import { ShippingEntity } from './entities/shipping.entity';
import { BooksModule } from 'src/books/books.module';

@Module({
  imports:[TypeOrmModule.forFeature([Order,
    OrdersBooksEntity,
    ShippingEntity]),BooksModule],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}
