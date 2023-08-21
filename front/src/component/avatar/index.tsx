import React from "react";
import avatar_img from '../tools/sign/avatar.png'
import { ReactSVG } from "react-svg";
import line from '../tools/sign/line.png'
import upload_icon from '../tools/sign/upload.svg'


type avatar = {
    wd_: string,
    src: string,
}



const Avatar = ({src, wd_}: avatar) => {
    const img = new Image()
    const hw = {height: "auto", width: "100%"}
    img.src = src;
    if(img.naturalWidth >= img.naturalHeight){
        hw.height = "100%"; hw.width = "auto"
    }

    return(
        <div style={{width: wd_, height: wd_}} className="flex justify-center items-center relative">
            <div className="h-[85%] w-[85%] flex justify-center items-center rounded-[50%] overflow-hidden">
                <img style={hw} src={src}/>
            </div>
            <img style={{width: wd_}} className="absolute top-[13%]" src={line}/>
        </div>
    )
}

export default Avatar;