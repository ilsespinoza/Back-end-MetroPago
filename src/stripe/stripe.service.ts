import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  Stripe as StripeEntity,
  StripeSubscriptionStatus,
} from './entities/stripe.entity';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class StripeService {
  private stripe: Stripe;

  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(StripeEntity)
    private readonly stripeRepository: Repository<StripeEntity>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {
    const secretKey = this.configService.get<string>('STRIPE_SECRET_KEY');
    if (!secretKey) {
      throw new Error('STRIPE_SECRET_KEY no está definido en el .env');
    }

    this.stripe = new Stripe(secretKey);
  }

  getStripe(): Stripe {
    return this.stripe;
  }

  async crearCliente(email: string): Promise<Stripe.Customer> {
    const cliente = await this.stripe.customers.create({ email });
    const user = await this.userRepository.findOne({ where: { email } });
    if (user) {
      user.stripeCustomerId = cliente.id;
      await this.userRepository.save(user);
    }

    return cliente;
  }
  async crearCheckoutSession(customerId: string, priceId: string) {
    const user = await this.userRepository.findOne({
      where: { stripeCustomerId: customerId },
    });

    if (!user) {
      throw new Error(`Usuario con customerId ${customerId} no encontrado`);
    }
    const planes = {
      price_1RlI9jPKNWjJLZi9ywBM9GKo: 'Semanal',
      price_1RlKi7PKNWjJLZi9DF8h8D4a: 'Mensual',
      price_1RlKjjPKNWjJLZi9PTB3eOOs: 'Bimensual',
      price_1RlKmNPKNWjJLZi9lTleDTfj: 'Semestral',
      price_1RlKnbPKNWjJLZi9rX5SLPu1: 'Anual',
    };

    const nombrePlan = planes[priceId] || 'PlanDesconocido';

    // const successUrl = `metropago://usuario/perfil?nombre=${encodeURIComponent(user.nombre)}&email=${encodeURIComponent(user.email)}&plan=${encodeURIComponent(nombrePlan)}`;
    const successUrl = 'metropago://login/login';

    return this.stripe.checkout.sessions.create({
      mode: 'subscription',
      customer: customerId,
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: successUrl,
      cancel_url: 'metropago://pago-cancelado',
    });
  }

  async registrarSuscripcionDesdeStripe(event: Stripe.Event) {
    if (
      event.type !== 'customer.subscription.created' &&
      event.type !== 'customer.subscription.updated'
    ) {
      return;
    }

    const subscription = event.data.object as Stripe.Subscription;
    const customerId = subscription.customer as string;
    const subscriptionId = subscription.id;
    const priceId = subscription.items.data[0].price.id;
    const status = subscription.status as StripeSubscriptionStatus;

    const user = await this.userRepository.findOne({
      where: { stripeCustomerId: customerId },
    });

    if (!user) {
      throw new Error(
        `Usuario con stripeCustomerId ${customerId} no encontrado`,
      );
    }

    let stripeRecord = await this.stripeRepository.findOne({
      where: { subscriptionId },
    });

    if (!stripeRecord) {
      stripeRecord = this.stripeRepository.create({
        user,
        customerId,
        subscriptionId,
        priceId,
        status,
        startDate: new Date(subscription.start_date * 1000), 
        endDate: subscription.ended_at
          ? new Date(subscription.ended_at * 1000)
          : null,
      });
    } else {
      stripeRecord.status = status;
      stripeRecord.priceId = priceId;
      stripeRecord.startDate = new Date(subscription.start_date * 1000);
      stripeRecord.endDate = subscription.ended_at
        ? new Date(subscription.ended_at * 1000)
        : null;
    }

    await this.stripeRepository.save(stripeRecord);
  }

  async obtenerUsuariosConSuscripcionesActivas() {
    const registros = await this.stripeRepository.find({
      where: { status: StripeSubscriptionStatus.ACTIVE },
      relations: ['user'],
    });

    return registros;
  }
}
