import { BadRequestException, Injectable, NotFoundException} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { Repository } from 'typeorm';
import { UserSignUpDto } from './dto/user-signup.dto';
import * as bcrypt from 'bcrypt';
import { UserSignInDto } from './dto/user-signin.dto';
import { sign } from 'jsonwebtoken';
@Injectable()
export class UsersService {

  constructor(
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
  ) {}

async signup(userSignUp: UserSignUpDto):Promise<UserEntity>{
    
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

async signin(userSignInDto: UserSignInDto):Promise<UserEntity>{
  const user = await this.usersRepository.createQueryBuilder("users")
  .addSelect("users.password")
  .where("users.username = :username", {username: userSignInDto.username}).getOne();
  if(!user) throw new BadRequestException("Username does not exist");
  const isMatch = await bcrypt.compare(userSignInDto.password, user.password)
  if(!isMatch) throw new BadRequestException("Password is incorrect");
  delete user.password;
  return user;

}
  create(createUserDto: CreateUserDto) {
    return 'This action adds a new user';
  }

  async findAll(): Promise<UserEntity[]> {
    return await this.usersRepository.find();
  }

 async findOne(id: number): Promise<UserEntity> {
    const user = await this.usersRepository.findOneBy({id})
    if(!user) throw new NotFoundException('user not found.');
    return user;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
  async findUserByUsername(username:string){
    return await this.usersRepository.findOneBy({username});
  }

  
}
