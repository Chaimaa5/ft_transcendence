import React, { ChangeEvent, useState, useTransition } from 'react'

/* typescript :
	- function paramaters : function deleteUser(user : User) {}
	- function return value : function getAdminUser() : User {}
	- two ways to declate the shape of an object :
		. interfaces : a way of describing the shape of an object. and sometimes we run into cases where not all properties are required, for that we follow the name of the property by a ?. and if we want to create properties that are immutable, we add the the readonly before the property name.
		. type aliases : 
*/


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