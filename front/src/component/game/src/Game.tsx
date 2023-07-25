import {Player} from "./Player";
import {Ball} from "./Ball";
import {GameTable} from "./GameTable";
import {Paddle} from "./Paddle";

export interface Round {
	roundNumber : number;
	leftPlayerScore : number;
	rightPlayerScore : number;
}

export class Game{
	rightPlayer : Player;
	leftPlayer : Player;
	rightPaddle : Paddle;
	leftPaddle : Paddle;
	ball : Ball;
	table : GameTable;
	roundsNumber : number;
	roundRequiredPoints : number;
	round : Round;


	constructor(tableWidth: number, tableHeight: number) {
		this.table = new GameTable(tableWidth, tableHeight);
		this.rightPlayer = new Player("shrooma");
		this.leftPlayer = new Player("cel-mhan");
		this.ball = new Ball(this.table);
		this.rightPaddle = new Paddle(this.table);
		this.leftPaddle = new Paddle(this.table);
		this.roundsNumber = 3;
		this.roundRequiredPoints = 5;
		this.round = {
			roundNumber : 1,
			leftPlayerScore : 0, 
			rightPlayerScore : 0
		};
	}

	setTableDimensions(tableWidth: number, tableHeight: number) {
		this.table.tableWidth = tableWidth;
		this.table.tableHeight = tableHeight;
	}

	setPaddlesDimensions(width : number, height : number){
		// left Paddle
		this.leftPaddle.paddlePosX = 20;
		this.leftPaddle.paddlePosY = height/2 - ((height*0.3)/2);
		this.leftPaddle.paddleWidth = width*0.02;
		this.leftPaddle.paddleHeight = height*0.3;
		// right Paddle
		this.rightPaddle.paddlePosX = width - width*0.02 - 20;
		this.rightPaddle.paddlePosY = height/2 - ((height*0.3)/2);
		this.rightPaddle.paddleWidth = width*0.02;
		this.rightPaddle.paddleHeight = height*0.3;
	}
};