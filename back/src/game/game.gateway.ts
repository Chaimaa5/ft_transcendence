import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer, OnGatewayConnection, OnGatewayInit, OnGatewayDisconnect } from '@nestjs/websockets'
import { Server, Socket } from 'socket.io'
import { RoomState, PaddleState } from "./gameState.interface"
import { SocketStrategy } from 'src/auth/jwt/websocket.strategy';
import { UserService } from 'src/user/user.service';
import { Logger } from '@nestjs/common';
import { PaddleSide } from './gameState.interface';
import { GameService, VIRTUAL_TABLE_HEIGHT, VIRTUAL_TABLE_WIDTH } from './game.service';

@WebSocketGateway({
	namespace:'/game',
	cors: {
		origin: ['http://localhost:8000'],
		methods: ['GET', 'POST'],
		credentials: true,
	},
})
export class GameGateway implements OnGatewayConnection{
	@WebSocketServer()
	server: Server;
	
	constructor(private readonly gameService : GameService) {}

	private logger : Logger = new Logger('gameGateway');

	clients = new Map<string, Socket>();
	


	afterInit() {
		this.logger.log('game server initialized');
		this.gameService.eventsEmitter.on('handleUpdateScore', (side : PaddleSide) => {
			this.server.emit('updateScore', side);
		})

		this.gameService.eventsEmitter.on('handleUpdateBallPosition', (ball : {x : number, y : number}) => {
			this.server.emit('updateBallPosition', {x: ball.x, y: ball.y});
		})
	}

	
	async handleConnection(client : Socket) {
		this.logger.log(`server side : client connected : ${client.id}`);
		// gotta add some verification of the validity of the authentication
		// let token : any =  client.handshake.headers['authorization'];
        // token = token.split(' ')[1]
        //  client.data.payload = await this.socketStrategy.validate(token);
		//  let user = await this.userService.GetById(client.data.payload.id)
		 
		// storing a refrerence to the client 
		this.clients.set(client.id, client);
		this.joinPlayerToRoom(client);
	}

	private joinPlayerToRoom(client : Socket) {
		let roomId : string;
		const availableRoom = [...this.gameService.roomsMap.values()].find(room => room.playersNumber === 1);
		if (availableRoom) {
			roomId = availableRoom.roomId;
			this.gameService.addPlayer(roomId, client.id, PaddleSide.Right);
			client.join(availableRoom.roomId);
			this.logger.log("joined an already created game");
			client.emit('joinedRoom', {roomId : roomId, side : PaddleSide.Right, serverTableWidth: VIRTUAL_TABLE_WIDTH, serverTableHeight : VIRTUAL_TABLE_HEIGHT});
		} else {
			roomId = this.gameService.createRoom(client.id);
			client.join(roomId);
			this.logger.log("waiting for another player")
			client.emit('joinedRoom', {roomId : roomId, side : PaddleSide.Left, serverTableWidth: VIRTUAL_TABLE_WIDTH, serverTableHeight : VIRTUAL_TABLE_HEIGHT});
		}
		const room = this.gameService.roomsMap.get(roomId);
		if(room && room.playersNumber === 2) {
			this.logger.log("game is starting now...");
			this.server.emit('startGame', {initialBallAngle : this.randomInitialDirection(), leftPlayerObj :  room.players[0], rightPlayerObj: room.players[1], ballPosX : room.ball.x , ballPosY : room.ball.y, ballSpeedX: room.ball.ballSpeedX, ballSpeedY : room.ball.ballSpeedY});
			this.gameService.startGameLoop(roomId);
		}
	}
	
	private randomInitialDirection = () : number => {
		const minValue = -Math.PI/4;
		const maxValue = Math.PI/4;

		// generate a random number between 0 and 1
		const randomZeroToOne = Math.random();
		// scale and shift the random number to fit the desired rane
		const randomValueInRange = randomZeroToOne * (maxValue - minValue) + minValue;

		return(randomValueInRange);
	}


	handleDisconnection(client : Socket) {
		console.log("client id  : " + client.id + "disconnected");
	}

	@SubscribeMessage('newPaddlePosition')
	handleNewPaddlePosition(client : Socket, payload : {roomId: string, paddlePosY:number}) : void {
		this.gameService.updatePaddlePosition(payload.roomId, client.id, payload.paddlePosY);
		client.to(payload.roomId).emit('updatePaddlePosition', { playerId : client.id ,paddlePosY : payload.paddlePosY});
	}

	@SubscribeMessage('resetRound') 
	handleResetRound(client: Socket) {
		this.server.emit('ballInitialDirection', this.randomInitialDirection());
	}
}