import React from "react";
import avatar_img from '../tools/sign/avatar.png'
import { ReactSVG } from "react-svg";
import line from '../tools/sign/line.png'
import upload_icon from '../tools/sign/upload.svg'
import './index.scss'


type avatar = {
    wd_: string,
    src: string,
}



const Avatar = ({src, wd_}: avatar) => {
    return(
        <div style={{width: wd_, height: wd_}} className="container_av">
            <div className="av-img">
                <img className="img-bd" src={src}/>
            </div>
            <img style={{width: wd_}} className="avatar-line" src={line}/>
        </div>
    )
}

export default Avatar;