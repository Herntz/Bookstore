import { UserEntity } from "src/users/entities/user.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, Timestamp, UpdateDateColumn} from "typeorm";

@Entity({name:'genres'})
export class GenreEntity {
  @PrimaryGeneratedColumn()
  id:number;
  @Column()
  genres:string;
  
   @CreateDateColumn()
   createAt: Timestamp;
   @UpdateDateColumn()
   updateAt: Timestamp;

   @ManyToOne(()=>UserEntity,(user)=>user.genre)
   addBy:UserEntity;

}


