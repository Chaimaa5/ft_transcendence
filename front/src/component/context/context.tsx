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

// export const Skt = new skt

// export const socket_ =  async  (endP: string) => {
//     await Instanse.get("/access")
//                   .then((res) => {Skt.setToken(res.data)
//     });
//     const socket =  sk("http://localhost:3000/notfications", {
//         // autoConnect : false,
//         extraHeaders: {
//             Authorization: `Bearer ${Skt.token}`,
            
//         }
//     });
//     // console.log(Skt.token)
//     socket.on("disconnect", (reason: string) => {
//       console.log("WebSocket disconnected:", reason);
//     });
//     socket.connect()
//     return socket
// };

// socket_("").then((sk) => {
//     Skt.SetSk(sk)
// })



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