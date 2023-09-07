import { BadRequestException, Injectable,Inject, NotFoundException, forwardRef } from '@nestjs/common';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Book } from './entities/book.entity';
import { Repository } from 'typeorm';
import { GenreService } from 'src/genre/genre.service';
import { UserEntity } from 'src/users/entities/user.entity';
import { OrderStatus } from 'src/orders/enums/order-status.enum';
import dataSource from 'db/data-source';
import { OrdersService } from 'src/orders/orders.service';


@Injectable()
export class BooksService {
  constructor(@InjectRepository(Book) private readonly bookRepository:Repository<Book>,
  private readonly genreService: GenreService,
  @Inject(forwardRef(()=>OrdersService)) private readonly orderService:OrdersService
  ){}
  
  
  async create(createBookDto: CreateBookDto,currentUser:UserEntity):Promise<Book> {
    const genre =await this.genreService.findOne(+createBookDto.genreId);

    const book = this.bookRepository.create(createBookDto);
    book.genre = genre;

    book.addBy=currentUser;
    return await this.bookRepository.save(book);
  }


async findAll(query: any): Promise<{ books: any[]; totalBooks: number; limit: number }> {
  let limit: number;
  if (!query.limit) {
    limit = 4;
  } else {
    limit = query.limit;
  }

  const queryBuilder = dataSource.getRepository(Book)
    .createQueryBuilder('book')
    .leftJoinAndSelect('book.genre', 'genre')
    .leftJoin('book.reviews', 'review')
    .addSelect([
      'COUNT(review.id) as reviewCount',
      'AVG(review.ratings) as avgRating',
    ])
    .groupBy('book.id,genre.id');
  const totalBooks = await queryBuilder.getCount();

  if (query.search) {
    const search = query.search;
    queryBuilder.andWhere("book.book_title like :book_title", { book_title: `%${search}%` });
  }
  if (query.genre) {
    queryBuilder.andWhere("genre.genres = :genres", { genres: query.genre });
  }
  if (query.minPrice) {
    queryBuilder.andWhere("book.book_price >= :minPrice", { minPrice: query.minPrice });
  }
  if (query.maxPrice) {
    queryBuilder.andWhere("book.book_price <= :maxPrice", { maxPrice: query.maxPrice });
  }
  if (query.minRating) {
    queryBuilder.andHaving('AVG(review.ratings) >= :minRating', { minRating: query.minRating });
  }

  if (query.maxRating) {
    queryBuilder.andHaving('AVG(review.ratings) <= :maxRating', { maxRating: query.maxRating });
  }

  queryBuilder.limit(limit);
  if (query.offset) {
    queryBuilder.offset(query.offset);
  }
  const books = await queryBuilder.getRawMany();

  return { books, totalBooks, limit };
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
    const order = await this.orderService.findOneBookById(book.id)
    if(order) throw new BadRequestException('Book is in use');
    if (!book) throw new NotFoundException('book not found');
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
