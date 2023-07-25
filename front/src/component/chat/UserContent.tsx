import React from 'react'

import avatar_img from '../tools/sign/avatar.png'
import Avatar from '../avatar'
import { ReactSVG } from "react-svg";
import incon1 from "../tools/btnsIcons/1.svg"
import incon3 from "../tools/btnsIcons/3.svg"
import incon5 from "../tools/btnsIcons/5.svg"



export const UserContent = () => {
  return (
    <div className={"w-[100%] h-[13%] bg-gradient-to-tr  from-[#457B9D]  to-[#1D3557]  rounded-t-[2vw]"} >
        <div className=" flex flex-col gap-[0.8vw] m-auto h-[68%] w-[95%] justify-center rounded-[2vw] mt-[-0.8vw] items-center cursor-pointer ">
            <Avatar src={avatar_img} wd_="5vw"/>
            <div className={" w-[50%] flex justify-center items-center gap-[1vw]"}>
                <button className="w-[1.8vw]  bg-[#457B9D] h-[1.8vw] rounded-full flex justify-center items-center">
                    <ReactSVG className="w-[1vw]" src={incon1}/>
                </button>
                <button className="w-[1.8vw]  bg-[#E63946] h-[1.8vw] rounded-full flex justify-center items-center">
                    <ReactSVG className="w-[1vw]" src={incon5}/>
                </button>
                <button className="w-[1.8vw]  bg-[#E63946] h-[1.8vw] rounded-full flex justify-center items-center">
                    <ReactSVG className="w-[1vw]" src={incon3}/>
                </button>
            </div>
        </div>
    </div>
  )
}
