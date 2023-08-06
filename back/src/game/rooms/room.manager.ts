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

	createRoom(leftPlayer : Socket, rightPlayer : Socket) {
		if(leftPlayer && rightPlayer) {
			const roomId = `room_${this.roomIdCounter}`;
			this.roomIdCounter++;
			
			// join the 2 players to a socket.io channel
			leftPlayer.join(roomId);
			leftPlayer.emit('paddleSide', 'left');
			rightPlayer.join(roomId);
			rightPlayer.emit('paddleSide', 'right')

			const initialLeftPaddleState : PaddleState = { playerId: leftPlayer.id, side: "left", y: 0 };
			const initialRightPaddleState : PaddleState = { playerId: rightPlayer.id, side: "right", y: 0 };

			// construct the initial game state of the game
			const initialGameState : GameState = {
				id : roomId,
				ball : {x : 0, y : 0},
				paddles: [initialLeftPaddleState, initialRightPaddleState]
			}

			// push the room id and its appropriate gamestate to the rooms map
			this.rooms.set(initialGameState['id'],initialGameState);
		}
		else {
			console.error("leftPlayer or/and rightPlayer are null")
		}
	}

	getRoomState(roomId: string) : GameState | undefined {
		return(this.rooms.get(roomId));
	}

	updateRoomState(roomId: string, payload: {playerId: string, y: number}) : void {
		
		// this.rooms.set(roomId, newState);
	}
}

