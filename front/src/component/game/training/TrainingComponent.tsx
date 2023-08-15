import React from 'react';
import { TrainingPongBoard } from './TrainingPongBoard'
import { TrainingRoundsBoard } from './TrainingRoundsBoard';
import { TrainingProvider } from './TrainingContext';
import { useParams } from 'react-router-dom';

import '../App.css';

export const TrainingComponent = () => {

  const routeProp = useParams();
  return (
    <TrainingProvider>
      <div className="App">
        <TrainingRoundsBoard gameId={routeProp.id}/>
        <TrainingPongBoard gameId={routeProp.id}/>
      </div>
    </TrainingProvider>
  );
}

