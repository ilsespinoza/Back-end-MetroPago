import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { Stripe } from 'src/stripe/entities/stripe.entity';
import { Pago } from 'src/pagos/entities/pago.entity';

export enum Ciudad {
  CDMX = 'CDMX',
  Guadalajara = 'Guadalajara',
  Monterrey = 'Monterrey',
  Puebla = 'Puebla',
  Tijuana = 'Tijuana',
  Hermosillo = 'Hermosillo',
}

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre: string;

  @Column()
  apellido: string;

  @Column()
  telefono: string;

  @Column({
    type: 'enum',
    enum: Ciudad,
  })
  ciudad: Ciudad;

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

  @OneToMany(() => Pago, (pago) => pago.user)
  pagos: Pago[];
}
