import { Injectable,BadRequestException, NotFoundException } from '@nestjs/common';
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
    const genreExist = await this.genreRepository.findOne({where : {genres: genre.genres}})
    if(genreExist) {
      throw new BadRequestException("Genre already exists");
    }
    
    genre.addBy=currentUser;
    return await this.genreRepository.save(genre);
    
  }

  async findAll():Promise<GenreEntity[]> {
    return await this.genreRepository.find();
  }

  async findOne(id: number):Promise<GenreEntity> {
    return this.genreRepository.findOneBy({id});
  }

  async update(id: number, fields:Partial<UpdateGenreDto>):Promise<GenreEntity> {
    const genre=await this.findOne(id);
    if(!genre) throw new NotFoundException('genre not found');
    Object.assign(genre,fields);
    return await this.genreRepository.save(genre);
  }

  remove(id: number) {
    return `This action removes a #${id} genre`;
  }

}

