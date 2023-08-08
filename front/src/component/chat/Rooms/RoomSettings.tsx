import React, { useState } from 'react'
import style from './setRoom.module.css'
import { SetRoomMembersList } from './setRoomMembersList'
import { SetRoomData } from './setRoomData'
import { CancelForm } from '../form/CancelForm'
import { ReactSVG } from 'react-svg'
import cancel_icon from '../../tools/btnsIcons/cancelIcon.svg' 
import useDisplayRoomSettings from '../ChatStore/useDisplayRoomSettings'


export const RoomSettings = () => {
  const {On, update} = useDisplayRoomSettings();

  return (
    <div className={[style.colorBg, "absolute top-0 left-0 right-0 bottom-0 flex  justify-center items-center"].join(" ")}>
        <div className={[style.gradientBg, 'relative flex justify-center items-center w-[50vw] h-[27vw] rounded-[2vw]'].join(" ")}>



          <SetRoomData/>



            <div className={[style.nop, 'w-[50%] h-[100%] flex justify-center items-center'].join(" ")}>
                <SetRoomMembersList/>
            </div>




            <button onClick={() => update(false)} className=" absolute top-[0.7vw] right-[0.7vw] w-[1.4vw] rounded-full bg-[#E63946] h-[1.4vw]  flex justify-center items-center ">
              <ReactSVG className={ "w-[0.7vw]"} src={cancel_icon}/>
            </button>
        </div>
        
    </div>
  )
}
