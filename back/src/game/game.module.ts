import { Module } from '@nestjs/common';

import { GameService } from './game.service';
import { GameController } from './game.controller';

@Module({
  imports: [],
  controllers: [GameController ],
  //add  GameGateway
  providers: [GameService],
  exports: []
})
export class GameModule {}
