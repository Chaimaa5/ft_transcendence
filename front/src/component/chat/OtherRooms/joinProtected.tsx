import React, { RefObject, useRef, useState } from 'react'
import { ReactSVG } from 'react-svg';
import Avatar from '../../avatar';
import useJoinRoonPopUp from '../ChatStore/useJoinRoomPopUp';
import style from '../form/form.module.css'
import Fonts from '../styleChat.module.css'
import Button_ from '../../button';
import cancel_icon from '../../tools/btnsIcons/cancelIcon.svg' 
import Instanse from '../../api/api';
import useReload from '../ChatStore/useReload';


interface Props{
  roomName: string,
  avatar: string,
  roomId: number
}

export const JoinProtected = ({avatar: image, roomName, roomId}: Props) => {
  const {setJoinPopupOff} =  useJoinRoonPopUp();
  const [error, setError] = useState('');
  const inputRef: RefObject<HTMLInputElement> = useRef(null);
  const {setReloadUnjoined, setReloadJoinedRooms} = useReload();
 

  const handleContinue = () => {
    if (inputRef?.current?.value)
    {
      
      Instanse.post(`/chat/joinProtected/${roomId}`, {password: inputRef?.current?.value})
      .then((res) => {
                        
                        if (res?.data === 'password incorrect')
                          setError(res?.data)
                        else if (res?.data ===  'success')
                        {
                          
                          setReloadUnjoined();
                          setReloadJoinedRooms();
                          setJoinPopupOff();
                        }
                      })
      
    }
  }

  if (error)
    return (
      
      <div className={[style.colorBg, "absolute top-0 left-0 right-0 bottom-0 flex  justify-center items-center"].join(" ")}>
    
        <div className={[style.popUpbg , "relative flex  justify-center items-center w-[28vw] h-[19vw] rounded-[2vw] gap-[2vw] "].join(" ")}>

          <p className={[Fonts.font3,'text-[1.4vw] text-[#E63946]'].join(" ")}>{error}</p>

            <button onClick={() =>  setJoinPopupOff()} className=" absolute top-[0.7vw] right-[0.7vw] w-[1.4vw] rounded-full bg-[#E63946] h-[1.4vw]  flex justify-center items-center ">
              <ReactSVG className={ "w-[0.7vw]"} src={cancel_icon}/>
            </button>

        </div>
      </div>  
    )




  return (
    <div className={[style.colorBg, "absolute top-0 left-0 right-0 bottom-0 flex  justify-center items-center"].join(" ")}>
   
        <div className={[style.popUpbg , "relative flex flex-col justify-center items-center w-[28vw] h-[19vw] rounded-[2vw] gap-[2vw] "].join(" ")}>

            <div className='w-[50%] h-[40%] flex flex-col justify-center items-center gap-[0.3vw]'>
              <div className='h-[5vw] w-[5vw] flex justify-center items-center ' >
                <Avatar src={image}  wd_="100%"/>
              </div>
              <h3 className={[Fonts.font2, "text-[1vw] text-[#A8DADC]"].join(" ")}>{roomName}</h3>
            </div>
            <div className=' flex flex-col justify-center items-center  w-[100%] h-[45%] gap-[0.5vw]'>
                <input className={[Fonts.font2, style.pupUpInputShadow, 'text-center focus:outline-none w-[57%] h-[2.8vw] rounded-[2vw] text-[white] placeholder-[#457B9D] text-[0.8vw]'].join(" ")}
                        placeholder={'Enter the Channel password'}
                        type={'password'}
                        ref={inputRef}
                        />

                <div className={'h-[4vw] w-[17vw] flex justify-center items-center mb-[1vw]'}>
                    <button type="button" onClick={handleContinue}>
                        <Button_ option="continue"/>
                    </button>
                </div>

            </div>
            <button onClick={() =>  setJoinPopupOff()} className=" absolute top-[0.7vw] right-[0.7vw] w-[1.4vw] rounded-full bg-[#E63946] h-[1.4vw]  flex justify-center items-center ">
              <ReactSVG className={ "w-[0.7vw]"} src={cancel_icon}/>
            </button>

        </div>
    </div>
   
  )
}
