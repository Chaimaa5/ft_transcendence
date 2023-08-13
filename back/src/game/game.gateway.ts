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
		this.gameService.eventsEmitter.on('handleUpdateScore', (room : RoomState) => {
			const leftPlayer =  {roundScore : room.players[0].roundScore, userName : room.players[0].username};
			const rightPlayer = {roundScore : room.players[1].roundScore, userName : room.players[1].username};
			const round = {roundNumber : room.thisRound.roundNumber, leftPlayerScore : room.thisRound.leftPlayerScore, rightPlayerScore : room.thisRound.rightPlayerScore};
			this.server.emit('updateScore', {leftPlayerRoundScore : leftPlayer.roundScore, rightPlayerRoundScore : rightPlayer.roundScore, playedRounds : round.roundNumber, leftScore : round.leftPlayerScore, rightScore : round.rightPlayerScore, paddleHeight : room.paddleHeight});
		})

		this.gameService.eventsEmitter.on('handleUpdateBallPosition', (ball : {x : number, y : number}) => {
			this.server.emit('updateBallPosition', {x: ball.x, y: ball.y});
		})

		this.gameService.eventsEmitter.on('handleEndGame', () => {
			this.server.emit('endGame');
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
	}

	handleDisconnection(client : Socket) {
		console.log("client id  : " + client.id + "disconnected");
	}

	@SubscribeMessage('joinRoom')
	async handleJoinRoom(client : Socket, payload : {roomId : string}) {
		const side = this.gameService.addPlayer(payload.roomId, client.id, client.data.payload.username)
		if(side === PaddleSide.Left)
		{
			client.join(payload.roomId);
			this.logger.log("waiting for another player")
			client.emit('joinedRoom', {roomId : payload.roomId, side : PaddleSide.Left, serverTableWidth: VIRTUAL_TABLE_WIDTH, serverTableHeight : VIRTUAL_TABLE_HEIGHT, userId : client.data.payload.id});
		}
		else {
			client.join(payload.roomId);
			this.logger.log("joined an already created game");
			client.emit('joinedRoom', {roomId : payload.roomId, side : PaddleSide.Right, serverTableWidth: VIRTUAL_TABLE_WIDTH, serverTableHeight : VIRTUAL_TABLE_HEIGHT});
			const room = this.gameService.roomsMap.get(payload.roomId);
			if(room && room.playersNumber === 2) {
				this.logger.log("game is starting now...");
				this.server.to(payload.roomId).emit('startGame', {initialBallAngle : this.gameService.randomInitialDirection(), leftPlayerObj :  room.players[0], rightPlayerObj: room.players[1], ballPosX : room.ball.x , ballPosY : room.ball.y, ballSpeedX: room.ball.ballSpeedX, ballSpeedY : room.ball.ballSpeedY});
			}
		}
	}


	@SubscribeMessage('newPaddlePosition')
	handleNewPaddlePosition(client : Socket, payload : {roomId: string, paddlePosY:number}) : void {
		this.gameService.updatePaddlePosition(payload.roomId, client.id, payload.paddlePosY);
		client.to(payload.roomId).emit('updatePaddlePosition', { playerId : client.id ,paddlePosY : payload.paddlePosY});
	}
}