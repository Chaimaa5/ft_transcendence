import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer, OnGatewayConnection, OnGatewayInit, OnGatewayDisconnect } from '@nestjs/websockets'
import { Server, Socket } from 'socket.io'
import { RoomState, PaddleState } from "./gameState.interface"
import { SocketStrategy } from 'src/auth/jwt/websocket.strategy';
import { UserService } from 'src/user/user.service';
import { Logger } from '@nestjs/common';
import { PaddleSide } from './gameState.interface';

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

	roomIdCounter = 1;

	// map to store the game state for each room 
	private readonly rooms : Map<RoomState['roomId'], RoomState> = new Map<RoomState['roomId'], RoomState> ();
	

	private logger : Logger = new Logger('gameGateway');

	// queue to hold players waiting for a game
	// playersQueue : Socket[] = [];
	clients = new Map<string, Socket>();
	


	afterInit() {
		this.logger.log('game server initialized');
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
		const availableRoom = [...this.rooms.values()].find(room => room.playersNumber === 1);
		if (availableRoom) {
			roomId = availableRoom.roomId;
			availableRoom.players.push({playerId: client.id, side: PaddleSide.Right, y: 0});
			availableRoom.playersNumber++;
			client.join(availableRoom.roomId);
			this.logger.log("joined an already created game");
			client.emit('joinedRoom', {roomId : roomId, side : PaddleSide.Right});
		} else {
			roomId = this.createRoom();
			this.rooms.set(
				roomId,
				{
					roomId : roomId,
					playersNumber : 1, 
					ball : {x : 0, y : 0}, 
					players : [{playerId : client.id, side : PaddleSide.Left, y : 0}],
				})
			client.join(roomId);
			this.logger.log("waiting for another player")
			client.emit('joinedRoom', {roomId : roomId, side : PaddleSide.Left});
		}
		if(this.rooms.get(roomId)?.playersNumber === 2) {
			this.logger.log("game is starting now...");
			this.server.emit('startGame', this.randomInitialDirection());
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

	private createRoom() : string{
		const roomId = `room_${this.roomIdCounter}`;
		this.roomIdCounter++;
		return roomId;
	}

	handleDisconnection(client : Socket) {
		console.log("client id  : " + client.id + "disconnected");
	}

	@SubscribeMessage('newPaddlePosition')
	handleNewPaddlePosition(client : Socket, payload : {roomId: string, direction:number}) : void {
		client.to(payload.roomId).emit('updatePositions', { playerId : client.id ,direction : payload.direction});
	}

	@SubscribeMessage('resetRound') 
	handleResetRound(client: Socket) {
		this.server.emit('ballInitialDirection', this.randomInitialDirection());
	}
}