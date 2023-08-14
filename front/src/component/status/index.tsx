import React, { useEffect, useState } from "react";
import "./index.scss"
import avatar_img from "../tools/sign/avatar.png"
import Avatar from "../avatar/index";
import { Value } from "sass";
import Instanse from "../api/api";

type status = [{
    status: boolean,
    username: string,
    avatar: string,
}]



const OfforOn = () => {
    let color = "#E63946";
    const [isOn, setStatus] = useState(false);
    const [data, SetData] = useState<status>();
    const [hName, SetHname] = useState(false)
    useEffect(() => {
        Instanse.get("/home/onlineFriends")
            .then((res) => {
                SetData(res.data);
                setStatus(res.data.status)
                console.log("fff")
            })
    },[])

    return(
        <div className="status-">
            {
                data?.map((value, key) => {
                    if(value.status) color = "#29F125";
                    return(
                        <div key={key} onMouseEnter={() => {SetHname(true)}}
                            onMouseLeave={() => {SetHname(false)}} className="cursor-pointer m-[5%] relative st-container-">
                            <div style={{background :color}} className="status-cr"></div>
                            <Avatar src={value.avatar} wd_="3vw" />
                            {hName && <div className="h-[0.8vw] w-[2vw] flex justify-center items-center rounded-[2vw] top-[0%] left-[-5%] absolute bg-[#457B9D]">
                                    <h1 className=" text-[0.3vw] text-[#A8DADC] ">{value.username}</h1>
                                </div>}
                        </div>
                    )
                })
            }
        </div>

    )
}


const Status = () => {
    
    return(
        <div className="container-status ">
            <OfforOn/>
        </div>
    )
}

export default Status;