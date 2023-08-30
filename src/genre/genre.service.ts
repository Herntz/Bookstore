import { Injectable, NotFoundException } from '@nestjs/common';
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

  async findAll() {
    return await this.genreRepository.find();
  }

  async findOne(id: number) {
    return this.genreRepository.findOneBy({id});
  }

  async update(id: number, fields:Partial<UpdateGenreDto>) {
    const genre=await this.findOne(id);
    if(!genre) throw new NotFoundException('genre not found');
    Object.assign(genre,fields);
    return await this.genreRepository.save(genre);
  }

  remove(id: number) {
    return `This action removes a #${id} genre`;
  }

}

