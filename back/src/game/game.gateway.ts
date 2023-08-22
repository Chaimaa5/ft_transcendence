import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer, OnGatewayConnection, OnGatewayInit, OnGatewayDisconnect } from '@nestjs/websockets'
import { Server, Socket } from 'socket.io'
import { RoomState, PaddleState } from "./gameState.interface"
import { UserService } from 'src/user/user.service';
import { Logger } from '@nestjs/common';
import { PaddleSide } from './gameState.interface';
import { GameResults, GameService, Player, VIRTUAL_TABLE_HEIGHT, VIRTUAL_TABLE_WIDTH } from './game.service';
import { SocketStrategy } from '../auth/jwt/websocket.strategy';

@WebSocketGateway({
	namespace:'/game',
	cors: {
		origin: ['http://localhost:8080', 'http://10.14.10.6:8080', 'http://10.14.10.6:8000', 'http://10.14.10.6:3000'],
		methods: ['GET', 'POST'],
		credentials: true,
	},
})
export class GameGateway implements OnGatewayConnection{
	@WebSocketServer()
	server: Server;
	
	constructor(private readonly gameService : GameService, private readonly userService : UserService) {}

	private logger : Logger = new Logger('gameGateway');

	sockets = new Map<string, Socket>();
	clients = new Map<string, Socket>();
	socketStrategy = new SocketStrategy;
	

	afterInit(){
		this.logger.log('game server initialized');
		this.gameService.eventsEmitter.on('handleMatched', (matches : {player1 : Player, player1Side : PaddleSide, player2 : Player, player2Side : PaddleSide, gameId : number}) => {
			console.log("player 1 : " + matches.player1.username + " is " + matches.player1Side);
			console.log("player 2  : " + matches.player2.username + " is " + matches.player2Side);
			matches.player1.socket.emit('match', {username : matches.player2.username, gameId : matches.gameId, side : matches.player1Side});
			matches.player2.socket.emit('match', {username : matches.player1.username, gameId : matches.gameId, side : matches.player2Side});

		})

		this.gameService.eventsEmitter.on('handleUpdateScore', (room : RoomState) => {
			const leftPlayer =  {roundScore : room.players[0].roundScore, userName : room.players[0].username};
			const rightPlayer = {roundScore : room.players[1].roundScore, userName : room.players[1].username};
			const round = {roundNumber : room.thisRound.roundNumber, leftPlayerScore : room.thisRound.leftPlayerScore, rightPlayerScore : room.thisRound.rightPlayerScore};
			this.server.emit('updateScore', {roomId : room.roomId ,leftPlayerRoundScore : leftPlayer.roundScore, rightPlayerRoundScore : rightPlayer.roundScore, playedRounds : round.roundNumber, leftScore : round.leftPlayerScore, rightScore : round.rightPlayerScore, paddleHeight : room.paddleHeight});
		})

		this.gameService.eventsEmitter.on('handleUpdateBallPosition', (ball : {roomId: string,x : number, y : number, speedRatio : number}) => {
			this.server.emit('updateBallPosition', {roomId : ball.roomId, x: ball.x, y: ball.y, speedRatio : ball.speedRatio});
		})

		this.gameService.eventsEmitter.on('handleEndGame', (payload : {roomId: string, gameResults : GameResults}) => {
			this.server.emit('endGame', {roomId : payload.roomId, gameResult : payload.gameResults});
		})
		this.gameService.eventsEmitter.on('startGame', (gameId:number) => {
			this.server.emit('launchGame',{gameId : gameId})
		})
		this.gameService.eventsEmitter.on('handleAlreadyJoinedQueue', (player : Socket) => {
			player.emit('alreadyJoined');
		})
	}

	
	async handleConnection(client : Socket) {
		this.logger.log(`server side : client connected : ${client.id}`);
		let token : any =  client.handshake.headers['authorization'];
        if(token){
                token = token.split(' ')[1]
                client.data.payload = await this.socketStrategy.validate(token);
                let user = await this.userService.GetById(client.data.payload.id)
                if (user) {
                    this.clients.set(client.data.payload.id , client);
				}
                console.log('WebSocket gateway connected!');
            }
		}
		
