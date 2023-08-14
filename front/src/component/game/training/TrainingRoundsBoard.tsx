import React, { ChangeEvent, useEffect, useState, useTransition } from 'react'
import Instanse from '../../api/api';
import { useTrainingContext } from './TrainingContext';


export const TrainingRoundsBoard = (gameId) => {

    const { score } = useTrainingContext();
	const [lossLimit, setLossLimit] = useState(0);
	const losses = Array.from(Array(lossLimit).keys());

	useEffect(() => {
		Instanse.get(`training-game/${gameId}`)
		.then(response => {
			setLossLimit(response.data.lossLimit);
		})
	})

	return(
		<div className="rounds-board">
		<span>LOSS LIMITS</span>
		<div className="rounds-points">
			{losses.map((roundNumber) => (
				<div
					key={roundNumber}
					className={`round ${roundNumber < score ? 'full' : 'empty'}`}
				>
				</div>
			))
			}
		</div>
</div>
	)
}