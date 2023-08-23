import React, { useState } from 'react'
import Style from '../Rooms/styleRoom.module.css'
import Avatar from '../../avatar'
import Button_ from '../../button';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import useSocket from '../ChatStore/useSocket'
import Instanse from '../../api/api';

interface Props{
    id: number,
    name: string,
    image: string,
    lastMsg: string,
    userId: string
}

export const Dm = ({id, name, image, lastMsg, userId}:Props) => {
    
    const {chatSocket} =  useSocket();
    const nav = useNavigate();

    const joinRoomSocket = () => {
        if (chatSocket)
          chatSocket.emit('joinChat', id)
    }

    const invite = () => {
        Instanse.post('/game/create-challenge-game', {isPlayerInvited: true, rounds: 3, pointsToWin: 5, isFlashy: false, isDecreasingPaddle: true, Player: name}).then((response) => {
            nav('/game/' + response.data + "/challenge");
        });
    }
  
    return (
        <Link to={"/chat/" + id}>
            <div 
                onClick={joinRoomSocket}
                className={" h-[3.5vw] w-[90%] pl-[-9vw] bg-gradient-to-r from-[#457B9D] to-[#1D3557] rounded-[2vw] text-center m-[1vw] flex justify-evenly items-center "}>
                
                    <Avatar src={image} wd_="3.5vw"/>
            
                    <h3 className={[Style.font2, "text-[0.8vw] text-[#F1FAEE] w-[30%]"].join(" ")}>{name}</h3>
                    <h3 className="text-[0.8vw] text-[#A8DADC] w-[20%]">{lastMsg}</h3>
                    <div className={'h-[2vw] w-[7vw] flex justify-center items-center '}>
                        <button type="button"  onClick={invite}>
                            <Button_ option="Play"/>
                        </button>
                    </div>
            </div>
        </Link>
    )
}
