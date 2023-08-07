import React from "react";
import "./index.scss"
import up_icon from "../tools/profile/up.svg"
import down_icon from "../tools/profile/down.svg"
import { ReactSVG } from "react-svg";

type Match = {
    isWin:boolean,
}


const Match = ({isWin}:Match) => {
    let icon = up_icon
    if(!isWin) icon = down_icon
    
    return(
        <div className="h-[3vw] w-[100%] m-[5%] match">
            <ReactSVG className="w-[2vw] match-icon" src={icon}></ReactSVG>
            <h4 className="text-[1vw] text-[#F1FAEE]">hkhalil</h4>
            <h3 className="text-[1.2vw] text-[#F1FAEE]">VS</h3>
            <h4 className="text-[1vw] text-[#F1FAEE]">hkhalil</h4>
        </div>
    );
}

export default Match