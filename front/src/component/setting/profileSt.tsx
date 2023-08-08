import React, { useContext, useEffect, useState } from "react";
import "./index.scss"
import Button_ from "../button";
import Avatar from "../avatar";
// import av from "../tools/profile.png"
import Instanse from "../api/api";
import CrContext from "../context/context";

type user = {
    id: string,
    username: string,
    avatar: string,
    email: string,
    fullname: string
}

type cntx = {
    id: string,
    username: string,
    avatar: string
}


const ProfileSt = () => {
    const [username, setusername] = useState("");
    
    const handleInputChange = (e) => {
        if(e.target.value === "Enter your Username")
          setusername("dasda");
          setusername(e.target.value);
      }

    const [response, setResponse] = useState<user>();
    useEffect(() =>{
        Instanse.get("/user/")
                .then((res) => {
                    setResponse(res.data);
                })
        },[])
    return(
        <>
            <h2 className="text-[#A8DADC] text-[1vw]">User Settings</h2>
            <div className="flex justify-evenly items-center h-[30%] w-[80%]">
                {response?.avatar && (
                <Avatar src={response?.avatar} wd_="5vw"/>
                )}
                <div className="h-[70%] w-[45%] flex flex-col justify-between items-center">
                    <div className="cursor-pointer relative img-st rounded-[2vw] h-[43%] w-[90%] bg-[#457B9D] flex-col flex justify-center items-center">
                        <h1 className="cursor-pointer text-[0.6vw] text-[#A8DADC]">Upload New Picture</h1>
                        <input
                            className="cursor-pointer absolute h-[100%] w-[100%] bg-black opacity-[0]"
                            type="file"
                            onChange={(e) => {
                                
                            }}
                        />
                    </div>
                    <button className="rounded-[2vw] h-[43%] w-[90%] bg-[#457B9D]">
                        <h1 className="text-[0.6vw] text-[#A8DADC]">Delete Picture</h1>
                    </button>
                </div>
             
            </div>
            <button className=" user-name-input w-[60%] h-[8%]">
                <input type="text"
                    className=" user-name"
                    value={username}
                    onChange={handleInputChange}
                    onClick={handleInputChange}
                    placeholder={response?.username}
                />
            </button>
            <h2 className="text-[#A8DADC] text-[0.7vw]">Full Name : {response?.fullname}</h2>
            <div onClick={() => {
                Instanse.post("/user/setup", {username: ""})
            }}>
                <Button_ option="Save"/>
            </div>
        </>
    )
}

export default ProfileSt