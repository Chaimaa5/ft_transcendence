import React, { useState, RefObject, useRef, useEffect  } from 'react'
import style from './styleChat.module.css'
import icon from '../tools/button/Union.svg'
import { ReactSVG } from "react-svg";
import Avatar from '../avatar';
import avatar_img from '../tools/sign/avatar.png'
import useRequestedRoom, { requestedChnlObj } from './ChatStore/useRequestedRoom';
import { MsgObj } from './ChatStore/useRequestedRoom';
import CrContext from "../context/context";
import { useContext } from 'react';
import { cntx } from '../context/context';
import Instanse, { socket_ } from '../api/api';
import { useParams } from 'react-router-dom';
import useSocket from './ChatStore/useSocket';
import useRcvflag from './ChatStore/useRecieve';

function getRandomNumberBasedOnTime() {
    const currentTime = new Date();
    const milliseconds = currentTime.getMilliseconds();
    const randomSeed = milliseconds % 100; // Limit seed to a reasonable range
    const randomNumber = Math.floor(Math.random() * 100) + randomSeed;
  
    return randomNumber;
  }

interface recievedObj
{
  content: string,
  id: string,
  avatar: string,
  username: string,
}

export const ChatContent = () => {
    const {roomData, updateRoomData} = useRequestedRoom();
    let messages: MsgObj[] = [...roomData.messages.reverse()];
    const data: cntx = useContext(CrContext);
    const [messageData, setMessagedata] = useState('');
    const inputRef: RefObject<HTMLInputElement> = useRef(null);
    const chatContainerRef: RefObject<HTMLDivElement> = useRef(null);
    // console.log("daaaaataa: "  ,data)
    const chatId = useParams().roomId;
    const {chatSocket} =  useSocket();
    const [recieveMsg, setRecieveMsg] = useState(0)
    const {setRcvFlag} = useRcvflag();

    const sendMessage = () => {
      console.log("messageData:", messageData )



      if (messageData != '' && chatSocket ){

        chatSocket.emit("sendMessage", {roomId: chatId, message: messageData})
        console.log('here')
        // setClearInput(true);
      }
      // if(inputRef && inputRef.current)
      //  inputRef.current.value = '';
    }

    // useEffect(()=>{
    //   Instanse.get<requestedChnlObj>(`/chat/message/${chatId}`)
    //   .then(res => {
    //     messages = res.data.messages
    //     // setRecieveMsg(recieveMsg + 1)
    //   }) 

    // }, [recieveMsg])

    // useEffect(()=>{
      if (chatSocket)
      {
        chatSocket.on("receiveMessage", (rcvData)=>{
          if (rcvData)
          {
            console.log("rcvData: ", messages)
            setRcvFlag()
            // setRecieveMsg(true);

            // Instanse.get<requestedChnlObj>(`/chat/message/${chatId}`)
            // .then(res => {
            //   updateRoomData(res?.data)
            // })

            // setRecieveMsg(recieveMsg + 1)
            
          }
        })
      }
    // }, [chatSocket])

    useEffect(()=>{
      if (chatContainerRef && chatContainerRef.current)
        chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;

    }, [messageData] )

  return (
    <div className={"w-[100%] h-[90%] bg-gradient-to-br from-[#457B9D] to-[#1D3557]  flex flex-col rounded-b-[2vw]  items-center "}>
        <div ref={chatContainerRef} className={ [style.font3,"w-[100%] h-[93%] overflow-y-auto mb-[1vw] "].join(" ")} >

            {messages?.map((message) =>  <div key={message?.id + getRandomNumberBasedOnTime()} className={(message?.id == parseInt(data?.id) ) ? 'flex  justify-start items-center w-[100%] pr-[1vw] flex-row-reverse' : 'flex  justify-start items-center w-[100%] pl-[1vw]  '}  > {roomData?.isChannel && <Avatar src={message?.avatar} wd_="2.5vw"/>}  <div  className={[style.font3,( (message?.id != parseInt(data?.id) ) ? "text-[white]  text-[0.7vw] ml-[0.5vw] flex justify-center items-center rounded-br-[0.8vw] rounded-bl-[0.8vw] rounded-tr-[0.8vw] w-fit max-w-[80%]  pt-[0.5vw] pb-[0.5vw] pl-[0.7vw] pr-[0.5vw] border-[#457B9D] bg-[#457B9D] mb-[0.8vw] mt-[0.8vw]" : "text-[white]  text-[0.7vw] mr-[0.5vw] flex justify-center items-center rounded-br-[0.8vw] rounded-bl-[0.8vw] rounded-tl-[0.8vw] w-fit max-w-[80%]  pt-[0.5vw] pb-[0.5vw] pl-[0.7vw] pr-[0.5vw] border-[#457B9D] bg-[#457B9D] mb-[0.8vw] mt-[0.8vw]")].join(" ")}>{message?.content}</div> </div> )}
        </div>
        <div className={"w-[95%] h-[8%] bg-[#457B9D] rounded-[2vw] mb-[1vw] drop-shadow-xl flex justify-between "} >
            <input 
                  ref={inputRef}
                  type={"text"} 
                  name={"message"} 
                  placeholder={"Type out your message here..."} 
                  className={[ style.font1 , "text-[0.8vw] w-[80%] text-[white] h-[100%] caret-[#1D3557]  outline-none bg-[#457B9D] rounded-[2vw] focus:border-2 focus:border-[#38769c] focus:drop-shadow-lg pl-[0.8vw]"].join(" ")}
                  onChange={(e)=> {e.preventDefault; setMessagedata(e.target.value)}}/>
                  
            <button 
                    className={[style.font2, style.st, "w-[20%]  h-[90%] rounded-[2vw] flex justify-center items-center gap-[0.5vw]"].join(" ")}
                    onClick={() => {
                                // setMessagedata(inputRef?.current?.value || '')
                                // console.log("send msg 1")
                                      if(inputRef && inputRef.current)
                                      {
                                        // setMessagedata(inputRef.current.value)
                                        console.log("target value: " , inputRef.current.value )
                                        inputRef.current.value = '';
                                      }
                                      if (chatContainerRef && chatContainerRef.current)
                                        chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;

                                      sendMessage();
                                    }
                    }>
                <ReactSVG className="w-[0.7vw]" src={icon}/>
                <p className={"text-[0.7vw] text-[#A8DADC] "}>Send</p>
            </button>
        </div>
    </div>
  )
}
