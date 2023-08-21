import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { ProfileController } from './Profile/profile.controller';
import { ProfileService } from './Profile/profile.service';
import { LeaderboardController } from './Leaderboard/leaderboard.controller';
import { LeaderboardService } from './Leaderboard/leaderboard.service';
import { HomeService } from './Home/home.service';
import { HomeController } from './Home/home.controller';
import { ChatController } from 'src/chat/chat.controller';
import { ChatService } from 'src/chat/chat.service';
import { NotificationService } from './Notifications/notification.service';
import { NotificationsGateway } from './Notifications/notifications.gateway';

@Module({
  imports: [],
  controllers: [UserController, ProfileController, LeaderboardController, HomeController, ChatController],
  providers: [UserService, ProfileService, LeaderboardService, HomeService, ChatService, NotificationService, NotificationsGateway],
  exports: [UserService]
})
export class UserModule {}
