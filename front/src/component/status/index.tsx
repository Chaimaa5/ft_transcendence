import React from "react";
import "./index.scss"
import avatar_img from "../tools/sign/avatar.png"
import Avatar from "../avatar/index";
import { Value } from "sass";


const OfforOn = () => {
    let color = "#E63946";
    return(
        <div className="status-">
            {
                // lol.map((value, key) => {
                //     if(value) color = "#29F125";
                //     return(
                //         <div className="cursor-pointer m-[5%] relative st-container">
                //             <div style={{background :color}} className="status-cr"></div>
                //             <Avatar src={avatar_img} wd_="3vw" />
                //         </div>
                //     )
                // }
                // )
            }
            
        </div>

    )
}


const Status = () => {
    
    return(
        <div className="container-status">
            <OfforOn/>
        </div>
    )
}

export default Status;