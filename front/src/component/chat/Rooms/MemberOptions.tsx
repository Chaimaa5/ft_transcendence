import React, { useEffect, useState } from 'react'
import { ReactSVG } from 'react-svg'
import Avatar from '../../avatar'
import icon3 from "../../tools/btnsIcons/3.svg"
import icon10 from "../../tools/btnsIcons/6.svg"
import icon8 from "../../tools/btnsIcons/5.svg"
import icon9 from "../../tools/btnsIcons/4.svg"
import icon2 from "../../tools/btnsIcons/2.svg"
import icon1 from "../../tools/btnsIcons/1.svg"
import icon4 from "../../tools/btnsIcons/7.svg"
import icon7 from "../../tools/btnsIcons/arrow.svg"
import Style from "./styleRoom.module.css"
import useDisplayMembers from '../ChatStore/useDisplayMembers'
import { useNavigate } from 'react-router-dom'
import Instanse from '../../api/api'
import useSocket from '../ChatStore/useSocket'
import useReload from '../ChatStore/useReload'

interface Props{
    name_: string,
    usrId_: string,
    avatar_: string,
    DmroomId_: string
}


interface Infos
{
    isFriend:boolean,
    isSender: boolean,
    isReceiver: boolean,
    isBlocked: boolean
}

export const MemberOptions = ({name_, usrId_, avatar_, DmroomId_}: Props) => {
    
    const {setReloadMembers} = useReload();
    const [fetch, setFetchChange] = useState(0)
    const {setOff} =  useDisplayMembers();
    const nav = useNavigate();
    const {chatSocket} =  useSocket();
    const [memberInfo, setMemberinfo] = useState<Infos>({
                                                            isFriend: false,
                                                            isSender: false,
                                                            isReceiver:false,
                                                            isBlocked: false
                                                        })

    useEffect(() => {
        Instanse.get<Infos>(`/profile/user/${name_}`)
        .then(res => setMemberinfo(res.data))
    }, [fetch])

    const addFriend = () => {
        Instanse.get(`/user/add/${usrId_}`)
        .then(() => setFetchChange(fetch + 1))
    }

    const joinRoomSocket = () => {
        if (chatSocket && DmroomId_)
        {
          chatSocket.emit('joinChat', DmroomId_)
        }
    }

    const removeFriend = () => {
        Instanse.get(`/user/remove/${usrId_}`)
        .then(() => setFetchChange(fetch + 1))
    }

    const acceptFriend = ()=>{
        Instanse.get(`/user/accept/${usrId_}`)
        .then(() => setFetchChange(fetch + 1))
    }

    const cancelFriendReq = () => {
        Instanse.get(`/user/remove/${usrId_}`)
        .then(() => setFetchChange(fetch + 1))
    }

    const handleBlock = () => {
        if (!memberInfo.isBlocked)
        {
            
            Instanse.get(`/user/block/${usrId_}`)
            .then(() => {setFetchChange(fetch + 1); setReloadMembers(); setOff()})
        }
        // else
        // {
        //     Instanse.get(`/user/unblock/${usrId_}`)
        //     .then(() => setFetchChange(fetch + 1))
        // }
    }

    const inviteToPlay = () => {
        Instanse.post('/game/create-challenge-game', {isPlayerInvited: true, rounds: 3, pointsToWin: 5, isFlashy: false, isDecreasingPaddle: true, Player: name_}).then((response) => {
            
            nav('/game/' + response.data + "/challenge");
        }); 
    }

  return (
    <div   className={[Style.frame2, " h-[3.5vw] w-[90%] pl-[-9vw] bg-gradient-to-r from-[#457B9D] to-[#1D3557] rounded-[2vw] text-center m-[1vw] flex justify-evenly items-center  "].join(" ")}>
        
          
        <button  onClick={() => nav(`/profile/${name_}`)}
                  className={'flex justify-center items-center  rounded-full w-[3.5vw] h-[3.5vw]'}>
            <Avatar src={avatar_} wd_="100%"/>
          </button>
        
        <h3 className={[Style.font2, "text-[0.8vw] text-[#F1FAEE] w-[30%]"].join(" ")}>{name_}</h3>

        <div className={'flex justify-evenly items-center w-[35%] h-[100%]'}>

            <button     onClick={inviteToPlay} 
                        className="w-[1.5vw]  bg-[#457B9D] h-[1.5vw] rounded-full flex justify-center items-center">
                <ReactSVG className="w-[0.8vw]" src={icon1}/>
            </button>

            {
                memberInfo?.isFriend &&
                <button onClick={removeFriend}
                        className="w-[1.5vw]  bg-[#457B9D] h-[1.5vw] rounded-full flex justify-center items-center">
                    <ReactSVG className="w-[0.8vw]" src={icon8}/>
                </button>

                ||

                !memberInfo?.isFriend && !memberInfo?.isReceiver && !memberInfo?.isSender  &&
                <button onClick={addFriend}
                        className="w-[1.5vw]  bg-[#457B9D] h-[1.5vw] rounded-full flex justify-center items-center">
                    <ReactSVG className="w-[0.8vw]" src={icon2}/>
                </button>

                ||

                memberInfo?.isSender && 
                <button onClick={acceptFriend}
                        className="w-[1.5vw]  bg-[#15B86A] h-[1.5vw] rounded-full flex justify-center items-center">
                    <ReactSVG className="w-[0.8vw]" src={icon9}/>
                </button>

                || 

                memberInfo?.isReceiver && 
                <button onClick={cancelFriendReq}
                        className="w-[1.5vw]  bg-[#457B9D] h-[1.5vw] rounded-full flex justify-center items-center">
                    <ReactSVG className="w-[0.8vw]" src={icon8}/>
                </button>
            }

            {
                memberInfo?.isSender && 
                <button onClick={cancelFriendReq}
                        className="w-[1.5vw]  bg-[#E63946] h-[1.5vw] rounded-full flex justify-center items-center">
                    <ReactSVG className="w-[0.8vw]" src={icon10}/>
                </button> 
            }


            {
                memberInfo?.isFriend &&
                    
                <button  onClick={() => {
                                            if (DmroomId_)
                                            {
                                                nav(`/chat/${DmroomId_}`);
                                                joinRoomSocket();
                                            }
                                        }
                                }
                        className="w-[1.5vw]  bg-[#457B9D] h-[1.5vw] rounded-full flex justify-center items-center">
                    <ReactSVG className="w-[0.8vw]" src={icon4}/>
                </button>
                    
            }

            <button onClick={handleBlock}
                    className="w-[1.5vw]  bg-[#E63946] h-[1.5vw] rounded-full flex justify-center items-center">
                <ReactSVG className="w-[0.8vw]" src={icon3}/>
            </button>
        </div>

        <button 
            onClick={setOff}
            className="w-[1.8vw]  bg-[#A8DADC] h-[1.8vw] rounded-full flex justify-center items-center">
            <ReactSVG className="w-[1vw]" src={icon7}/>
        </button>

    </div>   
  )
}
