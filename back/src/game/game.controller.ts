import {Controller, Get, UseGuards} from "@nestjs/common";
import { GameService } from "./game.service";
import { GameGateway } from "./game.gateway";
import { Request} from 'express';
import { User } from '@prisma/client';

// the controller would need to call the service and then return its result to the client back to the browser
// --> but to do that the controller would need to instansiate the service class, with the help of dependency injection an instance of the service would be created for the controller
// the game service can have various functions that will manage the game and its state. (addPlayer, removePlayer, scorePoint, endGame, resetGame...)
// the game controller would handle http requests and call the service decorator 


@Controller('game')
@UseGuards(AuthGuard('jwt'))
export class GameController{
	constructor(private gameService : GameService, private gamGateway : GameGateway) {}

	@Get('/auth')
	async SocketAuth(@Req() req: Request){
		const user: User = req.user as User;
		await this.gameService.getAccess(user.id)
	}
	@Get('create-game')
	createGame() {
		return 'game created';
	}
}

function AuthGuard(arg0: string): any {
	throw new Error("Function not implemented.");
}

function Req(): (target: GameController, propertyKey: "SocketAuth", parameterIndex: 0) => void {
	throw new Error("Function not implemented.");
}

