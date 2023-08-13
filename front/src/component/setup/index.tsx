import React from "react";
import Button_ from "../button";
import av_img from '../tools/sign/avatar.png'
import  { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import upload_icon from '../tools/sign/upload.svg'
import Avatar from "../avatar/index";
import { ReactSVG } from "react-svg";
import './index.scss'
import axios from 'axios'

const Setup = () => {
  const fileInputRef = useRef(null);
  const [avatar_img, setavatar_img] = useState(av_img);
  const [username_, setusername] = useState("");
  const [avatar, setimage] = useState("");
  const [up, setup] = useState(false);
  const handleButtonClick = () => {
    fileInputRef.current.click();
    setup(true);
  };

  const nav = useNavigate();

  const handleFileChange = (event) => {
    const avatar = event.target.files[0];
    if (avatar && (avatar.type === 'image/jpeg' || avatar.type === 'image/png')) {
      setavatar_img (URL.createObjectURL(avatar));
      setimage(avatar);
    } else {
      setavatar_img(null);
      alert('Please select a valid JPEG or PNG image.');
    }
  };

  const handleInputChange = (e) => {
    if(e.target.value === "Enter your Username")
      setusername("dasda");
      setusername(e.target.value);
  }


  const handleSubmit = event =>{
    event.preventDefault();
    let UpdateUserDTO = new FormData();
    const header = {   
      withCredentials: true,  
      headers: { 'content-type': 'multipart/form-data' }
    }
    UpdateUserDTO.append('username', username_);
    UpdateUserDTO.append('avatar', avatar);

     axios.post('http://localhost:3000/api/user/setup', UpdateUserDTO, header)
      nav('/home')


      
      
    }
  

  return (
    <div className="setup" >
      <div className="upload">
          <input
            // accept="image/jpeg, image/png"
            type="file"
            style={{ display: 'none' }}
            ref={fileInputRef}
            onChange={handleFileChange}
            />
          <button className="upload-img" onClick={handleButtonClick}>
            { !up &&
              <div className="h-[4vw] w-[4vw] upl-icon">
                  <ReactSVG className="icon_" src={upload_icon}/>
              </div>
            }
            <Avatar src={avatar_img} wd_="4vw"/>
          </button>
      </div>
      <div className="username w-[60%] h-[8%]">
        <input
            type="text"
            placeholder="Enter your name"
            className="username_input w-[100%]"
            value={username_}
            onChange={handleInputChange}
            onClick={handleInputChange}
            />
        </div>
      <div>
        <button onClick={ 

          handleSubmit
       
          }>
          <Button_ option="coninue" />
        </button>
      </div>
      </div>
  );
};


export default Setup;