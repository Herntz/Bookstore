import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Book } from './entities/book.entity';
import { Repository } from 'typeorm';
import { GenreService } from 'src/genre/genre.service';
import { UserEntity } from 'src/users/entities/user.entity';
import { OrderStatus } from 'src/orders/enums/order-status.enum';


@Injectable()
export class BooksService {
  constructor(@InjectRepository(Book) private readonly bookRepository:Repository<Book>,
  private readonly genreService: GenreService){}
  
  
  async create(createBookDto: CreateBookDto,currentUser:UserEntity):Promise<Book> {
    const genre =await this.genreService.findOne(+createBookDto.genreId);

    const book = this.bookRepository.create(createBookDto);
    book.genre = genre;

    book.addBy=currentUser;
    return await this.bookRepository.save(book);
  }

  async findAll() :Promise<Book[]> {
    return this.bookRepository.find();
  }

  async findOne(id: number) {
    const findBook=await this.bookRepository.findOne({
      where:{id:id},
      relations:{addBy:true,genre:true,},
      select:{
            addBy:{id:true,nom:true,prenom:true, email:true,},
            genre:{ id:true,genres:true}
             }
    });
    if (!findBook)throw new NotFoundException('Book by id `'+id+'` not found ');
  return findBook;
  }

  async update(id: number, updateBookDto:Partial<UpdateBookDto>,currentUser:UserEntity):Promise<Book> {
    const book= await this.findOne(id);
    Object.assign(book,updateBookDto)
    book.addBy=currentUser;
    if (updateBookDto.genreId) {
      const genre =await this.genreService.findOne(+updateBookDto.genreId);
      book.genre=genre
    }

    return await this.bookRepository.save(book);
  }

  async remove(id: number){
    const book = await this.findOne(id);
    if (!book) {
      throw new NotFoundException('Etudiant not found');
    }
    return await this.bookRepository.delete(id);
  }

  async updateStock(id:number,stock:number,status:string){
    let book=await this.findOne(id);
    if(status===OrderStatus.DELIVERED){
      book.book_stock-=stock;
    }else{
      book.book_stock+=stock;
    }
    book=await this.bookRepository.save(book);
    return book; 
  }
}
