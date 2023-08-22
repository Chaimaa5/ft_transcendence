import P5 from "p5"
import { drawPAddle } from "../DrawingUtils";
import { GameTable } from "./GameTable";


export enum PaddleSide {
	Left,
	Right,
}

const paddleSizeMap: Map<string, number> = new Map([
  ["small", 5],
  ["medium", 4],
  ["large", 3]
]);

export class Paddle {
	paddlePosX : number;
	paddlePosY : number;
	prevPaddlePosY : number;
	paddleWidth : number;
	paddleHeight : number;
	borderRadius : number;
	prevBorderRadius : number;
	gradientColor1 : string;
	gradientColor2 : string;
	stepsY : number;
	table : GameTable;
	side ?: PaddleSide;
	direction : number;
	prevDirection : number;
	prevWindowHeight : number;
	speedRatio : number;
	username : string;

	constructor (table : GameTable) {
		this.paddlePosX = NaN;
		this.paddlePosY = NaN;
		this.paddleWidth = NaN;
		this.paddleHeight = NaN;
		this.borderRadius = 60;
		this.prevBorderRadius = 60;
		this.gradientColor1 = '';
		this.gradientColor2 = '';
		this.table = table;
		this.stepsY = NaN;
		this.direction = 0;
		this.prevDirection = 0;
		this.prevWindowHeight = 0;
		this.speedRatio = 200;
	}

	initPaddle(
		gradientColor1 : string,
		gradientColor2 : string,
	) {
		this.gradientColor1 = gradientColor1;
		this.gradientColor2 = gradientColor2;
		this.paddlePosX = this.table.mapValue(this.paddlePosX, this.table.serverTableWidth, this.table.tableWidth);
		this.paddlePosY = this.table.mapValue(this.paddlePosY, this.table.serverTableHeight, this.table.tableHeight);
		this.prevPaddlePosY = this.paddlePosY;
		this.paddleWidth = this.table.tableWidth*0.02;
		this.paddleHeight = this.table.mapValue(this.paddleHeight, this.table.serverTableWidth, this.table.tableWidth);
		this.stepsY = this.table.tableWidth/this.speedRatio;
	}

	show() {
		if(this.table.ctx && this.table.p) {
			drawPAddle(this);
		}
	}

	updateOpponentPaddle(paddlePosY : number) {
		if(this.table.p) {
			this.paddlePosY = this.table.mapValue(paddlePosY, this.table.serverTableHeight, this.table.tableHeight);
		}
	}

	updateMyPaddle(ratio : number) {
		this.stepsY = this.table.tableWidth/(this.speedRatio-(ratio*3));
		if(this.table.p && this.table.socket) {
			this.paddlePosY += this.stepsY * this.direction;
			this.paddlePosY = this.table.p.constrain(
				this.paddlePosY,
				0,
				this.table.tableHeight - this.paddleHeight);
			if(	this.prevPaddlePosY != this.paddlePosY ) {
				this.prevPaddlePosY = this.paddlePosY
				this.table.socket.emit('newPaddlePosition', {side : this.side, roomId: this.table.roomId, paddlePosY : this.table.mapValue(this.paddlePosY, this.table.tableHeight, this.table.serverTableHeight), paddlePosX : this.table.mapValue(this.paddlePosX, this.table.tableWidth, this.table.serverTableWidth)});
			}
		}
	}

	move(direction : number) {
		this.direction = direction;
	}
	
	adjustPaddleSpeed() {
		this.stepsY = this.table.mapValue(this.stepsY, this.table.prevTableWidth, this.table.tableWidth);
	}
	
	moveToCenter(direction : number) {
		if(this.table.p) {
			const min = (direction === 1) ? 0 : this.table.tableHeight/2 - (this.paddleHeight/2);
			const max = (direction === 1) ? this.table.tableHeight/2 + (this.paddleHeight/2) : this.table.tableHeight;

			this.paddlePosY += this.stepsY * direction;
			this.paddlePosY = this.table.p.constrain(
				this.paddlePosY,
				min,
				max
			);
		}
	}

	// training mode methods


	initTrainingPaddle(
		gradientColor1 : string,
		gradientColor2 : string,
		side : PaddleSide,
		paddleSize : string,
		speed : number
	) {
		this.speedRatio = (speed === 1) ? 200  : (speed === 2) ? 150 : 100;
		this.gradientColor1 = gradientColor1;
		this.gradientColor2 = gradientColor2;
		this.side = side;
		if(this.side === PaddleSide.Left) {
			this.paddlePosX = this.table.tableWidth/100;
			this.paddlePosY = this.table.tableHeight/2 - ((this.table.tableHeight*0.3)/2);
		}
		else if(this.side === PaddleSide.Right) {
			this.paddlePosX = this.table.tableWidth - this.table.tableWidth*0.02 - (this.table.tableWidth/100);
			this.paddlePosY = this.table.tableHeight/2 - ((this.table.tableHeight*0.3)/2);
		}
		this.paddleWidth = this.table.tableWidth*0.02;
		const paddleSizeRatio = paddleSizeMap.get(paddleSize);
		if(paddleSizeRatio)
			this.paddleHeight = this.table.tableHeight/paddleSizeRatio;
		this.stepsY = this.table.tableWidth/this.speedRatio;
	}

	update() {
		if(this.table.p) {
			this.paddlePosY += this.stepsY * this.direction;
			this.paddlePosY = this.table.p.constrain(
				this.paddlePosY,
				0,
				this.table.tableHeight - this.paddleHeight);
		}
	}

	chaseBall(direction : number, ballPosY: number) {
		if(this.table.p) {
			const min = (direction === 1) ? 0 : ballPosY;
			const max = (direction === 1) ? ballPosY - this.paddleHeight : this.table.tableHeight - this.paddleHeight;

			this.paddlePosY += direction * this.stepsY;
			this.paddlePosY = this.table.p.constrain(
				this.paddlePosY,
				min,
				max
			)
		}
	}
};
