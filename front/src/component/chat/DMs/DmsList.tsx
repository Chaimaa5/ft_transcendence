import React from 'react'
import Style from "../Rooms/styleRoom.module.css"
import { Room } from '../Rooms/Room'
import style from '../Rooms/styleRoom.module.css'
import { Dm } from './Dm'

export const DmsList = () => {
  
  const rooms = [];
  
  

  return (
    <div className={"w-[100%] h-[50%] flex  justify-center items-center flex-col "}>

        <div className={[style.font3,  'text-[0.8vw] text-[#F1FAEE] w-[100%] h-[10%] flex justify-center items-center'].join(" ")}>Dms List</div>
        
            <div className={[Style.frame, "w-[100%] h-[90%] overflow-y-auto overflow-x-hidden"].join(" ")}>
              {rooms.map(e => <Dm/>)}
            </div>
        

    </div>
  )
}
