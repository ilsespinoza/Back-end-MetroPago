import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/user.entity';
import { Subscription } from './subscriptions/subscription.entity';

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
      synchronize: true, // usar migraciones para producción
    }),
    TypeOrmModule.forFeature([User, Subscription]),
  ],
})
export class AppModule {}
