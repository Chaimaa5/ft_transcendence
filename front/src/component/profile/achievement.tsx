import React from "react";

type achiev = {
    isAchieved: boolean,
    imagePath: string
}

const Achievement = ({imagePath, isAchieved}:achiev) => {
    let opc = "100%";
    if(!isAchieved) opc = "20%"; 
    return(
        <div style={{opacity: opc}} className="w-[13%] h-[100%] bg-[#1D3557] 
                       flex items-center justify-center rounded-[1.5vw] p-[1%]">
            <img className="h-[90%]" src={imagePath}/>
        </div>
    )
}

export default Achievement;