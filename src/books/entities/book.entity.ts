import { GenreEntity } from "src/genre/entities/genre.entity";
import { OrdersBooksEntity } from "src/orders/entities/orders-products.entity";
import { ReviewEntity } from "src/reviews/entities/review.entity";
import { UserEntity } from "src/users/entities/user.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, Timestamp, UpdateDateColumn } from "typeorm";

@Entity('books')
export class Book {
    @PrimaryGeneratedColumn()
    id:number;

    @Column()
    book_title:string;

    @Column()
    book_description:string;

    @Column({type:'decimal',precision:10,scale:2,default:0})
    book_price:number;

    @Column()
    book_author:string;

    @Column()
    book_stock:number;

    @Column('simple-array')
    book_images:string[];

    @CreateDateColumn()
    createAt: Timestamp;
    @UpdateDateColumn()
    updateAt: Timestamp;
    @ManyToOne(()=> UserEntity,(user)=>user.books)
    addBy: UserEntity;

    @ManyToOne(()=>GenreEntity,(genre)=>genre.books)
    genre:GenreEntity;

    @OneToMany(()=>ReviewEntity,(rev)=>rev.book)
    reviews:ReviewEntity[];

    @OneToMany(()=>OrdersBooksEntity,(op)=>op.books)
    books:OrdersBooksEntity[];






}
