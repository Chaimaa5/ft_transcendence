import React, { useEffect, useState } from "react"
import logo from '../tools/header/logo.svg'
import notfication from '../tools/header/notification.svg';
import logout from '../tools/header/logout.svg';
import './index.scss';
import { ReactSVG } from "react-svg";
import SearchIcon from "../tools/Search.svg"
import axios from "axios";
import Avatar from "../avatar/index";
import Instanse from "../api/api";
import { Link } from "react-router-dom";
import Av from "../tools/profile.png"
import incon6 from "../tools/btnsIcons/6.svg"
import incon4 from "../tools/btnsIcons/4.svg"





type search_ = {
    username: string,
    avatar: string
}


const Search = () => {
    const [txt, settxt] = useState(true)
    const [input, setValue] = useState("");
    const [status, setStatus] = useState(0);
    const [response, setResponse] = useState<search_[]>([])
    useEffect(
        () => {
            if(input){
                Instanse.post('/home/search', {input})
                .then((res) => {
                    setResponse(res.data)
                });
            } else setResponse([]) 
        },[input]
    )
    return(
        <>
            <input onClick={() => settxt(false)}  className="search-box m-[2.5%] w-[20%] h-[35%]" 
                type="text"
                value={input}
                placeholder="Search..."
                onChange={(event) => {
                    setValue(event.target.value);
                }}
             />
            <ReactSVG className="search-icon mr-[10%] w-[1vw]" src={SearchIcon}/>
            {
                response[0] && input.length != 0 &&
                <div className="search-list rounded-[1vw] absolute h-[12vw] z-[1000] w-[17%] top-[80%] left-[4%]">
                    {
                        response.map((value)=> {
                            return(
                                <div className="flex m-[2%] h-[2.5vw] w-[95%] justify-evenly rounded-[2vw] items-center border-[0.1vw] border-[#F1FAEE]">
                                    <Link to={"/profile/" + value.username}>
                                        <Avatar src={value.avatar} wd_="2vw"/>
                                    </Link>
                                    <h4 className="name">{value.username}</h4>
                                </div>
                            )
                        }
                    )}
                </div>
            }
        </>
    )
}


const Notification = () => {
    
    const GameNtf = () => {
        return(
            <div className=" p-[1%] flex m-[1%] h-[2.3vw] w-[95%] justify-between items-center hover:bg-[#A8DADC] rounded-[2vw]"> 
                    <Avatar src={Av} wd_="2vw"/>
                <h2 className="text-[#1D3557] text-[0.5vw]">hkhalil Challenged You To a Game</h2>
                <div className="h-[100%] w-[20%] flex justify-between items-center">
                    <button className="flex justify-center items-center h-[1vw] w-[1vw] rounded-[50%] bg-[#1D3557]">
                        <ReactSVG src={incon4} className="w-[70%]"/>
                    </button>
                    <button className=" flex justify-center items-center h-[1vw] w-[1vw] rounded-[50%] bg-[#E63946]">
                        <ReactSVG className="w-[55%]" src={incon6}/>
                    </button>
                </div>
            </div>
        )
    }

    const FriendNtf = () => {
        return(
            <div className="p-[1%] flex m-[1%] h-[2.3vw] w-[95%] justify-between items-center bg-[#A8DADC] rounded-[2vw]">
                    <Avatar src={Av} wd_="2vw"/>
                <h2 className="text-[#1D3557] text-[0.5vw]">mmoutawa: "Let's become friends!" </h2>
                <div className="h-[100%] w-[20%] flex justify-between items-center">
                    <button className="flex justify-center items-center h-[1vw] w-[1vw] rounded-[50%] bg-[#1D3557]">
                        <ReactSVG src={incon4} className="w-[70%]"/>
                    </button>
                    <button className=" flex justify-center items-center h-[1vw] w-[1vw] rounded-[50%] bg-[#E63946]">
                        <ReactSVG className="w-[55%]" src={incon6}/>
                    </button>
                </div>
            </div>
        )
    }
    
    
    
    return(
        <div className="notfication-box">
            <GameNtf/>
            <FriendNtf/>
        </div>
    )
}

const Header = () => {
    const [isHover, setIshover] = useState(false);
    return(
        <div className="header-">
            <div className="logo">
                <img className="h-[50%]" src={logo}/>
            </div>
            <div className="search">
                <Search/>
            </div>
            <div className="icons">
                <button className="notfication pr-[10%] w-[50%] relative"
                    onMouseEnter={() => { setIshover(true)}}
                    onMouseLeave={() => {setIshover(false)}}>
                    <img className="h-[1vw]" src={notfication}/>
                    {
                        isHover &&
                        <Notification/>
                    }
                </button>
                <button className="w-[50%] pl-[10%]">
                    <img className="icon h-[1vw]" src={logout}/>
                </button>
            </div>
        </div>
    )
}


export default Header