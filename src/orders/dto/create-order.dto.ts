import { Type } from "class-transformer";
import { CreateShippingDto } from "./create-shipping.dto";
import { ValidateNested } from "class-validator";
import { OrderedBooksDto } from "./ordered-products.dto";
import { ApiProperty } from "@nestjs/swagger";

export class CreateOrderDto {
    @Type(()=>CreateShippingDto)
    @ValidateNested()
    @ApiProperty({
        description:'shippingAdress'})
    shippingAdress:CreateShippingDto;

    @Type(()=>OrderedBooksDto)
    @ValidateNested()
    @ApiProperty({
        description:'orderedBooks'})
    orderedBooks:OrderedBooksDto[];


}
