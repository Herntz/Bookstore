import { Injectable } from '@nestjs/common';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { Book } from './entities/book.entity';

@Injectable()
export class BooksService {
  create(createBookDto: CreateBookDto) {
    return 'This action adds a new book';
  }

  async findAll() :Promise<Book[]> {
    return this.bookRepository.find();
  }

  async findOne(id: number) {
    return await this.bookRepository.findOne({
      where:{id:id},
    });
  }

  update(id: number, updateBookDto: UpdateBookDto) {
    return `This action updates a #${id} book`;
  }

  remove(id: number) {
    return `This action removes a #${id} book`;
  }
}
