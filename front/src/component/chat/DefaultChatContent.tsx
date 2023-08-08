import React from 'react'
import { ReactSVG } from 'react-svg'
import DefaultChatIcon from '../tools/btnsIcons/DefaultChat.svg'

export const DefaultChatContent = () => {
  return (
    <div className={"w-[100%] h-[100%] bg-gradient-to-br from-[#457B9D] to-[#1D3557] rounded-[2vw] flex flex-col justify-end items-center pb-[9%] "}>
        <ReactSVG className={ "w-[90%]"} src={DefaultChatIcon}/>
    </div>
  )
}
