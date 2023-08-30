import { Book } from "src/books/entities/book.entity";
import { UserEntity } from "src/users/entities/user.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, Timestamp, UpdateDateColumn} from "typeorm";

@Entity({name:'genres'})
export class GenreEntity {
  @PrimaryGeneratedColumn()
  id:number;
  @Column({ unique: true, nullable: false })
  genres:string;
  
   @CreateDateColumn()
   createAt: Timestamp;
   @UpdateDateColumn()
   updateAt: Timestamp;

   @ManyToOne(()=>UserEntity,(user)=>user.genre)
   addBy:UserEntity;

   @OneToMany(() => Book,(books)=>books.genre)
   books:Book[];
}


