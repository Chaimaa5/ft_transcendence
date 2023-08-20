import React, { useEffect, useState } from "react";
import Avatar from "../avatar";
import { Spin } from "antd";
import Av from "../tools/profile.png"
import { useGameContext } from "./GameContext";

const Matched = ({username, player2, onUnmount}) => {
	useEffect(() => {
		const timeout = setTimeout(() => {
			onUnmount();
		}, 2000);
	
		return () => clearTimeout(timeout); // Cleanup the timeout when the component unmounts
	  }, [onUnmount]);

  return(
        <div className="h-[100%] w-[100%] flex justify-center items-center">
            <div className="shadow-3xl h-[40%] w-[25%] rounded-[2vw] p-[1%] flex flex-col items-center bg-DarkBlue justify-evenly">
                <div className="h-[55%] w-[100%] flex  justify-evenly items-start pt-[2%]">
                    <div className="h-[90%] w-[40%] flex flex-col justify-evenly ">
                        <Avatar src={Av} wd_="5vw"/>
                        <h1 className="text-LightBlue text-[0.8vw]">{username}</h1>
                    </div>
					<div className="h-[90%] w-[40%] flex flex-col justify-evenly ">
						<Avatar src={Av} wd_="5vw"/>
						<h1 className="text-LightBlue text-[0.8vw]">{player2}</h1>
					</div>
                </div>
				<h1 className="text-[1.3vw] text-LightBlue ">You Matched</h1>
            </div>
        </div>
    )
}


export default Matched