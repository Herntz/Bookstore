import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, Timestamp } from "typeorm";
import { OrderStatus } from "../enums/order-status.enum";
import { UserEntity } from "src/users/entities/user.entity";
import { ShippingEntity } from "./shipping.entity";
import { OrdersBooksEntity } from "./orders-products.entity";

@Entity('orders')
export class Order {

    @PrimaryGeneratedColumn()
    id: number;

    @CreateDateColumn()
    orderAt:Timestamp;

    @Column({ type: 'enum', enum: OrderStatus, default: OrderStatus.PROCESSING })
    status:string;

    @Column({nullable:true})
    shippedAt:Date;

    @Column({nullable:true})
    deliveredAt:Date;

    @ManyToOne(()=>UserEntity,(user)=>user.ordersUpdateBy)
    updatedBy:UserEntity;

    @OneToOne(()=>ShippingEntity,(shipp)=>shipp.order,{cascade:true})
    @JoinColumn()
    shippingAdress:ShippingEntity;

    @OneToMany(()=>OrdersBooksEntity,(op)=>op.order,{cascade:true})
    books:OrdersBooksEntity[];

    @ManyToOne(()=>UserEntity,(user)=>user.orders)
    user:UserEntity;


}


