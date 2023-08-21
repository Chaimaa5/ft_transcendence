import React from 'react'
import style from './setRoom.module.css'
import { SetRoomMembersList } from './SetRoomMembersList'
import { SetRoomData } from './SetRoomData'
import { ReactSVG } from 'react-svg'
import cancel_icon from '../../tools/btnsIcons/cancelIcon.svg' 
import useDisplayRoomSettings from '../ChatStore/useDisplayRoomSettings'
import useChannelData from '../ChatStore/useChannelData'
import useProtectedOn from '../ChatStore/useProtectedOn'
import useChannelAvatar from '../ChatStore/usechannelAvatar'
import avatar_img from '../../tools/sign/avatar.png'


export const RoomSettings = () => {
  const { update, myPrev} = useDisplayRoomSettings();
  const {updateChannelName,  updateChannelPwd, updateChannelType, updateChannelAvatar } = useChannelData();
  const { setProtectedOn} = useProtectedOn();
  const {setImg} = useChannelAvatar();

  const cancelClick = ()=>{
    update(false);
    updateChannelName("");
    updateChannelPwd("");
    updateChannelType('public');
    updateChannelAvatar("");    
    setProtectedOn(false);
    setImg(avatar_img);
  }

  return (
    <div className={[style.colorBg, "absolute top-0 left-0 right-0 bottom-0 flex  justify-center items-center"].join(" ")}>

        <div className={[style.gradientBg, '  relative flex justify-center items-center w-[50vw] h-[27vw] rounded-[2vw]'].join(" ")}>

          {myPrev === 'owner' && <SetRoomData/>}

          <div className={[style.nop, 'w-[50%] h-[100%] flex justify-center  items-center'].join(" ")}>
              <SetRoomMembersList/>
          </div>

          <button onClick={cancelClick}
                  className=" absolute top-[0.7vw] right-[0.7vw] w-[1.4vw] rounded-full bg-[#E63946] h-[1.4vw]  flex justify-center items-center ">
            <ReactSVG className={ "w-[0.7vw]"} src={cancel_icon}/>
          </button>

        </div>
    
    </div>
  )
}
