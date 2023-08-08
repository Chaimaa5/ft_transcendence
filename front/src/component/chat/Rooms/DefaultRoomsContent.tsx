import React from 'react'

import Style from "./styleRoom.module.css"
import useNewchannelCreate from '../ChatStore/useNewChannelCreate'

export const DefaultRoomsContent = () => {
    const {updateAddNewChannel} = useNewchannelCreate();
  
   
  
    return (
      <div className={"flex flex-col w-[100%] h-[90%] justify-center items-center rounded-[1.5vw]  bg-gradient-to-br from-[#1D3557] to-[#0F294F] gap-[1vw]  "}>
  
            <div className={ "  w-[30%] h-[30%] flex flex-col justify-center items-center"}>
                <h3 className={[Style.font3, 'text-[1.2vw] text-[#457B9D]'].join(" ")}>START YOUR</h3>
                <h3 className={[Style.font3, 'text-[1.2vw] text-[#A8DADC]'].join(" ")}>CHANNEL</h3>
                <h3 className={[Style.font3, 'text-[1.2vw] text-[#457B9D]'].join(" ")}>ADVENTURE!</h3>
            </div>

            
            <button onClick={() => updateAddNewChannel(true) } 
                    className="  w-[1.8vw] rounded-full bg-[#457B9D] h-[1.8vw]  flex justify-center items-center ">
              <img src="./src/component/tools/btnsIcons/test.svg" className={" w-[1vw] "}/>
            </button>
        
      </div>
    )
}
