import React, { ChangeEvent, useEffect, useState, useTransition } from 'react'
import Instanse from '../../api/api';
import { useTrainingContext } from './TrainingContext';


export const TrainingRoundsBoard = (gameId) => {

    const { score } = useTrainingContext();
	const [lossLimit, setLossLimit] = useState(0);
	const losses = Array.from(Array(lossLimit).keys());
	const {setEndGame} = useTrainingContext();

	useEffect(() => {
		async  function fetchData() {
			try {
				await Instanse.get(`/game/training-game/${gameId.gameId}`)
				.then(response => {
					setLossLimit(response.data.lossLimit);
				})
			} catch(error) {
				console.error('Error fetching data "@Get /game/training-game/:id" : ', error)
			}
		}
		fetchData();
	},[])


	return(
		<div className="rounds-board">
			<span>LOSS LIMITS</span>
			<div className="rounds-points">
				{losses.map((roundNumber) => {
					if(lossLimit === score) {
						setEndGame();
					}
				
					return (
						<div
							key={roundNumber}
							className={`round ${roundNumber < score ? 'full' : 'empty'}`}
						>
						</div>
					);
				})}
			</div>
		</div>
	)
}