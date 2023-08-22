import React, { useEffect, useState } from "react";
import { GameProvider } from "./GameContext";
import { MultiComponent } from "./MultiComponent";
import { Socket } from "socket.io-client";
import { useSocketManager } from "./socket";
import { useGameContext } from './GameContext';
import { useParams } from "react-router-dom";
import Instanse from "../api/api";
import {Loading} from './Loading'


export const MultiApp = () => {
	const [isSocketInitialized, setIsSocketInitialized] = useState(false);
	const {updateSocket} = useGameContext();
	const [username, setUserName]  = useState();
	const [socket, setSocket] = useState<Socket>();


	
	const init = async() => {
		await useSocketManager().then((res)=> {
			setIsSocketInitialized(res.isSocketInitialized);
			updateSocket(res.socket);
			setSocket(res.socket);
			res.socket.emit('getUsername' );
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
		{(isSocketInitialized == true && username) ? (
			<MultiComponent username={username}/>
			) : (
				<Loading/>
			)
		}
		</>
	);
}
