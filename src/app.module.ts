import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user/entities/user.entity';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ScheduleModule } from '@nestjs/schedule';
import { StripeModule } from './stripe/stripe.module';
import { ConfigModule } from '@nestjs/config';
import { Stripe } from './stripe/entities/stripe.entity';
import { PagosModule } from './pagos/pagos.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'ilseespinoza2708',
      database: 'metropago',
      entities: [User, Stripe],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([User, Stripe]),
    UserModule,
    AuthModule,
    ScheduleModule.forRoot(),
    StripeModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PagosModule,
  ],
})
export class AppModule {}
