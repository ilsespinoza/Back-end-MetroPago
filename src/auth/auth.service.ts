import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.userService.buscarPorEmail(email);
    if (!user) return null;

    const passwordEsValida = await bcrypt.compare(password, user.password);
    if (!passwordEsValida) return null;

    return user;
  }

  async login(user: User) {
  const payload = { email: user.email, sub: user.id };
  return {
    access_token: this.jwtService.sign(payload),
    user: {
      id: user.id,
      nombre: user.nombre,
      email: user.email,
      // Agregar mas campos
    },
  };
}

}

