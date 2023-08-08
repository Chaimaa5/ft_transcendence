import React from 'react'
import style from './form.module.css'
import style2 from '../styleChat.module.css'
import edit_icon from '../../tools/btnsIcons/editIcon.svg' 
import { ReactSVG } from 'react-svg'
import useProtectedOn from '../ChatStore/useProtectedOn'
import useChannelData from '../ChatStore/useChannelData'

export const ChannelDataInputs = () => {
    const {updateChannelName, updateChannelPwd} = useChannelData();
    const {protectedOn} = useProtectedOn();

  return (
    <div className={'h-[7.5vw] w-[20vw] flex flex-col justify-between items-center '}>

    <div className={"relative h-[2.6vw] w-[17vw] "}>
      <input 
        type="text" 
        name="channelName" 
        id="channelName" 
        onChange={(e) => updateChannelName(e.target.value)}
        placeholder="Channel name" 
        className={[ style2.shdw , style2.st, style2.font2, " text-[0.8vw] absolute top-0 left-0 right-0 bottom-0 text-center bg-[#1D3557] rounded-[2vw] h-[100%] w-[100%] outline-none caret-[#457B9D]  focus:drop-shadow-lg text-[white]  "].join(" ")}/>
        <ReactSVG className={[style.icon_, "absolute top-[0.8vw] right-[0.6vw] w-[1vw]"].join(" ")} src={edit_icon}/>
    </div>


    <div className={"relative h-[2.6vw] w-[17vw] "}>
        <input 
        type="password" 
        name="channelPassword" 
        id="channelPassword" 
        placeholder="Change Password" 
        onChange={(e) => updateChannelPwd(e.target.value)}
        className={[style2.shdw ,style2.st, style2.font2," text-[0.8vw] absolute top-0 left-0 right-0 bottom-0 text-center bg-[#1D3557] rounded-[2vw] h-[100%] w-[100%] outline-none caret-[#457B9D] focus:drop-shadow-lg text-[white]  "].join(" ")}/>
        <ReactSVG className={[style.icon_, "absolute top-[0.8vw] right-[0.6vw] w-[1vw]"].join(" ")} src={edit_icon}/>
        {!protectedOn  && <div className={"absolute top-0 left-0 right-0 bottom-0  h-[100%] w-[100%] opacity-[50%] bg-gradient-to-br from-[#457B9D] to-[#1D3557] rounded-[2vw] "}></div>}
    </div>


</div>
  )
}
