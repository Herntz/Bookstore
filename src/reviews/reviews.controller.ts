import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserSignUpDto } from 'src/users/dto/user-signup.dto';
import { AuthenticationGuard } from 'src/utility/guards/authentication.guards';
import { CurrentUser } from 'src/utility/decorators/current-user.decorator';
import { UserEntity } from 'src/users/entities/user.entity';
import { ReviewEntity } from './entities/review.entity';
import { Roles } from 'src/utility/common/user.roles.enum';
import { AuthorizeGuard } from 'src/utility/guards/authorization.guards';

@Controller('reviews')
@ApiTags('Reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}


  @UseGuards(AuthenticationGuard)
  @Post()
  @ApiOperation({ description: 'this is the endpoint for Creating  a review' })
  @ApiResponse({
    description: 'The record has been successfully created.',
    type: ReviewEntity,
  })
 async create(@Body() createReviewDto: CreateReviewDto,@CurrentUser() currentUser:UserEntity)
 :Promise<ReviewEntity> {
    return await this.reviewsService.create(createReviewDto,currentUser);
  }

  @Get('/all')
  @ApiOperation({ description: 'this is the endpoint for retrieving  all reviews' })
  @ApiResponse({
    description: 'The record has been successfully retrieved.',
    type: ReviewEntity,
    isArray: true,})
  findAll() {
    return this.reviewsService.findAll();
  }

  @Get()
 async findAllByBook(@Body('bookId') bookId:number){
    return await this.reviewsService.findAllByBook(+bookId);

  }

  @Get(':id')
  @ApiOperation({ description: 'this is the endpoint for retrieving  one review' })
  @ApiResponse({
    description: 'The record has been successfully retrieved.',
    type: ReviewEntity,
    isArray: true,} )
  async findOne(@Param('id') id: string):Promise<ReviewEntity>  {
    return await this.reviewsService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ description: 'this is the endpoint for updating  a review' })
  @ApiResponse({
    description: 'The record has been successfully updated.',
    type: ReviewEntity,})
  update(@Param('id') id: string, @Body() updateReviewDto: UpdateReviewDto) {
    return this.reviewsService.update(+id, updateReviewDto);
  }

  @UseGuards(AuthenticationGuard,AuthorizeGuard([Roles.ADMIN]))
  @Delete(':id')
  @ApiOperation({ description: 'this is the endpoint for deleting  a review' })
  @ApiResponse({
    description: 'The record has been successfully deleted.',
    type: ReviewEntity,}
    )
  remove(@Param('id') id: string) {
    return this.reviewsService.remove(+id);
  }
}
