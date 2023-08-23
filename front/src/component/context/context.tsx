import { createContext } from "react"
import React from "react"
import { Socket } from "socket.io-client"
import Instanse from "../api/api";
import sk from "socket.io-client"

export interface cntx {
    username: string,
    avatar: string,
    id: string,
    XP: number,
    level: number, 
    topaz: number,
    win: number ,
    loss: number, 
    games: number,
    rank: number,
}

class skt {
    setToken(token_:string){
        this.token = token_;
    }
    SetSk(sk: Socket){
        this.sk = sk;
    }
    sk: Socket
    token:string;
}




const CrContext = createContext<cntx>(
    {
        username: "",
        avatar: "",
        id: "",
        XP: 0,
        level: 0, 
        topaz: 0,
        win: 0 ,
        loss: 0, 
        games: 0,
        rank: 0,
    }
);


export default CrContext