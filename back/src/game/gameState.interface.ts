export enum PaddleSide {
	Left,
	Right,
}


export interface PaddleState {
	playerId : string;
	side : PaddleSide;
	x : number;
	y : number;
}

export interface BallState {
	x : number;
	y : number;
	ballSpeedX : number;
	ballSpeedY : number;
}

export interface RoomState {
	roomId : string;
	playersNumber : number;
	ball : BallState;
	ballspeedRatio : number;
	players : PaddleState[]
}
