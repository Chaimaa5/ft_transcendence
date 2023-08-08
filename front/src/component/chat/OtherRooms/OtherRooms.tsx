import React from 'react'

import Style from "../Rooms/styleRoom.module.css"
import { OtherRoom } from './OtherRoom'
import useAllRooms from '../ChatStore/useAllRooms'


export default function OtherRooms() {
  const {otherRooms: rooms} = useAllRooms();

  return (
    <div className={"flex flex-col w-[100%] h-[90%] justify-center items-center   "}>






      <div className={[Style.frame, "  w-[100%] h-[100%] rounded-[1.5vw]  bg-gradient-to-br from-[#1D3557] to-[#0F294F]  overflow-y-auto overflow-x-hidden"].join(" ")}>
        {rooms.map(e => <OtherRoom id={e.id} name={e.name} image={e.image} type={e.type} count={e.count}/>)}
      </div>
    </div>
  )
}
