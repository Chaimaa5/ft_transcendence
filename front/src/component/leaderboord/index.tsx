import React from "react";
import cube from "../tools/leader/cube.png"
import Avatar from "../avatar/index";
import avatar_img from "../tools/profile.png"
import top1 from "../tools/achievement/1.png"
import top2 from "../tools/achievement/5.png"
import top3 from "../tools/achievement/4.png"
import TopPlayers from "./topplayers";
import "./index.scss"

const Leaderboord = () => {
    const achve: { isAchieved: boolean; imagePath: string }[] = [
        { isAchieved: true, imagePath:  "" },
        { isAchieved: false, imagePath: "" },
        { isAchieved: false, imagePath: "" },
        { isAchieved: true, imagePath:  ""},
        { isAchieved: true, imagePath:  ""},
        { isAchieved: false, imagePath: "" },
        { isAchieved: false, imagePath: "" },
        { isAchieved: false, imagePath: "" },
        { isAchieved: true, imagePath:  ""},
        { isAchieved: true, imagePath:  ""},
        { isAchieved: false, imagePath: "" },
        { isAchieved: false, imagePath: "" },
    ];
    return(
        <div className="leader-container h-[44vw] w-[100%]">
            <div className="h-[50%] w-[100%] top-3-players">
                <h1 className="h-[15%] text-[1vw] text-[#457B9D]">Leaderboard</h1>
                <div className="top-3 pt-[1%]">

                    <div className="h-[85%] w-[20%] m-[1%] leader-box">
                        <Avatar src={avatar_img} wd_="3.5vw"/>
                        <img className="h-[60%] w-[100%]" src={cube}/>
                        <div className="leader-info pt-[5%]">
                            <div className="text-center">
                                <h4 className="text-[1vw] text-[#A8DADC]">mmoutawa</h4>
                                <h4 className="text-[1vw] text-[#457B9D]">2630 Xp</h4>
                            </div>
                            <img className="h-[4vw]" src={top2}/>
                        </div>
                    </div>
                    <div className="h-[100%] w-[20%] m-[1%] leader-box">
                        <Avatar src={avatar_img} wd_="3.5vw"/>
                        <img className="w-[100%]" src={cube}/>
                        <div className="leader-info pb-[1%]">
                            <div className="text-center">
                                <h4 className="text-[1vw] text-[#A8DADC]">mmoutawa</h4>
                                <h4 className="text-[1vw] text-[#457B9D]">2630 Xp</h4>
                            </div>
                            <img className="h-[6vw]" src={top1}/>
                        </div>
                    </div>
                    <div className="h-[70%] w-[20%] m-[1%] leader-box">
                        <Avatar src={avatar_img} wd_="3.5vw"/>
                        <img className="h-[60%] w-[100%]" src={cube}/>
                        <div className="leader-info pt-[5%]">
                            <div className="text-center">
                                <h4 className="text-[1vw] text-[#A8DADC]">mmoutawa</h4>
                                <h4 className="text-[1vw] text-[#457B9D]">2630 Xp</h4>
                            </div>
                            <img className="h-[3vw]" src={top3}/>
                        </div>
                    </div>
                </div>
            </div>
            <div className="h-[50%] w-[100%] leader-players">
                <div className="h-[100%] w-[100%] pr-[1%]">
                    {
                        achve.map(()=>
                        <TopPlayers/>
                        )
                    }
                </div>
            </div>
        </div>
    )
}

export default Leaderboord