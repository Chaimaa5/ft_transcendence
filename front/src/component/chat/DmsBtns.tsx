import React, { useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ReactSVG } from 'react-svg'
import Instanse from '../api/api'
import CrContext, { cntx } from '../context/context'
import incon1 from "../tools/btnsIcons/1.svg"
import incon3 from "../tools/btnsIcons/3.svg"
import { DmObj } from './ChatStore/useDms'
import useReload from './ChatStore/useReload'

interface Props{
  name_: string
}

interface Infos
{
    isFriend:boolean,
    isSender: boolean,
    isReceiver: boolean,
    isBlocked: boolean
}

export const DmsBtns = ({name_}: Props) => {
 
  const {setReloadDm} = useReload();
  const chatId = useParams().roomId;
  const nav = useNavigate();
  const [myDms, setMyDms] = useState<DmObj[]>([]);
  const [memberInfo, setMemberinfo] = useState<Infos>({
    isFriend: false,
    isSender: false,
    isReceiver:false,
    isBlocked: false
});

useEffect(() => {
  Instanse.get<DmObj[]>('/chat/rooms')
  .then((res) => {
    if (res && res.data && chatId)
      setMyDms(res.data.filter(e => e.id === parseInt(chatId)))
  } )
}, [])

useEffect(() => {
  Instanse.get<Infos>(`/profile/user/${name_}`)
  .then (res =>  setMemberinfo(res?.data)  )

}, [])

const handleBlock = () => {
  
    if (!memberInfo?.isBlocked && myDms?.length)
    {
      
        Instanse.get(`/user/block/${myDms[0].userId}`)
        .then(() => {nav('/chat'); setReloadDm()})
    }
}

const invite = () => {
  
    Instanse.post('/game/create-challenge-game', {isPlayerInvited: true, rounds: 3, pointsToWin: 5, isFlashy: false, isDecreasingPaddle: true, Player: name_}).then((response) => {
        nav('/game/' + response.data + "/challenge");
    });
}

  return (
    <div className={" w-[50%] flex justify-center items-center gap-[0.5vw]"}>
            <button onClick={invite}
                    className="w-[1.3vw]  bg-[#457B9D] h-[1.3vw] rounded-full flex justify-center items-center">
                <ReactSVG className="w-[0.6vw]" src={incon1}/>
            </button>
      { !memberInfo?.isBlocked &&

        <button onClick={handleBlock} 
                className="w-[1.3vw]  bg-[#E63946] h-[1.3vw] rounded-full flex justify-center items-center">
            <ReactSVG className="w-[0.7vw]" src={incon3}/>
        </button>
      }


    </div>
  )
}
