import React, { useEffect, useState } from "react";
import Avatar from "../avatar";
import { Spin } from "antd";
import Av from "../tools/profile.png"
import { useGameContext } from "./GameContext";

const Waiting = ({username, mode}) => {
	const [player1, setPlayer1] = useState(username.username)
	const [player2, setPlayer2] = useState("waiting for another player");

	const {socket} = useGameContext();

    return(
        <div className="h-[100%] w-[100%] flex justify-center items-center">
            <div className="shadow-3xl h-[40%] w-[25%] rounded-[2vw] p-[1%] flex flex-col items-center bg-DarkBlue justify-evenly">
                <div className="h-[55%] w-[100%] flex  justify-evenly items-start pt-[2%]">
                    <div className="h-[90%] w-[40%] flex flex-col justify-evenly items-center">
                        <Avatar src={Av} wd_="5vw"/>
                        <h1 className="text-LightBlue text-[0.8vw]">{player1}</h1>
                    </div>
                    {mode === "multi" &&
                        <div className="h-[90%] w-[40%] flex flex-col justify-evenly ">
                            <Avatar src={Av} wd_="5vw"/>
                            <h1 className="text-LightBlue text-[0.8vw]">{player2}</h1>
                        </div>
                    }
                </div>
                <div className="flex h-[30%] w-[100%] items-center justify-center">
                    <Spin size="large" /> 
                </div>
            </div>
        </div>
    )
}


export default Waiting