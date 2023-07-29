import React, { ChangeEvent, useState, useTransition } from 'react'

class Game {
	playedRounds : number;
	requiredRounds: number;

	constructor() {
		this.playedRounds = 2;
		this.requiredRounds = 5;
	}

}

 
const RoundsBoard: React.FC = () => {
	const game = new Game();
	const roundNumbers = Array.from(Array(game.requiredRounds).keys());
	
 
	return (
		<div className="rounds-board">
				<span>ROUND</span>
				<div className="rounds-points">
					{roundNumbers.map((roundNumber) => (
						<div
							key={roundNumber}
							className={`round ${roundNumber < game.playedRounds ? 'full' : 'empty'}`}
						>
						</div>
					))
					}
				</div>
		</div>
	)
}

export default RoundsBoard;