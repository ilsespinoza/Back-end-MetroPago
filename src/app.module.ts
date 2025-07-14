import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user/entities/user.entity';
import { Subscription } from './subscription/entities/subscription.entity';
import { UserModule } from './user/user.module';
import { SubscriptionModule } from './subscription/subscription.module';
import { AuthModule } from './auth/auth.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'ilseespinoza2708',
      database: 'metropago',
      entities: [User, Subscription],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([User, Subscription]),
    UserModule,
    SubscriptionModule,
    AuthModule,
    ScheduleModule.forRoot(),
  ],
})
export class AppModule {}
