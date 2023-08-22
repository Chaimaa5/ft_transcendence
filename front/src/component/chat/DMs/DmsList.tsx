import React, { useEffect } from 'react'
import Style from "../Rooms/styleRoom.module.css"
import style from '../Rooms/styleRoom.module.css'
import { Dm } from './Dm'
import Instanse from '../../api/api'
import useDms from '../ChatStore/useDms'
import { DmObj } from '../ChatStore/useDms'
import useReload from '../ChatStore/useReload'

export const DmsList = () => {
  const {reloadDm} = useReload();
  const {Dms_List: rooms, updateDms} = useDms();
  
  useEffect(()=>{
    Instanse.get<DmObj[]>("/chat/rooms")
    .then(res =>{updateDms(res?.data) })
  }, [reloadDm])
  

  const extractSlice = (str: string) : string =>{
    if (str.length > 10)
      return (str.slice(0, 9))
    return (str)
  }

  return (
    <div className={"w-[100%] h-[50%] flex  justify-center items-center flex-col "}>

        <div className={[style.font3,  'text-[0.8vw] text-[#F1FAEE] w-[100%] h-[10%] flex justify-center items-center'].join(" ")}>Dms List</div>
        
            <div className={[Style.frame, "w-[100%] h-[90%] overflow-y-auto overflow-x-hidden"].join(" ")}>
              {rooms?.map((e, i) => { return <Dm key={i} 
                                        id={e.id} 
                                        image={e.image} 
                                        name={e.name} 
                                        lastMsg={e.message ?  extractSlice(e.message) : "No messages"}
                                        userId={e.userId}/>}
                                        )}
            </div>
        

    </div>
  )
}
