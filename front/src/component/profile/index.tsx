import React, { useContext } from "react";
import { ReactSVG } from "react-svg";
import "./index.scss"
import Avatar from "../avatar/index";
import avatar_img from "../tools/profile.png"
import achv1_img from "../tools/achievement/1.png"
import achv2_img from "../tools/achievement/2.png"
import achv3_img from "../tools/achievement/3.png"
import achv4_img from "../tools/achievement/4.png"
import achv5_img from "../tools/achievement/5.png"
import Achievement from "./achievement";
import up_icon from "../tools/profile/up.svg"
import down_icon from "../tools/profile/down.svg"
import star_icon from "../tools/profile/star.svg"
import friends_icon from "../tools/profile/friends.svg"
import Friends from "./friends";
import Circularprog from "./Circularprog"
import Match from "./match";
import { useState, useEffect } from "react";
import axios from "axios";
import UserBtns from "./userBtns";
import Instanse from "../api/api";
import CrContext from "../context/context"
import { useParams } from "react-router-dom";
import { Progress } from "antd";
import { cntx } from "../app";

type achiev_ = {
    img: string,
    opty: boolean,
}
const achve: { isAchieved: boolean; imagePath: string }[] = [
    { isAchieved: false, imagePath: achv1_img  },
    { isAchieved: false, imagePath: achv2_img },
    { isAchieved: false, imagePath: achv5_img },
    { isAchieved: true, imagePath: achv3_img },
    { isAchieved: false, imagePath: achv4_img },

];

const Statisteque = ({svg, info, title}) => {
    return(
        <div className="profile-box">
            <div className="info-box">
                <ReactSVG className="relative top-[-25%] w-[2vw]" src={svg}/>
                <div className="h-[60%] flex flex-col relative bottom-[10%]">
                    <h4 className="text-[1vw] text-[#F1FAEE]">{title}</h4>
                    <h3 className="text-[1vw] text-[#F1FAEE]">{info}</h3>
                </div>
            </div>
        </div>
     )
    }


interface profile_ {
    username:  string,
    losses:  number,
    wins:  number,
    level:  number,
    xp:  number,
    rank:  number,
    friend: number,
    avatar: string
    isOwner: boolean,
    isFriend: boolean,
    isSender: boolean,
    isReceiver: boolean,
    isBlocked: boolean,
    progress: string,
}



const Profile = () => {
    const [response, setResponse] = useState<profile_>();
    const data = useContext<cntx>(CrContext)
    const username = useParams().username
    useEffect(() => {
        Instanse.get<profile_>('profile/' + username)
        .then((res) => {
            setResponse(res.data)
        });
    },[username]);
    
    if(response?.isBlocked) return

    
    return(
        <div className="Profile">
            <div className="half-container">
                <h3 className="text-[1vw] text-[#A8DADC] usr">{response?.username}</h3>
                <div className="child-container">
                    <div className="w-[80%] h-[100%] flex">

                    <div className="w-[37%] h-[100%] flex items-center justify-end">
                        <Statisteque svg={up_icon} info={response?.wins} title={"Wins"}/>
                        <Statisteque svg={down_icon} info={response?.losses} title={"Losses"}/>
                    </div>
                    <div className="flex h-[100%] w-[26%] items-center justify-center">
                        {response && <Avatar src={response.avatar} wd_="10vw"/>}
                    </div>
                        <div className="w-[37%] h-[100%] flex items-center justify-start">
                            <Statisteque svg={friends_icon} info={response?.friend} title={"Friends"}/>
                            <Statisteque svg={star_icon} info={response?.rank} title={"Rank"}/>
                        </div>
                    </div>
                    <div className="w-[100%] h-[50%] user-btns">
                        {!response?.isOwner && <UserBtns username={username}/>}
                    </div>
                </div>

                <div className="lv-profile">
                    <h4 className="text-[#A8DADC]">Lv {response?.level}</h4>
                    <div className="w-[80%] h-[23%] sp-lv">
                        <div style={{width: response?.progress}} className="w-[60%] h-[100%] main-lv"></div>
                    </div>
                    <h4 className="text-[#A8DADC]">{response?.xp} Xp</h4>
                </div>

                <div className="achievement">
                        <Achievement name={username}/>
                </div>
            </div>
            <div className="w-[100%] h-[50%] flex p-right-[1%]">
                <div className="h-[100%] w-[50%] flex items-center flex-col">
                    <Friends/>
                </div>
                <div className="h-[100%] w-[50%] flex justify-between items-center">
                    <div className="w-[45%] h-[90%] flex justify-center items-center svg_circle flex-col">
                        <Circularprog name={response?.progress}/>
                    </div>
                    <div className="w-[55%] h-[100%] pr-[3%] matchs">
                        <Match/>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Profile;