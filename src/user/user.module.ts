// src/user/user.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Subscription } from 'src/subscription/entities/subscription.entity';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { StripeModule } from 'src/stripe/stripe.module'; // IMPORTANTE

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Subscription]),
    StripeModule, // IMPORTANTE: importa StripeModule para usar StripeService
  ],
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
