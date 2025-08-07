import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { Pago } from 'src/pagos/entities/pago.entity';

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

  @Column({ type: 'timestamptz', nullable: true })
  startDate?: Date;

  @Column({ type: 'timestamptz', nullable: true })
  endDate: Date | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Pago, (pago) => pago.stripeSubscription)
  pagos: Pago[];
}
