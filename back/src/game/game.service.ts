import { Injectable, Res, UnauthorizedException } from '@nestjs/common';
import { Game, PrismaClient, User } from '@prisma/client';
import { Response } from 'express';
import { NOTFOUND } from 'dns';
import { use } from 'passport';
import { BallState, PaddleSide, PaddleState, RoomState } from './gameState.interface';
import { EventEmitter } from 'events' 
import { NotificationService } from 'src/user/Notifications/notification.service';
import { UserService } from 'src/user/user.service';
import { Socket } from 'socket.io'

export class Player {
	id : string;
	username : string;
	status : 'waiting' | 'matched';
	socket : Socket;
}


const paddleSizeMap: { [key: number]: string } = {
	1: "small",
	2: "medium",
	3: "large"
};

export const VIRTUAL_TABLE_WIDTH = 1000;
export const VIRTUAL_TABLE_HEIGHT = 500;
const VIRTUAL_SPEED_RATIO = 150;
const VIRTUAL_PADDLE_WIDTH = VIRTUAL_TABLE_WIDTH*0.02;
const VIRTUAL_PADDLE_HEIGHT = VIRTUAL_TABLE_HEIGHT/3;

@Injectable()
export class GameService {
	
    prisma = new PrismaClient();
	roomIdCounter = 1;
	notification = new NotificationService
	user = new UserService
	
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

		const randomZeroToOne = Math.random();


		const randomValueInRange = randomZeroToOne * (maxValue - minValue) + minValue;

