import { Book } from "src/books/entities/book.entity";
import { UserEntity } from "src/users/entities/user.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, Timestamp, UpdateDateColumn } from "typeorm";

@Entity('reviews')
export class ReviewEntity {

    @PrimaryGeneratedColumn()
    id:number;

    @Column()
    ratings:number;

    @Column()
    comment:string;

    @CreateDateColumn()
    createdAt:Timestamp;

    @UpdateDateColumn()
    updatedAt:Timestamp;

    @ManyToOne(type=>UserEntity,(user)=>user.reviews)
    user:UserEntity;

    @ManyToOne(type=>Book,(book)=>book.reviews)
    book:Book;

    
}
