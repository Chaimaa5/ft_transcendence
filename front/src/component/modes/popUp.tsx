import React, { useEffect, useState } from "react";
import Button_ from "../button";
import { Slider } from "antd";
import { ReactSVG } from "react-svg";
import incon6 from "../tools/btnsIcons/6.svg"
import Challenge_img from "../tools/modes/1vs1.png"
import training_img from "../tools/modes/brain.png"
import { SliderMarks } from "antd/es/slider";
import Instanse from "../api/api";
import Avatar from "../avatar";
import incon1 from "../tools/btnsIcons/1.svg"
import {useNavigate} from 'react-router-dom'



interface pendingGamesProps {
	id : string;
	player1 : {
		avatar : string;
		username: string;
	}
}


const marksPaddle = {
    1: {
        style:{
            color: "#1D3557",
            fontSize: "0.5vw"
        },
        label: "Small"
    },
    2: {
        style:{
            color: "#1D3557",
            fontSize: "0.5vw"
        },
        label: "Medium"
    },
    3: {
        style:{
            color: "#1D3557",
            fontSize: "0.5vw"
        },
        label: "Large"
    } 
  };

const marksBall = {
    1: {
        style:{
            color: "#1D3557",
            fontSize: "0.5vw"
        },
        label: "Slow"
    },
    2: {
        style:{
            color: "#1D3557",
            fontSize: "0.5vw"
        },
        label: "Normal"
    },
    3: {
        style:{
            color: "#1D3557",
            fontSize: "0.5vw"
        },
        label: "Fast"
    } 
  };

