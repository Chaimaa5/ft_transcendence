import React, { useState } from "react";
import Button_ from "../button";
import { Slider } from "antd";
import Challenge_img from "../tools/modes/1vs1.png"
import training_img from "../tools/modes/brain.png"
import Instanse from "../api/api";

const marksPaddle = {
    1: {
        style:{
            color: "#1D3557",
        },
        label: "Small"
    },
    2: {
        style:{
            color: "#1D3557",
        },
        label: "Medium"
    },
    3: {
        style:{
            color: "#1D3557",
        },
        label: "Large"
    } 
  };

const marksBall = {
    1: {
        style:{
            color: "#1D3557",
        },
        label: "Slow"
    },
    2: {
        style:{
            color: "#1D3557",
        },
        label: "Normal"
    },
    3: {
        style:{
            color: "#1D3557",
        },
        label: "Fast"
    } 
  };


const ModePopUp = ({whichOne}) => {
    const [Next, GoToNext] = useState(false);
    const [Create, SetCreate] = useState(false);
    const [Join, SetJoin] = useState(false);
    const [Rounds , SetRounds] = useState(3);
    const [Points, SetPointes] = useState(4);
    const [isFlashy, SetFlashy] = useState(false);
    const [PaddleSize, SetSize] = useState(false);
    const [PaddleSize_, SetPaddleSize] = useState(3);
    const [BallSpeed, SetSpeed] = useState(2);
    const [LossLimit, SetLimit] = useState(2);
    

    if(whichOne){
        return(
            <>
                <div className="relative popup h-[20vw] pb-[0%] flex flex-col justify-end items-center w-[20vw] rounded-[2vw] bg-[#1D3557]">
                <form className="h-[100%] w-[70%] flex flex-col pt-[20%]  justify-between items-center">
                    <img src={training_img} className="absolute top-[-25%] w-[40%]"  />
                    <h1 className="text-[1vw] text-[#A8DADC]">Challenge Mode</h1>
                    <div className="flex h-[10%] w-[100%] justify-between items-center">
                        <h1 className="text-[0.7vw] text-[#A8DADC]">Ball Speed</h1>
                        <Slider marks={marksBall} max={3} min={1} defaultValue={2} onChange={(value) => {
                            SetSpeed(value);
                        }} className="w-[60%] flex justify-center items-center" trackStyle={{height: "60%", borderRadius: "2vw"}} railStyle={{background: "#A8DADC", height: "60%", borderRadius: "2vw"}}/>
                    </div>
                    <div className="flex h-[10%] w-[100%] justify-between items-center">
                        <h1 className="text-[0.7vw] text-[#A8DADC]">Paddle Size</h1>
                        <Slider marks={marksPaddle} max={3} min={1} defaultValue={2} onChange={(value) => {
                            SetPaddleSize(value);
                        }} className="w-[60%] flex justify-center items-center" trackStyle={{height: "60%", borderRadius: "2vw"}} railStyle={{background: "#A8DADC", height: "60%", borderRadius: "2vw"}}/>
                    </div>
                    <div className="flex h-[10%] w-[100%] justify-between items-center">
                        <h1 className="text-[0.7vw] text-[#A8DADC]">Loss Limits</h1>
                        <Slider max={10} min={1} defaultValue={6} onChange={(value) => {
                            SetLimit(value);
                        }} className="w-[60%] flex justify-center items-center" trackStyle={{height: "60%", borderRadius: "2vw"}} railStyle={{background: "#A8DADC", height: "60%", borderRadius: "2vw"}}/>
                    </div>
                    <div onSubmit={() => {
                          Instanse.post('/game/training', {PaddleSize_, BallSpeed, LossLimit})  }} className="flex justify-center h-[20%] w-[80%]">
                             <Button_ option="continue"/>
                    </div>
                </form>
                </div>
            </>
        )
    }

    return(
        <>
            <div className="relative popup h-[20vw] pb-[0%] flex flex-col justify-end items-center w-[20vw] rounded-[2vw] bg-[#1D3557]">
                {!Next && <> <img src={Challenge_img} className="absolute top-[-10%] w-[50%]"  />
                <div className="flex flex-col items-center justify-evenly h-[50%] w-[100%]">
                    <h1 className="text-[1vw] text-[#A8DADC]">Challenge Mode</h1>
                    <div className="flex flex-col h-[50%] w-[100%] justify-bteween items-center">
                        <div className="radio flex justify-between items-center h-[50%] w-[50%]">
                            <h1 className="text-[0.7vw] text-[#A8DADC]">Join a Game</h1>
                            <input onChange={(e) => {
                                if(e.target.checked){
                                    SetJoin(true)
                                    SetCreate(false)
                                }
                            }} name="create" className="popup-input" type="radio"/>
                        </div>
                        <div className="radio flex justify-between items-center h-[50%] w-[50%]">
                            <h1 className="text-[0.7vw] text-[#A8DADC]">Create a Game</h1>
                            <input onChange={(e) => {
                                if(e.target.checked){
                                    SetJoin(false)
                                    SetCreate(true)
                                }
                            }} name="create" type="radio"/>
                        </div>
                    </div>
                </div>

                <div onClick={() => {
                    if(Join)
                        return
                    else if(Create)
                        GoToNext(true);
                }} className="flex justify-center h-[20%] w-[80%]">
                    <Button_ option="continue"/>
                </div> </>}
                {Next &&
                    <form className="h-[100%] w-[70%] flex flex-col  justify-evenly items-center">
                        <h1 className="text-[1vw] text-[#A8DADC]">Challenge Mode</h1>
                        <div className="flex h-[10%] w-[100%] justify-between items-center">
                            <h1 className="text-[0.7vw] text-[#A8DADC]">Rounds</h1>
                            <Slider max={4} min={1} defaultValue={3} onChange={(value) => {
                                SetRounds(value);
                            }} className="w-[60%] flex justify-center items-center" trackStyle={{height: "60%", borderRadius: "2vw"}} railStyle={{background: "#A8DADC", height: "60%", borderRadius: "2vw"}}/>
                        </div>
                        <div className="flex h-[10%] w-[100%] justify-between items-center">
                            <h1 className=" text-[0.7vw] text-[#A8DADC]">Points</h1>
                            <Slider max={6} min={3} defaultValue={5} onChange={(value) => {
                                SetPointes(value)
                            }} className="w-[60%] flex justify-center items-center" trackStyle={{height: "60%", borderRadius: "2vw"}} railStyle={{background: "#A8DADC", height: "60%", borderRadius: "2vw"}}/>
                        </div>
                        <div className="radio flex justify-between items-center h-[10%] w-[100%]">
                            <h1 className="text-[0.7vw] text-[#A8DADC]">Flashy Mode</h1>
                            <input onChange={(e) => {
                                SetFlashy(e.isTrusted)
                                SetSize(false)
                            }} name="create" className="popup-input" type="radio"/>
                        </div>
                        <div className="radio flex justify-between items-center h-[10%] w-[100%]">
                            <h1 className="text-[0.7vw] text-[#A8DADC]">paddle size decreasing</h1>
                            <input onChange={(e) => {
                                SetSize(e.isTrusted)
                                SetFlashy(false)
                            }} name="create" className="popup-input" type="radio"/>
                        </div>
                        <div onClick={() => { Instanse.post('/game/challenge', {Rounds, Points, isFlashy, PaddleSize})
                            }} className="flex justify-center h-[10%] w-[80%]">
                             <Button_ option="continue"/>
                        </div>
                    </form>
                }
            </div>
        </>
    )
}


export default ModePopUp