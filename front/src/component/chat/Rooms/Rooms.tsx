import React, { useState } from 'react'
import { Room } from './Room'
import Style from "./styleRoom.module.css"
import useNewchannelCreate from '../ChatStore/useNewChannelCreate'
import useAllRooms from '../ChatStore/useAllRooms'


export const Rooms = () => {

  const {myRooms: rooms} =  useAllRooms();

  const {updateAddNewChannel} = useNewchannelCreate();

 

  return (
    <div className={"flex flex-col w-[100%] h-[90%] justify-center items-center   "}>


        <div className={[Style.frame, " relative w-[100%] h-[100%] rounded-[1.5vw]  bg-gradient-to-br from-[#1D3557] to-[#0F294F]  overflow-y-auto overflow-x-hidden"].join(" ")}>
          {rooms.map(e => <Room id={e.id} name={e.name} image={e.image} type={e.type} count={e.count} />)}
          
          <button onClick={() => updateAddNewChannel(true) } 
                  className="  bottom-[2%] left-[94%] sticky w-[1.8vw] rounded-full bg-[#457B9D] h-[1.8vw]  flex justify-center items-center ">
            <img src="./src/component/tools/btnsIcons/test.svg" className={" w-[1vw] "}/>
          </button>
        </div>
    </div>
  )
}
