import React, { useEffect, useState } from "react";
import { ReactSVG } from "react-svg";
import incon1 from "../tools/btnsIcons/1.svg"
import incon2 from "../tools/btnsIcons/2.svg"
import incon3 from "../tools/btnsIcons/3.svg"
import incon4 from "../tools/btnsIcons/4.svg"
import incon5 from "../tools/btnsIcons/5.svg"
import incon6 from "../tools/btnsIcons/6.svg"
import incon7 from "../tools/btnsIcons/7.svg"
import Instanse from "../api/api";

type profile_btn = {
    id: string,
    isOwner: boolean,
    isFriend: boolean,
    isSender: boolean,
    isReceiver: boolean,
    isBlocked: boolean
}

const UserBtns = ({username}) => {

    const [data, SetData] = useState<profile_btn>();
    useEffect(() =>{
    Instanse.get("/profile/user/" + username)
            .then((res) => {
                SetData(res.data);
            })
    },[data])
    let icon = incon2
    if(data?.isFriend || data?.isReceiver) icon = incon5
    return(
        <div className="flex h-[100%] w-[100%] userBtns">
            {data?.isSender &&
                <div className="flex h-[100%] w-[48%] items-end">
                    <button onClick={() => {
                        Instanse.get("/user/block/" + data?.id);
                    }} className="w-[1.8vw] mr-[1%] bg-[#E63946] h-[1.8vw] rounded-full flex justify-center items-center">
                        <ReactSVG className="w-[0.8vw]" src={incon6}/>
                    </button>
                    <button onClick={()=> {
                        Instanse.get("/user/accept/" + data.id);}} className="w-[1.8vw] mr-[1%] bg-[#15B86A] h-[1.8vw] rounded-full flex justify-center items-center">
                        <ReactSVG className="w-[1vw]" src={incon4}/>
                    </button>
                </div>
            }
            <div className="flex h-[100%] w-[50%] justify-end items-end">
                <button className="w-[1.8vw] mr-[1%] bg-[#457B9D] h-[1.8vw] rounded-full flex justify-center items-center">
                    <ReactSVG className="relative left-[5%] w-[0.8vw]" src={incon1}/>
                </button>
                <button className="w-[1.8vw] mr-[1%] bg-[#457B9D] h-[1.8vw] rounded-full flex justify-center items-center">
                    <ReactSVG className="relative top-[5%] w-[0.8vw]" src={incon7}/>
                </button>
                <button onClick={() => {
                    if(data?.isFriend || data?.isReceiver)
                        Instanse.get("/user/remove/" + data?.id);
                        else Instanse.get("/user/add/" + data?.id);
                }} className="w-[1.8vw] mr-[1%] bg-[#457B9D] h-[1.8vw] rounded-full flex justify-center items-center">
                    <ReactSVG className="relative left-[5%] w-[1vw]" src={icon}/>
                </button>
                <button className="w-[1.8vw] mr-[1%] bg-[#E63946] h-[1.8vw] rounded-full flex justify-center items-center">
                    <ReactSVG className="w-[1vw]" src={incon3}/>
                </button>
            </div>

        </div>
    )
}

export default UserBtns