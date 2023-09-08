import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsPositive } from "class-validator";

export class OrderedBooksDto{
    @IsNotEmpty({message:'Book can not be empty'})
    @ApiProperty({
        description:'Book Id'})
    id:number;

    @IsNumber({},{message:'Quantity should be number'})
    @IsPositive({message:'Quantity can not be negative'})
    @ApiProperty({
        description:'Quantity'})
    book_quantity:number;
}