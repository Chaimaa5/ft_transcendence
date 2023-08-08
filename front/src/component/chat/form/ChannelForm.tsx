import React, { useRef, useState, RefObject } from 'react'
import style from './form.module.css'
import style2 from '../styleChat.module.css'
import Avatar from '../../avatar'
import upload_icon from '../../tools/sign/upload.svg'
import { ReactSVG } from 'react-svg'
import useChannelAvatar from '../ChatStore/usechannelAvatar'
import useProtectedOn from '../ChatStore/useProtectedOn'
import { ChannelDataInputs } from './ChannelDataInputs'
import { SubmitButton } from './SubmitButton'
import { CancelForm } from './CancelForm'
import useChannelData from '../ChatStore/useChannelData'


export const ChannelForm = () => {
  const {img_, setImg} = useChannelAvatar();
  const { channelType, updateChannelAvatar, updateChannelType } = useChannelData();
  const [on, setOn] = useState(false);
  const { setProtectedOn} = useProtectedOn();
  const inputRef: RefObject<HTMLInputElement> = useRef(null);
  const inputRefProtected: RefObject<HTMLInputElement> = useRef(null);
  const inputRefPrivate: RefObject<HTMLInputElement> = useRef(null);

  const handleButtonClick = ()=>{
    inputRef?.current?.click();
    setOn(true);
  }

  const handleInputChange = (e) => {
    const file = e.target.files[0];
    if (file)
    {
      updateChannelAvatar(file);
      setImg(URL.createObjectURL(file));
    }
  }

  const  handleCheckboxClick = (e) =>{
    
    if (!e?.target?.checked)
     setProtectedOn(false);
    else
    {
      setProtectedOn(true);
      updateChannelType("protected");
    }
    if (e?.target?.checked && inputRefPrivate?.current?.checked)
      inputRefPrivate?.current?.click();
  }

  const handleCheckboxPrivateClick = (e) => {
    if (e?.target?.checked )
      updateChannelType("private");
    if (e?.target?.checked && inputRefProtected?.current?.checked)
      inputRefProtected?.current?.click();
  }

  return (
    <div className={[style.colorBg, "absolute top-0 left-0 right-0 bottom-0 flex  justify-center items-center"].join(" ")}>
        
        <form className={"relative w-[25vw] h-[28vw] bg-gradient-to-br from-[#457B9D] to-[#1D3557] rounded-[2vw] flex flex-col justify-evenly items-center gap-[0.8vw]"}>

          <div className=' h-[4.5vw] w-[4.5vw] flex justify-center items-center ' >
              <input type='file' style={{ display: 'none' }} ref={inputRef} onChange={handleInputChange}/>
              <button type="button" className={' relative flex justify-center items-center '} onClick={handleButtonClick}>
                <Avatar src={img_}  wd_="4vw"/>
  
                {
                  !on && <ReactSVG className={[style.icon_, "absolute  z-[122]"].join(" ")} src={upload_icon}/>
                }
              </button>
          </div>

          <div className={'h-[4vw] w-[20vw] flex flex-col justify-center items-center'}>

              <div className={[style2.font2, "text-[0.8vw]  text-[#A8DADC] flex justify-center items-center  h-[40%] w-[10vw]  gap-[1vw]"].join(" ")}>
                <p >Protected</p>
                <label className={style2.checkbox}>
                  <input type="checkbox" ref={inputRefProtected} name="checkboxrotected" onClick={handleCheckboxClick}/>
                  <span className={style2.checkmark}></span>
                </label >
              </div>

              <div className={[style2.font2,"text-[0.8vw]  text-[#A8DADC] flex justify-center items-center  h-[40%]  w-[10vw] gap-[2vw]"].join(" ")}>
                <p>Private</p>
                <label className={style2.checkbox}>
                  <input type="checkbox" ref={inputRefPrivate} name="checkboxPrivate" onClick={handleCheckboxPrivateClick}/>
                  <span className={style2.checkmark}></span>
                </label>
              </div>

          </div>

          <ChannelDataInputs/>
          <SubmitButton/>
          <CancelForm/>
    
            
        </form>

    </div>
  )
}