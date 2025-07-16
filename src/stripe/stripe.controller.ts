import { Controller, Post, Body } from '@nestjs/common';
import { StripeService } from './stripe.service';

@Controller('stripe')
export class StripeController {
  constructor(private readonly stripeService: StripeService) {}

  @Post('checkout-session')
  async crearCheckoutSession(
    @Body() body: { customerId: string; priceId: string }
  ) {
    return this.stripeService.crearCheckoutSession(
      body.customerId,
      body.priceId
    );
  }
}

