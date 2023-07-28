import P5 from "p5";
import {GameTable} from "./GameTable";
import {Paddle , PaddleSide} from "./Paddle";
import {Game} from "./Game"

const randomDirection = ():number => {
	const minValue = -Math.PI / 4;
	const maxValue = Math.PI / 4;
  
	// Generate a random number between 0 and 1
	const randomZeroToOne = Math.random();
  
	// Scale and shift the random number to fit the desired range
	const randomValueInRange = randomZeroToOne * (maxValue - minValue) + minValue;
  
	return randomValueInRange;
}


export class Ball {
	ballPosX : number;
	ballPosY : number;
	speedX : number;
	speedY : number;
	ballSize : number;
	table : GameTable; 
	radius : number;
	prevWindowWidth : number;
	prevWindowHeight : number;

	constructor(table : GameTable) {
		this.table = table;
		this.ballPosX = this.table.tableWidth;
		this.ballPosY = this.table.tableHeight;
		this.speedX = 1;
		this.speedY = 1;
		this.ballSize = 12;
		this.radius = this.ballSize/2;
		this.prevWindowWidth = NaN;
		this.prevWindowHeight = NaN;
	};

	show() : void {
		if(this.table.p) {
			this.table.p.fill(255);
			this.table.p.noStroke();
			this.table.p.ellipse(this.ballPosX, this.ballPosY, this.ballSize, this.ballSize);
		}
	};

	move() {
		this.ballPosX = this.ballPosX + this.speedX;
		this.ballPosY = this.ballPosY + this.speedY;
	}

	reset() {
		const randomAngle : number = randomDirection();
		this.ballPosX = this.table.tableWidth/2;
		this.ballPosY = this.table.tableHeight/2;
		this.speedX = this.table.tableWidth/200 * Math.cos(randomAngle);
		this.speedY = this.table.tableWidth/200 * Math.sin(randomAngle);
	}

	edges(game : Game) {
		if((this.ballPosY - this.radius) <= 0 || (this.ballPosY + this.radius) >= this.table.tableHeight)
			this.speedY *= -1;
		if((this.ballPosX + this.radius) >= this.table.tableWidth)
		{
			console.log("am here");
			game.updateScore(PaddleSide.Left);
			this.reset();
		}
		if((this.ballPosX - this.radius) <= 0)
		{
			console.log("no am here");
			game.updateScore(PaddleSide.Right);
			this.reset();
		}
	}

	setInitialBallPosition(width: number, height: number) {
		this.ballPosX = width / 2;
		this.ballPosY = height / 2;
	}

	initBall() {
		const randomAngle : number = randomDirection();
		this.ballSize = (this.table.tableWidth * 0.02) + 5;
		this.radius = this.ballSize/2;
		this.speedX = this.table.tableWidth/200 * Math.cos(randomAngle);
		this.speedY = this.table.tableWidth/200 * Math.sin(randomAngle);
		this.prevWindowHeight = this.table.tableHeight;
		this.prevWindowWidth = this.table.tableWidth;
		this.setInitialBallPosition(this.table.tableWidth, this.table.tableHeight);
	}

	resizeBall() {
		this.ballSize = (this.table.tableWidth * 0.02) + 5;
		this.radius = this.ballSize/2;
	}
	checkPaddleHits(paddle : Paddle) {
		if((this.ballPosY + this.radius) > paddle.paddlePosY
			&& (this.ballPosY - this.radius )< (paddle.paddlePosY + paddle.paddleHeight)) {
			let angle;
			if(paddle.side === PaddleSide.Right && (this.ballPosX + this.radius) > paddle.paddlePosX)
			{
				if(this.ballPosX < paddle.paddlePosX) {
					const diff = this.ballPosY - paddle.paddlePosY;
					if(this.table.p) {
						console.log("right speed X " + this.speedX);
						console.log("right speed Y " + this.speedY);
						angle = this.table.p.map(diff, 0, paddle.paddleHeight, this.table.p.radians(225), this.table.p.radians(135));
						this.speedX = (this.table.tableWidth/200) *  Math.cos(angle);
						this.speedY = (this.table.tableWidth/200) *  Math.sin(angle);
						this.ballPosX = paddle.paddlePosX - this.radius;
						console.log("right after X " + this.speedX);
						console.log("right after Y " + this.speedY);
					}
				}
			}
			else if(paddle.side === PaddleSide.Left && (this.ballPosX - this.radius) < (paddle.paddlePosX + paddle.paddleWidth))
			{
				if(this.ballPosX > paddle.paddlePosX){
					const diff = this.ballPosY - paddle.paddlePosY;
					if(this.table.p) {
						console.log("left paddle speed X " + this.speedX);
						console.log("left speed Y " + this.speedY);
						angle = this.table.p.map(diff, 0, paddle.paddleHeight, -this.table.p.radians(45), this.table.p.radians(45));
						this.speedX = (this.table.tableWidth/200) *  Math.cos(angle);
						this.speedY = (this.table.tableWidth/200) *  Math.sin(angle);
						this.ballPosX = paddle.paddlePosX + paddle.paddleWidth + this.radius;
						console.log("left after X " + this.speedX);
						console.log("left after Y " + this.speedY);
					}
				}
			}
		}
	}

	adjustBallSpeed() {
		this.speedX = this.table.tableWidth/200;
		this.speedY = this.table.tableWidth/200;
	}
};