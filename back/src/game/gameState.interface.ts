export enum PaddleSide {
	Left,
	Right,
}


export interface PaddleState {
	playerId : string;
	username : string; // to be removed
	side : PaddleSide;
	roundScore : number;
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
	speedIncrement : number;
	paddleHeightDecrement : number;
	paddleHeight : number;
	players : PaddleState[];
	thisRound  : {
		roundNumber : number;
		leftPlayerScore : number;
		rightPlayerScore : number;
	}
	rounds : number;
	pointsToWin : number;
}