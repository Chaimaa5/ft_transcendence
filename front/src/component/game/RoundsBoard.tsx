import React, { ChangeEvent, useEffect, useState, useTransition } from 'react'
import Instanse from '../api/api';
import { useGameContext } from './GameContext';

 
export const TwoPlayersRoundsBoard = ({gameMode, gameIdProp}) => {

	const [roundsNumber, setRoundsNumber] = useState(0);
	const [pointsToWin, setPointsToWin] = useState(0);
	const [playedRounds, setPlayedRounds] = useState(0);
	
	const rounds = Array.from(Array(roundsNumber).keys());

	const {socket} = useGameContext();

	useEffect(() => {
		Instanse.get(`/game/two-players-game/${gameIdProp}`)
		.then((response) => {
			setRoundsNumber(response.data.rounds);
			setPointsToWin(response.data.pointsToWin);
		});

		if(socket) {
			socket.on('updateScore', (payload) => {
				setPlayedRounds(payload.playedRounds);
			});
		}
	},[])

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
