import React, { useEffect, useState } from 'react';
import { TwoPlayersRoundsBoard } from './RoundsBoard'
import { useParams } from 'react-router-dom';
import './App.css';
import { socket } from './socket';
import {PongBoard} from './PongBoard';
import Waiting from './waiting';
import {EndGame} from './training/EndGame'


const GameComponent = () => {
	const routeProp = useParams();
	const [gamePending, setGamePending] = useState(true);
	const [gameEnded, setGameEnded] = useState(false);

	useEffect(() => {
		socket.connect();

		socket.on('connect', () => {
			console.log('client side : client connected to the server');
			socket.emit('joinRoom', ("room_" + routeProp.gameId));
		});
		socket.on('launchGame', () => { 
			setGamePending(true)
		});
	})

  return (
  	<div className="App">
		{(gamePending === true) ? (
			<Waiting />
		) : (gameEnded === false) ? (
			<>
				<TwoPlayersRoundsBoard gameMode={routeProp.mode} gameId={routeProp.id}/>
				<PongBoard gameId={routeProp.id}/>
			</>
		) :
			<EndGame />
		}
	</div>
  );
}

export default GameComponent;