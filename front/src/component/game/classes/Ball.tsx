import P5 from "p5";
import {GameTable} from "./GameTable";
import {Paddle , PaddleSide} from "./Paddle";
import {Game} from "./Game"

//normal speed ration tableWidth/200



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
	speedRatio : number;
	randomInitialBallDirection : number;

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
		this.speedRatio = NaN;
	};

	show() : void {
		if(this.table.p) {
			this.table.p.fill(255);
			this.table.p.noStroke();
			this.table.p.ellipse(this.ballPosX, this.ballPosY, this.ballSize, this.ballSize);
		}
	};

	initBall() {
		this.speedRatio = 100;
		this.ballSize = (this.table.tableWidth * 0.02) + 5;
		this.radius = this.ballSize/2;
		this.ballPosX = this.table.mapValue(this.ballPosX, this.table.serverTableWidth, this.table.tableWidth);
		this.ballPosY = this.table.mapValue(this.ballPosY, this.table.serverTableHeight, this.table.tableHeight);
		this.speedX = this.table.mapValue(this.speedX, this.table.serverTableWidth, this.table.tableWidth) * Math.cos(this.randomInitialBallDirection);
		this.speedY = this.table.mapValue(this.speedY, this.table.serverTableHeight, this.table.tableHeight) * Math.sin(this.randomInitialBallDirection);
		this.prevWindowHeight = this.table.tableHeight;
		this.prevWindowWidth = this.table.tableWidth;
	}

	adjustBallDimensions() {
		if(this.table.p) {
			this.ballSize = this.table.mapValue(this.ballSize, this.table.prevTableWidth, this.table.tableWidth);
			this.radius = this.ballSize/2;
			this.ballPosX = this.table.mapValue(this.ballPosX, this.table.prevTableWidth, this.table.tableWidth)
			this.ballPosY = this.table.mapValue(this.ballPosY, this.table.prevTableHeight, this.table.tableHeight);
			this.speedX = this.table.mapValue(this.speedX, this.table.prevTableWidth, this.table.tableWidth);
			this.speedY = this.table.mapValue(this.speedY, this.table.prevTableWidth, this.table.tableWidth);
		}
	}

	// training methods


	setInitialBallPosition(width: number, height: number) {
		this.ballPosX = width / 2;
		this.ballPosY = height / 2;
	}

	initTrainingBall(ballSpeed: number) {
		const randomAngle : number = randomDirection();
		this.speedRatio = (ballSpeed === 1) ? 200  : (ballSpeed === 2) ? 150 : 100;
		this.ballSize = (this.table.tableWidth * 0.02) + 5;
		this.radius = this.ballSize/2;
		this.speedX = this.table.tableWidth/this.speedRatio * Math.cos(randomAngle);
		this.speedY = this.table.tableWidth/this.speedRatio * Math.sin(randomAngle);
		this.prevWindowHeight = this.table.tableHeight;
		this.prevWindowWidth = this.table.tableWidth;
		this.setInitialBallPosition(this.table.tableWidth, this.table.tableHeight);
	}

	move() {
		this.ballPosX = this.ballPosX + this.speedX;
		this.ballPosY = this.ballPosY + this.speedY;
	}

	edges(game : Game) : boolean {
		if((this.ballPosY - this.radius) <= 0 || (this.ballPosY + this.radius) >= this.table.tableHeight)
			this.speedY *= -1;
		if((this.ballPosX + this.radius) >= this.table.tableWidth)
		{
			this.reset();
			return(true);
		}
		if((this.ballPosX - this.radius) <= 0)
		{
			this.reset();
		}
		return(false);
	}

	reset() {
		const randomAngle : number = randomDirection();
		this.ballPosX = this.table.tableWidth/2;
		this.ballPosY = this.table.tableHeight/2;
		this.speedX = this.table.tableWidth/this.speedRatio * Math.cos(randomAngle);
		this.speedY = this.table.tableWidth/this.speedRatio * Math.sin(randomAngle);
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
						angle = this.table.p.map(diff, 0, paddle.paddleHeight, this.table.p.radians(225), this.table.p.radians(135));
						this.speedX = (this.table.tableWidth/this.speedRatio) *  Math.cos(angle);
						this.speedY = (this.table.tableWidth/this.speedRatio) *  Math.sin(angle);
						this.ballPosX = paddle.paddlePosX - this.radius;
					}
				}
			}
			else if(paddle.side === PaddleSide.Left && (this.ballPosX - this.radius) < (paddle.paddlePosX + paddle.paddleWidth))
			{
				if(this.ballPosX > paddle.paddlePosX){
					const diff = this.ballPosY - paddle.paddlePosY;
					if(this.table.p) {
						angle = this.table.p.map(diff, 0, paddle.paddleHeight, -this.table.p.radians(45), this.table.p.radians(45));
						this.speedX = (this.table.tableWidth/this.speedRatio) *  Math.cos(angle);
						this.speedY = (this.table.tableWidth/this.speedRatio) *  Math.sin(angle);
						this.ballPosX = paddle.paddlePosX + paddle.paddleWidth + this.radius;
					}
				}
			}
		}
	}

};