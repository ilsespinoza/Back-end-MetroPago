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

  async create(createSubscriptionDto: CreateSubscriptionDto): Promise<Subscription> {
    const nueva = this.subscriptionRepository.create(createSubscriptionDto);
    return this.subscriptionRepository.save(nueva);
  }

  async findAll(): Promise<Subscription[]> {
    return this.subscriptionRepository.find({
      relations: ['user'], // incluye datos del usuario si quieres
    });
  }

  async findOne(id: number): Promise<Subscription | null> {
    return this.subscriptionRepository.findOne({
      where: { id },
      relations: ['user'],
    });
  }

  async update(id: number, updateDto: UpdateSubscriptionDto): Promise<Subscription> {
    await this.subscriptionRepository.update(id, updateDto);
    const actualizada = await this.findOne(id);
  
    if (!actualizada) {
      throw new Error(`La suscripción con ID ${id} no existe`);
    }
  
    return actualizada;
  }

  async remove(id: number): Promise<void> {
    await this.subscriptionRepository.delete(id);
  }
}


