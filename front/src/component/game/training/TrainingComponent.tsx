import React from 'react';
import { TrainingPongBoard } from './TrainingPongBoard'
import { TrainingRoundsBoard } from './TrainingRoundsBoard';
import { TrainingProvider, useTrainingContext } from './TrainingContext';
import { useParams } from 'react-router-dom';
import '../Game.css';
import { EndGame } from './EndGame';

export const TrainingComponent = () => {
  const routeProp = useParams();
  const { gameEnded } = useTrainingContext();
  return (
      <div className="Game">
		{ gameEnded === false ? (
			<>
				<TrainingRoundsBoard gameId={routeProp.id}/>
				<TrainingPongBoard gameId={routeProp.id}/>
			</>
			) : (
			<EndGame />)
		}
      </div>
  );
}

