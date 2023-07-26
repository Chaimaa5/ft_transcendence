import React from "react";
import Avatar from "../avatar/index";
import Button_ from "../button/index";
import avatar_img from "../tools/profile.png"
import { useState, useEffect } from "react";
import axios from "axios";
import { animate, motion } from "framer-motion";


type friends_ = {
    id: string,
    username: string,
    avatar: string,
    XP: number,
    level: number
}


const Rooms = () => {
    const [response, setResponse] = useState<friends_[]>([]);
    const HandleProfile = () => {
      return axios
            .get<friends_[]>('/profile/friends/' + "mmoutawa", {withCredentials: true})
            .then((res) => {
                setResponse(res.data)
            })
    };
    useEffect(() => {
      HandleProfile();
    },[]);
    if(!response[0]){
        const addFriends = [1,2,3,4,5,6,7,8,9]
        return(
            <>
                <h4 className="text-[#A8DADC]">Rooms</h4>
                <div className="h-[95%] w-[100%] Friend flex justify-center
                items-center flex-col bg-gradient-to-tr  from-[#1D3557]  to-[#0F294F]  rounded-[2vw] overflow-y-auto ">
                    {
                        addFriends.map( (value, key) =>
                            <motion.div whileHover={{scale: 1.2, opacity: 0}}
                                 tabIndex={key} className="opacity-[30%] flex h-[3vw] w-[100%] m-[2%] ml-[5%] rounded-[2vw] friends-bar bg-black">
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
                <div className="flex h-[3vw] w-[100%] m-[2%] rounded-[2vw] friends-bar bg-black ">
                    <button onClick={() => {
                        return axios
                        .get<friends_[]>('/profile/friends/' + value.username, {withCredentials: true})
                        .then((res) => {
                            setResponse(res.data)
                    })
                    }} className="h-[100%] w-[10%] av-bar">
                        <Avatar src={avatar_img} wd_="2.5vw"/>
                    </button>
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

export default Rooms