import { connect, io, Socket } from 'socket.io-client';
import Instanse from '../api/api';
import { useEffect, useState } from 'react';

class skt {
    setToken(token_:string){
        this.token = token_;
    }
    token:string;
	socket : Socket;
	isSocketInitialized : boolean;
}

const initializeSocket = async (Skt : skt) => {
	console.log("Initializing the socket manager.");
	await Instanse.get("/access")
	.then((res) => {Skt.setToken(res.data)});

	const socketInstance = io('http://localhost:3000/game', {
		extraHeaders: {
			Authorization: `Bearer ${Skt.token}`
		}
	});

	  // Create a Promise that resolves when the socket connects
	  const connectPromise = new Promise<void>((resolve) => {
		socketInstance.on('connect', () => {
		  console.log("Socket connected.");
		  resolve();
		});
	  });
	
	  // Wait for the connection to be established
	  await connectPromise;
	
	  // Now that the connection is established, set the socketInstance
	Skt.socket = socketInstance;
	Skt.isSocketInitialized = true;
};


export async function useSocketManager(){
	let socket : Socket;
	const Skt = new skt;

	await initializeSocket(Skt);


	
    return ({socket : Skt.socket, isSocketInitialized : Skt.isSocketInitialized});
}

