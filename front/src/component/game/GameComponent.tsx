import React, { useEffect } from 'react';
import {TwoPlayersRoundsBoard } from './RoundsBoard'
import { useParams } from 'react-router-dom';
import './App.css';
import { socket } from './socket';
import {PongBoard} from './PongBoard';


const GameComponent = () => {
	const routeProp = useParams();

	useEffect(() => {
		socket.connect();
	})

  return (
  	<div className="App">
		<TwoPlayersRoundsBoard gameMode={routeProp.mode} gameId={routeProp.id}/>
		<PongBoard gameId={routeProp.id}/>
	</div>
  );
}

export default GameComponent;