import { Module } from '@nestjs/common';
import { BooksService } from './books.service';
import { BooksController } from './books.controller';
import { Book } from './entities/book.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GenreModule } from 'src/genre/genre.module';

@Module({
  imports:[TypeOrmModule.forFeature([Book]),GenreModule],
  controllers: [BooksController],
  providers: [BooksService],
})
export class BooksModule {}
