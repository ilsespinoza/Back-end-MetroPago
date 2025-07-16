import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';
import { Subscription, SubscriptionStatus } from 'src/subscription/entities/subscription.entity';
import { StripeService } from 'src/stripe/stripe.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly stripeService: StripeService,
    @InjectRepository(Subscription)
    private readonly subscriptionRepository: Repository<Subscription>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<{ checkoutUrl: string }> {
    const existeUsuario = await this.userRepository.findOne({
      where: { email: createUserDto.email },
    });
  
    if (existeUsuario) {
      throw new ConflictException('El correo ya está registrado');
    }
  
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
  
    // Crear cliente en Stripe
    const clienteStripe = await this.stripeService.crearCliente(createUserDto.email);
  
    // Crear usuario y guardar el stripeCustomerId
    const nuevoUsuario = this.userRepository.create({
      ...createUserDto,
      password: hashedPassword,
      stripeCustomerId: clienteStripe.id, // 👈 SE GUARDA AQUÍ
    });
    const usuarioGuardado = await this.userRepository.save(nuevoUsuario);
  
    // Crear sesión de Stripe con priceId (desde el frontend)
    const session = await this.stripeService.crearCheckoutSession(
      clienteStripe.id,
      createUserDto.priceId
    );
  
    if (!session.url) {
      throw new Error('No se pudo crear la URL de checkout');
    }
  
    return { checkoutUrl: session.url };
  }
  

  findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  findOne(id: number): Promise<User | null> {
    return this.userRepository.findOne({ where: { id } });
  }

  update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    return this.userRepository.save({ id, ...updateUserDto });
  }

  async remove(id: number): Promise<void> {
    await this.userRepository.delete(id);
  }

  // Método extra para login con JWT
  async buscarPorEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { email } });
  }
}
