import React  from 'react'
import Avatar from '../../avatar'
import { ReactSVG } from "react-svg";
import icon9 from "../../tools/btnsIcons/9.svg"
import Style from "../Rooms/styleRoom.module.css"
import Instanse from '../../api/api';
import { JoinProtected } from './joinProtected';
import useJoinRoonPopUp from '../ChatStore/useJoinRoomPopUp';
import useReload from '../ChatStore/useReload';

interface Props
{
  id: number,
  name: string,
  image: string,
  count: string,
  type: string,
}

export const OtherRoom = ({id, name, image, count, type}: Props) => {

  const {joinPopupOn, popUpid, setJoinPopupOn} =  useJoinRoonPopUp();
  const {setReloadUnjoined, setReloadJoinedRooms} = useReload();

  const joinRoomOnClick = () => {
    
    if (type === 'public')
      Instanse.get('/chat/joinRoom/' + id)
      .then(() => {setReloadUnjoined(); setReloadJoinedRooms()})
    else if (type === 'protected')
      setJoinPopupOn(id);
  }

  if (joinPopupOn && popUpid === id)
  {
    return (
      <JoinProtected avatar={image} roomName={name} roomId={id}/>
    )
  }
  
  return (
    <div key={id} className={" h-[3.5vw] w-[90%] pl-[-9vw] bg-gradient-to-r from-[#457B9D] to-[#1D3557] rounded-[2vw] text-center m-[1vw] flex justify-around items-center "}>
      
        <Avatar src={image} wd_="3.5vw"/>
    
        <h3 className={[Style.font2, "text-[0.8vw] text-[white] w-[30%]"].join(" ")}>{name}</h3>
        <h3 className="text-[0.8vw] text-[#A8DADC] w-[18%]">{count + ' Members'}</h3>
        <h3 className="text-[0.8vw] text-[#A8DADC] w-[18%]">{type + " room"}</h3>
        <button className="w-[1.8vw]  bg-[#A8DADC] h-[1.8vw] rounded-full flex justify-center items-center"
                onClick={joinRoomOnClick}>
        <ReactSVG src={icon9} className={" w-[1vw] "}/>
        </button>
    </div>
  )
}
