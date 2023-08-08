// import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer, OnGatewayConnection, OnGatewayInit, OnGatewayDisconnect } from '@nestjs/websockets'
// import { Server, Socket } from 'socket.io'
// // import { RoomState, PaddleState } from "./gameState.interface"
// // import { roomManager } from './rooms/room.manager';
// import { SocketStrategy } from 'src/auth/jwt/websocket.strategy';
// import { UserService } from 'src/user/user.service';
// import { Logger } from '@nestjs/common';
// // import { PaddleSide  } from '../../../front/src/component/game/classes/Paddle'


// @WebSocketGateway({
// 	namespace:'/game',
// 	cors: {
// 		origin: ['http://localhost:8000'],
// 		methods: ['GET', 'POST'],
// 		credentials: true,
// 	},
// })
// export class GameGateway implements OnGatewayConnection{
// 	@WebSocketServer()
// 	server: Server;

// 	roomIdCounter = 1;

// 	// map to store the game state for each room 
// 	private readonly rooms : Map<RoomState['roomId'], RoomState> = new Map<RoomState['roomId'], RoomState> ();
	

// 	private logger : Logger = new Logger('gameGateway');

// 	// queue to hold players waiting for a game
// 	// playersQueue : Socket[] = [];
// 	clients = new Map<string, Socket>();
	


// 	afterInit() {
// 		this.logger.log('game server initialized');
// 	}
	
// 	async handleConnection(client : Socket) {
// 		this.logger.log(`server side : client connected : ${client.id}`);
// 		// gotta add some verification of the validity of the authentication
// 		// let token : any =  client.handshake.headers['authorization'];
//         // token = token.split(' ')[1]
//         //  client.data.payload = await this.socketStrategy.validate(token);
// 		//  let user = await this.userService.GetById(client.data.payload.id)
		 
// 		// storing a refrerence to the client 
// 		this.clients.set(client.id, client);
// 		this.joinPlayerToRoom(client);
// 	}

// 	private joinPlayerToRoom(client : Socket) {
// 		let roomId : string;
// 		const availableRoom = [...this.rooms.values()].find(room => room.playersNumber === 1);
// 		if (availableRoom) {
// 			roomId = availableRoom.roomId;
// 			availableRoom.players.push({playerId: client.id, side: PaddleSide.right, y: 0});
// 			availableRoom.playersNumber++;
// 			client.join(availableRoom.roomId);
// 			client.emit('joinedRoom', {roomId : roomId, side : PaddleSide.right});
// 		} else {
// 			roomId = this.createRoom();
// 			this.rooms.set(
// 				roomId,
// 				{
// 					roomId : roomId,
// 					playersNumber : 1, 
// 					ball : {x : 0, y : 0}, 
// 					players : [{playerId : client.id, side : PaddleSide.left, y : 0}],
// 				})
// 			client.join(roomId);
// 			client.emit('joinedRoom', {roomId : roomId, side : PaddleSide.left});
// 		}
// 		if(this.rooms.get(roomId)?.playersNumber === 2) {
// 			this.server.emit('startGame');
// 		}
// 	}
	
// 	private createRoom() : string{
// 		const roomId = `room_${this.roomIdCounter}`;
// 		this.roomIdCounter++;
// 		return roomId;
// 	}

// 	handleDisconnection(client : Socket) {
// 		console.log("client id  : " + client.id + "disconnected");
// 	}

// 	@SubscribeMessage('newPaddlePosition')
// 	handleNewPaddlePosition(client : Socket, payload : {roomId: string, direction:number}) : void {
// 		client.to(payload.roomId).emit('updatePositions', { playerId : client.id ,direction : payload.direction});
// 	}
// }