import { MessageBody, SubscribeMessage, WebSocketGateway, OnGatewayConnection, OnGatewayInit, OnGatewayDisconnect } from '@nestjs/websockets'
import { Server, Socket } from 'socket.io'
import { GameState, PaddleState } from "./gameState.interface"
import { roomManager } from './rooms/room.manager';

@WebSocketGateway({namespace:'/game'})
export class GameGateway implements OnGatewayConnection{

	// queue to hold players waiting for a game
	playersQueue : Socket[] = [];

	clients = new Map<string, Socket>();

	server: Server; 
	
	constructor(private readonly roomManager : roomManager) {}


	afterInit() {
		console.log('game server initialized');
	}
	
	handleConnection(client : Socket) {
		// gotta add some verification of the validity of the authentication

		// storing a reference to the client 
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
	}

	handleDisconnection(client : Socket) {

	}

	@SubscribeMessage('newPosition')
	handleNewPosition(client : Socket, @MessageBody() data: string) {
		console.log(data)
	}
}