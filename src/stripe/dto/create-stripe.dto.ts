import { IsNotEmpty, IsString, IsEnum, IsOptional } from 'class-validator';
import { StripeSubscriptionStatus } from '../entities/stripe.entity';

export class CreateStripeDto {
  @IsNotEmpty()
  @IsString()
  customerId: string;

  @IsNotEmpty()
  @IsString()
  subscriptionId: string;

  @IsNotEmpty()
  @IsString()
  priceId: string;

  @IsOptional()
  @IsEnum(StripeSubscriptionStatus)
  status?: StripeSubscriptionStatus;
}
