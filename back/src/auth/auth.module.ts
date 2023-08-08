import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { FortyTwoStrategy } from './auth.strategy';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from 'src/user/user.module';
import { UserService } from 'src/user/user.service';
import { ConfigModule } from 'src/config/config.module';
import { RefreshStrategy } from './jwt/refresh.strategy';
import { JWTStrategy } from './jwt/jwt.strategy';


@Module({
  imports:  [ UserModule, PassportModule,
  JwtModule.register({
      secretOrPrivateKey: process.env.JWT_ACCESS_SECRET,
      signOptions: { expiresIn: '1h' },
    }), ConfigModule],
  providers: [FortyTwoStrategy, AuthService, JwtModule, UserService, JWTStrategy, RefreshStrategy],
  controllers: [AuthController]
})
export class AuthModule {}
