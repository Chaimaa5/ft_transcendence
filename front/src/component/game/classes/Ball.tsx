import P5 from "p5";
import {GameTable} from "./GameTable";
import {Paddle , PaddleSide} from "./Paddle";
import {Game} from "./Game"

//normal speed ration tableWidth/200

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
		this.speedRatio = 200;
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
};