		handleDisconnection(client : Socket) {
			console.log("client id  : " + client.id + "disconnected");
		}
		
	@SubscribeMessage("getUsername")
	async handleGetUserName(client : Socket) {
		client.emit("username" , {username : client.data.payload.username});
	}

	@SubscribeMessage("joinQueue")
	async handleJoinedQueue(client : Socket, payload : {id : number}) {
		await this.gameService.createPlayer(client.data.payload.username, client.data.payload.id, client);
	}
	@SubscribeMessage('joinRoom')
	async handleJoinRoom(client : Socket, payload : {roomId : string, mode : string, side: PaddleSide}) {
		console.log("------ roomd id ----------------------------------------------------------------------- " + payload.roomId);
		let pSide;
		if(payload.mode === "multi") {
			pSide = payload.side;
		} else {
			pSide = this.gameService.addPlayer(payload.roomId, client.id, client.data.payload.username);
		}
		if(pSide === PaddleSide.Left)
		{
			console.log("left");
			client.join(payload.roomId);
			this.logger.log("waiting for another player in room " + payload.roomId)
			this.logger.log("client socket : " + client.id);
			client.emit('joinedRoom', {roomId : payload.roomId, pSide : PaddleSide.Left, serverTableWidth: VIRTUAL_TABLE_WIDTH, serverTableHeight : VIRTUAL_TABLE_HEIGHT, userId : client.data.payload.id, username : client.data.payload.username});
		}
		else if(pSide === PaddleSide.Right) {
			console.log("right");
			client.join(payload.roomId);
			this.logger.log("joined an already created game in room " + payload.roomId);
			this.logger.log("client socket : " + client.id);
			client.emit('joinedRoom', {roomId : payload.roomId, pSide : PaddleSide.Right, serverTableWidth: VIRTUAL_TABLE_WIDTH, serverTableHeight : VIRTUAL_TABLE_HEIGHT});
		}
		const room = this.gameService.roomsMap.get(payload.roomId);
		if(room && room.playersNumber === 2) {
			this.logger.log("game is starting now... ");
			this.gameService.startGameLoop(payload.roomId)
			this.server.emit('startGame', {roomId: payload.roomId, initialBallAngle : this.gameService.randomInitialDirection(), leftPlayerObj :  room.players[0], rightPlayerObj: room.players[1], ballPosX : room.ball.x , ballPosY : room.ball.y, ballSpeedX: room.ball.ballSpeedX, ballSpeedY : room.ball.ballSpeedY, paddleHeight : room.paddleHeight});
		}
	}


	@SubscribeMessage('leaveRoom') 
	async handleLeaveRoom (client : Socket, payload : {roomId : string, mode : string}){
		if(payload.mode === 'challenge') {
			const room = this.gameService.roomsMap.get(payload.roomId);
			if(room) {
				room.playersNumber--;
				room.isGameEnded = true;
			await this.gameService.deleteGameById(room.roomId.slice("room_".length));
			this.server.emit('gameCorrupted', {roomId : room.roomId});
			}
		}
		else {
			this.gameService.removePlayerFromQueue(client);
			const roomId = this.gameService.isInRoom(client.data.payload.id)
			if(roomId) {
				const room = this.gameService.roomsMap.get(roomId);
				if(room){
					room.playersNumber--;
					room.isGameEnded = true;
				}
				await this.gameService.deleteGameById(roomId.slice("room_".length));
				this.server.emit('gameCorrupted', {roomId : roomId});
			}
		}
	}

	@SubscribeMessage('newPaddlePosition')
	handleNewPaddlePosition(client : Socket, payload : {side : PaddleSide, roomId: string, paddlePosY:number, paddlePosX : number}) : void {
		this.gameService.updatePaddlePosition(payload.roomId, payload.side, payload.paddlePosY);
		client.to(payload.roomId).emit('updatePaddlePosition', { roomId : payload.roomId,paddlePosY : payload.paddlePosY});
	}
}