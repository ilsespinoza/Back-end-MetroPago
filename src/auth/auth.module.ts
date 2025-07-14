import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from 'src/user/user.module';
import { JwtStrategy } from './jwt.strategy';


@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: 'jwt_secreto_super_seguro',
      signOptions: { expiresIn: '1d' },
    }),
    UserModule, 
  ],
  
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
})
export class AuthModule {}
