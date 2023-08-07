import React, { useState } from "react"
import logo from '../tools/header/logo.svg'
import notfication from '../tools/header/notification.svg';
import logout from '../tools/header/logout.svg';
import './index.scss';
import { ReactSVG } from "react-svg";
import SearchIcon from "../tools/Search.svg"
import axios from "axios";
import Avatar from "../avatar/index";

type search_ = {
    username: string,
    avatar: string
}


const Search = () => {
    const [txt, settxt] = useState(true)
    const [Value, setValue] = useState("");
    const [status, setStatus] = useState(0);
    const [response, setResponse] = useState<search_[]>([])
    return(
        <>
            <input onClick={() => settxt(false)}  className="search-box m-[2.5%] w-[20%] h-[35%]" 
                type="text"
                value={Value}
                placeholder="Search..."
                onChange={(event) => {
                    setValue(event.target.value);
                    if(Value[0]){
                        let input = {Value}
                        return axios
                        .post('http://localhost:3000/home/search', input, {withCredentials: true})
                        .then((res) => {
                            setResponse(res.data)
                        });
                    }
                    if(event.target.value.length <= 0) setResponse([]);
                }}
             />
            <ReactSVG className="search-icon mr-[10%] w-[1vw]" src={SearchIcon}/>
            {
                response[0] && Value.length != 0 &&
                <div className="search-list rounded-[1vw] absolute h-[12vw] z-[1000] w-[17%] top-[80%] left-[4%]">
                    {
                        response.map((value)=> {
                            return(
                                <div className="flex m-[2%] h-[2.5vw] w-[95%] justify-evenly rounded-[2vw] items-center border-[0.1vw] border-[#F1FAEE]">
                                    <Avatar src={value.avatar} wd_="2vw"/>
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
    return(
        <div className="notfication-box">
            
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