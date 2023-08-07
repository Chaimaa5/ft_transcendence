import {Player} from "./Player";
import {Ball} from "./Ball";
import {GameTable} from "./GameTable";
import {Paddle, PaddleSide} from "./Paddle";

export interface Round {
	roundNumber : number;
	leftPlayerScore : number;
	rightPlayerScore : number;
}

export class Game{
	rightPlayer : Player;
	leftPlayer : Player;
	
	myPaddle : Paddle;
	opponentPaddle : Paddle;
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

		this.myPaddle = new Paddle(this.table);
		this.opponentPaddle = new Paddle(this.table);

		this.roundsNumber = 3;
		this.roundRequiredPoints = 2;
		this.round = {
			roundNumber : 0,
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
		this.myPaddle.paddlePosX = 20;
		this.myPaddle.paddlePosY = height/2 - ((height*0.3)/2);
		this.myPaddle.paddleWidth = width*0.02;
		this.myPaddle.paddleHeight = height*0.3;
		// right Paddle
		this.opponentPaddle.paddlePosX = width - width*0.02 - 20;
		this.opponentPaddle.paddlePosY = height/2 - ((height*0.3)/2);
		this.opponentPaddle.paddleWidth = width*0.02;
		this.opponentPaddle.paddleHeight = height*0.3;
	}
	
	updateScore(side : PaddleSide) {
		if(side === PaddleSide.Left) {
			this.round.leftPlayerScore++;
			if(this.round.leftPlayerScore === this.roundRequiredPoints) {
				this.nextRound();
				this.leftPlayer.score++;
				if(this.round.roundNumber === this.roundsNumber)
				{
					this.endGame(); 
				}
			}
		}
		else {
			this.round.rightPlayerScore++;
			if(this.round.rightPlayerScore === this.roundRequiredPoints) {
				this.nextRound();
				this.rightPlayer.score++;
				if(this.round.roundNumber === this.roundsNumber)
				{
					this.endGame(); 
				}
			}
		}
		this.table.displayScore(this.leftPlayer, this.rightPlayer, this.round);
	}

	nextRound() {
		this.round.roundNumber++;
		this.round.leftPlayerScore = 0;
		this.round.rightPlayerScore = 0;
	}

	endGame() {
		this.ball.setInitialBallPosition(this.table.tableWidth, this.table.tableHeight);
		this.ball.speedX = 0;
		this.ball.speedY = 0;
		if(this.table.p) {
			this.table.p.clear();
			this.table.p.noLoop();
		}
	}
};