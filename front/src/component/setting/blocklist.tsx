import React, { useContext, useEffect, useState } from "react";
import Avatar from "../avatar";
import { ReactSVG } from "react-svg";
import av from "../tools/profile.png"
import icon4 from "../tools/btnsIcons/6.svg"
import Instanse from "../api/api";
import CrContext from "../context/context";

type blocked =  {
    id: string,
    avatar: string,
    rank: number,
    username: string,
    level: number,
    XP: number,
    topaz: number
}


const BlockList = () => {

    const [response, setResponse] = useState<blocked[]>([]);
    const GetBlocked = () => {
    return Instanse
            .get<blocked[]>('/user/blocked')
            .then((res) => {
                setResponse(res.data)
            });
    };
    useEffect(() => {
        GetBlocked();
    });
    return(
        <>
            <div className="h-[10%] w-[100%]  p-[2%]">
                <h2 className="text-[#A8DADC] text-[1vw] text-center">Blocked Accounts</h2>
            </div>
            <div className="w-[100%] p-[1%] h-[90%] flex justify-start items-center flex-col">
            {response[0] && response?.map((data) =>
                <div className="w-[60%] h-[14%] p-[3%] rounded-[2vw] border-[0.1vw] border-[#A8DADC] flex justify-between items-center">
                    <Avatar src={data.avatar} wd_="2.5vw"/>
                    <h1 className="text-[#A8DADC] text-[1vw]">{data.username}</h1>
                    <button onClick={() => {
                        Instanse.get("/user/unblock/" + data.id);
                }} className="h-[1.5vw] w-[1.5vw] flex items-center justify-center bg-[#E63946] rounded-[50%]">
                        <ReactSVG src={icon4} className="w-[0.6vw] "/>
                    </button>
                </div>
            )}
            </div>
            
        </>
    )
}

export default BlockList