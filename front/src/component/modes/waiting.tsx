import React from "react";
import Avatar from "../avatar";
import { Spin } from "antd";
import Av from "../tools/profile.png"
const Waiting = ({mode}) => {
    
    return(
        <div className="h-[100%] w-[100%] flex justify-center items-center">
            <div className="shadow-3xl h-[40%] w-[25%] rounded-[2vw] p-[1%] flex flex-col items-center bg-DarkBlue justify-evenly">
                <div className="h-[55%] w-[100%] flex  justify-evenly items-start pt-[2%]">
                    <div className="h-[90%] w-[40%] flex flex-col justify-evenly ">
                        <Avatar src={Av} wd_="5vw"/>
                        <h1 className="text-LightBlue text-[0.8vw]">Waiting for other player</h1>
                    </div>
                    {mode === "multi" &&
                        <div className="h-[90%] w-[40%] flex flex-col justify-evenly ">
                            <Avatar src={Av} wd_="5vw"/>
                            <h1 className="text-LightBlue text-[0.8vw]">Waiting for other player</h1>
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