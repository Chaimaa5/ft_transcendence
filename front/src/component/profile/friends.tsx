import React from "react";
import Avatar from "../avatar/index";
import Button_ from "../button/index";
import avatar_img from "../tools/profile.png"
import { useState, useEffect } from "react";
import axios from "axios";
import { animate, motion } from "framer-motion";
import { useParams } from "react-router-dom";
import Instanse from "../api/api";
import { Link } from "react-router-dom";

type friends_ = {
    id: string,
    //username not found
    username: string,
    avatar: string,
    XP: number,
    level: number
}


const Friends = () => {
    const routProp = useParams()
    const [response, setResponse] = useState<friends_[]>([]);
    
    const Fetch = () => {
        Instanse.get<friends_[]>('/profile/friends/' + routProp.username)
        .then((res) => {
            setResponse(res.data)
        });
    }
    
    useEffect(() => {
            Fetch()
    }
    ,[routProp.username]);

    if(!response[0]){
        return(
            <>
                <h4 className="text-[#A8DADC]">Friends</h4>
                <div className="h-[95%] w-[100%] pt-[0%] Friend flex justify-start
                items-center flex-col">
                    {
                        Array(10).fill(null).map((v, k) => {
                            return(
                            <div key={k} className="opacity-[30%] m-[1%] flex h-[3vw] p-[2%] w-[100%] rounded-[2vw] friends-bar">
                                    <div className="h-[2.5vw] w-[2vw]"></div>
                            </div>
                        
                        )})
                    }
                </div>
            </>
        )
    }
    return(
        <>
        <h4 className="text-[#A8DADC]">Friends</h4>
        <div className="h-[95%] w-[100%] Friend">
        {
            response.map( (value, key) =>
                <div key={key} className="flex h-[3vw] w-[100%] m-[2%] rounded-[2vw] friends-bar ">
                    <Link className="h-[100%] w-[10%] av-bar" to={"/profile/" + value.username}>
                            <Avatar src={value.avatar} wd_="2.8vw"/>
                    </Link>
                    <div className="w-[15%] h-[100%]   flex justify-center items-center" >
                        <h3 className="text-[0.8vw] text-[#A8DADC]">{value.username}</h3>
                    </div>
                    <div className="w-[15%] h-[100%]   flex justify-center items-center">
                        <h3 className="text-[0.8vw] text-[#A8DADC]">{value.XP} xp</h3>
                    </div>
                    <div className="w-[15%] h-[100%]   flex justify-center items-center">
                        <h3 className="text-[0.8vw] text-[#A8DADC]">Lv {value.level}</h3>
                    </div>
                    <div className=" h-[90%] flex justify-center items-center">
                        <Button_ option="Invite"/>
                    </div>
                </div>
            )
        }
        </div>
    </>
    )
}

export default Friends