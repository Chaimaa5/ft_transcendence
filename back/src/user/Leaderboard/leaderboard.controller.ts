import { Body, Controller, Delete, Get, Param, Post, Put, Req, UseFilters, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { User } from '@prisma/client';
import { ApiTags } from '@nestjs/swagger';
import { LeaderboardService } from './leaderboard.service';
import { HttpExceptionFilter } from 'src/auth/exception.filter';
@Controller('leaderboard')
@ApiTags('leaderboard')
@UseGuards(AuthGuard('jwt'))
@UseFilters(HttpExceptionFilter)
export class LeaderboardController {
    constructor(private readonly profile: LeaderboardService){}

    @Get('')
    async Leaderboard( @Req() req: Request) {
        const user : User = req.user as User;
        return await this.profile.Leaderboard(user.id);
    }
    
    @Get('players')
    async Palyers( @Req() req: Request) {
        const user : User = req.user as User;
        return await this.profile.Palyers(user.id);
    }

}


