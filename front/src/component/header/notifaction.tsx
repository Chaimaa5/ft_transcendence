import React, { useEffect, useState } from "react";
import Instanse, { socket_ } from "../api/api";
import Avatar from "../avatar";
import { ReactSVG } from "react-svg";
import incon6 from "../tools/btnsIcons/6.svg"
import incon4 from "../tools/btnsIcons/4.svg"
import Av from "../tools/profile.png"
import { useNavigate } from "react-router-dom";


type not = [
    {
         id: number,
         type: string,
         status: boolean,
         sender: {
           id: string,
           username: string,
           avatar: string
         },
         gameId: number,
    }
]

const GameNtf = ({name, gameId, avatar}) => {
    const nav = useNavigate()
    return(
        <div className=" p-[1%] flex m-[1%] h-[2.3vw] w-[95%] justify-between items-center hover:bg-[#A8DADC] rounded-[2vw]"> 
                <Avatar src={avatar} wd_="2vw"/>
            <h2 className="text-[#1D3557] text-[0.5vw]">{name} Challenged You</h2>
            <div className="h-[100%] w-[20%] flex justify-between items-center">
                <button onClick={async () => {
					console.log("join game : "  + gameId);
					await Instanse.post("/game/join-game/" + gameId).then((res) => {
						nav("/game/" + gameId + "/challenge?accepted=true")
					});
                }} className="flex justify-center items-center h-[1vw] w-[1vw] rounded-[50%] bg-[#1D3557]">
                    <ReactSVG src={incon4} className="w-[70%]"/>
                </button>
                <button className=" flex justify-center items-center h-[1vw] w-[1vw] rounded-[50%] bg-[#E63946]">
                    <ReactSVG className="w-[55%]" src={incon6}/>
                </button>
            </div>
        </div>
    )
}

const FriendNtf = ({name, avatar, id}) => {
    return(
        <div className="p-[1%] flex m-[1%] h-[2.3vw] w-[95%] justify-between items-center bg-[#A8DADC] rounded-[2vw]">
                <Avatar src={avatar} wd_="2vw"/>
            <h2 className="text-[#1D3557] text-[0.5vw]">{name}: "Let's become friends!" </h2>
            <div className="h-[100%] w-[20%] flex justify-between items-center">
                <button onClick={() => {
                    Instanse.get("/user/accept/" + id)
                }} className="flex justify-center items-center h-[1vw] w-[1vw] rounded-[50%] bg-[#1D3557]">
                    <ReactSVG src={incon4} className="w-[70%]"/>
                </button>
                <button className=" flex justify-center items-center h-[1vw] w-[1vw] rounded-[50%] bg-[#E63946]">
                    <ReactSVG className="w-[55%]" src={incon6}/>
                </button>
            </div>
        </div>
    )
}

const FriendNtfAc = ({name, avatar, id}) => {
    return(
        <div className="p-[1%] flex m-[1%] h-[2.3vw] w-[95%] justify-evenly items-center bg-[#A8DADC] rounded-[2vw]">
                <Avatar src={avatar} wd_="2vw"/>
            <h2 className="text-[#1D3557] text-[0.5vw]">{name}: "Accepted your invitation!" </h2>
        </div>
    )
}

const Notification = () => {

    const [Data, SetData] = useState<not>();
    function test () {
        socket_('notifications').then((sk) => {
        sk.connect()
        sk.on("notifications", (data) => {
           SetData(data);
           console.log("notificaation data : ", data)
        });
    })
    }
    
    useEffect(() => {
        test()
    },[])
    
    return(
        <div className="notfication-box">
            
            {Data?.map((value, key) => {

                if(value.type == "Friendship invite")
                    return (
                        <FriendNtf  name={value.sender.username} avatar={value.sender.avatar} id={value.sender.id}/>
                    )
                else if(value.type == "Friendship acceptance")
					return (
						<FriendNtfAc  name={value.sender.username} avatar={value.sender.avatar} id={value.sender.id}/>
					)
					else if(value.type == "Game")
					return (
						<GameNtf  name={value.sender.username} gameId={value.gameId} avatar={value.sender.avatar}/>
						)
			})
            }
        </div>
    )
}

export default Notification