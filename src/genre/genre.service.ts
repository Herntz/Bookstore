import { Injectable } from '@nestjs/common';
import { CreateGenreDto } from './dto/create-genre.dto';
import { UpdateGenreDto } from './dto/update-genre.dto';
import { GenreEntity } from './entities/genre.entity';
import { UserEntity } from 'src/users/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class GenreService {
  constructor(@InjectRepository(GenreEntity)
   private readonly genreRepository:Repository<GenreEntity>){}

 async create(createGenreDto: CreateGenreDto,currentUser:UserEntity):Promise<GenreEntity> {
    const genre= this.genreRepository.create(createGenreDto);
    genre.addBy=currentUser;
    return await this.genreRepository.save(genre);
    
  }

  findAll() {
    return `This action returns all genre`;
  }

  async findOne(id: number) {
    return this.genreRepository.findOne(
      {
        where:{id:id},
        relations:{addBy:true},
        select:{
          addBy:{
         id:true,
         nom:true,
         email:true,
          }
        }
      }
     
    );
  }

  update(id: number, updateGenreDto: UpdateGenreDto) {
    return `This action updates a #${id} genre`;
  }

  remove(id: number) {
    return `This action removes a #${id} genre`;
  }

}

