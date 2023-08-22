import React, { useEffect, useRef, useState } from 'react';
import { TwoPlayersRoundsBoard } from './RoundsBoard'
import { useParams } from 'react-router-dom';
import './Game.css';
import {MultiPongBoard} from './MultiPongBoard';
import Waiting from './waiting';
import {EndGame} from './training/EndGame'
import Instanse from '../api/api';
import  {io, Socket }from 'socket.io-client';
import { useGameContext } from './GameContext';
import { Game } from './classes/Game';
import { PaddleSide } from './classes/Paddle';
import { GameCorrupted } from './GameCorrupted';
import Matched from './Matched';
import { AlreadyJoined } from './AlreadyJoined';
import GameOver from './GameOver';
import { GameResults } from './GameComponent';


export const MultiComponent = (username) => {
	const mode = useParams().mode;
	const [gamePending, setGamePending] = useState(true);
	const [gameEnded, setGameEnded] = useState(false);
	const [gameCorrupted, setGameCorrupted] = useState(false);
	const [playersMatched, setPlayersMatched] = useState(false);
	const [alreadyJoined, setAlreadyJoined] = useState(false);
	const [dataIsLoaded, setDataIsLoaded] = useState(false)
	const [gameId, setGameId] = useState();
	const [player2, setPlayer2] = useState();
	const [renderBoard, setRenderBoard] = useState(false);
	const {socket} = useGameContext();
	const [gameResult, setGameResult] = useState<GameResults>();
	const [side, setSide] = useState<PaddleSide>();
	
	const gameRef = useRef(new Game(0, 0));
	
	useEffect(() => {
		if(socket) {
			socket.emit('joinQueue');
	
			socket.on('match', (payload) => {
				console.log("my side on match event : " + payload.side);
				gameRef.current.myPaddle.side = payload.side;
				gameRef.current.opponentPaddle.side = (payload.side === PaddleSide.Left) ? PaddleSide.Right : PaddleSide.Left;
				setSide (payload.side);
				setPlayer2(payload.username);
				setGameId(payload.gameId);
				setGamePending(false);
				setPlayersMatched(true);
				
			})
			
			const handleDisconnect = () => {
				console.log(`socket disconnected`);
				socket.disconnect();
			};
			
			socket.on('disconnect', handleDisconnect);
			
			return () => {
				if(gameEnded === false) {
					if(playersMatched === true) {
						console.log("leaving room");
						socket.emit('leaveRoom');
					}
					else {
						socket.emit('leaveRoom');
					}
				}
				socket.disconnect();
			};
		}
	}, []);
	
	useEffect(() => {
		if(socket) {
			if(gameId) {
				socket.emit('joinRoom', { roomId: "room_" + gameId, mode : "multi", side : side});
			}
			
			socket.on('joinedRoom', (payload) => {
				console.log(" the client has joined the room : " + payload.roomId);
				gameRef.current.table.roomId = payload.roomId;
				gameRef.current.table.serverTableWidth = payload.serverTableWidth;
				gameRef.current.table.serverTableHeight = payload.serverTableHeight;
				gameRef.current.myPaddle.username = payload.username;
			})

			socket.on('startGame', async (payload) => {
				if(payload.roomId === ("room_" + gameId) ) {
					const myPaddleObj = (side === PaddleSide.Left) ? payload.leftPlayerObj : payload.rightPlayerObj;
					const opponentPaddleObj = (side === PaddleSide.Left) ? payload.rightPlayerObj : payload.leftPlayerObj;
					// paddle Position 
					gameRef.current.myPaddle.paddlePosX = myPaddleObj.x;
					gameRef.current.myPaddle.paddlePosY = myPaddleObj.y;
					gameRef.current.opponentPaddle.paddlePosX = opponentPaddleObj.x;
					gameRef.current.opponentPaddle.paddlePosY = opponentPaddleObj.y;
					// ball position and speed and initial angle
					gameRef.current.ball.ballPosX = payload.ballPosX;
					gameRef.current.ball.ballPosY = payload.ballPosY;
					gameRef.current.ball.speedX = payload.ballSpeedX;
					gameRef.current.ball.speedY = payload.ballSpeedY;
					gameRef.current.ball.randomInitialBallDirection = payload.initialBallAngle;
					gameRef.current.ball.speedRatio = payload.speedRatio;
					// paddle height 
					gameRef.current.myPaddle.paddleHeight = payload.paddleHeight;
					gameRef.current.opponentPaddle.paddleHeight = payload.paddleHeight;
					Instanse.get('/game/challenge-game/' + gameId).
					then(response => {
						gameRef.current.rightPlayer = {userName: "" , roundScore : 0};
						gameRef.current.leftPlayer = {userName: "" , roundScore : 0};
						gameRef.current.rightPlayer.userName = response.data.player2.username;
						gameRef.current.leftPlayer.userName = response.data.player1.username;
						setDataIsLoaded(true);
					})
				}
			})

			
			socket.on('alreadyJoined', () => {
				setAlreadyJoined(true);
			});
			
			socket.on('launchGame', (payload) => {
				if(payload.gameId = gameId) {
					setGamePending(false);	
				}
			});
			
			socket.on('endGame', (payload) => {
				if(payload.roomId === ("room_" + gameId) ) {
					gameRef.current.endGame();
					console.log("game result  : ", payload.gameResult)
					setGameResult(payload.gameResult);
					setGameEnded(true);
				}
			})
			
			socket.on('gameCorrupted', (payload) => {
				console.log("corrupted");
				if(payload.roomId === ("room_" + gameId)){
					setGameCorrupted(true);
				}
			})
		}
	}, [gameId]);

	const handleMatchedUnmount = () => {
		setPlayersMatched(false);
	};

  return (
  	<div className="Game">
		{(gamePending === true) ? (
			<Waiting username={username} mode={"multi"} />
		) :(playersMatched === true ) ? (
			<Matched username={username} player2={player2} onUnmount={handleMatchedUnmount}/>
		) : (gameEnded === true) ? (
			<GameOver username={username} side={gameRef.current.myPaddle.side} results={gameResult}/> 
		) : (gameCorrupted === true) ? (
			<GameCorrupted />
		) : (alreadyJoined === true) ? (
			<AlreadyJoined/>
		) : (dataIsLoaded === true  &&
			 <>
				<TwoPlayersRoundsBoard  gameMode={mode} gameIdProp={gameId}/>
				<MultiPongBoard gameProp={gameRef.current} gameIdProp={gameId} side={side}/>
			</>
		)
		}
	</div>
  );
}