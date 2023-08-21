import React, { useContext, useEffect } from 'react'
import Avatar from '../avatar'
import { ReactSVG } from "react-svg";
import incon5 from "../tools/btnsIcons/leaveIcon.svg"
import incon6 from "../tools/btnsIcons/setting.svg"
import useDisplayRoomSettings from './ChatStore/useDisplayRoomSettings';
import { useNavigate, useParams } from 'react-router-dom';
import Instanse from '../api/api';
import useRequestedRoom from './ChatStore/useRequestedRoom';
import { requestedChnlObj } from './ChatStore/useRequestedRoom';
import Style from './styleChat.module.css'
import useRcvflag from './ChatStore/useRecieve';
import { DmsBtns } from './DmsBtns';
import { memberObj } from './ChatStore/useRoomMembers';
import CrContext, { cntx } from '../context/context';
import useReload from './ChatStore/useReload';
import useSocket from './ChatStore/useSocket';


export const UserContent = () => {
    // const {chatSocket} =  useSocket();
    const {setReloadJoinedRooms, setReloadUnjoined} = useReload();
    const { update,  setPrev} = useDisplayRoomSettings();
    const {rcvMsgFlag} = useRcvflag();
    const chatId = useParams().roomId;
    const data: cntx = useContext(CrContext);
    const {roomData, updateRoomData} = useRequestedRoom();
    const nav = useNavigate();
    let allMembers: memberObj[] = [];

    
    const leaveChannel = () => {
        Instanse.get<memberObj[]>(`/chat/roomMembers/${chatId}`)
        .then((res) => {
                            if (res)
                                allMembers = res.data;
                             allMembers = allMembers?.filter(m => m.userId === data.id);
                             if (allMembers?.length)
                             {
                                Instanse.get(`/chat/leave/${allMembers[0].membershipId}`)
                                .then(() => {
                                    nav('/chat');
                                    setReloadJoinedRooms();
                                    setReloadUnjoined();

                                })
                             }
                        })
    }

    const handleSetting = () => {
        Instanse.get<memberObj[]>(`/chat/roomMembers/${chatId}`)
        .then((res) => {
            if (res)
            {
                let roomMmbrs : memberObj[] = [];
                roomMmbrs =  res.data?.filter(m => m.userId === data.id)
                if (roomMmbrs?.length)
                {
                    setPrev(roomMmbrs[0].role);
                    if (roomMmbrs[0].role != 'member')
                        update(true);
                }
            }
        })
    }

    useEffect(() => {
            
        Instanse.get<requestedChnlObj>(`/chat/message/${chatId}`)
        .then(res => updateRoomData(res?.data))

    }, [chatId, rcvMsgFlag])

    const redirectClick = () => {
        if (!roomData?.isChannel)
            nav(`/profile/${roomData?.name}`)
    }

    // useEffect(()=>{
        
    //     if (chatSocket && chatId)
    //         chatSocket.emit('joinChat', chatId)
        
    // })

  return (
    <div className={"relative w-[100%] h-[13%] bg-gradient-to-tr  from-[#457B9D]  to-[#1D3557]  rounded-t-[2vw]"} >
        <div className=" flex flex-col gap-[0.1vw] m-auto  w-[95%] justify-center  items-center  rounded-[2vw] mt-[-2.8vw]  cursor-pointer ">
            <button onClick={redirectClick} 
                    className={' w-[5vw] h-[5vw]'}>
                <Avatar src={roomData?.image} wd_="5vw"/>
            </button>
            <p className={[Style.font2, 'text-[0.8vw] text-[#A8DADC] h-[10%]'].join(" ")}>{roomData?.name}</p>
            {
                !roomData?.isChannel && <DmsBtns name_={roomData?.name } />
            }
        </div>

        { roomData?.isChannel && 

            <button className="absolute top-[1vw] right-[1vw] w-[1.8vw]  h-[1.8vw] rounded-full flex justify-center items-center"
                    onClick={leaveChannel}>
                        <ReactSVG className="w-[0.8vw]" src={incon5}/>
            </button> 
        }

        {  roomData?.isChannel  &&  <button className="focus:outline-none absolute top-[1.2vw] left-[1.2vw] w-[1.8vw]  h-[1.8vw] rounded-full flex justify-center items-center"
            onClick={handleSetting}>
                        <ReactSVG className="w-[1vw]" src={incon6}/>
            </button>
        }
        

    </div>
  )
}
