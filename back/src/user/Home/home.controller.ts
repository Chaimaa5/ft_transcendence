import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { User } from '@prisma/client';
import { ApiTags } from '@nestjs/swagger';
import { HomeService } from './home.service';
import { SerachpDTO } from '../dto/serachdto.dto';
@Controller('home')
@ApiTags('home')
@UseGuards(AuthGuard('jwt'))
export class HomeController {
    constructor(private readonly home: HomeService){}

    // 5 best ranked
    @Get('/bestRanked')
    async bestRanked(@Req() req: Request) {
        const user : User = req.user as User;
        return await this.home.bestRanked(user.id);
    }
    
    @Get('/navbar/')
    async NavBar(@Req() req: Request) {
        const user : User = req.user as User;
        return await this.home.NavBar(user.id);
    }       
            
    @Get('/onlineFriends/')
    async OnlineFriends(@Req() req: Request) {
        const user : User = req.user as User;
        return await this.home.OnlineFriends(user.id);
    }
   

    @Post('/search')
    async Search(@Req() req: Request, @Body() input: SerachpDTO) {
        const user : User = req.user as User;
        return await this.home.Search(input.Value);
    }
}


