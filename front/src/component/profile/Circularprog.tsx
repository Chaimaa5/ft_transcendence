import React, { useEffect, useState } from "react";
import "./index.scss"
import { useRef } from "react";
import { Progress } from "antd";
import Instanse from "../api/api";

interface circle {
    name: string
}

const CircularProg = ({name}) => {
    const [data, SetData] = useState<{win:number, loss:number}>()
    useEffect(() => {
        Instanse.get("/profile/statistics/" + name)
                .then((res) => {
                    SetData(res.data)
                })
    },[])


    return(
        <>
            <Progress type="circle" percent={data?.win}
                    className="flex justify-center items-center w-[100%] text-[5vw] h-[75%]"
                    strokeColor="#A8DADC"
                    trailColor="#E63946"
                    />
            <div className="prog h-[20%] w-[100%]">
                <div className=" h-[100%] w-[40%] cr-prog">
                    <div className="w-[1vw] h-[1vw] rounded-[50%] self-center bg-[#A8DADC]"></div>
                    <h4 className="text-[0.8vw] text-[#F1FAEE]">{data?.win}% Wins</h4>
                </div>
                <div className=" h-[100%] w-[40%] cr-prog">
                    <div className="w-[1vw] h-[1vw] rounded-[50%] self-center bg-[#E63946]"></div>
                    <h4 className="text-[0.8vw] text-[#F1FAEE]">{data?.loss}% Losses</h4>
                </div>
            </div>
        </>
    )
}

export default CircularProg