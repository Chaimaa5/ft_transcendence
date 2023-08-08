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
    const random: Match_[] = [{isWin: true, player1: "", player2: ""},
                            {isWin: true, player1: "", player2: ""},
                            {isWin: true, player1: "", player2: ""},
                            {isWin: true, player1: "", player2: ""},
                            {isWin: true, player1: "", player2: ""}]
    useEffect(() => {
        Instanse.get("/profile/history/" + username)
                .then((res) => {
                    setData(res.data);
                })
    },[data])
    // if(data){
    //     return(
    //         <>
    //         { data.map(() => {
    //             <div className="h-[3vw] w-[100%] m-[5%] match">
    //                 <ReactSVG className="w-[2vw] match-icon" src={icon}></ReactSVG>
    //             </div>
    //             })
    //         }
    //         </>
    //     )
    // }
    // if(!isWin) icon = down_icon
    return(
        <>
        {
            <div className="h-[3vw] w-[100%] m-[5%] match">
                <ReactSVG className="w-[2vw] match-icon" src={icon}></ReactSVG>
                {false && <>
                    <h4 className="text-[1vw] text-[#F1FAEE]">hkhalil</h4>
                    <h3 className="text-[1.2vw] text-[#F1FAEE]">VS</h3>
                    <h4 className="text-[1vw] text-[#F1FAEE]">hkhalil</h4>
                </>
                }
            </div>
        }
        </>
    );
}

export default Match