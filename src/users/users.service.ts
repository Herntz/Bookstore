import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { Repository } from 'typeorm';
import { UserSignUp } from './dto/user-signup.dto';
import * as bcrypt from 'bcrypt';
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
  ) {}

async signup(userSignUp: UserSignUp):Promise<UserEntity>{
    
    if(userSignUp.password !== userSignUp.confirm_password) {
      throw new BadRequestException("Passwords do not match");
    }
    const useremail = await this.usersRepository.findOne({where : {email: userSignUp.email}})
    if(useremail) {
      throw new BadRequestException("Email already exists");
    }
    delete userSignUp.confirm_password;
    const user1 = await this.usersRepository.findOne({where : {username: userSignUp.username}})
    if(user1) {
      throw new BadRequestException("Username already exists");
    }
    delete userSignUp.confirm_password;
    const salt = await bcrypt.genSalt()
    userSignUp.password = await bcrypt.hash(userSignUp.password, salt)
    const user = this.usersRepository.create(userSignUp);
    return await this.usersRepository.save(user);
}
  create(createUserDto: CreateUserDto) {
    return 'This action adds a new user';
  }

  findAll() {
    return `This action returns all users`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
