import React, { ChangeEvent, useEffect, useState, useTransition } from 'react'
import Instanse from '../api/api';
import { socket } from './socket';

export const TrainingRoundsBoard = (gameId) => {

	const [lossLimit, setLossLimit] = useState(0);
	const losses = Array.from(Array(lossLimit).keys());
	const [lostRounds, setLostRounds] = useState(0);

	useEffect(() => {
		Instanse.get(`training-game/${gameId}`)
		.then(response => {
			setLossLimit(response.data.lossLimit);
		})

		socket.on('updateLoss', () => {
			setLostRounds(prevLossRounds => prevLossRounds + 1);
		})
	})

	return(
		<div className="rounds-board">
		<span>LOSS LIMITS</span>
		<div className="rounds-points">
			{losses.map((roundNumber) => (
				<div
					key={roundNumber}
					className={`round ${roundNumber < lostRounds ? 'full' : 'empty'}`}
				>
				</div>
			))
			}
		</div>
</div>
	)
}

 
export const TwoPlayersRoundsBoard = (gameMode, gameId) => {

	const [roundsNumber, setRoundsNumber] = useState(0);
	const [pointsToWin, setPointsToWin] = useState(0);
	const [playedRounds, setPlayedRounds] = useState(0);
	
	const rounds = Array.from(Array(roundsNumber).keys());

	useEffect(() => {
		Instanse.get(`two-players-game/${gameId}`)
		.then(response => {
			setRoundsNumber(response.data.rounds);
			setPointsToWin(response.data.pointsToWin);
		});

		socket.on('updateRound', () => {
			setPlayedRounds(prevPlayedRounds => prevPlayedRounds + 1);
		});
	})

	return (
		<div className="rounds-board">
				<span>ROUND</span>
				<div className="rounds-points">
					{rounds.map((roundNumber) => (
						<div
							key={roundNumber}
							className={`round ${roundNumber < playedRounds ? 'full' : 'empty'}`}
						>
						</div>
					))
					}
				</div>
		</div>
	)
}

