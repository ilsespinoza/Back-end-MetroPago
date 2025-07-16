// user.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from 'typeorm';
import { Stripe } from 'src/stripe/entities/stripe.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ unique: true, nullable: true, type: 'varchar' })
  stripeCustomerId?: string; 

  @CreateDateColumn()
  creadoEn: Date;

  @OneToMany(() => Stripe, (stripe) => stripe.user)
  subscriptions: Stripe[];
}
