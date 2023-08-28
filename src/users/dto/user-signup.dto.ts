import { IsEmail, IsNotEmpty, IsString,  MinLength } from "class-validator";
import { UserSignInDto } from "./user-signin.dto";
export class UserSignUpDto extends UserSignInDto{

    @IsNotEmpty({message: 'Name is required'})
    @IsString({message: 'Name must be a string'})
    nom: string;

    @IsNotEmpty({message: 'first name is required'})
    @IsString({message: 'first name must be a string'})
    prenom: string;

    @IsNotEmpty({message: 'Email is required'})
    @IsEmail({}, {message: 'Email is invalid'})
    email: string;


    @IsNotEmpty()
    @MinLength(8, {message: 'Password minimum character should be 8'})
    confirm_password: string;


} 
