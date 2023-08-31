import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { BooksService } from './books.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { ApiTags } from '@nestjs/swagger';
import { AuthenticationGuard } from 'src/utility/guards/authentication.guards';
import { AuthorizeGuard } from 'src/utility/guards/authorization.guards';
import { Roles } from 'src/utility/common/user.roles.enum';
import { CurrentUser } from 'src/utility/decorators/current-user.decorator';
import { UserEntity } from 'src/users/entities/user.entity';
import { Book } from './entities/book.entity';

@Controller('books')
@ApiTags('Books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @UseGuards(AuthenticationGuard,AuthorizeGuard([Roles.ADMIN]))
  @Post()
 async  create(@Body() createBookDto: CreateBookDto,@CurrentUser() currentUser:UserEntity):Promise<Book> {
    return await this.booksService.create(createBookDto,currentUser);
  }

  @Get()
  async findAll():Promise<Book[]> {
    return await this.booksService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await  this.booksService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBookDto: UpdateBookDto) {
    return this.booksService.update(+id, updateBookDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.booksService.remove(+id);
  }
}
