import {
   Controller,
   Get,Post, 
   Body, Patch,
   Param, Delete,
   UseGuards, 
   ParseIntPipe, 
   Query,UseInterceptors } from '@nestjs/common';
import { BooksService } from './books.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { ApiCreatedResponse, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthenticationGuard } from 'src/utility/guards/authentication.guards';
import { AuthorizeGuard } from 'src/utility/guards/authorization.guards';
import { Roles } from 'src/utility/common/user.roles.enum';
import { CurrentUser } from 'src/utility/decorators/current-user.decorator';
import { UserEntity } from 'src/users/entities/user.entity';
import { Book } from './entities/book.entity';
import { SerializeIncludes, SerializeInterceptor } from 'src/utility/interceptors/serialize.interceptor';
import { BooksDto } from './dto/books.dto';

@Controller('books')
@ApiTags('Books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @UseGuards(AuthenticationGuard,AuthorizeGuard([Roles.ADMIN]))
  @Post()
  @ApiOperation({ description: 'this is the endpoint for Creating  a book' })
  @ApiCreatedResponse({
    description: 'The record has been successfully created.',
    type: Book,
  }
  )
 async  create(@Body() createBookDto: CreateBookDto,@CurrentUser() currentUser:UserEntity):Promise<Book> {
    return await this.booksService.create(createBookDto,currentUser);
  }

  @SerializeIncludes(BooksDto)
  @Get()
  @ApiOperation({ description: 'this is the endpoint for retrieving  all books' })
  @ApiResponse({
    description: 'The record has been successfully retrieved.',
    type: BooksDto,
    isArray: true,
  })
  async findAll(@Query() query:any):Promise<BooksDto> {
    return await this.booksService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ description: 'this is the endpoint for retrieving  one book' })
  @ApiResponse({
    description: 'The record has been successfully retrieved.',
    type: Book,
  })
  async findOne(@Param('id',ParseIntPipe) id: string):Promise<Book> {
    return await  this.booksService.findOne(+id);
  }

  @UseGuards(AuthenticationGuard,AuthorizeGuard([Roles.ADMIN]))
  @Patch(':id')
  @ApiOperation({ description: 'this is the endpoint for updating  a book' })
  @ApiResponse({
    description: 'The record has been successfully updated.',
    type: Book,
  })
 async update(@Param('id',ParseIntPipe) id: string, @Body() updateBookDto: UpdateBookDto,@CurrentUser() currentUser:UserEntity):Promise<Book> {
    return await this.booksService.update(+id, updateBookDto,currentUser);
  }

  @UseGuards(AuthenticationGuard,AuthorizeGuard([Roles.ADMIN]))
  @Delete(':id')
  @ApiOperation({ description: 'this is the endpoint for deleting  a book' })
  @ApiResponse({
    description: 'The record has been successfully deleted.',
    type: Book,
  })
  remove(@Param('id',ParseIntPipe) id: string) {
    return this.booksService.remove(+id);
  }
}