		return(randomValueInRange);
	}

	randomSign = () : number => {
		// Generate a random number between 0 and 1
		const randomValue = Math.random();

		// Map the random value to 1 or -1
		const randomSign = randomValue < 0.5 ? 1 : -1;

		return(randomSign);
	}

	startGameLoop(roomId : string) {
		const room = this.rooms.get(roomId);
		if(room) {
			const intervalId = setInterval(async () => {
				this.moveBall(room.ball, roomId, (room.thisRound.roundNumber*room.speedIncrement));
				await this.checkEdges(room);
				if(room.isGameEnded === true) {
					clearInterval(intervalId);
					return;
				}

				this.checkPaddleHits(room.ball, room.players[0], room.thisRound.roundNumber, room.speedIncrement, room.paddleHeightDecrement);
				this.checkPaddleHits(room.ball, room.players[1], room.thisRound.roundNumber, room.speedIncrement, room.paddleHeightDecrement);
			}, 1000/60)
		}
	}
	// (room.thisRound.roundNumber * room.speedIncrement)
	moveBall(ball : BallState, roomId : string, speedRatio : number) {
		ball.x = ball.x + ball.ballSpeedX;
		ball.y = ball.y + ball.ballSpeedY;
		this.events.emit('handleUpdateBallPosition', {roomId : roomId, x : ball.x , y : ball.y, speedRatio : speedRatio});
	}

	nextRound(room : RoomState) {
		room.thisRound.roundNumber++;
		room.thisRound.leftPlayerScore = 0;
		room.thisRound.rightPlayerScore = 0;
		room.paddleHeight = VIRTUAL_TABLE_HEIGHT/(3 + ((room.thisRound.roundNumber+1) * room.paddleHeightDecrement));
	}

	async updateScore(room : RoomState, side : PaddleSide) {
		if(side === PaddleSide.Left) {
			room.thisRound.leftPlayerScore++;
			if(room.thisRound.leftPlayerScore === room.pointsToWin) {
				this.nextRound(room);
				room.players[0].roundScore++;
				if(room.thisRound.roundNumber === room.rounds) {
					room.isGameEnded = true;
					await this.postGameResult(room).then((res) => {
						const gameResult : GameResults = res;
						this.events.emit('handleEndGame', {roomId : room.roomId, gameResults : gameResult});
					});
				}
			}
		}
		else {
			room.thisRound.rightPlayerScore++;
			if(room.thisRound.rightPlayerScore === room.pointsToWin) {
				this.nextRound(room);
				room.players[1].roundScore++;
				if(room.thisRound.roundNumber === room.rounds) {
					room.isGameEnded = true;
					await this.postGameResult(room).then((res) => {
						const gameResult : GameResults = res;
						this.events.emit('handleEndGame', {roomId : room.roomId, gameResults : gameResult});
					});
				}
			}
		}
		this.events.emit('handleUpdateScore', room);
	}

	async checkEdges(room : RoomState) {
		const radius = (VIRTUAL_TABLE_WIDTH*0.02)/2;
		const angle = this.randomInitialDirection();
		const randomSign = this.randomSign();
		if((room.ball.y - radius) <= 0 || (room.ball.y + radius) >= VIRTUAL_TABLE_HEIGHT)
		{
			room.ball.ballSpeedY *= -1;
		}
		if((room.ball.x + radius) >= VIRTUAL_TABLE_WIDTH)
		{
			room.ball.x = VIRTUAL_TABLE_WIDTH/2;
			room.ball.y = VIRTUAL_TABLE_HEIGHT/2;
			room.ball.ballSpeedX = randomSign * (VIRTUAL_TABLE_WIDTH/(VIRTUAL_SPEED_RATIO - (room.thisRound.roundNumber * room.speedIncrement)) *  Math.cos(angle));
			room.ball.ballSpeedY = VIRTUAL_TABLE_WIDTH/(VIRTUAL_SPEED_RATIO - (room.thisRound.roundNumber * room.speedIncrement)) *  Math.sin(angle);
			await this.updateScore(room, PaddleSide.Left);
			this.events.emit('handleUpdateScore', room);
		}
		if((room.ball.x - radius) <= 0)
		{
			room.ball.x = VIRTUAL_TABLE_WIDTH/2;
			room.ball.y = VIRTUAL_TABLE_HEIGHT/2;
			room.ball.ballSpeedX = randomSign * (VIRTUAL_TABLE_WIDTH/(VIRTUAL_SPEED_RATIO - (room.thisRound.roundNumber * room.speedIncrement)) *  Math.cos(angle));
			room.ball.ballSpeedY = VIRTUAL_TABLE_WIDTH/(VIRTUAL_SPEED_RATIO - (room.thisRound.roundNumber * room.speedIncrement)) *  Math.sin(angle);
			await this.updateScore(room, PaddleSide.Right);
			this.events.emit('handleUpdateScore',room);
		}
	}

	mapRange(n : number, start1 : number, stop1 : number, start2 : number, stop2 : number) : number{
		const newval = (n - start1) / (stop1 - start1) * (stop2 - start2) + start2;
		return(newval);
	}

	radians(angle: number) : number {
		return(angle * (Math.PI/180));
	}

	checkPaddleHits(ball : BallState, player : PaddleState, roundNumber : number, speedIncrement : number, paddleHeightDecrement : number) {
		const radius = ((VIRTUAL_TABLE_WIDTH*0.02) + 5)/2;
		const paddleHeight =  VIRTUAL_TABLE_HEIGHT/(3 + ((roundNumber+1) * paddleHeightDecrement));
		if((ball.y + radius) > player.y
		&& (ball.y - radius )< (player.y + paddleHeight)) {
		let angle;
		if(player.side === PaddleSide.Right && (ball.x + radius) > player.x)
		{
			if(ball.x < player.x) {
				const diff = ball.y - player.y;
				angle = this.mapRange(diff, 0, paddleHeight, this.radians(225), this.radians(135));
				ball.ballSpeedX = VIRTUAL_TABLE_WIDTH/(VIRTUAL_SPEED_RATIO - (roundNumber * speedIncrement)) *  Math.cos(angle);
				ball.ballSpeedY = VIRTUAL_TABLE_WIDTH/(VIRTUAL_SPEED_RATIO - (roundNumber * speedIncrement)) *  Math.sin(angle);
				ball.x = player.x - radius;
			}
		}
		else if(player.side === PaddleSide.Left && (ball.x - radius) < (player.x + VIRTUAL_PADDLE_WIDTH))
		{
			if(ball.x > player.x){
				const diff = ball.y - player.y;
				angle = this.mapRange(diff, 0, paddleHeight, -this.radians(45), this.radians(45));
				ball.ballSpeedX = VIRTUAL_TABLE_WIDTH/(VIRTUAL_SPEED_RATIO - (roundNumber * speedIncrement)) *  Math.cos(angle);
				ball.ballSpeedY = VIRTUAL_TABLE_WIDTH/(VIRTUAL_SPEED_RATIO - (roundNumber * speedIncrement)) *  Math.sin(angle);
				ball.x = player.x + VIRTUAL_PADDLE_WIDTH + radius;
			}
		}
	}
	}

	updatePaddlePosition(roomId : string, side : PaddleSide, paddlePosY : number) {
		const room = this.rooms.get(roomId);
		if(room) {
			const player = (room.players[0].side === side) ? room.players[0] : room.players[1];
			player.y = paddlePosY;
		}
	}

	calculateSpeedIncrement(rounds : number, difficulty : string)  : number{
		const minSpeedRatio : number = 0;
		const maxSpeedRatio : number = 500;
		let speedIncrement : number = 0;
		if(difficulty === 'flashy') {
			speedIncrement = (maxSpeedRatio - minSpeedRatio)/rounds;
		}
		return(speedIncrement);
	}

	calculatePaddleHeightDecrement(rounds : number, difficulty : string) : number {
		const minHeightRatio : number = 0;
		const maxHeightRatio : number = 8;
		let paddleHeightDecrement : number = 0;
		if(difficulty === 'decreasingPaddle') {
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
		let speedIncrement = 0;
		let paddleHeightDecrement = 0;
		if(difficulty != "multiplayer") {
			speedIncrement = this.calculateSpeedIncrement(rounds*pointsToWin, difficulty);
			paddleHeightDecrement = this.calculatePaddleHeightDecrement(rounds*pointsToWin, difficulty);
		}
		console.log("am here : " + speedIncrement);
		this.rooms.set(
			roomId,
			{
				roomId : roomId,
				isGameEnded : false,
				playersNumber : 0,
				ball : {x : VIRTUAL_TABLE_WIDTH/2, y : VIRTUAL_PADDLE_HEIGHT/2, ballSpeedX: VIRTUAL_TABLE_WIDTH/VIRTUAL_SPEED_RATIO, ballSpeedY: VIRTUAL_TABLE_WIDTH/VIRTUAL_SPEED_RATIO },
				speedIncrement : speedIncrement,
				paddleHeightDecrement : paddleHeightDecrement,
				paddleHeight : VIRTUAL_TABLE_HEIGHT/(3 + paddleHeightDecrement),
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
			let side: PaddleSide;
			side = (room.playersNumber == 0) ? PaddleSide.Left : PaddleSide.Right;
			console.log("player : " + username +  " side : " + side);
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

	async createPlayer(username : string, id : string, client : Socket) {
		const existingPlayers = this.players.filter(player => player.id === id);
		if(existingPlayers.length === 0) {
			const player = new Player()
			player.id = id;
			player.username = username;
			player.socket = client;
			player.status = 'waiting';
			this.players.push(player);
			console.log("player has been created : " + client.id + " username " + username + " id " + id);
			const matchedPlayers = this.getMatchedPlayers();
			if(matchedPlayers && matchedPlayers.length === 2) {
				const gameId = await this.createGame(matchedPlayers);
			}
		}
		else{
			this.eventsEmitter.emit('handleAlreadyJoinedQueue', client);
		}
	}

	getMatchedPlayers() {
		const waitingPlayers = this.players.filter(player => player.status === 'waiting');
		if(waitingPlayers.length >= 2 && (waitingPlayers[0].id != waitingPlayers[1].id)) {
			console.log(" waiting players : - " + waitingPlayers[0].id + " - " + waitingPlayers[1].id);
			const matchedPlayers = waitingPlayers.splice(0,2);
			matchedPlayers.forEach(player => {
				this.updateStatus(player.id, 'matched')
			})
			this.players = this.players.filter(player => player.status === 'waiting');
			console.log("players length : " + this.players.length);
			return(matchedPlayers)
		}
	}

	isInRoom(clientId : string) {
		for (const roomState of this.rooms.values()) {
			const player = roomState.players.find(player => player.playerId === clientId);
			if (player) {
			  return roomState.roomId;
			}
		}
		return undefined;
	}

	removePlayerFromQueue(client : Socket) {
		this.players = this.players.filter(player => player.id != client.data.payload.id);
	}

	async joinCreatedGame(user: User, gameId: string) {
		const id = parseInt(gameId);
		const game = await this.prisma.game.findUnique({where : {id: id}, select : {
			status : true,
		}})
		if(game?.status === 'pending' || game?.status === "waiting for another player") {
			const game = await this.prisma.game.update({where :  {id : id}, data : {
				playerId2 : user.id,
				status : 'created'
			}});
			this.eventsEmitter.emit('startGame', game.id);
		}
		else {
			throw('game already created');
		}
	}

	async createGame(matchedPlayers : Player[]) {
		const game = await this.prisma.game.create({data : {
			mode : 'multiplayer',
			playerId1 : matchedPlayers[0].id,
			playerId2 : matchedPlayers[1].id,
			rounds : 3,
			pointsToWin : 5,
			status : 'created'
		}})
		if(game.rounds && game.pointsToWin) {
			this.createRoom(game.id, game.rounds, game.pointsToWin, 'multiplayer');
			const side1 = this.addPlayer("room_" + game.id, matchedPlayers[0].id, matchedPlayers[0].username);
			const side2 = this.addPlayer("room_"+game.id, matchedPlayers[1].id, matchedPlayers[1].username);
			this.eventsEmitter.emit("handleMatched", {player1 : matchedPlayers[0], player1Side : side1, player2 : matchedPlayers[1], player2Side : side2, gameId : game.id});
		}
		return(game.id)
	}

    async postChallengeGame(user: User, body: any) {
		let game : Game;
		const difficulty = (body.isFlashy === true) ? "flashy" : "decreasingPaddle"
		const gameStatus = (body.isPlayerInvited === true) ? "waiting for another player" : "pending"
		game = await this.prisma.game.create({data : {
			mode : 'challenge',
			playerId1 : user.id,
			rounds : body.rounds,
			pointsToWin : body.pointsToWin,
			difficulty : difficulty,
			status: gameStatus
		}})
		if(game.rounds && game.pointsToWin && game.difficulty) {
			this.createRoom(game.id, game.rounds, game.pointsToWin, game.difficulty);
		}
		console.log(body.isPlayerInvited)

		if(body.isPlayerInvited)
		{
			const player = await this.prisma.user.findUnique({where : {username : body.Player}})
			if(player) {
				await this.notification.addGameInvite(user.id, player.id, game.id)
			}
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

	
	async getPendingGames(id : string) {
		let pendingGames = await this.prisma.game.findMany({
			where : {
				AND: [
					{status : 'pending'},
					{playerId1: {not : id}}
				]
	
			},
			select: {
				id : true,
				player1 : {
					select : {
						avatar : true,
						username : true,
					}
				}
			}
		});

		for(const game of pendingGames){
			if(game.player1.avatar){
				if(!game.player1.avatar.includes('cdn.intra') &&  !game.player1.avatar.includes('google'))
					game.player1.avatar = 'http://' + process.env.HOST + ':' + process.env.BPORT + '/api' + game.player1.avatar 
			}
		}

		return(pendingGames);
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

	async deleteGameById(gameId:string) {
		const id = parseInt(gameId);
		const game = await this.prisma.game.findUnique({where : {id : id}});
		if(game){
			try {
				await this.prisma.game.delete({where : {id : id}})
			}
			catch(error) {
				console.error("deleting game by Id failed + |" +  gameId + "|");
			}
		}
	}

	async updatePlayerXp(playerXp : number, id : string, endGameStatus : string) {
		let addedXp = (endGameStatus === "winner") ? 100 : (playerXp  < 10) ? 0 : -10;
		await this.prisma.user.update({
			where : {id : id}, data : {
				XP : playerXp + addedXp,
			}

		})

	}

	async postGameResult(room : RoomState) {
		const gameId = room.roomId.slice("room_".length);
		const id = parseInt(gameId);
		const draw : boolean = (room.players[0].roundScore === room.players[1].roundScore) ? true : false;
		const players = await this.prisma.game.findUnique({where :  {id : id}, select : {
			player1 :{
				select : {
					id : true,
					username : true,
					XP : true,
				}
			},
			player2 : {
				select : {
					id : true,
					username : true,
					XP : true,
				}
			}
		}})
		let ret : GameResults = {winner : '', draw : true, leftPlayer : {userName:'', roundScore:0}, rightPlayer:{userName:'',roundScore:0}};
		if(players && players.player2) {
			const player1 : PaddleState = (room.players[0].username === players.player1.username) ? room.players[0] : room.players[1];
			const player2 : PaddleState = (room.players[0].username === players.player2.username) ? room.players[0] : room.players[1];
			const leftPlayer = (room.players[0].side === PaddleSide.Left) ? room.players[0] : room.players[1];
			const rightPlayer = (room.players[0].side === PaddleSide.Right) ? room.players[0] : room.players[1];
			if(draw === false) {
				const winner : PaddleState = (room.players[0].roundScore > room.players[1].roundScore) ? room.players[0] : room.players[1];
				const loser : PaddleState = (room.players[0].roundScore > room.players[1].roundScore) ? room.players[1] : room.players[0];
				await this.prisma.game.update({where : {id : id}, data : {
					winner : winner.username,
					playerXp1 : player1.roundScore,
					playerXp2 : player2.roundScore,
				}});
				ret = {
					winner : winner.username,
					draw : false,
					leftPlayer : {
						userName :  leftPlayer.username,
						roundScore : leftPlayer.roundScore
					},
					rightPlayer : {
						userName :  rightPlayer.username,
						roundScore : rightPlayer.roundScore
					}
				}
				await this.updatePlayerXp(players.player1.XP, players.player1.id, (player1.username === winner.username ) ? "winner" : "loser");
				await this.updatePlayerXp(players.player2.XP, players.player2.id, (player2.username === winner.username ) ? "winner" : "loser")
			} else {
				await this.prisma.game.update({where : {id : id}, data : {
					draw : true,
					playerXp1 : player1.roundScore,
					playerXp2 : player2.roundScore,
				}});
				ret = {
					winner : '',
					draw : true,
					leftPlayer : {
						userName :  leftPlayer.username,
						roundScore : leftPlayer.roundScore
					},
					rightPlayer : {
						userName :  rightPlayer.username,
						roundScore : rightPlayer.roundScore
					}
				}
			}
		}	
		return(ret);
	}
}

export interface GameResults{
	winner: string,
	draw : boolean,
	leftPlayer : {
		userName: string,
		roundScore : number,
	}, 
	rightPlayer : {
		userName: string,
		roundScore : number,
	}
}