import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsNotEmpty, IsNumber, IsPositive, IsString, Min } from "class-validator";

export class CreateBookDto {
    @IsNotEmpty({message:'book_title can not be blank.'})
    @IsString()
    @ApiProperty({
        description:'Book Title',
        example:'Harry Potter' 
        })
    book_title:string;
    
    @IsNotEmpty({message:'book_description can not be empty.'})
    @IsString()
    @ApiProperty({
        description:'Book Description',
        example:'Harry Potter is a series of seven fantasy novels written by British author J. K. Rowling.'
        }
        )
    book_description:string;

    @IsNotEmpty({message:'book_price should not be empty'})
    @IsNumber({maxDecimalPlaces:2},{message:'book_price should be number & max decimal precission 2'})
    @IsPositive({message:'book_price should be positive number'})
    @ApiProperty({
        description:'Book Price',
        example:199.99
        }
        )
    book_price:number;

    @IsNotEmpty({message:'book_author can not be empty.'})
    @IsString()
    @ApiProperty({
        description:'Book Author',
        example:'J.K. Rowling'
        })
    book_author:string;

    @IsNotEmpty({message:'book_stock should not be empty.'})
    @IsNumber({},{message:'book_stock should be number'})
    @Min(0,{message:'book_stock can not be negative.'})
    @ApiProperty({
        description:'Book Stock',
        example:10
        })
    book_stock:number;

    @IsNotEmpty({message:'book_images should not be empty.'})
    @IsArray({message:'book_images should be in array format.'})
    @ApiProperty({
        description:'Book Images',
        example:['https://images-na.ssl-images-amazon.com/images/I/81QBj7XIbWL._SX331_BO1,204,203,200_.jpg']
        })
    book_images:string[]

    @IsNotEmpty({message:'genre should not be empty.'})
    @IsNumber({},{message:'genre should be number'})
    @ApiProperty({
        description:'Genre Id',
        example:1
        })
    genreId:number;

}
