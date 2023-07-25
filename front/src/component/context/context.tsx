import { createContext } from "react"
import React from "react"

type cntx = {
    username: string,
    avatar: string,
    id: string,
    XP: number,
    level: number, 
    topaz: number,
    win: number ,
    loss: number, 
    games: number,
    rank: number,
}
const CrContext = createContext<cntx>(
    {
        username: "",
        avatar: "",
        id: "",
        XP: 0,
        level: 0, 
        topaz: 0,
        win: 0 ,
        loss: 0, 
        games: 0,
        rank: 0,
    }
)
export default CrContext