import React from 'react'
import { Room } from './Room'
import Style from "./styleRoom.module.css"


export const Rooms = () => {
  const rooms = [1, 2, 3, 5, 6, 7, 8,9,1,2,3,4,5,6,7, 8,9,1,2,3,4,5,6,7,8,9,1,2,3,4,5,6,7]

  return (
    <div className={"flex flex-col w-[100%] h-[50%] justify-center items-center   "}>
        <div className={[Style.font2, " w-[100%] h-[10%]  text-[#F1FAEE] text-[1.1vw]  flex justify-center items-center"].join(" ")}>
            Rooms
        </div>
        <div className={[Style.frame, " relative w-[100%] h-[90%] rounded-[1.5vw]  bg-gradient-to-br from-[#1D3557] to-[#0F294F]  overflow-y-auto overflow-x-hidden"].join(" ")}>
          {rooms.map(e => <Room/>)}
          
          <button className=" absolute  bottom-[2%] left-[94%] sticky w-[1.8vw] rounded-full bg-[#457B9D] h-[1.8vw]  flex justify-center items-center ">
            <img src="./src/component/tools/btnsIcons/test.svg" className={" w-[1vw] "}/>
          </button>
        </div>
    </div>
  )
}
