import React, { useEffect, useState } from "react";
import { GameProvider } from "./GameContext";
import { MultiComponent } from "./MultiComponent";
import { Socket } from "socket.io-client";
import { useSocketManager } from "./socket";
import { useGameContext } from './GameContext';
import { useParams } from "react-router-dom";
import Instanse from "../api/api";


export const MultiApp = () => {
	const [isSocketInitialized, setIsSocketInitialized] = useState(false);
	const {updateSocket} = useGameContext();

	
	const init = async() => {
		await useSocketManager().then((res)=> {
			setIsSocketInitialized(res.isSocketInitialized);
			updateSocket(res.socket);
		})
	}
	const mode = useParams().mode;


	useEffect(()=>{
		init();
	}, []);

	return (
		<>
		{(isSocketInitialized == true) ?
			(<MultiComponent/>
			) : (
			<h1>Loading</h1>
			)
		}
		</>
	);
}
