import React, { useEffect } from "react";
import {motion} from "framer-motion"
import { useState } from "react";
import Button_ from "../button/index";
import "./index.scss"
import training_img from "../tools/modes/brain.png"
import racket_img from "../tools/modes/racket.png"
import Challenge_img from "../tools/modes/1vs1.png"
import { ReactSVG } from "react-svg";
import ModePopUp from "./popUp"
import Modal from 'react-modal';
const Modes = () => {

    const [isopen, setopen] = useState(true);
    const [first_cp, setFirst_cp] = useState(false);
    const [second_cp, setSecond_cp] = useState(false);
    const [wd, setwd] = useState("15%");
    const [wd_f, setWd_f] = useState("60%");
    const [wd_s, setWd_s] = useState("15%");
    const [borderRd_f, setBorderRd_f] = useState ('20vw')
    const [borderRd_s, setBorderRd_s] = useState ('20vw')
    const [borderRd_l, setBorderRd_l] = useState ('1.5vw')

    const isopen_ = () =>{
        setopen(false);
        setwd('60%');
    }

    const isclose_ = () => {
        setopen(true);
        setFirst_cp(false);
        setSecond_cp(false);
        setWd_s('15%');
        setwd('15%');
        setWd_f('60%');
        setBorderRd_f('20vw');
        setBorderRd_s('20vw');
        setBorderRd_l('1.7vw');
    }

    const isFirstopen_ = () => {
        setFirst_cp(true);
        setopen(false);
        setSecond_cp(false);
        setWd_f('15%');
        setwd('60%');
        setWd_s('15%')
        setBorderRd_f('1.7vw');
        setBorderRd_s('20vw');
        setBorderRd_l('20vw');
    }

    const isSecondopen_ = () => {
        setSecond_cp(true);
        setFirst_cp(false);
        setopen(false);
        setWd_s('60%');
        setwd('15%');
        setWd_f('15%');
        setBorderRd_f('20vw');
        setBorderRd_s('1.7vw');
        setBorderRd_l('20vw');
    }
    const [isPop, setPop] = useState(false);

    return(
        <>

        <div className="w-[100%] h-[100%] modes-">
            <div  onClick={isFirstopen_} style={{width: wd, borderRadius: borderRd_f}} className="container-mode vs-mode">
                { first_cp &&
                    <>
                        <motion.img whileHover={{scale: 1.05}} className="mode-img" src={Challenge_img} alt="" />
                        <div className="mode-dsc">
                            <h1 className="leading-[2.2vw] text-[#F1FAEE] text-[2vw]">Challenge <br/> Mode</h1>
                            <h6 className="text-center text-[#F1FAEE] text-[0.7vw]" >Invite Your Friends To a Game!</h6>
                        </div>
                        <button onClick={() =>{
                            setPop(true);
                            console.log(isPop)
                               
                        }} className="relative outline-0">
                            <Button_ option="Start"/>
                        </button>
                        <Modal className="flex justify-center items-center"
                              isOpen={isPop}
                              onRequestClose={() => {setPop(false)}}
                            >
                            {isPop && <ModePopUp whichOne={false}/>}
                        </Modal>
                    </>
                }
                { !first_cp &&
                    <>
                        <h4 className="close-title">Challenge Mode</h4>
                    </>
                }
            </div>
            <div  onClick={isSecondopen_} style={{width: wd_s, borderRadius: borderRd_s}} className= "container-mode multi-mode">
                { second_cp &&
                    <>
                        <motion.img whileHover={{scale: 1.05}} className="mode-img" src={racket_img} alt="" />
                        <div className="mode-dsc">
                            <h1 className="leading-[2.2vw] text-[#F1FAEE] text-[2vw]">Multiplayer <br/> Mode</h1>
                            <h6 className="text-center text-[#F1FAEE] text-[0.7vw]" >Compete in Intense Multiplayer Matches!</h6>
                        </div>
                        <button className="relative ">
                            <Button_ option="Start"/>
                        </button>
                    </>
                }
                { !second_cp &&
                    <>
                        <h4 className="close-title">Multiplayer Mode</h4>
                    </>
                }
            </div>
            <div onClick={isclose_} style={{width: wd_f, borderRadius: borderRd_l}} className="container-mode">
                { isopen &&
                    <>
                        <motion.img whileHover={{scale: 1.05}} className="mode-img" src={training_img} alt="" />
                        <div className="mode-dsc">
                            <h1 className="leading-[2.2vw] text-[#F1FAEE] text-[2vw]">Training <br/>  Mode</h1>
                            <h6 className="text-center text-[#F1FAEE] text-[0.7vw]" >Master Your Skills And Train to Become a Pong Pro</h6>
                        </div>
                        <button onClick={() =>{
                            setPop(true);
                            console.log(isPop)
                               
                        }} className="relative outline-0">
                            <Button_ option="Start"/>
                        </button>
                        <Modal className="flex justify-center items-center"
                              isOpen={isPop}
                              onRequestClose={() => {setPop(false)}}
                            >
                            {isPop && <ModePopUp whichOne={true}/>}
                        </Modal>
                    </>
                }
                { !isopen &&
                    <>
                        <h4 className="close-title">Training Mode</h4>
                    </>
                }
                
            </div>
        </div>
        </>
    )
}

export default Modes;