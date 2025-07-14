import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';
import { Subscription, SubscriptionStatus } from 'src/subscription/entities/subscription.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Subscription)
    private readonly subscriptionRepository: Repository<Subscription>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    // Verificar si ya existe usuario con ese email
    const existeUsuario = await this.userRepository.findOne({
      where: { email: createUserDto.email },
    });
  
    if (existeUsuario) {
      throw new ConflictException('El correo ya está registrado');
    }
  
    // Continúa con el guardado
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const nuevoUsuario = this.userRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });
  
    const userGuardado = await this.userRepository.save(nuevoUsuario);
  
    // Crear suscripción (como antes)
    const now = new Date();
    const trialEnd = new Date();
    trialEnd.setDate(now.getDate() + 7);
  
    const nuevaSub = this.subscriptionRepository.create({
      user: userGuardado,
      stripeSubscriptionId: 'sin_stripe',
      status: SubscriptionStatus.TRIALING,
      startDate: now,
      endDate: trialEnd,
    });
  
    await this.subscriptionRepository.save(nuevaSub);
  
    return userGuardado;
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
