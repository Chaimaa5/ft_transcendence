import React, { useEffect } from 'react'

import avatar_img from '../tools/sign/avatar.png'
import Avatar from '../avatar'
import { ReactSVG } from "react-svg";
import incon1 from "../tools/btnsIcons/1.svg"
import incon3 from "../tools/btnsIcons/3.svg"
import incon5 from "../tools/btnsIcons/leaveIcon.svg"
import incon6 from "../tools/btnsIcons/setting.svg"
import useDisplayRoomSettings from './ChatStore/useDisplayRoomSettings';
import { RoomSettings } from './Rooms/RoomSettings';
import { useParams } from 'react-router-dom';
import Instanse from '../api/api';
import useRequestedRoom from './ChatStore/useRequestedRoom';
import { requestedChnlObj } from './ChatStore/useRequestedRoom';
import Style from './styleChat.module.css'
import useRcvflag from './ChatStore/useRecieve';



export const UserContent = () => {
    const { update} = useDisplayRoomSettings();
    const {rcvMsgFlag} = useRcvflag();
    const chatId = useParams().roomId;
    const {roomData, updateRoomData} = useRequestedRoom();
    

    



    useEffect(() => {

        Instanse.get<requestedChnlObj>(`/chat/message/${chatId}`)
        .then(res => updateRoomData(res?.data))

    }, [chatId, rcvMsgFlag])

  return (
    <div className={"relative w-[100%] h-[13%] bg-gradient-to-tr  from-[#457B9D]  to-[#1D3557]  rounded-t-[2vw]"} >
        <div className=" flex flex-col gap-[0.1vw] m-auto  w-[95%] justify-center  items-center  rounded-[2vw] mt-[-2.8vw]  cursor-pointer ">
            <Avatar src={roomData?.image} wd_="5vw"/>
            <p className={[Style.font2, 'text-[0.8vw] text-[#A8DADC] h-[10%]'].join(" ")}>{roomData?.name}</p>
            {

                !roomData.isChannel && <div className={" w-[50%] flex justify-center items-center gap-[0.5vw]"}>
                    <button className="w-[1.3vw]  bg-[#457B9D] h-[1.3vw] rounded-full flex justify-center items-center">
                        <ReactSVG className="w-[0.6vw]" src={incon1}/>
                    </button>
                    {/* <button className="w-[1.8vw]  bg-[#457B9D] h-[1.8vw] rounded-full flex justify-center items-center">
                        <ReactSVG className="w-[1vw]" src={incon5}/>
                    </button> */}
                    <button className="w-[1.3vw]  bg-[#E63946] h-[1.3vw] rounded-full flex justify-center items-center">
                        <ReactSVG className="w-[0.7vw]" src={incon3}/>
                    </button>
                </div>
            }
        </div>

        { roomData.isChannel && 

            <button className="absolute top-[1vw] right-[1vw] w-[1.8vw]  h-[1.8vw] rounded-full flex justify-center items-center"
            onClick={()=>update(true)}>
                        <ReactSVG className="w-[0.8vw]" src={incon5}/>
            </button> }

        {  roomData.isChannel &&  <button className="absolute top-[1.2vw] left-[1.2vw] w-[1.8vw]  h-[1.8vw] rounded-full flex justify-center items-center"
            onClick={()=>update(true)}>
                        <ReactSVG className="w-[1vw]" src={incon6}/>
            </button>
        }
        

    </div>
  )
}
