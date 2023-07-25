import React from "react";
import Button_ from "../button";
import av_img from '../tools/sign/avatar.png'
import  { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import upload_icon from '../tools/sign/upload.svg'
import Avatar from "../avatar/index";
import { ReactSVG } from "react-svg";
import './index.scss'


const Setup = () => {
  const fileInputRef = useRef(null);
  const [avatar_img, setavatar_img] = useState(av_img);
  const [username_, setusername] = useState("");
  const [up, setup] = useState(false);
  const handleButtonClick = () => {
    fileInputRef.current.click();
    setup(true);
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setavatar_img (URL.createObjectURL(file));
  };

  const handleInputChange = (e) => {
    if(e.target.value === "Enter your Username")
      setusername("dasda");
      setusername(e.target.value);
  }

  const nav = useNavigate();

  return (
    <div className="setup">
      <div className="upload">
          <input
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
        <button onClick={() =>{nav('/home')}}>
          <Button_ option="coninue"/>
        </button>
      </div>
    </div>
  );
};


export default Setup;