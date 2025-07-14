import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
  } from 'typeorm';
  import { User } from '../users/user.entity';
  
  export enum SubscriptionStatus {
    ACTIVE = 'active',
    CANCELED = 'canceled',
    TRIALING = 'trialing',
  }
  
  @Entity()
  export class Subscription {
    @PrimaryGeneratedColumn()
    id: number;
  
    @ManyToOne(() => User)
    @JoinColumn()
    user: User;
  
    @Column()
    stripeSubscriptionId: string;
  
    @Column({ type: 'enum', enum: SubscriptionStatus })
    status: SubscriptionStatus;
  
    @Column({ type: 'timestamptz' })
    startDate: Date;
  
    @Column({ type: 'timestamptz', nullable: true })
    endDate: Date;
  }
  