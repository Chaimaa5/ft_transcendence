import React from 'react'
import Style from "./styleRoom.module.css"
import { Member } from './Member'

export const SetRoomMembersList = () => {
    const members = [1, 2, 3, 5, 6, 7, 8,9,1,2,3,4,5,6,7, 8,9,1,2,3,4,5,6,7,8,9,1,2,3,4,5,6,7]
    
  
   
  
    return (
      <div className={  "flex flex-col w-[90%] h-[77%] justify-center items-center  mb-[-4%]"}>

  
          <div className={[Style.frame, Style.MembersListShadow , " relative w-[100%] h-[100%] rounded-[1.5vw]  bg-gradient-to-br from-[#1D3557] to-[#0F294F]  overflow-y-auto overflow-x-hidden"].join(" ")}>
            {members.map(e => <Member/>)}
            
            <button className="  bottom-[2%] left-[94%] sticky w-[1.3vw] rounded-full bg-[#457B9D] h-[1.3vw]  flex justify-center items-center ">
              <img src="./src/component/tools/btnsIcons/test.svg" className={" w-[0.8vw] "}/>
            </button>
            <div className={[Style.font2,'absolute top-0 right-0 left-0 w-[100%] h-[8%] rounded-t-[1.5vw] text-[0.9vw] pt-[0.7vw] flex justify-center items-center '].join(" ")}>Members</div>
          </div>
      </div>
    )
}
