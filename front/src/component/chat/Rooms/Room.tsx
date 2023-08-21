import React, { useContext, useEffect, useState } from 'react'
import Avatar from '../../avatar'
import { ReactSVG } from "react-svg";
import Style from "./styleRoom.module.css"
import { Link,  useParams } from 'react-router-dom';
import { memberObj } from '../ChatStore/useRoomMembers';
import Instanse from '../../api/api';
import useSocket from '../ChatStore/useSocket';
import CrContext, { cntx } from '../../context/context';
import icon8 from "../../tools/btnsIcons/messages.svg"
import useDisplayMembers from '../ChatStore/useDisplayMembers';
import { MemberOptions } from './MemberOptions';
import useReload from '../ChatStore/useReload';


interface Props
{
  id: number,
  name: string,
  image: string,
  count: string,
  type: string,
  index: number
}

interface displayMmbr{
  on: boolean,
  username: string,
  userId: string,
  avatar: string,
  DmroomId: string
}

export const Room = ({id, name, image, count, type, index}: Props) => {
  
  const {reloadMembers} = useReload();
  const displayMembers =  useDisplayMembers();
  const data: cntx = useContext(CrContext);
  const {roomId: chatId } = useParams();
  const [membersFetch, setMembers] = useState<memberObj[]>([]);
  const {chatSocket} =  useSocket();
  
  useEffect(()=>{
    Instanse.get<memberObj[]>("/chat/roomMembers/" + id)
    .then(res => setMembers(res?.data))
  }, [chatId, reloadMembers])
  
  const members = membersFetch?.filter(m => m.userId != data.id )

  const joinRoomSocket = () => {
      if (chatSocket)
        chatSocket.emit('joinChat', id)
  }

  if (displayMembers?.on && chatId && parseInt(chatId) == id)
    return (
      <MemberOptions name_={displayMembers?.username} usrId_={displayMembers?.userId} avatar_={displayMembers?.avatar} DmroomId_={displayMembers?.DmroomId}/>
    )

  if (chatId && parseInt(chatId) == id)
  {
    return (
      <div   className={[Style.frame2, "  h-[3.5vw] w-[90%] pl-[-9vw] bg-gradient-to-r from-[#457B9D] to-[#1D3557]] rounded-[2vw] text-center m-[1vw] flex justify-start  overflow-x-scroll overflow-y-hidden "].join(" ")}>
        
        {members?.map((e, i) => {return <div  key={i}
                                              onClick={() => displayMembers?.setDisplayMembers({
                                                        on: true, 
                                                        username: e.username, 
                                                        userId: e.userId, 
                                                        avatar: e.avatar, 
                                                        DmroomId: e.DmroomId
                                                      })}
                                        className={' ml-[0.5vw] mr-[0.5vw] w-[3vw] h-[3vw] rounded-full flex-none pt-[0.3vw] '}>
                                      <Avatar src={e.avatar} wd_="2.7vw"/>
                                    </div>})}  
      
      </div>
    )
  }
  

  return (
    <Link to={"/chat/" + id} >
      <div  onClick={joinRoomSocket} className={" h-[3.5vw] w-[90%] pl-[-9vw] bg-gradient-to-r from-[#457B9D] to-[#1D3557] rounded-[2vw] text-center m-[1vw] flex justify-around items-center "}>
        
          <Avatar src={image} wd_="3.5vw"/>
      
          <h3 className={[Style.font2, "text-[0.8vw] text-[#F1FAEE] w-[30%]"].join(" ")}>{name}</h3>
          <h3 className="text-[0.8vw] text-[#A8DADC] w-[20%]">{count + " Members"}</h3>
          <button className="w-[1.8vw]  bg-[#A8DADC] h-[1.8vw] rounded-full flex justify-center items-center">
              <ReactSVG className="w-[1vw]" src={icon8}/>
          </button>
      </div>
    </Link>
  )
}
