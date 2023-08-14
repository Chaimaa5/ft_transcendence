import React, { useEffect } from "react";
import { useState } from "react";
import "./index.scss"
import { ReactSVG } from "react-svg";
import home_icon from "../tools/navbar/home.svg"
import chat_icon from "../tools/navbar/chat.svg"
import setting_icon from "../tools/navbar/setting.svg"
import leader_icon from "../tools/navbar/leader.svg"
import profil_img from "../tools/navbar/profil.png" 
import avatar_img from "../tools/sign/avatar.png"
import Avatar from "../avatar";
import achievement from "../tools/arch.png"
import Profile from "../profile/index";
import Profile_effect from "../Profile_effect/index";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import CrContext from "../context/context";
import { useContext } from "react";
import Instanse from "../api/api";

interface nav {
    username: string,
    avatar: string,
    XP: number,
    level: number,
    games: number,
    win: number,
    loss: number,
    progress: number
}

const Navbar = () => {
    
    const [ishover_, sethover] = useState(false)
    const data = useContext(CrContext);
    const [Data,SetData] = useState<nav>();
    useEffect(() => {
        Instanse.get("/home/navbar")
        .then((res) => {
            SetData(res.data);
        })
    },[])
    const [Home_ic, SetHome_ic] = useState({fill: "#A8DADC"})
    const [Leader_ic, SetLeader_ic] = useState({fill: "#A8DADC"})
    const [Chat_ic, SetChat_ic] = useState({fill: "#A8DADC"})
    const [Stt_ic, SetStt_ic] = useState({fill: "#A8DADC"})
    const location = useLocation();  
    console.log(location.pathname)
    const i = "18%";
    useEffect(() => {

        SetHome_ic({fill: "#A8DADC"})
        SetLeader_ic({fill: "#A8DADC"})
        SetChat_ic({fill: "#A8DADC"})
        SetStt_ic({fill: "#A8DADC"})

        if(location.pathname == "/home")
            SetHome_ic({fill: "#E63946"})
        else if(location.pathname == "/leaderboord")
            SetLeader_ic({fill: "#E63946"})
        else if(location.pathname.startsWith("/chat"))
            SetChat_ic({fill: "#E63946"})
        else if(location.pathname == "/setting")
            SetStt_ic({fill: "#E63946"})

    },[location.pathname])
    return(
        <div className=" flex h-[90%] w-[100%] justify-evenly items-center flex-col">
            <div className="h-[50%] w-[100%] flex justify-center items-start" >
                {location.pathname != "/profile" &&
                    <div className="container-lv bg-[#1D3557]">
                        <div className="info">
                            <h4>Lv</h4>
                            <h5 className="value">{Data?.level}</h5>
                        </div>
                        <div className="lv bg-[#A8DADC]">
                            <div style={{height: i}} className="lv-status h-[63%]">
                            </div>
                        </div>
                        <div className="info">
                            <h6 className="value">{Data?.XP}</h6>
                            <h4>Xp</h4>
                        </div>
                    </div>
                }
            </div>
            <div className="flex h-[50%] w-[100%] flex-col justify-between items-center pt-[10%]" >
                <Link to={"/profile/" + data.username}>
                    <div className="profil_"
                        // onMouseEnter={() => { sethover(true)}}
                        // onMouseLeave={() => {sethover(false)}}
                        >
                        <Avatar src={data.avatar} wd_="4vw"/>
                        {/* { ishover_ &&
                            <motion.div animate={{x: 15, y: 8}} className="Profile_effect"
                            >
                                <Profile_effect/>
                            </motion.div>
                        } */}
                    </div>
                </Link>
                <Link to={"/home"}>
                    <ReactSVG style={Home_ic}  className="icon-svg w-[1.5vw]" src={home_icon}/>
                </Link>
                <Link to={"/leaderboord"}>
                    <ReactSVG style={Leader_ic} className="icon-svg w-[1.5vw]" src={leader_icon}/>
                </Link>
                <Link to="/chat">
                    <ReactSVG style={Chat_ic} className="icon-svg w-[1.5vw]" src={chat_icon}/>
                </Link>
                <Link to="/setting">
                    <ReactSVG style={Stt_ic} className="icon-svg w-[1.5vw]" src={setting_icon}/>
                </Link>
            </div>
        </div>
    )
    
}
export default Navbar