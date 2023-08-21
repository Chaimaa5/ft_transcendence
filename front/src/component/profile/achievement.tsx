import React, { useEffect, useState } from "react";
import Instanse from "../api/api";

interface achiev {
    id: number,
    Achievement: string,
    Achieved: boolean,
    Image: string,
}



const Achievement =  ({name}) => {
    let opc = "100%";
    const [data, SetData] = useState<achiev[]>()
    async function achievData (){
        Instanse.get("/profile/acheivments/" + name)
                .then((res) => {
                    SetData(res.data)
                })
    }
    useEffect(() => {
          achievData()
    },[])
    return(
        <>
        {data?.map((value, key) => {
    if(!value.Achieved) opc = "20%"; 
        return(
            <div key={key} style={{opacity: opc}} className="w-[5vw] h-[5vw] bg-[#1D3557] 
                flex items-center justify-center rounded-[1.5vw] p-[1%]">
                <img className="h-[90%]" src={value.Image}/>
            </div>
            )
        })}
        </>
    )
}

export default Achievement;