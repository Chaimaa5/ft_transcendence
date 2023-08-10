import React from 'react';
import RoundsBoard from './RoundsBoard'
import TrainingPongBoard from './TrainingPongBoard'

import './App.css';

const TrainingGame = () => {
  return (
    <div className="App">
		<RoundsBoard/>
		<TrainingPongBoard/>
    </div>
  );
}

export default TrainingGame;