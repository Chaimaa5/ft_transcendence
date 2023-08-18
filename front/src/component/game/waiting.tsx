import React, { useEffect } from "react";
import Avatar from "../avatar";
import { socket_ } from "../api/api";

const Waiting = () => {
    return(
        <div className="h-[100%] w-[100%] flex justify-center items-center">
            <div className="h-[20%] w-[30%] flex items-center justify-between ">
                <div className="h-[100%] w-[30%] flex flex-col justify-evenly ">
                    <Avatar src="" wd_="5vw"/>
                    <h1 className="text-LightBlue text-[0.8vw]">mmoutawa</h1>
                </div>
                <div>

                </div>
                <div className="h-[100%] w-[30%] flex flex-col justify-evenly ">
                    <Avatar src="" wd_="5vw"/>
                    <h1 className="text-LightBlue text-[0.8vw]">Waiting for other player</h1>
                </div>
                
            </div>
        </div>
    )
}

export default Waiting