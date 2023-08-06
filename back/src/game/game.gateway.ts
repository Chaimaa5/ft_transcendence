import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer, OnGatewayConnection, OnGatewayInit, OnGatewayDisconnect } from '@nestjs/websockets'
import { Server, Socket } from 'socket.io'
import { GameState, PaddleState } from "./gameState.interface"
import { roomManager } from './rooms/room.manager';
import { SocketStrategy } from 'src/auth/jwt/websocket.strategy';
import { UserService } from 'src/user/user.service';

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

	// queue to hold players waiting for a game
	playersQueue : Socket[] = [];
	socketStrategy = new SocketStrategy
	clients = new Map<string, Socket>();
	userService = new UserService;
	
	constructor(private readonly roomManager : roomManager) {}


	afterInit() {
		console.log('game server initialized', this.server);
	}
	
	async handleConnection(client : Socket) {
		console.log(`server side : client connected : ${client.id}`);
		// gotta add some verification of the validity of the authentication
		// let token : any =  client.handshake.headers['authorization'];
        // token = token.split(' ')[1]
        //  client.data.payload = await this.socketStrategy.validate(token);
		//  let user = await this.userService.GetById(client.data.payload.id)
		 
		// storing a refrerence to the client 
		this.clients.set(client.id, client);

		// add the player to the queue
		this.playersQueue.push(client);
		if(this.playersQueue.length === 2 ) {
			const player1 = this.playersQueue.shift();
			const player2 = this.playersQueue.shift();

			if(player1 && player2) {
				this.roomManager.createRoom(player1, player2);
			}
		}
		else  {
			console.log("waiting for another player");
		}
	}

	handleDisconnection(client : Socket) {
		console.log("client id  : " + client.id + "disconnected");
	}

	@SubscribeMessage('newPaddlePosition')
	handleNewPaddlePosition(client : Socket, payload : {playerId: string, direction:number}) : void {
		// get the rooms the client has joined (which should always be one)
		const rooms = Array.from(client.rooms);

		// gotta redo all the logic fuck
		// https://youtu.be/3V1DBEUoImo

		// find the id of the custom room that the client has joined (excluding the default room which is always equal to the client's id)
		const roomId = rooms.find(room => room != client.id);
	}
}