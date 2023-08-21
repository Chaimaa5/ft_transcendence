import React, { useEffect, useState } from "react";
import "./index.scss"
import up_icon from "../tools/profile/up.svg"
import down_icon from "../tools/profile/down.svg"
import { ReactSVG } from "react-svg";
import Instanse from "../api/api";
import { useParams } from "react-router-dom";

type Match_ = {
    isWin:boolean,
    player1: string,
    player2:string
    
}


const Match = () => {
    let icon = up_icon
    const username = useParams().username;
    const [data, setData] = useState<Match_[]>();
    useEffect(() => {
        Instanse.get("/profile/history/" + username)
                .then((res) => {
                    setData(res.data);
                })
    },[])
    // if(!data?.length){
    //     return(
    //         <>
    //         { Array(4).fill(null).map((v, key) => {
    //             return(
    //             <div key={key} className="h-[3vw] w-[100%] opacity-[30%] m-[5%] match">
    //                 <ReactSVG className="w-[2vw] match-icon" src={icon}></ReactSVG>
    //             </div>
    //         )})
    //         }
    //         </>
    //     )
    // }
    return(
        <>
        {
            <div className="h-[3vw] w-[100%] m-[5%] match">
                <ReactSVG className="w-[2vw] match-icon" src={icon}></ReactSVG>
                <h1 className="w-[33%] text-[0.8vw] text-[#F1FAEE]">mmoutawa</h1>
                <h1 className="text-[1vw] text-DarkBlue">9</h1>
                <h3 className="text-[1.2vw] text-[#F1FAEE]">VS</h3>
                <h1 className="text-[1vw] text-DarkBlue">2</h1>
                <h1 className="w-[33%] text-[0.8vw] text-[#F1FAEE]">mmoutawa</h1>
            </div>
        }
        </>
    );
}

export default Match