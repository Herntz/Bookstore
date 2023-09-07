import { Module, forwardRef } from '@nestjs/common';
import { BooksService } from './books.service';
import { BooksController } from './books.controller';
import { Book } from './entities/book.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GenreModule } from 'src/genre/genre.module';
import { OrdersModule } from 'src/orders/orders.module';

@Module({
  imports:[TypeOrmModule.forFeature([Book]),
  GenreModule,forwardRef(()=>OrdersModule)],
  controllers: [BooksController],
  providers: [BooksService],
  exports:[BooksService],
})
export class BooksModule {}
