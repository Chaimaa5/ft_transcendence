import React from 'react'
import { Rooms } from './Rooms/Rooms';
import Friends from '../profile/friends';
import { UserContent } from './UserContent';
import { ChatContent } from './ChatContent';



const Chat = () => {

  return (
    
    <div className={"flex flex-row justify-center items-center w-[100%] h-[44vw]"}>

        <div className={"w-[40%] h-[100%] pb-[1vw]  flex flex-col justify-center items-center"}>
          <div className={"w-[100%] h-[50%] flex items-center flex-col "}>
            <Friends/>
          </div>
          <Rooms/>
        </div>

        <div className={"w-[60%] h-[100%] p-[2vw] flex flex-col  "}>
            <UserContent/>
            <ChatContent/>
        </div>

    </div> 
  )
}

export default Chat;