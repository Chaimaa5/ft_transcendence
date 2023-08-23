import React, { useEffect, useRef, useState } from 'react';
import { TwoPlayersRoundsBoard } from './RoundsBoard'
import { useParams } from 'react-router-dom';
import './Game.css';
import {PongBoard} from './PongBoard';
import Waiting from './waiting';
import {EndGame} from './training/EndGame'
import Instanse from '../api/api';
import  {io, Socket }from 'socket.io-client';
import { useGameContext } from './GameContext';
import { Game, Player } from './classes/Game';
import { PaddleSide } from './classes/Paddle';
import { GameCorrupted } from './GameCorrupted';
import GameOver from './GameOver';
import { RoomNotFound } from './RoomNotFound';


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

export const GameComponent = (username) => {
	const gameId = useParams().id;
	const mode = useParams().mode;
	const [gamePending, setGamePending] = useState(true);
	const [gameEnded, setGameEnded] = useState(false);
	const [gameCorrupted, setGameCorrupted] = useState(false);
	const {socket} = useGameContext();
	const queryParams = new URLSearchParams(location.search);
	const accepted = queryParams.get('accepted');
	const roomId = "room_" + gameId;
	const [gameResult, setGameResult] = useState<GameResults>();
	const [roomNotFound, setRoomNotFound] = useState(false);

	const gameRef = useRef(new Game(0, 0));

	useEffect(() => {
		if(accepted==="true") {
			setGamePending(false);
		}

		if(socket) {
			socket.emit('joinRoom', { roomId: "room_" + gameId , mode : "challenge"});
			
			socket.on("roomNotFound" , (payload) => {
				if(payload.roomId === ("room_" + gameId) ) {
					setRoomNotFound(true);
					setGamePending(false);
				}
			})

			socket.on('joinedRoom', (payload) =>{
				gameRef.current.table.roomId = payload.roomId;
				gameRef.current.myPaddle.side = payload.pSide;
				gameRef.current.opponentPaddle.side = (payload.pSide === PaddleSide.Left) ? PaddleSide.Right : PaddleSide.Left;
				gameRef.current.myPaddle.stepsY = payload.serverTableWidth/100;
				gameRef.current.opponentPaddle.stepsY = payload.serverTableWidth/100;
				gameRef.current.table.serverTableWidth = payload.serverTableWidth;
				gameRef.current.table.serverTableHeight = payload.serverTableHeight;
				gameRef.current.myPaddle.username = payload.username;
			})
		
			socket.on('launchGame', (payload) => {
				if(payload.gameId = gameId) {
					setGamePending(false);	
				}
			});
		
			const handleDisconnect = () => {
				socket.emit("removeRoom", {roomId : "room_" + gameId});
				socket.disconnect();
			};
			
			
			socket.on('endGame', (payload) => {
				if(payload.roomId === roomId) {
					gameRef.current.endGame();
					setGameResult(payload.gameResult);
					setGameEnded(true);
				}
			})
			
			socket.on('gameCorrupted', (payload) => {
				if(payload.roomId){
					setGameCorrupted(true);
				}
			})

			const handleBeforeUnload = (event) => {
				socket.off('disconnect', handleDisconnect);
				socket.emit('leaveRoom', { roomId: "room_" + gameId, mode : "challenge"});
				socket.disconnect();
				event.preventDefault();
				// This message is usually ignored by modern browsers but can be helpful for legacy browsers
				event.returnValue = '';
			  };

			socket.on('disconnect', handleDisconnect);
			
			window.addEventListener('beforeunload', handleBeforeUnload);

			return () => {
				window.removeEventListener('beforeunload', handleBeforeUnload);

				socket.off('disconnect', handleDisconnect);
				if(gameEnded == false) {
					socket.emit('leaveRoom', { roomId: "room_" + gameId, mode : "challenge"});
				}
				socket.disconnect();
			};
		}
	}, []);
	
  return (
  	<div className="Game">
		{(gamePending === true) ? (
			<Waiting username={username} mode=""/>
		) : (gameEnded === true && gameResult) ? (
			<GameOver username={username} side={gameRef.current.myPaddle.side} results={gameResult}/> 
		) : (gameCorrupted === true) ? (
			<GameCorrupted />
		) : (roomNotFound === true) ? (
			<RoomNotFound gameId={gameId}/>
		) : (
			<>
				<TwoPlayersRoundsBoard  gameMode={mode} gameIdProp={gameId}/>
				<PongBoard gameProp={gameRef.current} gameIdProp={gameId}/>
			</>
		) 
		}
	</div>
  );
}
