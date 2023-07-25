import { Body, Controller, Delete, Get, Param, Post, Put, Req, UseGuards } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { Request } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { User } from '@prisma/client';
import { ApiTags } from '@nestjs/swagger';
@Controller('profile')
@ApiTags('profile')
@UseGuards(AuthGuard('jwt'))
export class ProfileController {
    constructor(private readonly profile: ProfileService){}
            
    //---------Profile

    //Profile info
    @Get(':username')
    async Profile(@Param('username') username: string, @Req() req: Request){
        const user : User = req.user as User;
        return await this.profile.Profile(user.id, username);
    }

    //Acheivments
    @Get('/acheivments/:username')
    async GetAcheivments(@Param('username') username: string, @Req() req: Request){
        return await this.profile.Badges(username);
    }

    //MatchHistory --- Not Complete
    @Get('/history/:username')
    async MatchHistory(@Param('username') username: string,@Req() req: Request){
        return await this.profile.MatchHistory(username);
    }

    //Percentage in profile
    @Get('/statistics/:username')
    async UserStatistics(@Param('username') username: string, @Req() req: Request){
        return await this.profile.CalculatePercentage(username);
    }

    //List of friends in profile
    @Get('/friends/:username')
    async Friends(@Param('username') username: string, @Req() req: Request){
        const user : User = req.user as User;
        return await this.profile.Friends(username, user.id);
    }

    @Get('/user/:username')
    async User(@Param('username') username: string, @Req() req: Request){
        const user : User = req.user as User;
        return await this.profile.User(user.id, username);
    }

}


