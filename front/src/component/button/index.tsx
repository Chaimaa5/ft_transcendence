import React from "react";
import { ReactSVG } from "react-svg";
import setup_icon from '../tools/button/continue.svg';
import start_icon from '../tools/button/start.svg';
import invite_icon from '../tools/button/invite.svg';
import watch_icon from '../tools/button/watch.svg';
import './index.scss';

type btn = {
    option:string
}

const Button_ = ({option}:btn ) => {
    let icon = setup_icon;
    if(option == "Start")
        icon = start_icon;
    else if (option == "Watch")
        icon = watch_icon;
    else if(option == "Invite")
        icon = invite_icon;

    
    return(
        <div className="btn-shape">
            <div className="btn-body">
                 <ReactSVG className="icon" src={icon}/>
                <h6 className="option">{option}</h6>
            </div>
        </div>
    )
}


export default Button_;