import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
// import { JwtModule } from '@nestjs/jwt';
// import { SocketGateway } from './socket/socket.gateway';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { ChatGateway } from './socket/chat.gateway';
import { ScheduleModule } from '@nestjs/schedule';

import { MuteService } from './chat/mute.service';
import { GameModule } from './game/game.module';

@Module({
  imports: [ScheduleModule.forRoot(),
    AuthModule, ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'upload'),
      serveRoot: '/upload' 

    }), GameModule
  ],
  controllers: [],
  providers: [ChatGateway, MuteService],

  })
export class AppModule {}
