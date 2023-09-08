import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateShippingDto{
    @IsNotEmpty({message:'Phone can not be empty'})
    @IsString({message:'Phone format should be string'})
    @ApiProperty({
        description:'Phone',
        example:9999999999}
        )
    phone:number;

    @IsOptional()
    @IsString({message:'name  format should be string'})
    @ApiProperty({
        description:'name',
        example:'Joe'}
        )
    name:string;

    @IsNotEmpty({message:'Adress can not be empty'})
    @IsString({message:'Adress format should be string'})
    @ApiProperty({
        description:'Adress',
        example:'123 Street'}
        )
    address:string;

    @IsNotEmpty({message:'city can not be empty'})
    @IsString({message:'city format should be string'})
    @ApiProperty({
        description:'city',
        example:'New York'}
        )
    city:string;

    @IsNotEmpty({message:'state can not be empty'})
    @IsString({message:'state format should be string'})
    @ApiProperty({
        description:'state',
        example:'NY'}
        )
    state:string;

}