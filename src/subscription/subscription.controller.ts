import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  NotFoundException,
} from '@nestjs/common';
import { SubscriptionService } from './subscription.service';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { UpdateSubscriptionDto } from './dto/update-subscription.dto';

@Controller('subscription')
export class SubscriptionController {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  @Post()
  async create(@Body() createDto: CreateSubscriptionDto) {
    return this.subscriptionService.create(createDto);
  }

  @Get()
  async findAll() {
    return this.subscriptionService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const sub = await this.subscriptionService.findOne(+id);
    if (!sub) {
      throw new NotFoundException(`Suscripción con ID ${id} no encontrada`);
    }
    return sub;
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateDto: UpdateSubscriptionDto,
  ) {
    const sub = await this.subscriptionService.findOne(+id);
    if (!sub) {
      throw new NotFoundException(`No se puede actualizar: ID ${id} no existe`);
    }

    return this.subscriptionService.update(+id, updateDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const sub = await this.subscriptionService.findOne(+id);
    if (!sub) {
      throw new NotFoundException(`No se puede eliminar: ID ${id} no existe`);
    }

    await this.subscriptionService.remove(+id);
    return { message: 'Suscripción eliminada correctamente' };
  }
}

