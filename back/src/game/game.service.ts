import { Injectable, Res, UnauthorizedException } from '@nestjs/common';
import { Game, PrismaClient, User } from '@prisma/client';
import { Response } from 'express';
import { NOTFOUND } from 'dns';
import { use } from 'passport';
import { BallState, PaddleSide, PaddleState, RoomState } from './gameState.interface';
import { EventEmitter } from 'events' 
import { NotificationService } from 'src/user/Notifications/notification.service';

export class Player {
	id : string;
	username : string;
	status : 'waiting' | 'matched';
}


const paddleSizeMap: { [key: number]: string } = {
	1: "small",
	2: "medium",
	3: "large"
};

export const VIRTUAL_TABLE_WIDTH = 1000;
export const VIRTUAL_TABLE_HEIGHT = 500;
const VIRTUAL_SPEED_RATIO = 100;
const VIRTUAL_PADDLE_WIDTH = VIRTUAL_TABLE_WIDTH*0.02;
const VIRTUAL_PADDLE_HEIGHT = VIRTUAL_TABLE_HEIGHT/3;

@Injectable()
export class GameService {
	
    prisma = new PrismaClient();
	roomIdCounter = 1;
	notification = new NotificationService
	
    constructor(){}

	private readonly rooms : Map<RoomState['roomId'], RoomState> = new Map<RoomState['roomId'], RoomState> ();
	private events = new EventEmitter();

	get roomsMap() {
		return(this.rooms);
	}

	// game logic implementation 

	randomInitialDirection = () : number => {
		const minValue = -Math.PI/4;
		const maxValue = Math.PI/4;

		// generate a random number between 0 and 1
		const randomZeroToOne = Math.random();
		// scale and shift the random number to fit the desired rane
		const randomValueInRange = randomZeroToOne * (maxValue - minValue) + minValue;

		return(randomValueInRange);
	}

	startGameLoop(roomId : string) {
		const room = this.rooms.get(roomId);
		if(room) {
			setInterval(() => {
				this.moveBall(room.ball);
				this.checkEdges(room);
				this.checkPaddleHits(room.ball, room.players[0], room.thisRound.roundNumber, room.speedIncrement);
				this.checkPaddleHits(room.ball, room.players[1], room.thisRound.roundNumber, room.speedIncrement);
			}, 1000/60)
		}
	}
	
	moveBall(ball : BallState) {
		ball.x = ball.x + ball.ballSpeedX;
		ball.y = ball.y + ball.ballSpeedY;
		this.events.emit('handleUpdateBallPosition', {x : ball.x , y : ball.y});
	}

	nextRound(room : RoomState) {
		room.thisRound.roundNumber++;
		room.thisRound.leftPlayerScore = 0;
		room.thisRound.rightPlayerScore = 0;
		room.paddleHeight = VIRTUAL_TABLE_HEIGHT/(3 + (room.thisRound.roundNumber * room.paddleHeightDecrement));
	}

	updateScore(room : RoomState, side : PaddleSide) {
		if(side === PaddleSide.Left) {
			room.thisRound.leftPlayerScore++;
			if(room.thisRound.leftPlayerScore === room.pointsToWin) {
				this.nextRound(room);
				room.players[0].roundScore++;
				if(room.thisRound.roundNumber === room.rounds) {
					this.events.emit('endGame');
				}
			}
		}
		else {
			room.thisRound.rightPlayerScore++;
			if(room.thisRound.rightPlayerScore === room.pointsToWin) {
				this.nextRound(room);
				room.players[1].roundScore++;
				if(room.thisRound.roundNumber === room.rounds) {
					this.events.emit('handleEndGame');
				}
			}
		}
		this.events.emit('handleUpdateScore', room);
	}

