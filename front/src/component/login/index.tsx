import React from "react";
import { useEffect, useState } from "react";
import './index.scss'
import { Application, SPEObject } from '@splinetool/runtime';
// import anime from 'animejs';
import { useRef } from "react";
import bg from '../tools/sign/background.png'
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import { socket_ } from "../api/api";
import { ReactSVG } from "react-svg";
import login_ic from "../tools/button/login.svg"
import Spline from "@splinetool/react-spline";

type btn_obj = {
  title:string,
}

const Signbottun = ({title}:btn_obj) => {
  return(
    <div className="h-[100%] w-[100%] sign-btn">
        <div className="-btn h-[100%] w-[100%] ">
          <ReactSVG className="w-[1vw] fill-LightBlue login-icon" src={login_ic}/>
          <h6 className="btn-dsc">{title}</h6>
        </div>
    </div>
  )
}


function Login () {

  return (
    <div className="w-[100vw] h-[55vw] flex flex-col">
        <img className="sign-bg z-[-1]" src={bg} />
        <div className="w-[100%] h-[50%] flex justify-center items-center">
          <Spline id="spline-container" scene="https://draft.spline.design/ORG3qbIqFFr8fevS/scene.splinecode"
          />
        </div>
        <div className="login-prop">
          <h3 className="sb-title">Use Your Mouse to Experience the 3D Animation</h3>
          <h1 className="title_">Unlock The Game <br/>And Have Fun</h1>
          
          <button onClick={() => {
                window.location.href= "http://localhost:3000/api/login";
            }}  className="m-[1%] h-[3vw] w-[20vw] flex justify-center items-center" >
                <Signbottun  title={"Log in With 42 Intra"}/>
          </button>
          <button  onClick={() => {
                window.location.href= "http://localhost:3000/api/login/google";
            }} className="m-[1%] h-[3vw] w-[20vw] flex justify-center items-center">
              <Signbottun title={"Log in With Google Account"}/>
          </button>
        </div>
    </div>
  );
};
  

export default Login;