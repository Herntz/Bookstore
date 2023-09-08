import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString} from "class-validator";
export class CreateGenreDto {
    @IsNotEmpty({message:'title can not be empty.'})
    @IsString({message:'title can not be string.'})
    @ApiProperty({
        description:'title',
        example:'Fiction'})
    genres:string;

    
}
