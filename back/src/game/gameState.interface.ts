export interface PaddleState {
	playerId : string;
	side : string;
	y : number;
}

interface BallState {
	x : number;
	y : number;
}

export interface GameState {
	id : string;
	ball : BallState;
	paddles: PaddleState[]
}