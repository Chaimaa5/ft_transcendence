import React from "react";
import "./index.scss"
import { useRef } from "react";

type circle = {
    size: string
    pct: number
}

const CircularProg = ({size, pct}:circle) => {
    const windowSize = useRef([window.innerWidth, window.innerHeight]);
    const p = (1 - pct / 100 ) * (2 * (22 / 7) * ((windowSize.current[0] * 5) / 100));
    const x = (2 * (22 / 7) * ((windowSize.current[0] * 5) / 100));
    return(
        <div style={{width: size , height: size}} className="svg_circle">
            <svg className="h-[75%] w-[100%]">
                <circle  className="h-[100%] w-[100%] circle-line" cx={'50%'} cy={'55%'} r={'5vw'}> </circle>
                <circle style={{width: size,height: size, strokeDashoffset: p, strokeDasharray: x}} 
                    className="circular" cx={'50%'} cy={'55%'} r={'5vw'}> </circle>
            </svg>
            <div className="prog h-[20%] w-[100%]">
                <div className=" h-[100%] w-[40%] cr-prog">
                    <div className="cr bg-[#A8DADC]"></div>
                    <h5 className="text-[0.8vw] text-[#F1FAEE]">{pct}% Wins</h5>
                </div>
                <div className=" h-[100%] w-[40%] cr-prog">
                    <div className="cr bg-[#E63946]"></div>
                    <h5 className="text-[0.8vw] text-[#F1FAEE]">{100 - pct}% Losses</h5>
                </div>
            </div>
        </div>
    )
}

export default CircularProg