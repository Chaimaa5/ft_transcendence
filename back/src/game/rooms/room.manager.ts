import {Server, Socket} from 'socket.io'
import {GameState, PaddleState} from "../gameState.interface"


export class roomManager {


	// map to store the gamestate for each room 
	private readonly rooms :Map<GameState['id'], GameState> = new Map<GameState['id'], GameState> ();
	roomIdCounter = 1;

	public server : Server;

	constructor(server : Server) {
		this.server = server;
	}

	createRoom(player1 : Socket, player2 : Socket) {
		if(player1 && player2) {
			const roomId = `room_${this.roomIdCounter}`;
			this.roomIdCounter++;
			
			// join the 2 players to a socket.io channel
			player1.join(roomId);
			player2.join(roomId);

			const initialPaddleState1 : PaddleState = { playerId: player1.id, x: 0, y: 0 };
			const initialPaddleState2 : PaddleState = { playerId: player2.id, x: 0, y: 0 };

			// construct the initial game state of the game
			const initialGameState : GameState = {
				id : roomId,
				ball : {x : 0, y : 0},
				paddles: [initialPaddleState1, initialPaddleState2]
			}

			// push the room id and its appropriate gamestate to the rooms map
			this.rooms.set(initialGameState['id'],initialGameState);
		}
		else {
			console.error("player1 or/and player2 are null")
		}
	}

	getRoomState(roomId: string) : GameState | undefined {
		return(this.rooms.get(roomId));
	}

	updateRoomState(roomId: string, newState : GameState) : void {
		this.rooms.set(roomId, newState);
	}
}

