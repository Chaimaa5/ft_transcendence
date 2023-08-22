import React, { useEffect, useState } from "react";
import "./index.scss"
import up_icon from "../tools/profile/up.svg"
import down_icon from "../tools/profile/down.svg"
import { ReactSVG } from "react-svg";
import Instanse from "../api/api";
import { useParams } from "react-router-dom";

type Match_ = {
        winner: string,
        player1: {
          avatar: string,
          username: string,
          hits: number
        },
        player2: {
          avatar: string,
          username: string,
          hits: number
        },
        result: string
}


const Match = () => {
    let icon = up_icon
    const username = useParams().username;
    const [data, setData] = useState<Match_[]>();
    useEffect(() => {
        Instanse.get("/profile/history/" + username)
                .then((res) => {
                    setData(res.data);
                    console.log("lol", res.data)
                })
    },[])
    if(!data || !data.length){
        return(
            <>
            { Array(4).fill(null).map((v, key) => {
                return(
                <div key={key} className="h-[3vw] w-[100%] opacity-[30%] m-[5%] match">
                    <ReactSVG className="w-[2vw] match-icon" src={icon}></ReactSVG>
                </div>
            )})
            }
            </>
        )
    }
    else
    return(
        <>
        {data?.map((value, key) => {
            console.log("ddd")
            if(!value)
                return
            if(value.result === "loss")
                icon = down_icon;
            else if (value.result === "draw")
                icon = ""
            return(
            <div key={key} className="h-[3vw] w-[100%] m-[5%] match">
                <ReactSVG className="w-[2vw] match-icon" src={icon}></ReactSVG>
                <h1 className="w-[33%] text-[0.8vw] text-[#F1FAEE]">{value.player1.username}</h1>
                <h1 className="text-[1vw] text-DarkBlue">{value.player1.hits}</h1>
                <h3 className="text-[1.2vw] text-[#F1FAEE]">VS</h3>
                <h1 className="text-[1vw] text-DarkBlue">{value.player2.hits}</h1>
                <h1 className="w-[33%] text-[0.8vw] text-[#F1FAEE]">{value.player2.username}</h1>
            </div>)
            })
        }
        </>
    );
}

export default Match