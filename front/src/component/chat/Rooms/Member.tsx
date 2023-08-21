import React, { useState } from 'react'
import Avatar from '../../avatar'
import { ReactSVG } from "react-svg";
import adminIcon from "../../tools/btnsIcons/adminIcon.svg"
import starIcon from "../../tools/btnsIcons/StarIcon.svg"
import Style from "./styleRoom.module.css"
import Instanse from '../../api/api';
import RemoveAdminIcon from "../../tools/btnsIcons/removeAdm.svg"
import useDisplayRoomSettings from '../ChatStore/useDisplayRoomSettings';
import useMemberAction from '../ChatStore/useMemberAction';

interface Props{
  membershipId: number,
  userId: string,
  username: string,
  avatar: string,
  role: string,
  isBanned: boolean,
  isMuted: boolean 
}

export const Member = ({membershipId, userId, username,  avatar, role, isBanned, isMuted } : Props) => {

  const { myPrev} = useDisplayRoomSettings();
  const [muteTimerOn, setMuteTimerOn] = useState(false);
  const {setAction} = useMemberAction();
  

  const postMuteRequest = (time: string) => {

    if (!isMuted)
      Instanse.post("/chat/mute/" + membershipId, {duration: time})
      .then(() => {setAction()})
  }
  
  const handleUnmute = () => {
    if (isMuted)
      Instanse.post("/chat/unmute/" + membershipId)
      .then(() => setAction())
  }
  
  const postKickRequest = () => {
    Instanse.get("/chat/kick/" + membershipId)
    .then(() => setAction())
  }
  
  const handleBan = () => {
    if (!isBanned)
    {
      Instanse.post("/chat/ban/" + membershipId)
      .then(() => setAction())
    }
    else
    {
      Instanse.post("/chat/unban/" + membershipId)
      .then(() => setAction())
    }
        
  }

  const handleAdmin = () => {
    if (role != 'admin')
      Instanse.post(`/chat/${membershipId}/setAdmin`)
      .then(() => setAction())
    else
      Instanse.get(`/chat/${membershipId}/unsetAdmin`)
      .then(() => setAction())
    
  }

  return (
    <div className={"  mb-[-1.9vw] h-[3.5vw] w-[90%] pl-[-9vw] bg-[#457B9D] rounded-[2vw] text-center mt-[2.6vw] ml-[1vw] mr-[1vw] flex justify-evenly items-center "}>
      
        <div className={'relative w-[3vw] h-[3vw] rounded-full drop-shadow-xl flex justify-center items-center'}>
          <Avatar src={avatar} wd_="100%"/>
          {(role === 'admin' || role === 'owner') && <ReactSVG className="absolute w-[0.6vw] top-[12%] right-[9%] " src={starIcon}/>}
        </div>
    
        <h3 className={[Style.font2, " ml-[2%] text-[0.7vw] text-[#A8DADC] w-[30%]"].join(" ")}>{username}</h3>

        { role != 'owner' &&
          <div className={[Style.font2, 'w-[10vw] h-[1.5vw]  flex justify-center items-center gap-[0.2vw] '].join(" ")}>
            <h3 onClick={handleBan}
            className="flex justify-center items-center text-[0.7vw] text-[#E63946] w-[30%] h-[90%] rounded-[2vw] bg-[#1D3557] cursor-pointer">{isBanned ?  'Unban' : 'Ban'}</h3>
            <h3 onClick={postKickRequest} 
                className="flex justify-center items-center text-[0.7vw] text-[#E63946] w-[30%] h-[90%] rounded-[2vw] bg-[#1D3557] cursor-pointer">{'Kick'}</h3>

            <div  onMouseOver={() => setMuteTimerOn(true)}
                onMouseLeave={() => setMuteTimerOn(false)}
                className="relative flex justify-center items-center w-[30%] h-[90%] ">


                  <h3 onClick={handleUnmute}
                  className="flex justify-center items-center text-[0.7vw] text-[#A8DADC] w-[100%] h-[100%] rounded-[2vw] bg-[#1D3557] cursor-pointer" 
                
                  >{ isMuted ?  'Unmute' : 'Mute'}</h3>
                {muteTimerOn && !isMuted && <div className={"absolute top-[-3vw] z-[200] right-[-1.8vw] rounded-[0.5vw] bg-[#A8DADC] w-[2.5vw] h-[3vw] flex flex-col justify-evenly items-center "} 
                onMouseOver={() => setMuteTimerOn(true)} onMouseLeave={() => setMuteTimerOn(false)}>
                    <h3 onClick={() => postMuteRequest("4 h")}
                        className={[Style.font3, "flex justify-center items-center text-[0.5vw] text-[#1D3557] w-[100%] h-[10%] cursor-pointer "].join(" ")}>{"4 H"}</h3>
                    <h3 onClick={() => postMuteRequest("8 h")} 
                        className={[Style.font3, "flex justify-center items-center text-[0.5vw] text-[#1D3557] w-[100%] h-[10%] cursor-pointer "].join(" ")}>{"8 H"}</h3>
                    <h3  onClick={() => postMuteRequest("1 d")}
                        className={[Style.font3, "flex justify-center items-center text-[0.5vw] text-[#1D3557] w-[100%] h-[10%] cursor-pointer "].join(" ")}>{"1 D"}</h3>
                    <h3 onClick={() => postMuteRequest("1 y")}
                        className={[Style.font3, "flex justify-center items-center text-[0.5vw] text-[#1D3557] w-[100%] h-[10%] cursor-pointer "].join(" ")}>{"1 Y"}</h3>
                  </div>} 
            </div>

          </div>
        }
        { myPrev === 'owner'  &&
            <button onClick={(handleAdmin)} 
                    className="flex justify-center items-center w-[1.2vw]  bg-[#1D3557] h-[1.2vw] rounded-full ">
                {role != 'admin'        && <ReactSVG className="w-[0.6vw]" src={adminIcon}/>}
                {role === 'admin'    && <ReactSVG className="w-[0.6vw]" src={RemoveAdminIcon}/>}
            </button>
        }
        
    </div>
  )
}
