import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { User } from '@prisma/client';
import { ApiTags } from '@nestjs/swagger';
import { NotificationService } from './notification.service';
import { SerachpDTO } from '../dto/serachdto.dto';
@Controller('home')
@ApiTags('home')
@UseGuards(AuthGuard('jwt'))
export class NotificationController {
    constructor(private readonly notification: NotificationService){}

    // 5 best ranked
    // @Get('/bestRanked')
    // async bestRanked(@Req() req: Request) {
    //     const user : User = req.user as User;
    //     return await this.home.bestRanked(user.id);
    // }
    

}


