import { Body, Controller, Delete, Get, Param, Post, Put, Req, UseFilters, UseGuards } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { Request } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { User } from '@prisma/client';
import { ApiTags } from '@nestjs/swagger';
import { HttpExceptionFilter } from 'src/auth/exception.filter';
@Controller('profile')
@ApiTags('profile')

@UseGuards(AuthGuard('jwt'))
@UseFilters(HttpExceptionFilter)
export class ProfileController {
    constructor(private readonly profile: ProfileService){}
            

    @Get(':username')
    async Profile(@Param('username') username: string, @Req() req: Request){
        const user : User = req.user as User;
        return await this.profile.Profile(user.id, username);
    }

    @Get('/acheivments/:username')
    async GetAcheivments(@Param('username') username: string, @Req() req: Request){
        return await this.profile.Badges(username);
    }

    @Get('/history/:username')
    async MatchHistory(@Param('username') username: string,@Req() req: Request){
        return await this.profile.MatchHistory(username);
    }

    @Get('/statistics/:username')
    async UserStatistics(@Param('username') username: string, @Req() req: Request){
        return await this.profile.CalculatePercentage(username);
    }

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


