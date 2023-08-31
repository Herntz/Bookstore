import { IsArray, IsNotEmpty, IsNumber, IsPositive, IsString, Min } from "class-validator";

export class CreateBookDto {
    @IsNotEmpty({message:'book_title can not be blank.'})
    @IsString()
    book_title:string;
    
    @IsNotEmpty({message:'book_description can not be empty.'})
    @IsString()
    book_description:string;

    @IsNotEmpty({message:'book_price should not be empty'})
    @IsNumber({maxDecimalPlaces:2},{message:'book_price should be number & max decimal precission 2'})
    @IsPositive({message:'book_price should be positive number'})
    book_price:number;

    @IsNotEmpty({message:'book_author can not be empty.'})
    @IsString()
    book_author:string;

    @IsNotEmpty({message:'book_stock should not be empty.'})
    @IsNumber({},{message:'book_stock should be number'})
    @Min(0,{message:'book_stock can not be negative.'})
    book_stock:number;

    @IsNotEmpty({message:'book_images should not be empty.'})
    @IsArray({message:'book_images should be in array format.'})
    book_images:string[]

    @IsNotEmpty({message:'genre should not be empty.'})
    @IsNumber({},{message:'genre should be number'})
    genre:number;

}
