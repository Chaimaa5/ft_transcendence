import P5 from "p5"
import { drawPAddle } from "../DrawingUtils";
import { GameTable } from "./GameTable";


export enum PaddleSide {
	Left,
	Right,
}

export class Paddle {
	paddlePosX : number;
	paddlePosY : number;
	prevPaddlePosY : number;
	paddleWidth : number;
	paddleHeight : number;
	borderRadius : number;
	gradientColor1 : string;
	gradientColor2 : string;
	stepsY : number;
	table : GameTable;
	side ?: PaddleSide;
	direction : number;
	prevDirection : number;
	prevWindowHeight : number;
	speedRatio : number;

	constructor (table : GameTable) {
		this.paddlePosX = NaN;
		this.paddlePosY = NaN;
		this.paddleWidth = NaN;
		this.paddleHeight = NaN;
		this.borderRadius = 60;
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
		this.paddleHeight = this.table.tableHeight*0.3;
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

	updateMyPaddle() {
		if(this.table.p && this.table.socket) {
			this.paddlePosY += this.stepsY * this.direction;
			this.paddlePosY = this.table.p.constrain(
				this.paddlePosY,
				0,
				this.table.tableHeight - this.paddleHeight);
			if(	this.prevPaddlePosY != this.paddlePosY ) {
				this.prevPaddlePosY = this.paddlePosY
				this.table.socket.emit('newPaddlePosition', {roomId: this.table.roomId, paddlePosY : this.table.mapValue(this.paddlePosY, this.table.tableHeight, this.table.serverTableHeight)});
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
