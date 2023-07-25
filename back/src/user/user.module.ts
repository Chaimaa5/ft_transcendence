import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { ProfileController } from './Profile/profile.controller';
import { ProfileService } from './Profile/profile.service';
import { LeaderboardController } from './Leaderboard/leaderboard.controller';
import { LeaderboardService } from './Leaderboard/leaderboard.service';
import { HomeService } from './Home/home.service';
import { HomeController } from './Home/home.controller';
// import { SocketGateway } from 'src/socket/socket.gateway';

@Module({
  imports: [],
  controllers: [UserController, ProfileController, LeaderboardController, HomeController],
  providers: [UserService, ProfileService, LeaderboardService, HomeService],
  exports: [UserService]
})
export class UserModule {}
