import React from "react";
import avatar_img from "../tools/profile.png"
import Avatar from "../avatar/index";
import Button_ from "../button/index";
import topaz_img from "../tools/home/Topaz.png"
import Instanse from "../api/api";

const TopPlayers = () => {
    return(
        <div className="h-[3vw] w-[100%] mt-[1%] rounded-[2vw] topplayers">
            <div className="flex flex-calum items-center w-[20%] justify-evenly">
                <h4 className="text-[0.8vw] text-[#F1FAEE]">1</h4>
                <Avatar src={avatar_img} wd_="2.5vw"/>
                <h4 className="text-[0.8vw] text-[#F1FAEE]">mmoutawa</h4>
            </div>
            <h4 className="text-[0.8vw] text-[#F1FAEE]">2 Lv</h4>
            <h4 className="text-[0.8vw] text-[#F1FAEE]">2630 Xp</h4>
            <div className="flex flex-calum items-center w-[20%] justify-between pr-[1%]">
                <div className="flex flex-calum items-center justify-between">
                    <h4 className="text-[0.8vw] text-[#F1FAEE]">5 </h4>
                    <img className="h-[2vw]" src={topaz_img} />
                </div>
                <Button_ option="Invite"/>
            </div>
        </div>
    )
}

export default TopPlayers