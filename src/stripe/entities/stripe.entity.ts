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

  @ManyToOne(() => User)
  @JoinColumn()
  user: User;  // Relación con usuario local

  @Column({ unique: true })
  customerId: string; // ID del cliente en Stripe

  @Column({ unique: true, nullable: true })
  subscriptionId: string; // ID de la suscripción en Stripe

  @Column()
  priceId: string; // ID del plan contratado en Stripe

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