const ModePopUp = ({whichOne}) => {
    const [Next, GoToNext] = useState(false);
    const [Create, SetCreate] = useState(false);
    const [Join, SetJoin] = useState(false);

    const [Invite, SetInvite] = useState(false);
    const [input, setValue] = useState("");
    const [response, setResponse] = useState<{username: string, avatar: string}[]>([]);
    const [Player, SetPlayer] = useState("");
    const nav = useNavigate();

	// let gameId : number;
	const [gameId, setGameId] = useState(0);
	// training settings
	const [ballSpeed, setBallSpeed] = useState(2);
	const [paddleSize, setPaddleSize] = useState(2);
	const [lossLimit, setLossLimit] = useState(6);
	// challenge settings
	let isPlayerInvited = false;
	const [rounds, setRounds] = useState(3);
	const [pointsToWin, setPointsToWin] = useState(5);
	const [isFlashy, setIsFlashy] = useState(false);
	const [isDecreasingPaddle, setIsDecreasingPaddle] = useState(false);
	const [pendingGames, setPendingGames] = useState<pendingGamesProps[]>([]);

    useEffect(() => {
            if(input){
                SetPlayer("");
                Instanse.post('/home/search', {input})
                .then((res) => {
                    setResponse(res.data)
                });
            } else setResponse([]);
        },[input]
    )

	useEffect(() => {
		Instanse.get('/game/pending-games').then((res) => {
			setPendingGames(res.data);
		})
	},[])

    if(whichOne){
        return(
            <>
                <div className="relative popup h-[20vw] pb-[0%] flex flex-col justify-end items-center w-[20vw] rounded-[2vw] bg-[#1D3557]">
                <form className="h-[100%] w-[70%] flex flex-col pt-[20%]  justify-between items-center">
                    <img src={training_img} className="absolute top-[-25%] w-[40%]"  />
                    <h1 className="text-[1vw] text-[#A8DADC]">Challenge Mode</h1>
                    <div className="flex h-[10%] w-[100%] justify-between items-center">
                        <h1 className="text-[0.7vw] text-[#A8DADC]">Ball Speed</h1>
                        <Slider marks={marksBall} max={3} min={1} defaultValue={2} onChange={(value) => {
                            setBallSpeed(value);
                        }} className="w-[60%] flex justify-center items-center" trackStyle={{height: "60%", borderRadius: "2vw"}} railStyle={{background: "#A8DADC", height: "60%", borderRadius: "2vw"}}/>
                    </div>
                    <div className="flex h-[10%] w-[100%] justify-between items-center">
                        <h1 className="text-[0.7vw] text-[#A8DADC]">Paddle Size</h1>
                        <Slider marks={marksPaddle} max={3} min={1} defaultValue={2} onChange={(value) => {
							setPaddleSize(value);
                        }} className="w-[60%] flex justify-center items-center" trackStyle={{height: "60%", borderRadius: "2vw"}} railStyle={{background: "#A8DADC", height: "60%", borderRadius: "2vw"}}/>
                    </div>
                    <div className="flex h-[10%] w-[100%] justify-between items-center">
                        <h1 className="text-[0.7vw] text-[#A8DADC]">Loss Limits</h1>
                        <Slider max={10} min={1} defaultValue={6} onChange={(value) => {
							setLossLimit(value);
                        }} className="w-[60%] flex justify-center items-center" trackStyle={{height: "60%", borderRadius: "2vw"}} railStyle={{background: "#A8DADC", height: "60%", borderRadius: "2vw"}}/>
                    </div>
                    <div onClick={async () => {
                            await Instanse.post('/game/training-settings', {ballSpeed, paddleSize, lossLimit}).then((response) => {
								setGameId(response.data);
								nav('/training/' + response.data);
                            });
                            }} className="flex justify-center h-[20%] w-[80%]">
                             <Button_ option="continue"/>
                    </div>
                </form>
                </div>
            </>
        )
    }

    return(
        <>
            <div className="relative popup h-[20vw] pb-[0%] flex flex-col justify-end items-center w-[20vw] rounded-[2vw] bg-[#1D3557]">
                {!Next && <> <img src={Challenge_img} className="absolute top-[-10%] w-[50%]"  />
                <div className="flex flex-col items-center justify-evenly h-[50%] w-[100%]">
                    <h1 className="text-[1vw] text-[#A8DADC]">Challenge Mode</h1>
                    <div className="flex flex-col h-[50%] w-[100%] justify-bteween items-center">
                        <div className="radio flex justify-between items-center h-[50%] w-[50%]">
                            <h1 className="text-[0.7vw] text-[#A8DADC]">Join a Game</h1>
                            <input onChange={(e) => {
                                if(e.target.checked){
                                    SetJoin(true)
                                    SetCreate(false)
                                }
                            }} name="create" className="popup-input" type="radio"/>
                        </div>
                        <div className="radio flex justify-between items-center h-[50%] w-[50%]">
                            <h1 className="text-[0.7vw] text-[#A8DADC]">Create a Game</h1>
                            <input onChange={(e) => {
                                if(e.target.checked){
                                    SetJoin(false)
                                    SetCreate(true)
                                }
                            }} name="create" type="radio"/>
                        </div>
                    </div>
                </div>

                <div onClick={() => {
                        GoToNext(true);
                }} className="flex justify-center h-[20%] w-[80%]">
                    <Button_ option="continue"/>
                </div> </>}
                {Next && !Invite && Create &&
                    <form className="h-[100%] w-[90%] flex flex-col  justify-evenly items-center">
                        <h1 className="text-[1vw] text-[#A8DADC]">Challenge Mode</h1>
                        <div className="flex h-[10%] w-[80%] justify-between items-center">
                            <h1 className="text-[0.7vw] text-[#A8DADC]">Rounds</h1>
                            <Slider max={4} min={1} defaultValue={3} onChange={(value) => {
                                setRounds(value);
								console.log("value : " + value + " rounds : " + rounds);
                            }} className="w-[60%] flex justify-center items-center" trackStyle={{height: "60%", borderRadius: "2vw"}} railStyle={{background: "#A8DADC", height: "60%", borderRadius: "2vw"}}/>
                        </div>
                        <div className="flex h-[10%] w-[80%] justify-between items-center">
                            <h1 className=" text-[0.7vw] text-[#A8DADC]">Points</h1>
                            <Slider max={6} min={3} defaultValue={5} onChange={(value) => {
								setPointsToWin(value);
								console.log("value : " + value + " pointToWin : " + pointsToWin);
                            }} className="w-[60%] flex justify-center items-center" trackStyle={{height: "60%", borderRadius: "2vw"}} railStyle={{background: "#A8DADC", height: "60%", borderRadius: "2vw"}}/>
                        </div>
                        <div className="radio flex justify-between items-center h-[10%] w-[80%]">
                            <h1 className="text-[0.7vw] text-[#A8DADC]">Flashy Mode</h1>
                            <input onChange={(e) => {
								setIsFlashy(e.isTrusted);
								setIsDecreasingPaddle(false);
                            }} name="create" className="popup-input" type="radio"/>
                        </div>
                        <div className="radio flex justify-between items-center h-[10%] w-[80%]">
                            <h1 className="text-[0.7vw] text-[#A8DADC]">paddle size decreasing</h1>
                            <input onChange={(e) => {
								setIsDecreasingPaddle(e.isTrusted);
								setIsFlashy(false);
                            }} name="create" className="popup-input" type="radio"/>
                        </div>
                        <div className="flex w-[100%] justify-evenly">
                            <button onClick={() => {SetInvite(true)}} className="flex justify-center h-[10%] w-[80%]">
                                 <Button_ option="Invite"/>
                            </button>
                            <div onClick={async () => {
								if(Player) {
									isPlayerInvited = true;
								}
								await Instanse.post('/game/create-challenge-game', {isPlayerInvited, rounds, pointsToWin, isFlashy, isDecreasingPaddle, Player}).then((response) => {
									setGameId(response.data) ;
									nav('/game/' + response.data + "/challenge");
								});
                            }}className="flex justify-center h-[10%] w-[80%]">
                                 <Button_ option="continue"/>
                            </div>
                        </div>
                    </form>
                }
                {Next && Invite &&
                    <div className="h-[100%] w-[90%] flex flex-col  justify-start pt-[8%] pb-[8%] items-center">
                        <h1 className="text-[1vw] text-[#A8DADC]">Challenge Mode</h1>
                        <div className="h-[80%] w-[95%] flex flex-col justify-start items-center">
                            <input className="search-box-invite w-[100%] h-[16%] m-[5%]" 
                                type="text"
                                value={input}
                                placeholder="Search..."
                                onChange={(event) => {
                                    setValue(event.target.value);
                                }}
                            />
                            {response && 
                                <div className="w-[95%] h-[80%] flex flex-col justify-start items-center overflow-y-scroll">
                                    {response.map((value, key) => {
                                        return(
                                            <button key={key} onClick={() => {
                                                SetPlayer(value.username);
                                                setResponse([]);
                                                }} className="flex m-[2%] h-[28%] w-[95%] justify-evenly rounded-[2vw] items-center border-[0.1vw] border-[#F1FAEE]">
                                                <Avatar src={value.avatar} wd_="2vw"/>
                                                <h1 className="text-[1vw] text-LightBlue">{value.username}</h1>
                                            </button>
                                        )
                                    })
                                    }
                                    {Player &&
                                        <h1 className="text-[0.7vw] text-LightBlue">you selected {Player}</h1>
                                    }
                                </div>
                            }
                        </div>
                        <button onClick={() => {
							
                            GoToNext(true); SetInvite(false)
                        }} className="">
                    	  <Button_ option="Back"/>
                        </button>
                    </div>
                }
                {Next && Join && 
                    <div className="flex flex-col  items-center justify-evenly h-[100%] w-[100%]">
                        <h1 className="text-[1vw] text-[#A8DADC]">Challenge Mode</h1>
                        <h5 className="text-[0.8vw] text-[#A8DADC]">Games List</h5>	
							<div className="flex flex-col h-[80%] w-[100%] justify-bteween items-center overflow-y-scroll">
									{pendingGames.map((value, key) => {
										return(
											<div className="flex justify-between items-center h-[20%] p-[5%] border-LightBlue border-[0.15vw] w-[80%] rounded-[2vw] m-[1%]">
												<Avatar src={value.player1.avatar} wd_="2.3vw"/>
												<h1 className="text-[0.6vw] w-[60%] text-LightBlue">Challenge<br/>{value.player1.username}</h1>
												<button onClick={async () => {
													await Instanse.post("/game/join-game/" + value.id).then((res) => {
														nav("/game/" + value.id + "/challenge?accepted=true")
													})
												}} className="h-[2vw] w-[2vw] flex justify-center items-center relative rounded-[50%] bg-DarkBlue hover:bg-LightBlue">
													<ReactSVG className="w-[0.8vw] fill-White absolute left-[35%] hover:fill-DarkBlue" src={incon1}/>   
												</button>
											</div>
										)
									})
								}
							</div>
						{/* } */}
                </div>
                }
            </div>
        </>
    )
}


export default ModePopUp