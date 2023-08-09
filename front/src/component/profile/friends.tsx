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
    username: string,
    avatar: string,
    XP: number,
    level: number
}


const Friends = () => {
    const routProp = useParams()
    const [response, setResponse] = useState<friends_[]>([]);
    
    const Fetch = async () => {
        await Instanse.get<friends_[]>('/profile/friends/' + routProp.username, {withCredentials: true})
        .then((res) => {
            setResponse(res.data)
        });
    }
    
    useEffect(
        () => {
            const FetchDt = async () => {await Fetch()}
            FetchDt()
        }
    ,[response]);
    if(!response[0]){
        const addFriends = [1,2,3,4,]
        return(
            <>
                <h4 className="text-[#A8DADC]">Friends</h4>
                <div className="h-[95%] w-[100%] Friend flex justify-center
                items-center flex-col">
                    {
                        addFriends.map( (value, key) =>
                            <motion.div whileHover={{scale: 1.2, opacity: 0}}
                                 tabIndex={key} className="opacity-[30%] flex h-[3vw] w-[100%] m-[2%] rounded-[2vw] friends-bar bg-black">
                            </motion.div>
                        )
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
                <div className="flex h-[3vw] w-[100%] m-[2%] rounded-[2vw] friends-bar bg-black">
                    <Link className="h-[100%] w-[10%] av-bar" to={"/profile/" + value.username}>
                            <Avatar src={value.avatar} wd_="2.5vw"/>
                    </Link>
                    <h3 className="text-[0.8vw] text-[#A8DADC]">{value.username}</h3>
                    <h3 className="text-[0.8vw] text-[#A8DADC]">{value.XP} xp</h3>
                    <h3 className="text-[0.8vw] text-[#A8DADC]">Lv {value.level}</h3>
                    <div className=" h-[90%]">
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