import React, { useState } from "react";
import  "./index.css"
import { ReactSVG } from "react-svg";
import icon3 from "../tools/btnsIcons/st2.svg"
import Instanse from "../api/api";
import Button_ from "../button";
import { useNavigate } from "react-router-dom";

const TfaPage = () => {
    const [holder, setholder] = useState("Enter the 6-digit code")
    const [code, SetCode] = useState("");
    const nav = useNavigate();

    return(
        <div  className="flex flex-col  justify-evenly items-center h-[12vw] rounded-[2vw] w-[20vw] tfa-p ">
            <ReactSVG className="w-[1vw] fill-[#1D3557]" src={icon3} />
            <div className="username w-[80%] h-[20%]">
                <input
                    type="text"
                    placeholder={holder}
                    className="username_input w-[100%]"
                    onChange={(e) => {
                        SetCode(e.target.value)
                        
                    }}
                />
            </div>
            <button onClick={() => {
                Instanse.post("/VerifyTwoFA",{code: code})
                .then((res) => {
                    if(!res.data)
                        setholder("try again !")
                    else nav("/home")
                })
            }}>
                <Button_ option="continue"/>
            </button>
        </div>
    )
}

export default TfaPage;