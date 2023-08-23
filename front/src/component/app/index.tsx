import React, { createContext, useContext } from "react";
import './index.scss'
import Header from "../header/index";
import Navbar from "../navbar/index";
import Home from "../home/index";
import Profile from "../profile/index";
import Status from "../status/index";
import { redirect, useLocation} from 'react-router-dom';
import { useEffect, useState } from "react";
import Leaderboord from "../leaderboord";
import Instanse from "../api/api";
import CrContext from "../context/context";
import Setting from "../setting/index";
import Waiting from "../modes/waiting";
import { Socket } from "socket.io-client";
import GameOver from "../game/gameOver";
import Chat from "../chat/Chat"

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
    socket: Socket | null,
}

function Container(){
    const location = useLocation();
    const context = useContext<cntx>(CrContext);
    const [data, setData] = useState(context);
        useEffect(() => {
        Instanse.get("/user")
                .then((res) => setData(res.data))
        },[]

    )
    // if(location.pathname.startsWith("/g"))
        // return(
        //     // <div className="background">
        //         <div className="background">
        //             <GameOver />
        //         </div>
        //     // </div>
        // )
    return(
        <CrContext.Provider value={data}>
            <div className="background">
                <div className="allcontent">
                    <div className="header_">
                        <Header/>
                    </div>
                    <div className="content_">
                        <div className="navbar">
                            <Navbar/>
                        </div>
                        <div className="page">
                            {location.pathname == "/home"    && <Home/>}
                            {location.pathname.startsWith("/profile/") && <Profile/>}
                            {location.pathname == "/leaderboord" && <Leaderboord/>}
                            {location.pathname == "/setting" && <Setting/>}
                            {location.pathname.startsWith("/chat") && <Chat/> }
                        </div>
                        <div className="status">
                            <Status/>
                        </div>
                    </div>
                </div>
            </div>
        </CrContext.Provider>
    )
}

export default Container;