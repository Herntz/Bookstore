import { PartialType } from '@nestjs/swagger';
import { OrderedBooksDto } from './ordered-products.dto';

export class UpdateCartDto  extends PartialType(OrderedBooksDto) {}
