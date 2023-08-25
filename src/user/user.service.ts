import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}
 
  async create(createUserDto: CreateUserDto) {
    if(createUserDto.password !== createUserDto.confirm_password) {
      throw new BadRequestException("Passwords do not match");
    }
    const user = await this.usersRepository.findOne({where : {email: createUserDto.email}})
    if(user) {
      throw new BadRequestException("Email already exists");
    }
    delete createUserDto.confirm_password;
    const user1 = await this.usersRepository.findOne({where : {username: createUserDto.username}})
    if(user1) {
      throw new BadRequestException("Username already exists");
    }
    delete createUserDto.confirm_password;
    const salt = await bcrypt.genSalt()
    createUserDto.password = await bcrypt.hash(createUserDto.password, salt)
    return await this.usersRepository.save(createUserDto);
  }
  async findAll() {
    return await this.usersRepository.find();
  }

  async findOne(id: number) {
    return await this.usersRepository.findOne({ where: { id } });

  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
