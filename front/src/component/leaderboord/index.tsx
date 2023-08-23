import React, { useEffect, useState } from "react";
import cube from "../tools/leader/cube.png"
import Avatar from "../avatar/index";
import avatar_img from "../tools/profile.png"
import top1 from "../tools/achievement/1.png"
import top2 from "../tools/achievement/5.png"
import top3 from "../tools/achievement/4.png"
import TopPlayers from "./topplayers";
import Instanse from "../api/api";
import "./index.scss"
import { Link } from "react-router-dom";




type leaderboard = {
      id: number,
      rank: number,
      username: string,
      avatar: string,
      XP: number,
      badge: [
        {
          id: number,
          Achievement: string,
          Achieved: boolean,
          userId: number
        },
        {
            id: number,
            Achievement: string,
            Achieved: boolean,
            userId: number
        },
        {
          id: number,
          Achievement: string,
          Achieved: boolean,
          userId: number
        }
      ]
}

const Leaderboord = () => {
    let second = false;
    let last = false;
    const [data, setData] = useState<leaderboard[]>([]);
    useEffect(() => {
        Instanse.get("/leaderboard")
                .then((res) => {
                    setData(res.data);
                })
    },[])


    return(
        <div className="leader-container h-[44vw] w-[100%]">
            <div className="h-[50%] w-[100%] top-3-players">
                <h1 className="h-[15%] text-[1vw] text-[#457B9D]">Leaderboard</h1>
                <div className="top-3 pt-[1%]">
                {data?.length < 3 &&
                    <>
                        {data.length <= 2 &&
                            <div className="h-[65%] pt-[1%] w-[20%] m-[1%] z-[2] leader-box order-1 relative">
                                <img className="h-[65%] w-[100%] absolute bottom-[0%]" src={cube}/>
                            </div>
                        }
                
                        {data.length == 1 &&
                            <div className="h-[85%] w-[20%] m-[1%] z-[2] leader-box order-2 relative">
                                <img className="w-[100%] h-[65%] absolute z-[-1] bottom-[0%]" src={cube}/>
                            </div>
                        }
                    </>
                }
                {data?.map((value, key) =>{
                    // if(value.rank == 2){
                    return(
                        <> 
                        {value.rank == 2 &&
                        <div key={key} className="h-[85%] pt-[1%] w-[20%] m-[1%] z-[2] leader-box order-3 relative">
                            <img className="h-[65%] w-[100%] absolute bottom-[0%]" src={cube}/>
                                <>
                                <Link className="h-[20%] w-[100%] flex justify-center items center" to={"/profile/" + value.username}  >
                                    <Avatar src={value.avatar} wd_="3.5vw"/>
                                </Link>
                                <div className="flex flex-col items-center z-[1] justify-evenly p-[5%] h-[60%] left-[37%]">
                                    <div className="text-center">
                                        <h4 className="text-[1vw] text-[#A8DADC]">{value.username}</h4>
                                        <h4 className="text-[1vw] text-[#457B9D]">{value.XP} Xp</h4>
                                    </div>
                                    <img className="w-[3.2vw]" src={top2}/>
                                </div>
                                </>
                            
                        </div>
                        }
                    
                        {value.rank == 1 &&
                            <div key={key} className="h-[95%] w-[20%] m-[1%] z-[2] leader-box order-2 relative">
                                <img className="w-[100%] h-[75%] absolute z-[-1] bottom-[0%]" src={cube}/>
                                <Link className="h-[20%] w-[100%] flex justify-center items center" to={"/profile/" + value.username}  >
                                    <Avatar src={value.avatar} wd_="3.5vw"/>
                                </Link>
                                <div className="flex flex-col  items-center z-[1] justify-evenly p-[6%] h-[60%] left-[37%]">
                                    <div className="text-center">
                                        <h4 className="text-[1vw] text-[#A8DADC]">{value.username}</h4>
                                        <h4 className="text-[1vw] text-[#457B9D]">{value.XP} Xp</h4>
                                    </div>
                                    <img className="w-[4.5vw]" src={top1}/>
                                </div>
                            </div>
                        }
                        
                        {value.rank == 3 &&
                            <div key={key} className="h-[65%] w-[20%] m-[1%] z-[2] leader-box order-1 relative">
                                <img className="w-[100%] h-[65%] absolute z-[-1] bottom-[0%]" src={cube}/>
                                <Link className="h-[20%] w-[100%] flex justify-center items center" to={"/profile/" + value.username}  >
                                    <Avatar src={value.avatar} wd_="3.5vw"/>
                                </Link>
                                <div className="flex flex-col  items-center z-[1] justify-evenly p-[6%] h-[60%] left-[37%]">
                                    <div className="text-center">
                                        <h4 className="text-[1vw] text-[#A8DADC]">{value.username}</h4>
                                        <h4 className="text-[1vw] text-[#457B9D]">{value.XP} Xp</h4>
                                    </div>
                                    <img className="h-[3vw]" src={top3}/>
                                </div>
                            </div>
                        }
                    </>
                )})}
                </div>
            </div>
            <div className="h-[50%] w-[100%] leader-players">
                <div className="h-[100%] w-[100%] pr-[1%]">
                        <TopPlayers/>
                        
                </div>
            </div>
        </div>
    )
}

export default Leaderboord