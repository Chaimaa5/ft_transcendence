import { Module } from '@nestjs/common';

import { GameService } from './game.service';
import { GameController } from './game.controller';
import { GameGateway } from './game.gateway';
import { UserService } from 'src/user/user.service';

@Module({
  imports: [],
  controllers: [GameController ],
  providers: [GameGateway,  GameService, UserService],
  exports: []
})
export class GameModule {}
