import React, { useEffect, useState } from "react";
import avatar_img from "../tools/profile.png"
import Avatar from "../avatar/index";
import Button_ from "../button/index";
import topaz_img from "../tools/home/Topaz.png"
import Instanse from "../api/api";
import { Link, useNavigate } from "react-router-dom";

type topplayer = [
    {
        id: number,
        avatar: string,
        rank:number,
        username: string,
        level: number,
        XP: number,
        topaz: number,
    }
]

const TopPlayers = () => {
    const [data, SetData] = useState<topplayer>();
    const nav = useNavigate()
    useEffect(() => {
        Instanse.get("/leaderboard/players")
                .then((res) => {
                    SetData(res.data);
                });
    }, [])
    if(!data?.length)
        return(
            <>
                {Array(8).fill(null).map((vl, key) => {
                    return(
                        <div key={key} className="w-[100%] h-[3vw] m-[1%] rounded-[5vw] bg-Blue opacity-[40%]"></div>)
                })}
            </>
            )
    else
    return(
        <>{
            data?.map((value, key) => {
                return(
                <div key={key} className="h-[3vw] w-[100%] mt-[1%] rounded-[2vw] topplayers">
                    <div className="flex flex-calum items-center w-[20%] justify-evenly">
                        <h4 className="text-[0.8vw] text-[#F1FAEE]">{value.rank}</h4>
                        <Link to={"/profile/" + value.username}  >
                            <Avatar src={value.avatar} wd_="2.5vw"/>
                        </Link>
                        <h4 className="text-[0.8vw] text-[#F1FAEE]">{value.username}</h4>
                    </div>
                    <h4 className="text-[0.8vw] text-[#F1FAEE]">{value.level} Lv</h4>
                    <h4 className="text-[0.8vw] text-[#F1FAEE]">{value.XP} Xp</h4>
                    <div className="flex flex-calum items-center w-[20%] justify-between pr-[1%]">
                        <div className="flex flex-calum items-center justify-between">
                            <h4 className="text-[0.8vw] text-[#F1FAEE]">5 </h4>
                            <img className="h-[2vw]" src={topaz_img} />
                        </div>
                    <button onClick={() => {
                        Instanse.post('/game/create-challenge-game', {isPlayerInvited: true, rounds: 3, pointsToWin: 5, isFlashy: false, isDecreasingPaddle: true, Player: value.username})
                                .then((response) => {
                                    nav('/game/' + response.data + "/challenge");
                                });
                    }}>
                        <Button_ option="Invite"/>
                    </button>
                    </div>
                </div>)
            })}
        </>
    )
}

export default TopPlayers