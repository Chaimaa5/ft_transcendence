import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
// import { JwtModule } from '@nestjs/jwt';
// import { SocketGateway } from './socket/socket.gateway';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { ChatGateway } from './chat/chat.gateway';
import { ScheduleModule } from '@nestjs/schedule';

import { MuteService } from './chat/mute.service';
// import { GameModule } from './game/game.module';
import { ChatModule } from './chat/chat.module';
import { NotificationsGateway } from './user/Notifications/notifications.gateway';
import { GameModule } from './game/game.module';
import { APP_FILTER } from '@nestjs/core';
import { HttpExceptionFilter } from './auth/exception.filter';
// import { GameGateway } from './game/game.gateway';
// import { GameService } from './game/game.service';
@Module({
  imports: [ScheduleModule.forRoot(),
    AuthModule, ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'upload'),
      serveRoot: '/api/upload' 

    }), ChatModule, GameModule
  ],
  controllers: [],
  providers: [ChatGateway, MuteService, {provide: APP_FILTER, useClass: HttpExceptionFilter}],

  })
export class AppModule {}
