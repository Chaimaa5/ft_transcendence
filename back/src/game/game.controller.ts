import { Body, Controller, Delete, Get, OnApplicationShutdown, Param, Patch, Post, Put, Req, Res, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { Request, Response} from 'express';
import { AuthGuard } from '@nestjs/passport';
import { Cron } from '@nestjs/schedule';
import { User } from '@prisma/client';
import { ApiTags } from '@nestjs/swagger';
import { GameService, Player } from './game.service';
import { AuthService } from 'src/auth/auth.service';

@Controller('game')
@ApiTags('game')
@UseGuards(AuthGuard('jwt'))
export class GameController{
    authService = new AuthService;
    constructor(private readonly gameService: GameService){}
    
	@Get('/auth')
	async GetAuthAccess(@Req() req: Request){
		const user : User = req.user as User;
		return await this.authService.generateToken(user);
	}

	@Get('/two-players-game/:id')
	async getMultiplayerGame(@Param('id') id : string) {
		const gameId : number = parseInt(id);
		return await this.gameService.getTwoPlayersGame(gameId);
	}

	@Post('/create-challenge-game')
	async postChallengeGame(@Req() settings : Request, @Body() body : any) {
		const user : User = settings.user as User;
		return await this.gameService.postChallengeGame(user, body)
	}

	@Get('/challenge-game/:id')
	async getChallengeGame(@Param('id') id : string) {
		const gameId : number = parseInt(id);
		return await this.gameService.getChallengeGame(gameId);
	}

	@Get('/pending-games')
	async getPendingGames(@Req() Req : Request) {
		const user : User = Req.user as User;
		return await this.gameService.getPendingGames(user.id);
	}


	@Post('/join-game/:id')
	async handleJoingGame(@Req() req : Request, @Param('id') id : string){
		const user : User = req.user as User;
		return await this.gameService.joinCreatedGame(user,id);
	}

	@Post('/training-settings')
	async postTrainingSettings(@Req() settings : Request, @Body() body : any) {
		const user : User = settings.user as User;
		return await this.gameService.postTrainingSettings(user, body);
	}

	@Get('/training-settings/:id')
	async getTrainingSettings(@Param('id') id : string) {
		const gameId : number = parseInt(id);
		return await this.gameService.getTrainingSettings(gameId);
	}

	@Get('/training-game/:id')
	async getTrainingGame(@Param('id') id : string) {
		const gameId : number = parseInt(id);
		return await this.gameService.getTrainingGame(gameId);
	}
}