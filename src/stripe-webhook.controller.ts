import {
  Controller,
  Post,
  Req,
  Res,
  HttpStatus,
  Headers,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import Stripe from 'stripe';
import * as rawBody from 'raw-body';
import { StripeService } from './stripe/stripe.service';

@Controller('stripe-webhook')
export class StripeWebhookController {
  private readonly logger = new Logger(StripeWebhookController.name);

  constructor(private readonly stripeService: StripeService) {}

  @Post()
  async handleWebhook(
    @Req() req: Request,
    @Res() res: Response,
    @Headers('stripe-signature') signature: string,
  ) {
    const webhookSecret = process.env.STRIPE_WEBHOOK_KEY;

    if (!webhookSecret) {
      this.logger.error('Webhook secret no configurado en .env');
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .send('Webhook secret no configurado');
    }

    let event: Stripe.Event;

    try {
      const raw = await rawBody(req);
      event = this.stripeService
        .getStripe()
        .webhooks.constructEvent(raw, signature, webhookSecret);
    } catch (err) {
      this.logger.error(`Error verificación webhook: ${err.message}`);
      return res
        .status(HttpStatus.BAD_REQUEST)
        .send(`Webhook Error: ${err.message}`);
    }
    switch (event.type) {
      case 'checkout.session.completed':
        this.logger.log('Evento checkout.session.completed recibido');
        const session = event.data.object as Stripe.Checkout.Session;
        break;

      case 'customer.subscription.created':
      case 'customer.subscription.updated':
        this.logger.log('Evento suscripción creada o actualizada');
        await this.stripeService.registrarSuscripcionDesdeStripe(event);
        break;

      default:
        this.logger.log(`Evento no manejado: ${event.type}`);
    }
    res.status(HttpStatus.OK).send({ received: true });
  }
}
