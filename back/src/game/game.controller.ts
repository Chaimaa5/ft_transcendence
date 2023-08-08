import { Body, Controller, Delete, Get, OnApplicationShutdown, Param, Patch, Post, Put, Req, Res, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { Request, Response} from 'express';
// import { SocketGateway } from 'src/socket/socket.gateway';
import { AuthGuard } from '@nestjs/passport';
import { User } from '@prisma/client';
import { ApiTags } from '@nestjs/swagger';
import { GameService } from './game.service';
import { AuthService } from 'src/auth/auth.service';


@Controller('game')
@ApiTags('game')
@UseGuards(AuthGuard('jwt'))
export class GameController{
    authService = new AuthService;
    constructor(private readonly gameService: GameService){}
    
    @Post('Challenge')
    async postChallengeSettings(@Req() settings : Request, @Body() body : any) {
        const user : User = settings.user as User;
        return await this.gameService.postChallengeSettings(user, body);
    }

    @Get('/auth')
    async GetAuthAccess(@Req() req: Request){
        const user : User = req.user as User;
        return await this.authService.generateToken(user);
    }
    @Get('challenge/:id')
    async getChallengeSettings(@Param('id') id : string) {
        const idNum : number = parseInt(id);
        return await  this.gameService.getChallengeSettings(idNum);
    }
}