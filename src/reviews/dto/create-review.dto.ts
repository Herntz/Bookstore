import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateReviewDto {

    @IsNotEmpty({message:'Book should not be empty.'})
    @IsNumber({},{message:'Book should not be number.'})
    bookId:number;

    @IsNotEmpty({message:'ratings should not be empty.'})
    @IsNumber({},{message:'Book should not be number.'})
    ratings:number;

    @IsNotEmpty({message:'comment should not be empty.'})
    comment:string;
}
