import React, { useEffect, useState } from "react";
import "./index.scss"
import Instanse from "../api/api";

type btnType = {
    background: string,
    justifyContent: string
}

type btnBody = {
    background: string,
}





const TfaContainer = () => {
    const [Qrcode, setQr] = useState("");
    const [btnBody, SetBody] = useState<btnBody>({background: "#E63946"});
    const [btnColor, SetBtn] = useState<btnType>({background: "#f29999", justifyContent: ""});
    const [code, SetCode] = useState("");
    const [holder, setholder] = useState("Enter the 6-digit code")
    const [isActv, setIsActv] = useState(false);


    function IsTFA(){
        SetBtn({justifyContent: "", background: "#f29999"});
        SetBody({background: "#E63946"})
        Instanse.get("/generate-qrcode" ,{
            responseType: 'blob',
        })
        .then((res) => {
            const qrImg = URL.createObjectURL(res.data);
            setQr(qrImg);
        })
    }

    useEffect(() => {
        Instanse.get("/isEnabled")
            .then((res) => {
                if(res.data)
                    setIsActv(true);
            })
       IsTFA();
    },[])

    
    if(isActv){
        return(
            <div className="flex flex-col justify-evenly items-center h-[40%] w-[80%]">
                <h1 className="text-[1vw] text-[#A8DADC] ">you've successfully <br /> set up 2FA</h1>
                <div onClick={() => {
                        setIsActv(false)
                        Instanse.get("/disable")
                }} style={{justifyContent: "end", background: "#A8DADC"}}
                    className="flex cursor-pointer items-center p-[0.8%] rounded-[2vw] h-[1vw] w-[2vw]">
                    <div style={{background: "#1D3557"}} className="flex rounded-[50%] h-[0.8vw] w-[0.8vw]"></div>
                </div>
            </div>
        )
    }
    return(
        <>
            <div className="flex h-[10%] w-[70%] justify-evenly items-center">
            <h1 className="text-[#A8DADC] text-[0.8vw]">2FA Authorization</h1>
            <div onClick={() => {
                if(btnColor?.justifyContent == "end"){
                   IsTFA();
                }else {
                    SetBtn({justifyContent: "end", background: "#A8DADC"});
                    SetBody({background: "#1D3557"})
                }
            }} style={btnColor} className="flex items-center p-[0.8%] rounded-[2vw] h-[1vw] w-[2vw]">
                <div style={btnBody} className="flex rounded-[50%] h-[0.8vw] w-[0.8vw]"></div>
            </div>
            </div>
            <div className="overflow-hidden	h-[11vw] w-[11vw] rounded-[1vw] border-[#A8DADC] border-[0.1vw]" >
                {btnColor?.justifyContent == "end" && <img className=" w-[102%]" src={Qrcode} />}
            </div>
            <div className=" user-name-input w-[60%] h-[8%]">
                <input type="text"
                    className="user-name"
                    placeholder={holder}
                    maxLength={6}
                    value={code}
                    onChange={(e) => SetCode(e.target.value)}
                />
            </div>
            <button onClick={() => {
                Instanse.post("/enable",{code: code})
                .then((res) => {
                    if(!res.data){
                        setholder("try again !")
                        SetCode("")
                    } else setIsActv(true)
                })
                .catch((err) => {console.log(err)})
            }} className="h-[10%] w-[30%] rounded-[2vw] flex justify-center items-center hover:bg-[#457B9D] bg-[#1D3557]">
                <h2 className="text-[#A8DADC] text-[0.8vw]">Verify</h2>
            </button>
        </>
    )
}

export default TfaContainer;