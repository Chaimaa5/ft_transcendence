import React, { useEffect } from 'react';
import { TrainingRoundsBoard, TwoPlayersRoundsBoard } from './RoundsBoard'
import { useParams } from 'react-router-dom';
import './App.css';
import { socket } from './socket';
import ChallengePongBoard from './ChallengePongBoard';




const GameComponent = () => {
	const routeProp = useParams();

	useEffect(() => {
		socket.connect();
	})

  return (
  	<div className="App">
		{routeProp.mode === 'training' ? <TrainingRoundsBoard gameId={routeProp.id}/> :
			<TwoPlayersRoundsBoard gameMode={routeProp.mode} gameId={routeProp.id}/>
		}
		{routeProp.mode === 'challenge' ? <ChallengePongBoard gameId={routeProp.id}/> :
			routeProp.mode === 'multiplayer' ? <MultiplayerPongBoard gameId={routeProp.id}/> :
			<TrainingPongboard gameId={routeProp.id}/>
		}
	</div>
  );
}

export default GameComponent;
