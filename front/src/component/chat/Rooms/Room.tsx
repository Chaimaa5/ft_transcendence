import React, { useContext, useEffect, useState } from 'react'
import Avatar from '../../avatar'
import avatar_img from '../../tools/sign/avatar.png'
import { ReactSVG } from "react-svg";
import icon7 from "../../tools/btnsIcons/7.svg"
import Style from "./styleRoom.module.css"
import { Link, useParams } from 'react-router-dom';
import { memberObj } from '../ChatStore/useRoomMembers';
import Instanse from '../../api/api';
import useSocket from '../ChatStore/useSocket';
import CrContext, { cntx } from '../../context/context';

interface Props
{
  id: number,
  name: string,
  image: string,
  count: string,
  type: string,
}

export const Room = ({id, name, image, count, type}: Props) => {
  // const [members, setMembers] = useState<memberObj[]>([]);
  const members = [{image: ""}, {image: ""}, {image: ""}, {image: ""}, {image: ""}, {image: ""}, {image: ""}, {image: ""}, {image: ""}, {image: ""}, {image: ""}]
  const {roomId : chatId} = useParams();
  // const userdata: cntx = useContext(CrContext);
  // useEffect(()=>{
    //   Instanse.get<memberObj[]>("/chat/roomMembers/" + chatId)
    //   .then(res => setMembers(res?.data))
    // }, [])
    console.log('roomId to join :' , id, "   -  ", chatId)
  const [isIn, SetIsin] = useState(false);
  const {chatSocket} =  useSocket();

  const joinRoomSocket = () => {
      if (chatSocket)
      {
        
        chatSocket.emit('joinChat', {roomId: id})
      }
  }

  // const displayMemberClick = () => {
  //   return (
  //     <div  key={id} className={[Style.frame2, "  h-[3.5vw] w-[90%] pl-[-9vw] bg-gradient-to-r from-[#457B9D] to-[#1D3557]] rounded-[2vw] text-center m-[1vw] flex justify-start  overflow-x-scroll overflow-y-hidden "].join(" ")}>
        
  //     {members?.map(e => {return <div onClick={displayMemberClick}
  //                                     className={' ml-[0.5vw] mr-[0.5vw] w-[3vw] h-[3vw] rounded-full flex-none pt-[0.3vw] '}>
  //                                   <Avatar src={avatar_img} wd_="2.7vw"/>
  //                                 </div>})}  
    
  //   </div>   
  //   )
  // }

  if (chatId && parseInt(chatId) == id)
  {

    return (
      <div  key={id} className={[Style.frame2, "  h-[3.5vw] w-[90%] pl-[-9vw] bg-gradient-to-r from-[#457B9D] to-[#1D3557]] rounded-[2vw] text-center m-[1vw] flex justify-start  overflow-x-scroll overflow-y-hidden "].join(" ")}>
        
        {members?.map(e => {return <div 
                                        // onClick={displayMemberClick}
                                        className={' ml-[0.5vw] mr-[0.5vw] w-[3vw] h-[3vw] rounded-full flex-none pt-[0.3vw] '}>
                                      <Avatar src={avatar_img} wd_="2.7vw"/>
                                    </div>})}  
      
      </div>
    )
  }
  
  console.log("room id :", id)

  return (
    <Link to={"/chat/" + id} >
      <div onClick={joinRoomSocket} key={id} className={" h-[3.5vw] w-[90%] pl-[-9vw] bg-gradient-to-r from-[#457B9D] to-[#1D3557] rounded-[2vw] text-center m-[1vw] flex justify-around items-center "}>
        
          <Avatar src={image} wd_="3.5vw"/>
      
          <h3 className={[Style.font2, "text-[0.8vw] text-[#F1FAEE]"].join(" ")}>{name}</h3>
          <h3 className="text-[0.8vw] text-[#A8DADC]">{count}</h3>
          <button className="w-[1.8vw]  bg-[#457B9D] h-[1.8vw] rounded-full flex justify-center items-center">
              <ReactSVG className="w-[1vw]" src={icon7}/>
          </button>
      </div>
    </Link>
  )
}
