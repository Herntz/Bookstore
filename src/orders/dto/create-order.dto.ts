import { Type } from "class-transformer";
import { CreateShippingDto } from "./create-shipping.dto";
import { ValidateNested } from "class-validator";
import { OrderedBooksDto } from "./ordered-products.dto";

export class CreateOrderDto {
    @Type(()=>CreateShippingDto)
    @ValidateNested()
    shippingAdress:CreateShippingDto;

    @Type(()=>OrderedBooksDto)
    @ValidateNested()
    orderedBooks:OrderedBooksDto[];


}
