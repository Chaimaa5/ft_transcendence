import React, { RefObject, useRef, useEffect  } from 'react'
import style from './styleChat.module.css'
import Avatar from '../avatar';
import useRequestedRoom from './ChatStore/useRequestedRoom';
import { MsgObj } from './ChatStore/useRequestedRoom';
import CrContext from "../context/context";
import { useContext } from 'react';
import { cntx } from '../context/context';
import useSocket from './ChatStore/useSocket';
import useRcvflag from './ChatStore/useRecieve';
import { InputMessage } from './InputMessage';
import useReload from './ChatStore/useReload';

interface recievedObj
{
  content: string,
  userId: string,
  avatar: string,
  ischannel: boolean
}

export const ChatContent = () => {
  const {setReloadDm} = useReload();
  const {roomData} = useRequestedRoom();
  const messages: MsgObj[] = [...roomData?.messages];
  const data: cntx = useContext(CrContext);
  const lastdivRef: RefObject<HTMLDivElement> = useRef(null);
  const chatContainerRef: RefObject<HTMLDivElement> = useRef(null);
  const {chatSocket} =  useSocket();
  const {setRcvFlag} = useRcvflag();


  useEffect(()=>{
    // lastdivRef?.current?.scrollIntoView({behavior: 'auto'});
    
    if(chatContainerRef && chatContainerRef.current)
      chatContainerRef.current.scrollTop = chatContainerRef.current?.scrollHeight
  },[roomData] )

  useEffect(()=>{
    if (chatSocket)
    {
      chatSocket.on("receiveMessage", (rcvData)=>{
        if (rcvData)
        {
          setRcvFlag()
          // setReloadDm();
        }
      })
    }
  }, [chatSocket])


  return (
    <div className={"w-[100%] h-[90%] bg-gradient-to-br from-[#457B9D] to-[#1D3557]  flex flex-col rounded-b-[2vw] mb-[-1vw] items-center "}>
        <div ref={chatContainerRef} className={ [style.font3,"w-[100%] h-[93%] overflow-y-auto mb-[1vw] "].join(" ")} >

            {
              messages?.map((message, i) =>  
                  {
                    
                    return <div key={i} 
                                className={(message?.id == parseInt(data?.id) ) ? 'flex  justify-start items-center w-[100%] pr-[1vw] flex-row-reverse' : 'flex  justify-start items-center w-[100%] pl-[1vw]  '}  > 
                                
                                  {roomData?.isChannel && <Avatar src={message?.avatar} wd_="2.5vw"/>}  

                                <div  className={[style.font3,( (message?.id != parseInt(data?.id) ) ? "text-[white]  text-[0.7vw] ml-[0.5vw] flex justify-center items-center rounded-br-[0.8vw] rounded-bl-[0.8vw] rounded-tr-[0.8vw] w-fit max-w-[80%]  pt-[0.5vw] pb-[0.5vw] pl-[0.7vw] pr-[0.5vw] border-[#457B9D] bg-[#457B9D] mb-[0.8vw] mt-[0.8vw]" : "text-[white]  text-[0.7vw] mr-[0.5vw] flex justify-center items-center rounded-br-[0.8vw] rounded-bl-[0.8vw] rounded-tl-[0.8vw] w-fit max-w-[80%]  pt-[0.5vw] pb-[0.5vw] pl-[0.7vw] pr-[0.5vw] border-[#457B9D] bg-[#457B9D] mb-[0.8vw] mt-[0.8vw]")].join(" ")}>
                                  
                                  {message?.content}
                                  
                                </div> 
                        </div> 
                  }
                )
              }
              {/* <div className=" " ref={lastdivRef}/> */}
        </div>
        <InputMessage/>
    </div>
  )
}
