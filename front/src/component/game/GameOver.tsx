import React from "react";
import Avatar from "../avatar";
import str from "../tools/modes/starts.png"
import tpz from "../tools/home/Topaz.png"
import Av from "../tools/profile.png"
import Button_ from "../button";
import { Link } from "react-router-dom";
import { PaddleSide } from "./classes/Paddle";
import { GameResults } from "./GameComponent";

// if side === PaddleSide.Left/Right



const GameOver = ({username, side, results}) => {
    return(
        <div className="h-[100%] w-[100%] flex justify-center items-center">
            <div className="relative pt-[3%]  shadow-3xl h-[40%] w-[25%] rounded-[2vw] flex flex-col items-center bg-DarkBlue justify-evenly">
                <img src={str} className="absolute w-[60%] top-[-14%]" />
                <h1 className="text-[1vw]  text-LightBlue">You win</h1>
                <div className="h-[55%]  w-[90%] flex  justify-center items-start pt-[2%]">
                    <div className="h-[90%] w-[45%] flex flex-col justify-evenly ">
                        <Avatar src={Av} wd_="4vw"/>
                        <h1 className="text-LightBlue text-[0.8vw]">mmoutawa</h1>
                        <h1 className="text-LightBlue text-[0.8vw]">3</h1>
                    </div>
                    <div className="h-[90%] w-[45%] flex flex-col justify-evenly ">
                        <Avatar src={Av} wd_="4vw"/>
                        <h1 className="text-LightBlue text-[0.8vw]">mmoutawa</h1>
                        <h1 className="text-LightBlue text-[0.8vw]">1</h1>
                    </div>
                </div>
                <div className=" flex  flex-col h-[40%] w-[100%] items-center justify-center">
                    <div className="h-[30%] w-[40%] flex justify-evenly">
                        <div className="w-[40%] h-[100%]  flex justify-evenly items-center">
                            <h4 className="text-White text-[0.8vw]">+ 1</h4>
                            <img src={tpz} className="h-[2vw]" />
                        </div>
                        <div className="w-[40%] h-[100%]  flex justify-evenly items-center">
                            <h4 className="text-White text-[0.8vw]">+ 100Xp</h4>
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