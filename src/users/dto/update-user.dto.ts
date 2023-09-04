import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { UserSignUpDto } from './user-signup.dto';

export class UpdateUserDto extends PartialType(UserSignUpDto) {}
