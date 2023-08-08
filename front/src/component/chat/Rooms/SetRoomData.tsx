import React, { useRef, useState, RefObject } from 'react'
import useChannelAvatar from '../ChatStore/usechannelAvatar'
import { ReactSVG } from 'react-svg'
import style from '../form/form.module.css'
import Avatar from '../../avatar'
import upload_icon from '../../tools/sign/upload.svg'
import style2 from '../styleChat.module.css'
import useProtectedOn from '../ChatStore/useProtectedOn'
import { ChannelDataInputs } from '../form/ChannelDataInputs'
import { SubmitButton } from '../form/SubmitButton'
import { CancelForm } from '../form/CancelForm'

export const SetRoomData = () => {
    const {img_, setImg} = useChannelAvatar();
    const [on, setOn] = useState(false);
    const inputRef: RefObject<HTMLInputElement> = useRef(null);
    const inputRefProtected: RefObject<HTMLInputElement> = useRef(null);
    const { setProtectedOn} = useProtectedOn();
    const inputRefPrivate: RefObject<HTMLInputElement> = useRef(null);


    const handleInputChange = (e) => {
        const file = e.target.files[0];
        if (file)
          setImg(URL.createObjectURL(file));
      }

    const handleButtonClick = ()=>{
    inputRef?.current?.click();
    setOn(true);
    }     

    const  handleCheckboxClick = (e) =>{
    
        if (!e?.target?.checked)
         setProtectedOn(false);
        else
         setProtectedOn(true);
        if (e?.target?.checked && inputRefPrivate?.current?.checked)
          inputRefPrivate?.current?.click();
      }

      const handleCheckboxPrivateClick = (e) => {
        if (e?.target?.checked && inputRefProtected?.current?.checked)
          inputRefProtected?.current?.click();
      }

  return (
    <div className={' w-[50%] h-[90%] flex flex-col justify-between items-center mb-[-4%]'}>


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
          
          
          

    </div>
  )
}
