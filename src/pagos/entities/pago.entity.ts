// pago.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { Stripe } from 'src/stripe/entities/stripe.entity';

@Entity()
export class Pago {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  stripeCustomerId: string;

  @Column()
  subscriptionId: string;

  @Column('decimal')
  monto: number;

  @Column()
  metodoPago: string;

  @Column({ type: 'timestamptz' })
  fechaPago: Date;

  @ManyToOne(() => User, (user) => user.pagos, { nullable: false })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  userId: number;

  @ManyToOne(() => Stripe, { nullable: true })
  @JoinColumn({ name: 'stripeSubscriptionId' })
  stripeSubscription?: Stripe;

  @Column({ nullable: true })
  stripeSubscriptionId?: number;

  @CreateDateColumn()
  createdAt: Date;
}

