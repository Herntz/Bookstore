import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, ParseIntPipe } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserSignUpDto } from './dto/user-signup.dto';
import { UserEntity } from './entities/user.entity';
import { UserSignInDto } from './dto/user-signin.dto';
import { CurrentUser } from 'src/utility/decorators/current-user.decorator';
import { AuthenticationGuard } from 'src/utility/guards/authentication.guards';
import { Roles } from 'src/utility/common/user.roles.enum';
import { AuthorizeGuard } from 'src/utility/guards/authorization.guards';
import {  ApiOperation, ApiParam, ApiResponse,ApiCreatedResponse, ApiTags } from '@nestjs/swagger';

@Controller('users')
@ApiTags('Users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}


  @Post('signup')
  @ApiOperation({ description: 'this is the endpoint for Creating  a user' })
  @ApiCreatedResponse({
    description: 'The record has been successfully created.',
    type: UserSignUpDto,
  })
  async signup(@Body() body: UserSignUpDto):Promise<{user:UserEntity}>{
       return {user:await this.usersService.signup(body)};
    }
  @Post('signin')
    async signin(@Body() userSignInDto: UserSignInDto): Promise<{
      accessToken: string;
      user: UserEntity;
  }>
      {
        const user= await this.usersService.signin(userSignInDto);
        const accessToken= await this.usersService.accessToken(user);
        return {accessToken,user};
      }
       

  @UseGuards(AuthenticationGuard,AuthorizeGuard([Roles.ADMIN]))
  @Get('all')
  @ApiOperation({
    description: 'this is the endpoint for retrieving all  users without filter',
  })
  @ApiResponse({
    type: UserSignUpDto,
    description: 'Operation to retrieve all users without filtering',
    isArray: true,
  })
  async findAll(): Promise<UserEntity[]> {
    return await this.usersService.findAll();
  }

  @Get('single/:id')
  @ApiResponse({
    status: 200,
    description: 'The found record',
    type: UserSignUpDto,
    isArray: true,
    })
    @ApiParam({
      name: 'id',
        type: 'string',
      description:'id user'
    })
    @ApiOperation({
      description: 'this is the endpoint for retrieving  one user',
    })
  async findOne(@Param('id',ParseIntPipe) id: string) {
    return await this.usersService.findOne(+id);
  }

  @UseGuards(AuthenticationGuard)
  @Patch('me')
  @ApiResponse({ type: CreateUserDto })
  @ApiOperation({
    description: 'this is the endpoint for updating  a user',
  })
  async updateUserProfile(@Body() updateUserDto: UpdateUserDto,@CurrentUser() currentUser:UserEntity,): Promise<UserEntity> {
    const user= currentUser;
    return await this.usersService.update(updateUserDto,user);
  } 

  @Delete(':id')
  @ApiParam({
    name: 'id',
      type: 'string',
    description:'id user'
  })
  @ApiResponse({ type: CreateUserDto })
  @ApiOperation({
    description: 'this is the endpoint for deleting  a user',
  })
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }

  @UseGuards(AuthenticationGuard)
  @Get('me')
  @ApiOperation({
    description: 'this is the endpoint for retrieving  user profile',
    })
    @ApiResponse({
      status: 200,
      description: 'The found record',
      type: UserSignUpDto,
      isArray: true,
      }
      )
  getProfile(@CurrentUser() currentUser:UserEntity){
  return currentUser
  }
}
