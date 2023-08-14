import React, { useEffect, useState } from "react"
import logo from '../tools/header/logo.svg'
import notfication from '../tools/header/notification.svg';
import logout from '../tools/header/logout.svg';
import './index.scss';
import Instanse, {socket_} from "../api/api";
import { Link } from "react-router-dom";
import Notification from "./notifaction"
import Search from "./search"

const Header = () => {
    const [isHover, setIshover] = useState(false);
    return(
        <div className="header-">
            <div className="h-[100%] w-[9%] flex justify-center items-center">
                <img className="h-[50%]" src={logo}/>
            </div>
            <div className="left-[1%] h-[100%] w-[92%] flex justify-start items-center relative">
                <Search/>
            </div>
            <div className="h-[100%] w-[9%] flex justify-center items-center">
                <div className="notfication pr-[10%] w-[50%] relative"
                    onMouseEnter={() => { setIshover(true)}}
                    onMouseLeave={() => {setIshover(false)}}>
                    <img className="h-[1vw]" src={notfication}/>
                    {
                        isHover &&
                        <Notification/>
                    }
                </div>
                <Link to="/login" onClick={() => {
                    Instanse.get("/logout")
                }} className="w-[50%] pl-[10%]">
                    <img className="icon h-[1vw]" src={logout}/>
                </Link>
            </div>
        </div>
    )
}


export default Header