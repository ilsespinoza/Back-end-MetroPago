// src/stripe/stripe.module.ts
import { Module } from '@nestjs/common';
import { StripeService } from './stripe.service';
import { StripeController } from './stripe.controller';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule], // Para que funcione ConfigService en StripeService
  providers: [StripeService],
  controllers: [StripeController],
  exports: [StripeService], // Exporta para que otros módulos lo usen
})
export class StripeModule {}
