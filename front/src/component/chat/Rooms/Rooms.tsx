import React from 'react'
import { Room } from './Room'
import Style from "./styleRoom.module.css"

import { ReactSVG } from "react-svg";
import incon1 from "../../tools/btnsIcons/test.svg"

export const Rooms = () => {
  const rooms = [1, 2, 3, 5, 6, 7, 8,9,1,2,3,4,5,6,7, 8,9,1,2,3,4,5,6,7,8,9,1,2,3,4,5,6,7]

  return (
    <div className={"flex flex-col w-[100%] h-[50%] justify-center items-center   "}>
        <div className={" w-[100%] h-[10%]  text-[#F1FAEE] text-[1.1vw] font-medium flex justify-center items-center"}>
            Rooms
        </div>
        <div className={"w-[100%] h-[90%] bg-gradient-to-br from-[#1D3557] rounded-[1.5vw] to-[#0F294F] flex flex-col  justify-center items-center gap-[0.5vw]"}>
        <div className={[Style.font2 , Style.frame, " w-[94%] h-[90.5%] mt-[1.5%] rounded-[1.5vw]  bg-gradient-to-br from-[#1D3557] to-[#0F294F]  overflow-y-auto overflow-x-hidden"].join(" ")}>
          {rooms.map(e => <Room/>)}
          
        </div>
          <button className=" ml-[92.5%]    w-[1.8vw] rounded-full bg-[#457B9D] h-[9.5%]  flex justify-center items-center ">
            <img src="./src/component/tools/btnsIcons/test.svg" className={" w-[1vw] "}/>
          </button>
        </div>
    </div>
  )
}
