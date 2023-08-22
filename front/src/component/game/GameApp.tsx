import React, { useEffect, useState } from "react";
import { GameProvider } from "./GameContext";
import { GameComponent } from "./GameComponent";
import { Socket } from "socket.io-client";
import { useSocketManager } from "./socket";
import { useGameContext } from './GameContext';
import { useParams } from "react-router-dom";
import { Loading } from "./Loading";


export const GameApp = () => {
	const [isSocketInitialized, setIsSocketInitialized] = useState(false);
	const {socket,updateSocket} = useGameContext();
	const [username, setUserName]  = useState();

	
	const init = async() => {
		await useSocketManager().then((res)=> {
			setIsSocketInitialized(res.isSocketInitialized);
			updateSocket(res.socket);
			res.socket.emit('getUsername');

			res.socket.on("username" , (payload) => {
				setUserName(payload.username);
			})
		})
	}
	
	
	
	useEffect(()=>{
		init();
	}, []);

	return (
		<>
		{(isSocketInitialized === true && username) ? (
			<GameComponent username={username}/>
			) : (
			<Loading/>
			)
		}
		</>
	);
}
