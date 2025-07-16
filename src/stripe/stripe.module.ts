// stripe.module.ts
import { Module } from '@nestjs/common';
import { StripeService } from './stripe.service';
import { StripeController } from './stripe.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Stripe as StripeEntity } from './entities/stripe.entity';
import { User } from 'src/user/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([StripeEntity, User]) 
  ],
  providers: [StripeService],
  controllers: [StripeController],
  exports: [StripeService], 
})
export class StripeModule {}
