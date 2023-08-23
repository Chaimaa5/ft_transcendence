import React, { RefObject, useRef, useState } from 'react'
import { useParams } from 'react-router-dom';
import { ReactSVG } from 'react-svg';
import useSocket from './ChatStore/useSocket';
import style from './styleChat.module.css';
import icon from '../tools/button/Union.svg'


export const InputMessage = () => {
    const inputRef: RefObject<HTMLInputElement> = useRef(null);
    const [messageData, setMessagedata] = useState('');
    const {chatSocket} =  useSocket();
    const chatId = useParams().roomId;

    const sendMessage = () => {
  
        if (messageData != '' && chatSocket )
        {
          chatSocket.emit("sendMessage", {roomId: chatId, message: messageData})
          setMessagedata('')
        }
    }


  return (
        <form className={"w-[95%] h-[8%] bg-[#457B9D] rounded-[2vw] mb-[1vw] drop-shadow-xl flex justify-between "} >
            <input 
                ref={inputRef}
                type={"text"} 
                name={"message"} 
                placeholder={"Type out your message here..."} 
                className={[ style.font1 , "text-[0.8vw] w-[80%] text-[white] h-[100%] caret-[#1D3557]  outline-none bg-[#457B9D] rounded-[2vw]  pl-[0.8vw]"].join(" ")}
                onChange={(e)=> {e?.preventDefault; setMessagedata(e?.target?.value)}}/>
                
            <button type={'submit'} 
                    className={[style.font2, style.st, "w-[20%]  h-[90%] rounded-[2vw] flex justify-center items-center gap-[0.5vw]"].join(" ")}
                    onClick={(e) => {
                                        e.preventDefault();
                                        if(inputRef && inputRef.current)
                                            inputRef.current.value = '';

                                        sendMessage();
                                    }
                    }>
                <ReactSVG className="w-[0.7vw]" src={icon}/>
                <p className={"text-[0.7vw] text-[#A8DADC] "}>Send</p>
            </button>
        </form>
  )
}
