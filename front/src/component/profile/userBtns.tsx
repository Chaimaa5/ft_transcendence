import React, { useEffect, useState } from "react";
import { ReactSVG } from "react-svg";
import incon1 from "../tools/btnsIcons/1.svg"
import incon2 from "../tools/btnsIcons/2.svg"
import incon3 from "../tools/btnsIcons/3.svg"
import incon4 from "../tools/btnsIcons/4.svg"
import incon5 from "../tools/btnsIcons/5.svg"
import incon6 from "../tools/btnsIcons/6.svg"
import incon7 from "../tools/btnsIcons/7.svg"
import Instanse from "../api/api";
import { useNavigate } from "react-router-dom";

type profile_btn = {
    id: string,
    isOwner: boolean,
    isFriend: boolean,
    isSender: boolean,
    isReceiver: boolean,
    isBlocked: boolean,
    DM: number
}

const UserBtns = ({username}) => {

    const [data, SetData] = useState<profile_btn>();
    const [count, SetCount] = useState(0)
    const nav = useNavigate()
    useEffect(() =>{
    Instanse.get("/profile/user/" + username)
            .then((res) => {
                SetData(res.data);
            })
    },[count])
    const invite = () => {
        Instanse.post('/game/create-challenge-game', {isPlayerInvited: true, rounds: 3, pointsToWin: 5, isFlashy: false, isDecreasingPaddle: true, Player: data?.id}).then((response) => {
            nav('/game/' + response.data + "/challenge");
        });
    }

    const directMessage = () =>{
            nav('/chat/' + data?.DM );
    }
    return(
        <div className="flex h-[100%] w-[100%] userBtns">
            {data?.isSender &&
                <div className="flex h-[100%] w-[48%] items-end">
                    <button onClick={() => {
                        Instanse.get("/user/remove/" + data.id).then(() => SetCount(count + 1));
                    }} className="w-[1.8vw] mr-[1%] bg-[#E63946] h-[1.8vw] rounded-full flex justify-center items-center">
                        <ReactSVG className="w-[0.8vw]" src={incon6}/>
                    </button>
                    <button onClick={()=> {
                        Instanse.get("/user/accept/" + data.id).then( () => SetCount(count + 1))}
                        } className="w-[1.8vw] mr-[1%] bg-[#15B86A] h-[1.8vw] rounded-full flex justify-center items-center">
                        <ReactSVG className="w-[1vw]" src={incon4}/>
                    </button>
                </div>
            }
            <div className="flex h-[100%] w-[50%] justify-end items-end">
                {/* game */}
                <button onClick={invite} className="hover:bg-DarkBlue w-[1.8vw] mr-[1%] bg-[#457B9D] h-[1.8vw] rounded-full flex justify-center items-center">
                    <ReactSVG className="relative fill-White left-[5%] w-[0.8vw]" src={incon1}/>
                </button>
                {/* chat */}
                {data?.isFriend &&
                    <button onClick={directMessage} className="w-[1.8vw] mr-[1%] bg-[#457B9D] h-[1.8vw] rounded-full flex justify-center items-center">
                        <ReactSVG className="relative top-[5%] w-[0.8vw]" src={incon7}/>
                    </button>
                }
                
                <button onClick={() => {
                    if(data?.isFriend || data?.isReceiver)
                    Instanse.get("/user/remove/" + data?.id).then(() => SetCount(count + 1))
                else Instanse.get("/user/add/" + data?.id).then(() => SetCount(count + 1))
                
                }} className="w-[1.8vw] mr-[1%] bg-[#457B9D] h-[1.8vw] rounded-full flex justify-center items-center">
                    <ReactSVG className="relative left-[5%] w-[1vw]" src={(data?.isFriend || data?.isReceiver) ? incon5 : incon2}/>
                </button>

                <button onClick={() => {
                    Instanse.get("/user/block/" + data?.id).then(() => SetCount(count + 1))
                }} className="w-[1.8vw] mr-[1%] bg-[#E63946] h-[1.8vw] rounded-full flex justify-center items-center">
                    <ReactSVG className="w-[1vw]" src={incon3}/>
                </button>
            </div>

        </div>
    )
}

export default UserBtns