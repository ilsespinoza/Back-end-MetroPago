import {
  IsString,
  IsEmail,
  IsNotEmpty,
  MinLength,
  IsEnum,
} from 'class-validator';
import { Ciudad } from '../entities/user.entity'; 

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @IsString()
  @IsNotEmpty()
  apellido: string;

  @IsString()
  @IsNotEmpty()
  telefono: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsString()
  @IsNotEmpty()
  priceId: string; 

  @IsEnum(Ciudad, { message: 'Ciudad no válida' })
  ciudad: Ciudad;
}

