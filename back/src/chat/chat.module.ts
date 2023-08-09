import { Module } from "@nestjs/common";
import { ScheduleModule } from '@nestjs/schedule';
import { MuteService } from "./mute.service";
import { ChatController } from "./chat.controller";
import { ChatService } from "./chat.service";


@Module({
  imports: [
    
  ],
  controllers: [ChatController],
  providers: [ChatService],
})
export class ChatModule {}
