import { IsIn, IsNotEmpty, IsString } from "class-validator";
import { OrderStatus } from "../enums/order-status.enum";
import { ApiProperty } from "@nestjs/swagger";

export class UpdateOrderStatusDto{
    @IsNotEmpty()
    @IsString()
    @IsIn([OrderStatus.SHIPPED,OrderStatus.DELIVERED])
    @ApiProperty({
        description:'Order Status',
        example:OrderStatus.SHIPPED}
        )
    status:OrderStatus;
}