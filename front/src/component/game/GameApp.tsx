import React from 'react';
import RoundsBoard from './RoundsBoard'
import PongBoard from './PongBoard'

import './App.css';

const Game = () => {
  return (
    <div className="App">
		<RoundsBoard/>
		<PongBoard/>
    </div>
  );
}

export default Game;