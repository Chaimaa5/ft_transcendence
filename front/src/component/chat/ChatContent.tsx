import React from 'react'
import style from './styleChat.module.css'


export const ChatContent = () => {
    const messages = [{id: 1, m: "This is Message 1"},{id: 2, m: "This is Message 1 randomly typed to test the div width XXXXXXXX XXXXXXXX XXXXXXXXX"},{id: 3, m: "This is Message 1"},{id: 4, m: "This is Message 1"},{id: 5, m: "This is Message 1"},{id: 6, m: "This is Message 1"},{id: 7, m: "This is Message 1"},{id: 8, m: "This is Message 1"},{id: 9, m: "This is Message 1"},{id: 10, m: "This is Message 1"},{id: 11, m: "This is Message 1"},{id: 12, m: "This is Message 1"},{id: 13, m: "This is Message 1"},{id: 1, m: "This is Message 1"},{id: 14, m: "This is Message 1"},{id: 15, m: "This is Message 1"}, {id: 16, m:"This is Message 2"}, {id: 17, m:"This is Message 3"}, {id: 18, m:"This is Message 4"}, {id: 19, m:"This is Message 5"}, {id: 20, m:"This is Message 6"}, {id:21, m:"This is Message 7"}, {id: 22, m:"This is Message 8"}, {id: 23, m:"This is Message 9"}]
    

  return (
    <div className={"w-[100%] h-[90%] bg-gradient-to-br from-[#457B9D] to-[#1D3557]  flex flex-col rounded-b-[2vw]  items-center "}>
        <div className={[style.font3, "w-[100%] h-[93%] overflow-y-auto mb-[1vw]"].join(" ")} >

            {messages.map((message) => <div key={message.id} className={"text-[white]  text-[1vw] ml-[1vw] flex justify-center items-center rounded-br-[0.6vw] rounded-bl-[0.6vw] rounded-tr-[0.6vw] w-fit max-w-[80%]  pt-[0.5vw] pb-[0.5vw] pl-[0.7vw] pr-[0.5vw] border-[#457B9D] bg-[#457B9D] mb-[0.8vw] mt-[0.8vw]"}>{message.m}</div>)}
        </div>
        <div className={"w-[95%] h-[8%] bg-[#457B9D] rounded-[2vw] mb-[1vw] drop-shadow-xl flex justify-between 		"} >
            <input type={"text"} name={"message"} placeholder={"Type out your message here..."} className={[ style.font1 , "text-[0.8vw] w-[80%] text-[white] h-[100%] caret-[#1D3557]  outline-none bg-[#457B9D] rounded-[2vw] focus:border-2 focus:border-[#38769c] focus:drop-shadow-lg pl-[0.8vw]"].join(" ")}/>
            <button className={[style.font2, style.st, "w-[20%]  h-[90%] rounded-[2vw] flex justify-center items-center gap-[0.5vw]"].join(" ")}>
                <img src={"./src/component/tools/button/Union.svg"} className={"w-[0.7vw]"}/>
                <p className={"text-[0.7vw] text-[#A8DADC] "}>Send</p>
            </button>
        </div>
    </div>
  )
}
