import { Module } from '@nestjs/common';
import { AuthController } from './auth/auth.controller';
import { AuthModule } from './auth/auth.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
// import { JwtModule } from '@nestjs/jwt';
import { UserModule } from './user/user.module';
// import { SocketGateway } from './socket/socket.gateway';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { NotificationsGateway } from './socket/notifications.gateway';
import { GameController } from './game/game.controller';
import { GameGateway } from './game/game.gateway';
import { roomManager } from './game/rooms/room.manager';

@Module({
  imports: [
    AuthModule, ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'upload'),
      serveRoot: '/upload' 

    })
  ],
  controllers: [],
  providers: [ GameGateway, roomManager],
})
export class AppModule {}
