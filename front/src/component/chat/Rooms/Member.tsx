import React, { useState } from 'react'
import Avatar from '../../avatar'
import avatar_img from '../../tools/sign/avatar.png'
import { ReactSVG } from "react-svg";
import adminIcon from "../../tools/btnsIcons/adminIcon.svg"
import starIcon from "../../tools/btnsIcons/starIcon.svg"
import Style from "./styleRoom.module.css"

export const Member = () => {
  const memberName: string = "member"
  const [muteTimerOn, setMuteTimerOn] = useState(false);
  

  return (
    <div className={"  mb-[-1.9vw] h-[3.5vw] w-[90%] pl-[-9vw] bg-[#457B9D] rounded-[2vw] text-center mt-[2.6vw] ml-[1vw] mr-[1vw] flex justify-evenly items-center "}>
      
        <div className={'relative w-[3vw] h-[3vw] rounded-full drop-shadow-xl flex justify-center items-center'}>
          <Avatar src={avatar_img} wd_="100%"/>
          <ReactSVG className="absolute w-[0.6vw] top-[12%] right-[9%] " src={starIcon}/>
        </div>
    
        <h3 className={[Style.font2, " ml-[2%] text-[0.7vw] text-[#A8DADC]"].join(" ")}>{memberName}</h3>
        <div className={[Style.font2, 'w-[10vw] h-[1.5vw]  flex justify-center items-center gap-[0.2vw] '].join(" ")}>
          <h3 className="flex justify-center items-center text-[0.7vw] text-[#E63946] w-[30%] h-[90%] rounded-[2vw] bg-[#1D3557]">{'Ban'}</h3>
          <h3 className="flex justify-center items-center text-[0.7vw] text-[#E63946] w-[30%] h-[90%] rounded-[2vw] bg-[#1D3557]">{'Kick'}</h3>

          <div  onMouseOver={() => setMuteTimerOn(true)}
          onMouseLeave={() => setMuteTimerOn(false)}
          className="relative flex justify-center items-center w-[30%] h-[90%] ">


            <h3 className="flex justify-center items-center text-[0.7vw] text-[#A8DADC] w-[100%] h-[100%] rounded-[2vw] bg-[#1D3557]" 
           
            >{'Mute'}</h3>
           {muteTimerOn && <div className={"absolute top-[-3vw] z-[200] right-[-1.8vw] rounded-[0.5vw] bg-[#A8DADC] w-[2.5vw] h-[3vw] flex flex-col justify-evenly items-center "} 
           onMouseOver={() => setMuteTimerOn(true)} onMouseLeave={() => setMuteTimerOn(false)}>
              <h3 className={[Style.font3, "flex justify-center items-center text-[0.5vw] text-[#1D3557] w-[100%] h-[10%] "].join(" ")}>{"4 Hours"}</h3>
              <h3 className={[Style.font3, "flex justify-center items-center text-[0.5vw] text-[#1D3557] w-[100%] h-[10%] "].join(" ")}>{"8 Hours"}</h3>
              <h3 className={[Style.font3, "flex justify-center items-center text-[0.5vw] text-[#1D3557] w-[100%] h-[10%] "].join(" ")}>{"1 Day"}</h3>
              <h3 className={[Style.font3, "flex justify-center items-center text-[0.5vw] text-[#1D3557] w-[100%] h-[10%] "].join(" ")}>{"1 Year"}</h3>
            </div>} 
          </div>

        </div>
        <button className="flex justify-center items-center w-[1.2vw]  bg-[#1D3557] h-[1.2vw] rounded-full ">
            <ReactSVG className="w-[0.6vw]" src={adminIcon}/>
        </button>
        
    </div>
  )
}
