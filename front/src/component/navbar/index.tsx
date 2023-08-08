import React from "react";
import { useState } from "react";
import "../navbar/index.scss"
import { ReactSVG } from "react-svg";
import home_icon from "../tools/navbar/home.svg"
import chat_icon from "../tools/navbar/chat.svg"
import setting_icon from "../tools/navbar/setting.svg"
import leader_icon from "../tools/navbar/leader.svg"
import profil_img from "../tools/navbar/profil.png" 
import avatar_img from "../tools/sign/avatar.png"
import Avatar from "../avatar";
import achievement from "../tools/arch.png"
import Profile from "../profile/index";
import Profile_effect from "../Profile_effect/index";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import CrContext from "../context/context";
import { useContext } from "react";
const Navbar = () => {
    const location = useLocation();  
    const [ishover_, sethover] = useState(false)
    const data = useContext(CrContext);
    return(
        <div className="navbar_">
            <div className="level-bar ">
                {location.pathname != "/profile" &&
                    <div className="container-lv bg-[#1D3557]">
                        <div className="info">
                            <h4>Lv</h4>
                            <h5 className="value">2.63</h5>
                        </div>
                        <div className="lv bg-[#A8DADC]">
                            <div className="lv-status h-[63%]">
                            </div>
                        </div>
                        <div className="info">
                            <h6 className="value">2630</h6>
                            <h4>Xp</h4>
                        </div>
                    </div>
                }
            </div>
            <div className="nav-bar" >
                <Link to={"/profile/" + data.username}>
                    <div className="profil_"
                        onMouseEnter={() => { sethover(true)}}
                        onMouseLeave={() => {sethover(false)}}
                        >
                        <Avatar src={avatar_img} wd_="4vw"/>
                        { ishover_ &&
                            <motion.div animate={{x: 15, y: 8}} className="Profile_effect"
                            >
                                <Profile_effect/>
                            </motion.div>
                        }
                    </div>
                </Link>
                <Link to={"/home"}>
                    <ReactSVG  className="icon-svg " src={home_icon}/>
                </Link>
                <Link to={"/leaderboord"}>
                    <ReactSVG className="icon-svg" src={leader_icon}/>
                </Link>
                <Link to={"/chat"}>
                    <ReactSVG className="icon-svg" src={chat_icon}/>
                </Link>
                <Link to="/setting">
                    <ReactSVG className="icon-svg" src={setting_icon}/>
                </Link>
                <span></span>
            </div>
        </div>
    )
    
}
export default Navbar