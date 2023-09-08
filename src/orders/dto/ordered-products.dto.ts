import { IsNotEmpty, IsNumber, IsPositive } from "class-validator";

export class OrderedBooksDto{
    @IsNotEmpty({message:'Book can not be empty'})
    id:number;

    @IsNumber({},{message:'Quantity should be number'})
    @IsPositive({message:'Quantity can not be negative'})
    book_quantity:number;
}