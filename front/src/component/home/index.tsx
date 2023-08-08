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
import Instanse from "../api/api"
import CrContext from "../context/context"
import Profile from "../profile/index";
import { Link } from "react-router-dom";


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
    return Instanse
            .get<home_[]>('/home/bestRanked')
            .then((res) => {
                setResponse(res.data)
            });
    };
    useEffect(() => {
      HandleLogin();
    },[]);
    const plyrs = [1,2,3,4,5]
    return(
        <motion.div animate={{x: "-43%", y: "-50%"}} className="players pos">
            <div className="titels_">
            <h3 className=" inf">Rank</h3>
            <h3 className="relative left-[13%] inf">Username</h3>
            <h3 className="relative left-[8%] inf">Score</h3>
            <h3 className="relative left-[3%] inf">Level</h3>
            <h3 className="inf">Topaz</h3>
            </div>
            {response[0] &&
            response?.map((data)=>
                <div className="player-bar">
                    <div className="bar_cantainer">
                       <h3 className="inf">{data.rank}</h3>
                       <Link to={"/profile/" + data.username}>
                            <div className="player-pc">
                                <Avatar src={data.avatar} wd_="3vw"/>
                            </div>
                        </Link>
                       <h3 className="inf" >{data.username}</h3>
                       <h3 className="inf">{data.XP} Xp</h3>
                       <h3 className="inf">{data.level} Lv</h3>
                       <div className="elem">
                           <h3 className="inf">{0}</h3>
                           <img src={topaz}/>
                       </div>
                    </div>
                </div>    
            )
            }{!response[0] && plyrs.map((data)=>
            <div className="player-bar opacity-[30%]"></div>)}
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
    return(
        <div className="home_">
            <motion.div animate={{x: "50%", y: "50%"}} className="welcoming pos">
                <h3 className="title Welcom_title">WELCOME</h3>
                <h5 className="dsc">To The <br /> Ultimate<br /> Pong<br /> Experience!</h5>
                <button className="start_">
                    <Button_ option="Start"/>
                </button>
                <motion.img whileHover={{skew: 5}} className="boy" src={pongboy} />
            </motion.div>
            <motion.div  animate={{x: "50%", y: "-50%"}}  className="stream pos">
                <h3 className="title title_stream">WATCH</h3>
                <h5 className="dsc-stream">The Game In Action</h5>
                    <button className="Watch_">
                        <Button_ option="Watch"/>
                    </button>
                <motion.img whileHover={{scale: 1.06}} className="table" src={table_img}/>
            </motion.div>
            {/* <motion.div animate={{x: "-50%", y: "50%"}} className="modes pos">
                    <Modes/>
            </motion.div> */}
            <div className="modes pos">
                    <Modes/>
            </div>
            <TopPlayers/>
        </div>
    )
}

export default Home;