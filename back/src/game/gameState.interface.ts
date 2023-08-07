import { PaddleSide } from '../../../front/src/component/game/classes/Paddle'
export interface PaddleState {
	playerId : string;
	side : PaddleSide;
	y : number;
}

interface BallState {
	x : number;
	y : number;
}

export interface RoomState {
	roomId : string;
	playersNumber : number;
	ball : BallState;
	players : PaddleState[]
}