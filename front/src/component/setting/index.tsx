import React, { useEffect, useRef, useState } from "react";
import { ReactSVG } from "react-svg";
import icon1 from "../tools/btnsIcons/3.svg"
import icon2 from "../tools/btnsIcons/st1.svg"
import icon3 from "../tools/btnsIcons/st2.svg"
import "./index.scss"
import Instanse from "../api/api";
import TfaContainer from "./tfa";
import ProfileSt from "./profileSt";
import BlockList from "./blocklist";

const Setting = () => {
    const [profile, setProfile] = useState(true);
    const [Twofa, setTwofa] = useState(false);
    const [bklist, setBklist] = useState(false);
    const fileInputRef = useRef();

    return(
        <div className="h-[100%] w-[100%] flex justify-center items-center">
            <div className="w-[40%] h-[90%] flex justify-center items-center flex-col">
                <div className="h-[5%] w-[100%]">
                    <h3 className="text-[1.3vw] text-[#A8DADC]">Settings</h3>
                </div>
                <div className="h-[90%] w-[100%] flex flex-col pt-[7%] items-center">
                    <div className="h-[10%] w-[30%] flex justify-evenly items-center">
                        <button onClick={() => {
                            setProfile(true);
                            setBklist(false);
                            setTwofa(false);
                        }} className="flex justify-center items-center h-[2vw] w-[2vw] rounded-[2vw] bg-[#457B9D] hover:bg-[#A8DADC]">
                            <ReactSVG style={{fill: "#1D3557"}} className="w-[0.9vw] " src={icon2}/>
                        </button>
                        <button onClick={() => {
                            setProfile(false);
                            setBklist(false);
                            setTwofa(true);
                        }} className="flex justify-center items-center h-[2vw] w-[2vw] rounded-[2vw] bg-[#457B9D] hover:bg-[#A8DADC]">
                            <ReactSVG className="w-[0.9vw] " src={icon3}/>
                        </button>
                        <button onClick={() => {
                            setProfile(false);
                            setBklist(true);
                            setTwofa(false);
                        }} className="flex justify-center items-center h-[2vw] w-[2vw] rounded-[2vw] bg-[#457B9D] hover:bg-[#A8DADC]">
                            <ReactSVG className="w-[1vw] " src={icon1}/>
                        </button>
                    </div>
                    <div className=" h-[70%] rounded-[1.5vw] w-[70%] st-container">
                        {profile && <ProfileSt/>}
                        {Twofa && <TfaContainer/>}
                        {bklist && < BlockList/>}
                    </div>
                </div>
            </div>
        </div>
    )
};

export default Setting