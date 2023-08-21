import React from 'react'
import cancel_icon from '../../tools/btnsIcons/cancelIcon.svg' 
import { ReactSVG } from 'react-svg'
import useNewchannelCreate from '../ChatStore/useNewChannelCreate'
import useChannelData from '../ChatStore/useChannelData'
import useProtectedOn from '../ChatStore/useProtectedOn'
import useChannelAvatar from '../ChatStore/usechannelAvatar'
import avatar_img from '../../tools/sign/avatar.png'


export const CancelForm = () => {
  const {setImg} = useChannelAvatar();
    const {updateAddNewChannel} = useNewchannelCreate();
    const {updateChannelName,  updateChannelPwd, updateChannelType, updateChannelAvatar } = useChannelData();
    const { setProtectedOn} = useProtectedOn();

    const handleClick = () => {
      updateAddNewChannel(false);
      updateChannelName("");
      updateChannelPwd("");
      updateChannelType('public');
      updateChannelAvatar("");    
      setProtectedOn(false);
      setImg(avatar_img);
    }

  return (
    <button onClick={handleClick} className=" absolute top-[0.7vw] right-[0.7vw] w-[1.4vw] rounded-full bg-[#E63946] h-[1.4vw]  flex justify-center items-center ">
        <ReactSVG className={ "w-[0.7vw]"} src={cancel_icon}/>
    </button>      
  )
}
