export class CreateUserDto {
  nombre: string;
  email: string;
  password: string;
  priceId: string; // ID del plan en Stripe (mensual, anual, etc.)
}
