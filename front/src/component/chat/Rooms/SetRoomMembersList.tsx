import React, { useContext, useEffect, useState } from 'react'
import Style from "./styleRoom.module.css"
import { Member } from './Member'
import { ReactSVG } from 'react-svg'
import icon from '../../tools/btnsIcons/test.svg'
import icon2 from '../../tools/btnsIcons/recoverMembers.svg'
import Instanse from '../../api/api'
import { useParams } from 'react-router-dom'
import useRoomMembers from '../ChatStore/useRoomMembers'
import { memberObj } from '../ChatStore/useRoomMembers'
import CrContext, { cntx } from '../../context/context'
import Avatar from '../../avatar'
import useMemberAction from '../ChatStore/useMemberAction'

export const SetRoomMembersList = () => {
  const { membersList,  setMembersList} = useRoomMembers();
  const [membersToAdd, setMembersToAdd] = useState<{username: string, avatar: string, id: string}[]>([]);
  const [searchVal, setSearchVal] = useState('');
  const [userSelected, setUserSelected] = useState<{username: string, avatar: string, id: string}>({username: '', avatar: '', id: ''});
  let members: memberObj[] = [];
  const {action} = useMemberAction();
  const chatId = useParams().roomId;
  const data: cntx = useContext(CrContext);
  const [addOn, setAddOn] = useState<boolean>(false);

  useEffect(()=>{
    Instanse.get<memberObj[]>("/chat/roomMembers/" + chatId)
    .then(res => setMembersList(res?.data))
  }, [action])
    

  useEffect(()=>{
    if(searchVal)
    {
      let input = searchVal;
      Instanse.post('/home/search', {input})
      .then((res) => {
        setMembersToAdd(res?.data);
      });
    } 
    else 
      setMembersToAdd([]);
  }, [searchVal])

  useEffect(()=>{
    if (userSelected?.id && chatId)
      Instanse.post('/chat/add', {roomId: parseInt(chatId), userId: userSelected.id})
  }, [userSelected])

  if (data)
    members = membersList?.filter(e => e.userId != data.id );

    if (addOn)
    {
      return (
        <div className={  "flex flex-col w-[90%] h-[77%] justify-center  items-center   mb-[-4%]"}>

  
          <div className={[Style.frame, Style.MembersListShadow , " relative w-[100%] h-[100%] rounded-[1.5vw]  bg-gradient-to-br from-[#1D3557] to-[#0F294F] flex  flex-col justify-center items-center "].join(" ")}>
            
              <div className={` w-[100%] h-[20%] flex flex-col justify-center items-center gap-[1vw] rounded-t-[1.5vw]`}>
                <div className={[Style.font2,' w-[100%] h-[7%]  text-[0.9vw] pt-[0.7vw] flex justify-center items-center '].join(" ")}>
                  {`Add members`}
                </div>
                <input
                  type='text'
                  className={[Style.searchShadow, Style.font3,  `w-[75%] h-[47%] rounded-[2vw] bg-[#1D3557] text-center text-[0.8vw] placeholder-[#457B9D] focus:outline-none`].join(' ')}
                  placeholder={`Search...`}
                  value={searchVal}
                  onChange={(e) => {setSearchVal(e?.target?.value);
                                    setUserSelected({username: '', avatar: '', id: ''})}}
                />

              </div>
              
              {membersToAdd && 
                <div className={` w-[100%] h-[80%] flex flex-col justify-start items-center overflow-y-scroll`}>
                    {membersToAdd?.map((value, key) => {
                          return(
                              <button key={key} 
                                      onClick={() => {
                                        setUserSelected(value);
                                        setMembersToAdd([]);
                                      }}
                                  className="flex m-[2%] h-[28%] w-[95%] justify-evenly rounded-[2vw] items-center border-[0.1vw] border-[#F1FAEE]">
                                  <Avatar src={value.avatar} wd_="2vw"/>
                                  <h1 className="text-[1vw] text-LightBlue">{value.username}</h1>
                              </button>
                          )
                        })
                      }
                      {
                        userSelected?.id &&
                         (userSelected?.id === data?.id || members?.filter(e => e.userId === userSelected.id).length )&&
                          <h1 className="text-[0.7vw] text-LightBlue">{userSelected?.username} is already a member of this channel!</h1>

                          || 

                        userSelected?.id &&
                        !members?.filter(e => e.userId === userSelected.id).length &&
                        <h1 className="text-[0.7vw] text-LightBlue">{userSelected?.username} is now a member of this channel!</h1>
                        
                      }
                     
                </div>
              }

              <button onClick={() => setAddOn(false)}
                      className="  bottom-[2%] left-[92%] absolute w-[1.3vw] mt-[2vw] rounded-full bg-[#457B9D] h-[1.3vw]  flex justify-center items-center ">
                <ReactSVG src={icon2} className={" w-[0.8vw] "}/>
              </button>

          </div>
        </div>      
      )
    }
 
   
  
    return (
      <div className={  "flex flex-col w-[90%] h-[77%] justify-center  items-center   mb-[-4%]"}>

  
          <div className={[Style.frame, Style.MembersListShadow , " relative w-[100%] h-[100%] rounded-[1.5vw]  bg-gradient-to-br from-[#1D3557] to-[#0F294F]  overflow-y-auto overflow-x-hidden"].join(" ")}>
            {members?.map((e, i) =>  <Member key={i} membershipId={e?.membershipId} userId={e?.userId} username={e?.username} avatar={e?.avatar} role={e?.role} isBanned={e?.isBanned} isMuted={e?.isMuted} />  )}
            
              <button onClick={() => setAddOn(true)}
                      className="  bottom-[2%] left-[94%] sticky w-[1.3vw] mt-[2vw] rounded-full bg-[#457B9D] h-[1.3vw]  flex justify-center items-center ">
                <ReactSVG src={icon} className={" w-[0.8vw] "}/>
              </button>

              <div className={[Style.font2,'absolute top-0 right-0 left-0 w-[100%] h-[8%] rounded-t-[1.5vw] text-[0.9vw] pt-[0.7vw] flex justify-center items-center '].join(" ")}>
                Members
              </div>

          </div>
      </div>
    )
}
