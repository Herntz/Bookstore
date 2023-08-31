import { Injectable } from '@nestjs/common';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Book } from './entities/book.entity';
import { Repository } from 'typeorm';
import { GenreService } from 'src/genre/genre.service';
import { UserEntity } from 'src/users/entities/user.entity';

@Injectable()
export class BooksService {
  constructor(@InjectRepository(Book) private readonly bookRepository:Repository<Book>,
  private readonly genreService: GenreService){}
  
  
  async create(createBookDto: CreateBookDto,currentUser:UserEntity):Promise<Book> {
    const genre =await this.genreService.findOne(+createBookDto.genre);
    const book = this.bookRepository.create(createBookDto);
    book.genre = genre;
    book.addBy=currentUser;
    return await this.bookRepository.save(book);
  }

  findAll() {
    return `This action returns all books`;
  }

  findOne(id: number) {
    return `This action returns a #${id} book`;
  }

  update(id: number, updateBookDto: UpdateBookDto) {
    return `This action updates a #${id} book`;
  }

  remove(id: number) {
    return `This action removes a #${id} book`;
  }
}
