import React from 'react'
import avatar_img from '../../tools/sign/avatar.png'
import incon7 from "../../tools/btnsIcons/7.svg"
import Style from '../Rooms/styleRoom.module.css'
import { ReactSVG } from "react-svg";
import Avatar from '../../avatar'
import Button_ from '../../button';
import { useNavigate } from 'react-router-dom';


export const Dm = () => {
    const userName: string = "ridrissi"
    const last_msg: string = "Hello world!";

    const nav = useNavigate();
  
    return (
      <div className={" h-[3.5vw] w-[90%] pl-[-9vw] bg-gradient-to-r from-[#457B9D] to-[#1D3557] rounded-[2vw] text-center m-[1vw] flex justify-evenly items-center "}>
        
            <Avatar src={avatar_img} wd_="3.5vw"/>
      
            <h3 className={[Style.font2, "text-[0.8vw] text-[#F1FAEE]"].join(" ")}>{userName}</h3>
            <h3 className="text-[0.8vw] text-[#A8DADC]">{last_msg}</h3>
            <div className={'h-[2vw] w-[7vw] flex justify-center items-center '}>
                <button type="button"  onClick={() => nav('/home')}>
                    <Button_ option="Play"/>
                </button>
            </div>
      </div>
    )
}
