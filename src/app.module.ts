import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user/entities/user.entity';
import { Subscription } from './subscription/entities/subscription.entity';
import { UserModule } from './user/user.module';
import { SubscriptionModule } from './subscription/subscription.module';
import { AuthModule } from './auth/auth.module';
import { ScheduleModule } from '@nestjs/schedule';
import { StripeModule } from './stripe/stripe.module';
import { ConfigModule } from '@nestjs/config';
import { Stripe } from './stripe/entities/stripe.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'ilseespinoza2708',
      database: 'metropago',
      entities: [User, Subscription, Stripe],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([User, Subscription, Stripe]),
    UserModule,
    SubscriptionModule,
    AuthModule,
    ScheduleModule.forRoot(),
    StripeModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
})
export class AppModule {}
