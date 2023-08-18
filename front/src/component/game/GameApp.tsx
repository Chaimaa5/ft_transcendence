import React, { useEffect, useState } from "react";
import { GameProvider } from "./GameContext";
import { GameComponent } from "./GameComponent";
import { Socket } from "socket.io-client";
import { useSocketManager } from "./socket";
import { useGameContext } from './GameContext';


export const GameApp = () => {
	const [isSocketInitialized, setIsSocketInitialized] = useState(false);
	const {updateSocket} = useGameContext();

	
	const init = async() => {
		await useSocketManager().then((res)=> {
			setIsSocketInitialized(res.isSocketInitialized);
			console.log("respone : ", res.socket ,res.isSocketInitialized);
			updateSocket(res.socket);
		})
	}

	useEffect(()=>{
		init();
	}, []);

	return (
		<>
		{(isSocketInitialized == true) ? (
			<GameComponent />
			) : (
				<h1>Loading</h1>
			)
		}
		</>
	);
}
