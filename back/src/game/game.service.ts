import { Injectable, Res, UnauthorizedException } from '@nestjs/common';
import { PrismaClient, User } from '@prisma/client';
import { Response } from 'express';
import { NOTFOUND } from 'dns';
import { use } from 'passport';
import { BallState, PaddleSide, PaddleState, RoomState } from './gameState.interface';
import { EventEmitter } from 'events' 

export const VIRTUAL_TABLE_WIDTH = 1000;
export const VIRTUAL_TABLE_HEIGHT = 500;
const VIRTUAL_SPEED_RATIO = 200;
const VIRTUAL_PADDLE_WIDTH = VIRTUAL_TABLE_WIDTH*0.02;
const VIRTUAL_PADDLE_HEIGHT = VIRTUAL_TABLE_HEIGHT*0.3;

@Injectable()
export class GameService {
    
    prisma = new PrismaClient();
	roomIdCounter = 1;
	
    constructor(){}

	private readonly rooms : Map<RoomState['roomId'], RoomState> = new Map<RoomState['roomId'], RoomState> ();
	private events = new EventEmitter();

	get roomsMap() {
		return(this.rooms);
	}

	
	startGameLoop(roomId : string) {
		const room = this.rooms.get(roomId);
		if(room) {
			setInterval(() => {
				this.moveBall(room.ball);
				this.checkEdges(room.ball);
				this.checkPaddleHits(room.ball, room.players[0]);
				this.checkPaddleHits(room.ball, room.players[1]);
			}, 1000/60)
		}
	}
	
	moveBall(ball : BallState) {
		ball.x = ball.x + ball.ballSpeedX;
		ball.y = ball.y + ball.ballSpeedY;
		this.events.emit('handleUpdateBallPosition', {x : ball.x , y : ball.y});
	}

	checkEdges(ball : BallState) {
		const radius = (VIRTUAL_TABLE_WIDTH*0.02)/2;
		if((ball.y - radius) <= 0 || (ball.y + radius) >= VIRTUAL_TABLE_HEIGHT)
		{
			ball.ballSpeedY *= -1;
		}
		if((ball.x + radius) >= VIRTUAL_TABLE_WIDTH)
		{
			ball.x = VIRTUAL_TABLE_WIDTH/2;
			ball.y = VIRTUAL_TABLE_HEIGHT/2;
			this.events.emit('handleUpdateScore', PaddleSide.Left);
		}
		if((ball.x - radius) <= 0)
		{
			ball.x = VIRTUAL_TABLE_WIDTH/2;
			ball.y = VIRTUAL_TABLE_HEIGHT/2;
			this.events.emit('handleUpdateScore', PaddleSide.Right);
		}
	}

	mapRange(n : number, start1 : number, stop1 : number, start2 : number, stop2 : number) : number{
		const newval = (n - start1) / (stop1 - start1) * (stop2 - start2) + start2;
		return(newval);
	}

	radians(angle: number) : number {
		return(angle * (Math.PI/180));
	}

	checkPaddleHits(ball : BallState, player : PaddleState) {
		const radius = ((VIRTUAL_TABLE_WIDTH*0.02) + 5)/2;
		if((ball.y + radius) > player.y
		&& (ball.y - radius )< (player.y + VIRTUAL_PADDLE_HEIGHT)) {
		let angle;
		if(player.side === PaddleSide.Right && (ball.x + radius) > player.x)
		{
			if(ball.x < player.x) {
				const diff = ball.y - player.y;
				angle = this.mapRange(diff, 0, VIRTUAL_PADDLE_HEIGHT, this.radians(225), this.radians(135));
				ball.ballSpeedX = VIRTUAL_TABLE_WIDTH/VIRTUAL_SPEED_RATIO *  Math.cos(angle);
				ball.ballSpeedY = VIRTUAL_TABLE_WIDTH/VIRTUAL_SPEED_RATIO *  Math.sin(angle);
				ball.x = player.x - radius;
			}
		}
		else if(player.side === PaddleSide.Left && (ball.x - radius) < (player.x + VIRTUAL_PADDLE_WIDTH))
		{
			if(ball.x > player.x){
				const diff = ball.y - player.y;
				angle = this.mapRange(diff, 0, VIRTUAL_PADDLE_HEIGHT, -this.radians(45), this.radians(45));
				ball.ballSpeedX = VIRTUAL_TABLE_WIDTH/VIRTUAL_SPEED_RATIO *  Math.cos(angle);
				ball.ballSpeedY = VIRTUAL_TABLE_WIDTH/VIRTUAL_SPEED_RATIO *  Math.sin(angle);
				ball.x = player.x + VIRTUAL_PADDLE_WIDTH + radius;
			}
		}
	}
	}


	updatePaddlePosition(roomId : string, playerId : string, paddlePosY : number) {
		const room = this.rooms.get(roomId);
		if(room) {
			const player = room.players.find(p => p.playerId === playerId);
			if(player) {
				player.y = paddlePosY;
			}
		}
	}

	newRoomId() : string {
		const roomId = `room_${this.roomIdCounter}`;
		this.roomIdCounter++;
		return roomId;
	}

	createRoom(playerId : string) : string {
		const roomId = this.newRoomId();
		this.rooms.set(
			roomId,
			{
				roomId : roomId,
				playersNumber : 0,
				ball : {x : VIRTUAL_TABLE_WIDTH/2, y : VIRTUAL_PADDLE_HEIGHT/2, ballSpeedX: VIRTUAL_TABLE_WIDTH/VIRTUAL_SPEED_RATIO, ballSpeedY: VIRTUAL_TABLE_WIDTH/VIRTUAL_SPEED_RATIO },
				ballspeedRatio : VIRTUAL_SPEED_RATIO,
				players : [],
			}
		)
		this.addPlayer(roomId, playerId, PaddleSide.Left);
		return(roomId);
	}

	addPlayer(roomId : string, playerId : string, side : PaddleSide) {
		const x = (side === PaddleSide.Left) ? VIRTUAL_TABLE_WIDTH/100 : VIRTUAL_TABLE_WIDTH - VIRTUAL_PADDLE_WIDTH - VIRTUAL_TABLE_WIDTH/100;
		const y = VIRTUAL_TABLE_HEIGHT/2 - (VIRTUAL_PADDLE_HEIGHT/2);
		const room = this.rooms.get(roomId);
		if(room){ 
			room.players.push({playerId : playerId, side: side, x : x, y : y});
			room.playersNumber++;
		}
	}

	get eventsEmitter() {
		return(this.events)
	}

    async postChallengeSettings(user: User, body: any) {
        const game = await this.prisma.game.create({data : {
            mode : 'OneVsOne',
            playerId1 : user.id,
            rounds : body.rounds,
            pointsToWin : body.pointsToWin,
            difficulty : body.difficulty,
            status: 'pending'
        }})
        return game.id
    }

    async getChallengeSettings(id : number) {
        const game = await this.prisma.game.findUnique({where : {id : id},
            select:{
                player1: {
                    select: {
                        username: true,
                    }
                }, 
                player2: {
                    select: {
                        username: true,
                    }
                },
                rounds : true,
                pointsToWin : true,
                difficulty : true,
            }
        })
        return(game);
    } 
}