	checkEdges(room : RoomState) {
		const radius = (VIRTUAL_TABLE_WIDTH*0.02)/2;
		const angle = this.randomInitialDirection();
		if((room.ball.y - radius) <= 0 || (room.ball.y + radius) >= VIRTUAL_TABLE_HEIGHT)
		{
			room.ball.ballSpeedY *= -1;
		}
		if((room.ball.x + radius) >= VIRTUAL_TABLE_WIDTH)
		{
			room.ball.x = VIRTUAL_TABLE_WIDTH/2;
			room.ball.y = VIRTUAL_TABLE_HEIGHT/2;
			room.ball.ballSpeedX = VIRTUAL_TABLE_WIDTH/(VIRTUAL_SPEED_RATIO + (room.thisRound.roundNumber * room.speedIncrement)) *  Math.cos(angle);
			room.ball.ballSpeedY = VIRTUAL_TABLE_WIDTH/(VIRTUAL_SPEED_RATIO + (room.thisRound.roundNumber * room.speedIncrement)) *  Math.sin(angle);
			this.updateScore(room, PaddleSide.Left);
			this.events.emit('handleUpdateScore', PaddleSide.Left);
		}
		if((room.ball.x - radius) <= 0)
		{
			room.ball.x = VIRTUAL_TABLE_WIDTH/2;
			room.ball.y = VIRTUAL_TABLE_HEIGHT/2;
			room.ball.ballSpeedX = VIRTUAL_TABLE_WIDTH/(VIRTUAL_SPEED_RATIO + (room.thisRound.roundNumber * room.speedIncrement)) *  Math.cos(angle);
			room.ball.ballSpeedY = VIRTUAL_TABLE_WIDTH/(VIRTUAL_SPEED_RATIO + (room.thisRound.roundNumber * room.speedIncrement)) *  Math.sin(angle);
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

	checkPaddleHits(ball : BallState, player : PaddleState, roundNumber : number, speedIncrement : number) {
		const radius = ((VIRTUAL_TABLE_WIDTH*0.02) + 5)/2;
		if((ball.y + radius) > player.y
		&& (ball.y - radius )< (player.y + VIRTUAL_PADDLE_HEIGHT)) {
		let angle;
		if(player.side === PaddleSide.Right && (ball.x + radius) > player.x)
		{
			if(ball.x < player.x) {
				const diff = ball.y - player.y;
				angle = this.mapRange(diff, 0, VIRTUAL_PADDLE_HEIGHT, this.radians(225), this.radians(135));
				ball.ballSpeedX = VIRTUAL_TABLE_WIDTH/(VIRTUAL_SPEED_RATIO + (roundNumber * speedIncrement)) *  Math.cos(angle);
				ball.ballSpeedY = VIRTUAL_TABLE_WIDTH/(VIRTUAL_SPEED_RATIO + (roundNumber * speedIncrement)) *  Math.sin(angle);
				ball.x = player.x - radius;
			}
		}
		else if(player.side === PaddleSide.Left && (ball.x - radius) < (player.x + VIRTUAL_PADDLE_WIDTH))
		{
			if(ball.x > player.x){
				const diff = ball.y - player.y;
				angle = this.mapRange(diff, 0, VIRTUAL_PADDLE_HEIGHT, -this.radians(45), this.radians(45));
				ball.ballSpeedX = VIRTUAL_TABLE_WIDTH/(VIRTUAL_SPEED_RATIO + (roundNumber * speedIncrement)) *  Math.cos(angle);
				ball.ballSpeedY = VIRTUAL_TABLE_WIDTH/(VIRTUAL_SPEED_RATIO + (roundNumber * speedIncrement)) *  Math.sin(angle);
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

	calculateSpeedIncrement(rounds : number, difficulty : string)  : number{
		const minSpeedRatio : number = 100;
		const maxSpeedRatio : number = 200;
		let speedIncrement : number = 0;
		if(difficulty === 'flashy') {
			speedIncrement = (maxSpeedRatio - minSpeedRatio)/rounds;
		}
		return(speedIncrement);
	}

	calculatePaddleHeightDecrement(rounds : number, difficulty : string) : number {
		const minHeightRatio : number = 3;
		const maxHeightRatio : number = 5;
		let paddleHeightDecrement : number = 0;
		if(difficulty === 'paddleSize') {
			paddleHeightDecrement = (maxHeightRatio - minHeightRatio)/rounds;
		}
		return(paddleHeightDecrement);
	}

	newRoomId() : string {
		const roomId = `room_${this.roomIdCounter}`;
		this.roomIdCounter++;
		return roomId;
	}

	createRoom(gameId : number, rounds : number, pointsToWin : number, difficulty : string) : string {
		const roomId = "room_" + gameId;
		const speedIncrement = this.calculateSpeedIncrement(rounds, difficulty);
		const paddleHeightDecrement = this.calculatePaddleHeightDecrement(rounds, difficulty);
		this.rooms.set(
			roomId,
			{
				roomId : roomId,
				playersNumber : 0,
				ball : {x : VIRTUAL_TABLE_WIDTH/2, y : VIRTUAL_PADDLE_HEIGHT/2, ballSpeedX: VIRTUAL_TABLE_WIDTH/VIRTUAL_SPEED_RATIO, ballSpeedY: VIRTUAL_TABLE_WIDTH/VIRTUAL_SPEED_RATIO },
				speedIncrement : speedIncrement,
				paddleHeightDecrement : paddleHeightDecrement,
				paddleHeight : VIRTUAL_TABLE_HEIGHT/3,
				players : [],
				thisRound : {
					roundNumber : 0,
					leftPlayerScore : 0,
					rightPlayerScore : 0,
				},
				rounds : rounds, 
				pointsToWin : pointsToWin,
			}
		)
		return(roomId);
	}

	addPlayer(roomId : string, playerId : string, username : string) {
		const room = this.rooms.get(roomId);
		if(room){
			const side = (room.playersNumber == 0) ? PaddleSide.Left : PaddleSide.Right;
			const x = (side === PaddleSide.Left) ? VIRTUAL_TABLE_WIDTH/100 : VIRTUAL_TABLE_WIDTH - VIRTUAL_PADDLE_WIDTH - VIRTUAL_TABLE_WIDTH/100;
			const y = VIRTUAL_TABLE_HEIGHT/2 - (VIRTUAL_PADDLE_HEIGHT/2);
				room.players.push({playerId : playerId, username : username, side: side, roundScore: 0, x : x, y : y});
				room.playersNumber++;
			return(side);
		}
	}

	get eventsEmitter() {
		return(this.events)
	}

	// game endpoints methods
	private players : Player[] = [];

	updateStatus(playerId : string, status : 'waiting' | 'matched') {
		const player = this.players.find(p => p.id === playerId);
		if(player) {
			player.status = status;
		}
	}

	createPlayer(player : Player) {
		this.players.push(player);
	}

	getMatchedPlayers() {
		const waitingPlayers = this.players.filter(player => player.status === 'waiting');
		if(waitingPlayers.length >= 2) {
			const matchedPlayers = waitingPlayers.splice(0,2);
			matchedPlayers.forEach(player => {
				this.updateStatus(player.id, 'matched')
			})
			return(matchedPlayers)
		}
	}

	async joinGame(user: User, body: any) {
		const gameId = parseInt(body.id);
		const game = await this.prisma.game.findUnique({where : {id: gameId}, select : {
			status : true,
		}})
		if(game?.status == 'pending') {
			await this.prisma.game.update({where :  {id : gameId}, data : {
				playerId2 : user.id,
				status : 'created'
			}})
		}
		else {
			throw('game already created');
		}
	}

	async createGame(matchedPlayers : Player[]) {
		const game = await this.prisma.game.create({data : {
			mode : 'multiplayer',
			playerId1 : matchedPlayers[0].id,
			playerId2 : matchedPlayers[0].id,
			rounds : 3,
			pointsToWin : 5,
			status : 'created'
		}})
		if(game.rounds && game.pointsToWin) {
			this.createRoom(game.id, game.rounds, game.pointsToWin, 'multiplayer');
		}
		return(game.id)
	}

    async postChallengeGame(user: User, body: any) {
		let game : Game;
		game = await this.prisma.game.create({data : {
			mode : 'challenge',
			playerId1 : user.id,
			rounds : body.rounds,
			pointsToWin : body.pointsToWin,
			difficulty : body.difficulty,
			status: 'pending'
		}})
		if(body.Player)
		{
			const player = await this.prisma.user.findUnique({where : {username : body.Player}})
			if(player) {
				this.notification.addGameInvite(user.id, player.id, game.id)
			}
		}
		if(game.rounds && game.pointsToWin && game.difficulty) {
			this.createRoom(game.id, game.rounds, game.pointsToWin, game.difficulty);
		}
		return game.id
    }

    async getChallengeGame(id : number) {
        const game = await this.prisma.game.findUnique({where : {id : id},
            select:{
                player1: {
                    select: {
						id : true,
                        username: true,
                    }
                }, 
                player2: {
                    select: {
						id : true,
                        username: true,
                    }
                },
                difficulty : true,
            }
        })
        return(game);
    }


	async postTrainingSettings(user : User, body : any) {
		const paddleSize : string = paddleSizeMap[body.paddleSize];
		const game = await this.prisma.game.create({ data : {
			mode : 'training',
			player1 : {connect: {id: user.id}},
			lossLimit : body.lossLimit,
			paddleSize : paddleSize,
			ballSpeed : body.ballSpeed,
			status : 'playing',
		}
		})
		return game.id
	}

	async getTrainingSettings(id : number) {
		const game = await this.prisma.game.findUnique({where : {id : id},
			select : {
				player1 : {
					select : {
						username: true,
					}
				},
				paddleSize : true,
				ballSpeed : true,
			}
		})
		return(game)
	}

	async getTrainingGame(id : number) {
		const game = await this.prisma.game.findUnique({where : {id : id},
			select : {
				lossLimit : true,
			}
		})
		return(game);
	}

	async getTwoPlayersGame(id : number) {
		const game = await this.prisma.game.findUnique({where : {id : id},
			select : {
				rounds : true, 
				pointsToWin  : true,
			}
		})
		return(game);
	}
}