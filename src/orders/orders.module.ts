import { Module,forwardRef } from '@nestjs/common';
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
    ShippingEntity]),
    forwardRef(()=>BooksModule)],
  controllers: [OrdersController],
  providers: [OrdersService],
  exports:[OrdersService],
})
export class OrdersModule {}
