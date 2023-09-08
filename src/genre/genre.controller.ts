import { Controller, Get, Post, Body, Patch, Param, Delete , UseGuards, ParseIntPipe} from '@nestjs/common';
import { GenreService } from './genre.service';
import { CreateGenreDto } from './dto/create-genre.dto';
import { UpdateGenreDto } from './dto/update-genre.dto';
import { CurrentUser } from 'src/utility/decorators/current-user.decorator';
import { UserEntity } from 'src/users/entities/user.entity';
import { AuthorizeGuard } from 'src/utility/guards/authorization.guards';
import { Roles } from 'src/utility/common/user.roles.enum';
import { AuthenticationGuard } from 'src/utility/guards/authentication.guards';
import { GenreEntity } from './entities/genre.entity';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@Controller('genres')
@ApiTags('Genres')
export class GenreController {
  constructor(private readonly genreService: GenreService) {}

  @UseGuards(AuthenticationGuard,AuthorizeGuard([Roles.ADMIN]))
  @Post()
  @ApiOperation({ description: 'this is the endpoint for Creating  a genre' })
  @ApiResponse({
    description: 'The record has been successfully created.',
    type: GenreEntity,
  }
  )
  async create(@Body() createGenreDto: CreateGenreDto, @CurrentUser()
   currentUser:UserEntity):Promise<GenreEntity> {
    return await this.genreService.create(createGenreDto,currentUser);
  }

  @Get()
  @ApiOperation({ description: 'this is the endpoint for retrieving  all genres' })
  @ApiResponse({
    description: 'The record has been successfully retrieved.',
    type: GenreEntity,
    isArray: true,
  } )
  findAll() {
    return this.genreService.findAll();
  }

  @Get(':id')
  @ApiOperation({ description: 'this is the endpoint for retrieving  one genre' })
  @ApiResponse({
    description: 'The record has been successfully retrieved.',
    type: GenreEntity,
  })
  async findOne(@Param('id',ParseIntPipe) id: string) {
    return this.genreService.findOne(+id);

  }

  @Patch(':id')
  @ApiOperation({ description: 'this is the endpoint for updating  a genre' })
  @ApiResponse({
    description: 'The record has been successfully updated.',
    type: GenreEntity,
  })
  update(@Param('id',ParseIntPipe) id: string, @Body() updateGenreDto: UpdateGenreDto) {
    return this.genreService.update(+id, updateGenreDto);
  }

  @Delete(':id')
  @ApiOperation({ description: 'this is the endpoint for deleting  a genre' })
  @ApiResponse({
    description: 'The record has been successfully deleted.',
    type: GenreEntity,
  })
  remove(@Param('id') id: string) {
    return this.genreService.remove(+id);
  }
}
