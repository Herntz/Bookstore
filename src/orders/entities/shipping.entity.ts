import { Column, Entity, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Order } from "./order.entity";

@Entity('shippings')
export class ShippingEntity{

    @PrimaryGeneratedColumn()
    id:number;

    @Column()
    phone:string;

    @Column({default:' '})
    name:string;

    @Column()
    address:string;

    @Column()
    city:string;

    @Column()
    state:string;    

    @OneToOne(()=>Order,(order)=>order.shippingAdress)
    order:Order; 
}