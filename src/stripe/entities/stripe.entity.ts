// stripe.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from 'src/user/entities/user.entity';

export enum StripeSubscriptionStatus {
  ACTIVE = 'active',
  CANCELED = 'canceled',
  TRIALING = 'trialing',
  PAST_DUE = 'past_due',
  UNPAID = 'unpaid',
}

@Entity()
export class Stripe {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.subscriptions, { nullable: false })
  @JoinColumn()
  user: User;  

  @Column({ unique: true })
  customerId: string; 

  @Column({ unique: true, nullable: true })
  subscriptionId?: string; 

  @Column()
  priceId: string; 

  @Column({
    type: 'enum',
    enum: StripeSubscriptionStatus,
    default: StripeSubscriptionStatus.TRIALING,
  })
  status: StripeSubscriptionStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
