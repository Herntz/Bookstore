import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Order } from "./order.entity";
import { Book } from "src/books/entities/book.entity";

@Entity('orders_books')
export class OrdersBooksEntity{

    @PrimaryGeneratedColumn()
    id:number;

    @Column({type:'decimal',precision:10,scale:2,default:0})
    book_unit_price:number;

     @Column()
     book_quantity:number;

     @ManyToOne(()=>Order,(order)=>order.books)
     order:Order;

     @ManyToOne(()=>Book,(book)=>book.books,{cascade:true})
     books:Book;

}