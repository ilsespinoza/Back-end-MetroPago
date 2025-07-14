import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { Subscription } from 'src/subscription/entities/subscription.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Subscription])], 
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
