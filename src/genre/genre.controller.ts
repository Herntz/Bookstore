import { Controller, Get, Post, Body, Patch, Param, Delete , UseGuards} from '@nestjs/common';
import { GenreService } from './genre.service';
import { CreateGenreDto } from './dto/create-genre.dto';
import { UpdateGenreDto } from './dto/update-genre.dto';
import { CurrentUser } from 'src/utility/decorators/current-user.decorator';
import { UserEntity } from 'src/users/entities/user.entity';
import { AuthorizeGuard } from 'src/utility/guards/authorization.guards';
import { Roles } from 'src/utility/common/user.roles.enum';
import { AuthenticationGuard } from 'src/utility/guards/authentication.guards';
import { GenreEntity } from './entities/genre.entity';

@Controller('genres')
export class GenreController {
  constructor(private readonly genreService: GenreService) {}

  @UseGuards(AuthenticationGuard,AuthorizeGuard([Roles.ADMIN]))
  @Post()
  async create(@Body() createGenreDto: CreateGenreDto, @CurrentUser()
   currentUser:UserEntity):Promise<GenreEntity> {
    return await this.genreService.create(createGenreDto,currentUser);
  }

  @Get()
  async findAll():Promise<GenreEntity[]> {
    return await this.genreService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string):Promise<GenreEntity> {
    return this.genreService.findOne(+id);

  }
  @UseGuards(AuthenticationGuard,AuthorizeGuard([Roles.ADMIN]))
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateGenreDto: UpdateGenreDto):Promise<GenreEntity> {
    return await this.genreService.update(+id, updateGenreDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.genreService.remove(+id);
  }
}
