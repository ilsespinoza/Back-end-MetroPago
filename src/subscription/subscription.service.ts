import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan } from 'typeorm';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Subscription, SubscriptionStatus } from './entities/subscription.entity';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { UpdateSubscriptionDto } from './dto/update-subscription.dto';

@Injectable()
export class SubscriptionService {
  private readonly logger = new Logger(SubscriptionService.name);

  constructor(
    @InjectRepository(Subscription)
    private readonly subscriptionRepository: Repository<Subscription>,
  ) {}

  // Tarea programada: cada día a medianoche revisa suscripciones expiradas
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async revisarSuscripcionesExpiradas() {
    const ahora = new Date();

    const expiradas = await this.subscriptionRepository.find({
      where: {
        endDate: LessThan(ahora),
        status: SubscriptionStatus.ACTIVE,
      },
    });

    for (const sub of expiradas) {
      sub.status = SubscriptionStatus.CANCELED;
      await this.subscriptionRepository.save(sub);
      this.logger.log(`Suscripción ${sub.id} cancelada por expiración`);
    }
  }

  create(createSubscriptionDto: CreateSubscriptionDto) {
    return 'This action adds a new subscription';
  }

  findAll() {
    return 'This action returns all subscriptions';
  }

  findOne(id: number) {
    return `This action returns a #${id} subscription`;
  }

  update(id: number, updateSubscriptionDto: UpdateSubscriptionDto) {
    return `This action updates a #${id} subscription`;
  }

  remove(id: number) {
    return `This action removes a #${id} subscription`;
  }
}

