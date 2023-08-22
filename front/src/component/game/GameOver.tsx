import React, { useEffect, useState } from "react";
import Avatar from "../avatar";
import str from "../tools/modes/starts.png"
import tpz from "../tools/home/Topaz.png"
import Av from "../tools/profile.png"
import Button_ from "../button";
import { Link } from "react-router-dom";
import { PaddleSide } from "./classes/Paddle";
import { GameResults } from "./GameComponent";
import Instanse from "../api/api";

// if side === PaddleSide.Left/Right

export interface GameResults{
    winner: string,
    draw : boolean,
    leftPlayer : {
        userName: string,
        roundScore : number,
    }, 
    rightPlayer : {
        userName: string,
        roundScore : number,
    }
}

const GameOver = ({username, side, results}) => {
    const [data, SetData] = useState<GameResults>(results)
    let Data_ = {
        iswin: false,
        Xp: "-10",
        Topaz: "0",
        opct: "30%",
        Rslt: "Loss",

    }
    
    if(data.winner && data.winner === username.username){
        Data_.iswin = true
        Data_.Topaz = "+ 1"
        Data_.opct = "100%"
        Data_.Rslt = "Win"
        Data_.Xp = "+100"
    }

    return(
        <div className="h-[100%] w-[100%] flex justify-center items-center">
            <div className="relative pt-[3%]  shadow-3xl h-[40%] w-[25%] rounded-[2vw] flex flex-col items-center bg-DarkBlue justify-evenly">
                <img style={{opacity: Data_.opct}} src={str} className="absolute w-[60%] top-[-14%]" />
                <h1 className="text-[1vw]  text-LightBlue">{Data_.Rslt}</h1>
                <div className="h-[55%]  w-[90%] flex  justify-center items-start pt-[2%]">
                    <div className="h-[90%] w-[45%] flex flex-col justify-evenly items-center">
                        <Avatar src={Av} wd_="4vw"/>
                        <h1 className="text-LightBlue text-[0.8vw]">{data.leftPlayer.userName}</h1>
                        <h1 className="text-LightBlue text-[0.8vw]">{data.leftPlayer.roundScore}</h1>
                    </div>
                    <div className="h-[90%] w-[45%] flex flex-col justify-evenly items-center">
                        <Avatar src={Av} wd_="4vw"/>
                        <h1 className="text-LightBlue text-[0.8vw]">{data.rightPlayer.userName}</h1>
                        <h1 className="text-LightBlue text-[0.8vw]">{data.rightPlayer.roundScore}</h1>
                    </div>
                </div>
                <div className=" flex  flex-col h-[40%] w-[100%] items-center justify-center">
                    <div className="h-[30%] w-[40%] flex justify-evenly">
                        <div className="w-[40%] h-[100%]  flex justify-evenly items-center">
                            <h4 className="text-White text-[0.8vw]">{Data_.Topaz}</h4>
                            <img src={tpz} className="h-[2vw]" />
                        </div>
                        <div className="w-[40%] h-[100%]  flex justify-evenly items-center">
                            <h4 className="text-White text-[0.8vw]">{Data_.Xp}Xp</h4>
                        </div>
                    </div>
                    <Link to="/home" className="h-[60%] w-[40%] flex justify-center items-center">
                        <Button_ option="Home"/>
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default GameOver