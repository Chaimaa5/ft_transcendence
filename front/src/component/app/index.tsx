import React, { createContext, useContext } from "react";
import './index.scss'
import Header from "../header/index";
import Navbar from "../navbar/index";
import Home from "../home/index";
import Profile from "../profile/index";
import Status from "../status/index";
import { useLocation } from 'react-router-dom';
import { useEffect, useState } from "react";
import axios from "axios";
import Leaderboord from "../leaderboord";
import Instanse, { socket_ } from "../api/api";
import CrContext from "../context/context";
import Setting from "../setting/index";
import Waiting from "../modes/waiting";
import Chat from "../chat/Chat";
// import GameComponent from '../game/GameComponent'

type cntx = {
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

function Container(){
    const location = useLocation();
    const context = useContext<cntx>(CrContext);
    const [data, setData] = useState(context);
    useEffect(() => {
        // socket_().then((sk) => {
        //     sk.connect()
        //   })
            Instanse.get("/user")
            .then((res) => setData(res.data))
        },[]
    )
    if(location.pathname == "/waiting")
        return(
            <CrContext.Provider value={data}>
            <div className="background">
                <div className="allcontent">
                    <Waiting/>
                </div>
            </div>
        </CrContext.Provider>
        )
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
                            {location.pathname == "/home" && <Home/>}
                            {location.pathname.startsWith("/profile/") && <Profile/>}
                            {location.pathname == "/leaderboord" && <Leaderboord/>}
                            {location.pathname == "/setting" && <Setting/>}
                            {location.pathname.startsWith("/chat") && <Chat/> }
                            {/* {location.pathname.startsWith("/game") && <GameComponent/> } */}
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