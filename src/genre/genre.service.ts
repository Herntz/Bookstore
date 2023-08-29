import { Injectable } from '@nestjs/common';
import { CreateGenreDto } from './dto/create-genre.dto';
import { UpdateGenreDto } from './dto/update-genre.dto';
import { GenreEntity } from './entities/genre.entity';
import { Repository } from 'typeorm'
import { CurrentUser } from 'src/utility/decorators/current-user.decorator';
import { UserEntity } from 'src/users/entities/user.entity';

@Injectable()
export class GenreService {
  constructor(@InjectRepository(GenreEntity)private readonly 
  genreRepository:Repository<GenreEntity>){}

 async create(createGenreDto: CreateGenreDto, @CurrentUser() currentUser:UserEntity):Promise<GenreEntity> {
    const genre= await this.genreRepository.create(createGenreDto);
    genre.addBy=currentUser;
    return await this.genreRepository.save(genre);
    
  }

  findAll() {
    return `This action returns all genre`;
  }

  findOne(id: number) {
    return `This action returns a #${id} genre`;
  }

  update(id: number, updateGenreDto: UpdateGenreDto) {
    return `This action updates a #${id} genre`;
  }

  remove(id: number) {
    return `This action removes a #${id} genre`;
  }
}
function InjectRepository(GenreEntity: any): (target: typeof GenreService, propertyKey: undefined, parameterIndex: 0) => void {
  throw new Error('Function not implemented.');
}

