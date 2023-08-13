import { Module } from '@nestjs/common';

import { GameService } from './game.service';
import { GameController } from './game.controller';
import { GameGateway } from './game.gateway';

@Module({
  imports: [],
  controllers: [GameController ],
  providers: [GameGateway,  GameService],
  exports: []
})
export class GameModule {}
