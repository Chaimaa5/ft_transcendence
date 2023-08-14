import React from 'react';
import {TrainingRoundsBoard} from '../RoundsBoard'
import TrainingPongBoard from './TrainingPongBoard'
import { TrainingProvider } from './TrainingContext';

import './App.css';

const TrainingComponent = () => {
  return (
    <TrainingProvider>
      <div className="App">
      <TrainingRoundsBoard/>
      <TrainingPongBoard/>
      </div>
    </TrainingProvider>
  );
}

export default TrainingComponent;