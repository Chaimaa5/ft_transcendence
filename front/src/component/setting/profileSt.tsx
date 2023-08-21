import React, { useContext, useEffect, useRef, useState } from "react";
import "./index.scss"
import Button_ from "../button";
import Avatar from "../avatar";
// import av from "../tools/profile.png"
import Instanse from "../api/api";
import CrContext from "../context/context";
import axios from "axios";
import { useNavigate } from "react-router-dom";


type cntx = {
    username: string,
    avatar: string,
    fullname: string
}

const ProfileSt = () => {
    const ImageUrl = useRef(null);
    const [data, setData] = useState(useContext<cntx>(CrContext))
    const [username, setusername] = useState("");
    const [ImageFile, setImageFile] = useState("");
    const [avatar, setAvatar] = useState(data.avatar);
    const [done, SetDone] = useState("Save")

    const handleInputChange = (e) => {
        if(e.target.value === "Enter your Username")
        setusername("dasda");
        setusername(e.target.value);
    }
    
    const handleImageChange = (e) =>{
        const avatar = e.target.files[0];
    if (avatar && (avatar.type === 'image/jpeg' || avatar.type === 'image/png')) {
        setAvatar (URL.createObjectURL(avatar));
      setImageFile(avatar);
    } else {
        // setAvatar(null);
      alert('Please select a valid JPEG or PNG image.');
    }
    }
    const nav = useNavigate();
    const handleSave = (event) =>{
        event.preventDefault();
    let UpdateUserDTO = new FormData();
    const header = {   
      withCredentials: true,  
      headers: { 'content-type': 'multipart/form-data' }
    }
    UpdateUserDTO.append('username', username);
    UpdateUserDTO.append('avatar', ImageFile);

     axios.post('http://localhost:3000/api/user/setup', UpdateUserDTO, header)
        .then((res) => {
            // if(res.data)
                SetDone("done");
        })
    //   nav('/home')
    }
    const handleDelete = (e) =>{
        setAvatar("");
        Instanse.delete("/user/avatar");

    }



    return(
        <>
            <h2 className="text-[#A8DADC] text-[1vw]">User Settings</h2>
            <div className="flex justify-evenly items-center h-[30%] w-[80%]">
                <Avatar src={avatar} wd_="5vw"/>
                <div className="h-[70%] w-[45%] flex flex-col justify-between items-center">
                    <div className="cursor-pointer relative img-st rounded-[2vw] h-[43%] w-[90%] bg-[#457B9D] flex-col flex justify-center items-center">
                        <h1 className="cursor-pointer text-[0.6vw] text-[#A8DADC]">Upload New Picture</h1>
                        <input
                            className="cursor-pointer absolute h-[100%] w-[100%] bg-black opacity-[0]"
                            type="file"
                            ref={ImageUrl}
                            onChange={handleImageChange}
                            
                        />
                    </div>
                    <button className="rounded-[2vw] h-[43%] w-[90%] bg-[#457B9D]"  onClick={handleDelete}>
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
                    placeholder={data.username}
                />
            </button>
            <h2 className="text-[#A8DADC] text-[0.7vw]">Full Name : {data.fullname}</h2>
            <div onClick={handleSave}>
                <Button_ option={done}/>
            </div>
        </>
    )
}

export default ProfileSt