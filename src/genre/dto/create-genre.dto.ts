import { IsNotEmpty, IsString} from "class-validator";
export class CreateGenreDto {
    @IsNotEmpty({message:'title can not be empty.'})
    @IsString({message:'title can not be string.'})
    genre:string;

    
}
