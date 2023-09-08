import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateReviewDto {

    @IsNotEmpty({message:'Book should not be empty.'})
    @IsNumber({},{message:'Book should not be number.'})
    @ApiProperty({
            description:'Book Id',
            example:1})
    bookId:number;

    @IsNotEmpty({message:'ratings should not be empty.'})
    @IsNumber({},{message:'Book should not be number.'})
    @ApiProperty({
            description:'ratings',
            example:5}
            )
    ratings:number;

    @IsNotEmpty({message:'comment should not be empty.'})
    @IsString()
    @ApiProperty({
            description:'comment',
            example:'Good Book'}
            )
    comment:string;
}
