import React, {createContext, useContext, useEffect, useState} from "react";
import { Socket } from "socket.io-client";
import {useSocketManager} from "./socket";

interface GameContextProps {
	socket : Socket | undefined;
	isSocketInitialized : boolean;
	updateSocket : (newSocket : Socket) => void
}

const GameContext = createContext<GameContextProps | undefined >(undefined);

export const GameProvider = ({children}) => {
	const [socket, setSocket] = useState<Socket | undefined>(undefined)
	const [isSocketInitialized, setIsSocketInitialized] = useState(false);
	
	const updateSocket = (newSocket : Socket) => {
		setSocket(newSocket);
	}

	return(
		<GameContext.Provider value={{socket, isSocketInitialized, updateSocket}}>
			{children}
		</GameContext.Provider>
	);
}

export const useGameContext = () : GameContextProps => {
	const context = useContext(GameContext);

	if(!context) {
		throw new Error('useGameContext must be used with a GameProvider')
	}

	return(context);
}