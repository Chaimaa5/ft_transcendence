import {Controller, Get} from "@nestjs/common";
import { GameService } from "./game.service";
import { GameGateway } from "./game.gateway";

// the controller would need to call the service and then return its result to the client back to the browser
// --> but to do that the controller would need to instansiate the service class, with the help of dependency injection an instance of the service would be created for the controller
// the game service can have various functions that will manage the game and its state. (addPlayer, removePlayer, scorePoint, endGame, resetGame...)
// the game controller would handle http requests and call the service decorator 


@Controller('game')
export class GameController{
	constructor(private gameService : GameService, private gamGateway : GameGateway) {}

	@Get('create-game')
	createGame() {
		return 'game created';
	}
}