import React, { useContext } from "react";
import "./index.scss"
import pongboy from "../tools/home/welcoming.png"
import table_img from "../tools/home/table.png"
import Button_ from "../button";
import topaz from "../tools/home/Topaz.png"
import Modes from "../modes"
import Avatar from "../avatar";
import {motion} from "framer-motion"
import { useState, useEffect } from "react";
import Instanse, { socket_ } from "../api/api"
import CrContext from "../context/context"
import Profile from "../profile/index";
import { Link, useNavigate } from "react-router-dom";


type home_ =  {
    avatar: string,
    rank: number,
    username: string,
    level: number,
    XP: number,
    topaz: number
}

type TopPlayersProps = {
    data: home_
}

type cntx = {
    username: string,
    avatar: string
}

const TopPlayers = ()=> {
    const [data, setData] = useState(useContext<cntx>(CrContext))
    const [response, setResponse] = useState<home_[]>([]);
    const HandleLogin = () => {
       Instanse.get<home_[]>('/home/bestRanked')
                .then((res) => {
                    setResponse(res.data)
                })
    };

    useEffect(() => {
        HandleLogin();
    },[]);

    const plyrs = [1,2,3,4,5]

    return(
        <motion.div /*animate={{x: "-43%", y: "-50%"}}*/ className="players w-[45%] ">
            <div className="titels_ pl-[5%]">
                <h3 className="inf ">Rank</h3>
                <div className="flex justify-evenly pl-[15%] items-center w-[80%] ">
                    <h3 className="inf w-[30%]">Username</h3>
                    <h3 className="inf w-[30%]">Score</h3>
                    <h3 className="inf w-[30%]">Level</h3>
                </div>
                    <h3 className="inf w-[15%]">Topaz</h3>
            </div>
            {response[0] &&
            response?.map((data, key)=>
                <div key={key} className="player-bar">
                    <div className="bar_cantainer">
                       <h3 className="inf">{data.rank}</h3>
                       <Link to={"/profile/" + data.username}>
                            <div className="player-pc">
                                <Avatar src={data.avatar} wd_="3vw"/>
                            </div>
                        </Link>
                       <h3 className="inf w-[15%]" >{data.username}</h3>
                       <h3 className="inf w-[15%]">{data.XP} Xp</h3>
                       <h3 className="inf w-[15%]">{data.level} Lv</h3>
                       <div className="elem">
                           <h3 className="inf">{data.topaz}</h3>
                           <img className="w-[2.5vw]" src={topaz}/>
                       </div>
                    </div>
                </div>    
            )
            }{!response[0] && plyrs.map((data, key)=>
            <div key={key} className="player-bar opacity-[30%]"></div>)}
        </motion.div>
    )
}

const Home = () => {

    type anm = {
            x: string,
            y: string,
    }
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const [animation, setanimation] = useState<anm[]>([]);

    const box_animation = () =>{
        const first:anm[] = [
            {
                x: "50%",
                y: "50%",
            },
            {
                x:"50%",
                y:"-50%",
            }
        ]
        if(windowWidth > 900)
            setanimation(first)
        else setanimation([])
    }
	
	const nav = useNavigate();
    return(
        <div className=" flex flex-col  w-[100%] h-[100%] justify-between align-center">
            <div className="w-[100%] h-[50%] flex  justify-evenly items-start">
                <motion.div animate={{x: "50%", y: "50%"}}  className="welcoming w-[45%] h-[90%] flex flex-col pt-[2%]">
                    <div className="h-[25%] w-[100%] flex items-center justify-center">
                        <h1 className="text-[6.5vw] title Welcom_title">WELCOME</h1>
                    </div>                   
                    <div className="flex flex-col h-[75%] pl-[12%] justify-evenly">
                        <h5 className="dsc">To The <br /> Ultimate<br /> Pong<br /> Experience!</h5>
						<button onClick={async () => {
							nav("/game/");
						}} className="start_">
                            <Button_ option="Start"/>
                        </button>
                    </div>
                    <motion.img whileHover={{skew: 5}} className="boy" src={pongboy} />
                </motion.div>
                <motion.div animate={{x: "-50%", y: "50%"}} className="flex h-[90%] w-[45%] relative top-[-45%] right-[-22.5%] ">
                        <Modes/>
                </motion.div>
            </div>
            <div className="w-[100%] h-[50%] flex justify-evenly items-end">
                <motion.div  animate={{x: "50%", y: "-50%"}}  className="stream w-[45%] h-[92%] flex justify-evenly flex-col rounded-[1.7vw]">
                        <h3 className="title title_stream text-[3vw] leading-[1.25]">Embrace <br/>the Challenge</h3>
                        <h5 className="text-LightBlue text-[1.5vw]">it's paddle time!</h5>
                        <motion.img whileHover={{scale: 1.06}} className="h-[40%]" src={table_img}/>
                </motion.div>
                <TopPlayers/>
            </div>
        </div>
    )
}

export default Home;