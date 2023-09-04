import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { UserEntity } from 'src/users/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ReviewEntity } from './entities/review.entity';
import { Repository } from 'typeorm';
import { BooksService } from 'src/books/books.service';

@Injectable()
export class ReviewsService {
  constructor(@InjectRepository(ReviewEntity) private readonly 
  reviewRepository:Repository<ReviewEntity>,
  private readonly bookService:BooksService
  ){}

  async create(createReviewDto: CreateReviewDto,currentUser:UserEntity):Promise<ReviewEntity> {
  const book=await this.bookService.findOne(createReviewDto.bookId); 
   let review=await this.findOneByUserAndBook(currentUser.id,createReviewDto.bookId);
    if(!review){
    review=this.reviewRepository.create(createReviewDto);
    review.user=currentUser;
    review.book=book; 
    }else{
      review.comment=createReviewDto.comment,
      review.ratings=createReviewDto.ratings
    }
  return await this.reviewRepository.save(review);
  }

  findAll() {
    return `This action returns all reviews`;
  }

  async findOne(id: number) {
    const review=await this.reviewRepository.findOne({
      where:{id},
      relations:{
        user:true,
        book:{
          genre:true
      }
    }
    })
    if(!review) throw new NotFoundException('Review not found.')
    return review;
  }

  update(id: number, updateReviewDto: UpdateReviewDto) {
    return `This action updates a #${id} review`;
  }

  remove(id: number) {
    return `This action removes a #${id} review`;
  }
  async findOneByUserAndBook(userId:number,bookId:number){
    return await this.reviewRepository.findOne({
      where:{
        user:{
          id:userId
        },
        book:{
          id:bookId
        }
      },
      relations:{
        user:true,
        book:{
          category:true
        }
      }
    })

  }
}
