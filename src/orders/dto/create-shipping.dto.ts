import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateShippingDto{
    @IsNotEmpty({message:'Phone can not be empty'})
    @IsString({message:'Phone format should be string'})
    phone:number;

    @IsOptional()
    @IsString({message:'name  format should be string'})
    name:string;

    @IsNotEmpty({message:'Adress can not be empty'})
    @IsString({message:'Adress format should be string'})
    address:string;

    @IsNotEmpty({message:'city can not be empty'})
    @IsString({message:'city format should be string'})
    city:string;

    @IsNotEmpty({message:'state can not be empty'})
    @IsString({message:'state format should be string'})
    state:string;

}