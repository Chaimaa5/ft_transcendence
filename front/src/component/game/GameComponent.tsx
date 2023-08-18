import React, { useEffect, useState } from 'react';
import { TwoPlayersRoundsBoard } from './RoundsBoard'
import { useParams } from 'react-router-dom';
import './App.css';
import {PongBoard} from './PongBoard';
import Waiting from './waiting';
import {EndGame} from './training/EndGame'
import Instanse from '../api/api';
import  {io, Socket }from 'socket.io-client';
import { useGameContext } from './GameContext';


export const GameComponent = () => {
	const gameId = useParams().id;
	const mode = useParams().mode;
	const [gamePending, setGamePending] = useState(true);
	const [gameEnded, setGameEnded] = useState(false);
	const {socket} = useGameContext();
	const queryParams = new URLSearchParams(location.search);
	const accepted = queryParams.get('accepted');

	useEffect(() => {
		if(accepted==="true") {
			console.log("player socket : " + socket.id);
			setGamePending(false);
		}

		if(socket) {
			socket.emit('joinRoom', { roomId: "room_" + gameId });
		
			socket.on('launchGame', (payload) => {
				console.log("launch Game " + payload.gameId);
				if(payload.gameId == gameId){
					console.log("Game started");
					setGamePending(false);
				}
	
			});
		
			const handleDisconnect = () => {
				console.log(`Socket disconnected`);
				socket.emit('leaveRoom', { roomId: "room_" + gameId });
				socket.disconnect();
			};
				
			socket.on('disconnect', handleDisconnect);
	
			return () => {
				socket.off('disconnect', handleDisconnect);
				socket.disconnect();
			};
		}
	}, []);
	
  return (
  	<div className="App">
		{(gamePending === true) ? (
			<Waiting/>
		) : (gameEnded === false) ? (
			<>
				<TwoPlayersRoundsBoard  gameMode={mode} gameId={gameId}/>
				<PongBoard gameId={gameId}/>
			</>
		) :
			<EndGame />
		}
	</div>
  );
}