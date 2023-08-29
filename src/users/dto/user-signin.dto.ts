import { IsNotEmpty,   Min,   MinLength, min } from "class-validator";

export class UserSignInDto{

    @IsNotEmpty({message: 'username is required'})
    @MinLength(5, {message: 'username must be at least 5 characters'})
    username: string;

    @IsNotEmpty({message: 'Password is required'})
    @MinLength(5, {message: 'Password minimum character should be 8'})
    password: string;


} 
