import { Injectable } from '@nestjs/common';
import { CreatePagoDto } from './dto/create-pago.dto';
import { UpdatePagoDto } from './dto/update-pago.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Pago } from './entities/pago.entity';

@Injectable()
export class PagosService {
  constructor(
    @InjectRepository(Pago)
    private readonly pagoRepository: Repository<Pago>,
  ) {}
  create(createPagoDto: CreatePagoDto) {
    return 'This action adds a new pago';
  }

  async obtenerHistorialPorUsuario(userId: number): Promise<Pago[]> {
    return this.pagoRepository.find({
      where: { user: { id: userId } },
      relations: ['stripeSubscription'],
      order: { fechaPago: 'DESC' },
    });
  }

  findAll() {
    return `This action returns all pagos`;
  }

  findOne(id: number) {
    return `This action returns a #${id} pago`;
  }

  update(id: number, updatePagoDto: UpdatePagoDto) {
    return `This action updates a #${id} pago`;
  }

  remove(id: number) {
    return `This action removes a #${id} pago`;
  }


}
