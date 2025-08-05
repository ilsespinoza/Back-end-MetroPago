import {
  Controller,
  Post,
  Body,
  Req,
  Res,
  Headers,
  HttpCode,
  Get,
  RawBodyRequest,
} from '@nestjs/common';
import { StripeService } from './stripe.service';
import { Request, Response } from 'express';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';

@Controller('stripe')
export class StripeController {
  constructor(
    private readonly stripeService: StripeService,
    private readonly configService: ConfigService,
  ) {}

  @Post('checkout-session')
  async crearCheckoutSession(
    @Body() body: { customerId: string; priceId: string },
  ) {
    return this.stripeService.crearCheckoutSession(
      body.customerId,
      body.priceId,
    );
  }

  @Post('webhook')
  @HttpCode(200)
  async handleWebhook(
    @Req() request: RawBodyRequest<Request>,
    @Res() response: Response,
    @Headers('stripe-signature') signature: string,
    @Body() body: any,
  ) {
    const webhookSecret = this.configService.get<string>(
      'STRIPE_WEBHOOK_SECRET',
    );

    if (!webhookSecret) {
      console.error('Falta STRIPE_WEBHOOK_SECRET en el .env');
      return response
        .status(500)
        .send('Falta configuración del webhook secret');
    }

    let event: Stripe.Event;

    try {
      event = this.stripeService
        .getStripe()
        .webhooks.constructEvent(request.rawBody!, signature, webhookSecret);
      console.log('Webhook recibido, tipo:', event.type);
    } catch (err) {
      console.error('Error en la firma del webhook:', err.message);
      return response.status(400).send(`Webhook Error: ${err.message}`);
    }

    try {
      if (
        event.type === 'customer.subscription.created' ||
        event.type === 'customer.subscription.updated'
      ) {
        await this.stripeService.registrarSuscripcionDesdeStripe(event);
        console.log('Suscripción procesada y guardada correctamente.');
      } else {
        console.log('Evento ignorado:', event.type);
      }
      return response.send({ received: true });
    } catch (err) {
      console.error('Error procesando evento del webhook:', err.message);
      return response.status(500).send('Error procesando webhook');
    }
  }

  @Get('suscripciones-activas')
  async obtenerSuscripcionesActivas() {
    const suscripciones =
      await this.stripeService.obtenerUsuariosConSuscripcionesActivas();
    return suscripciones;
  }
}
