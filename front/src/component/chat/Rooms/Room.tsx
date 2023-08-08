import React from 'react'
import Avatar from '../../avatar'
import avatar_img from '../../tools/sign/avatar.png'
import { ReactSVG } from "react-svg";
import incon7 from "../../tools/btnsIcons/7.svg"
import Style from "./styleRoom.module.css"

interface Props
{
  id: number,
  name: string,
  image: string,
  count: string,
  type: string,
}

export const Room = ({id, name, image, count, type}: Props) => {
  // const roomName: string = "RoomXX"
  // const members: string = "10 Members";

  return (
    <div key={id} className={" h-[3.5vw] w-[90%] pl-[-9vw] bg-gradient-to-r from-[#457B9D] to-[#1D3557] rounded-[2vw] text-center m-[1vw] flex justify-around items-center "}>
      
        <Avatar src={image} wd_="3.5vw"/>
    
        <h3 className={[Style.font2, "text-[0.8vw] text-[#F1FAEE]"].join(" ")}>{name}</h3>
        <h3 className="text-[0.8vw] text-[#A8DADC]">{count}</h3>
        <button className="w-[1.8vw]  bg-[#457B9D] h-[1.8vw] rounded-full flex justify-center items-center">
            <ReactSVG className="w-[1vw]" src={incon7}/>
        </button>
    </div>
  )
}
