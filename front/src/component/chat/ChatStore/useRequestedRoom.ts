import { create } from "zustand"

export interface MsgObj{
    id: number,
    username: string,
    avatar: string,
    content: string
}

export interface requestedChnlObj{
    name: string,
    image: string,
    type: string,
    isChannel: boolean,
    role: string,
    messages: MsgObj[]
}

interface channelData
{
    roomData: requestedChnlObj,
    updateRoomData: (state: requestedChnlObj) => void
}

const useRequestedRoom =  create<channelData>(set => ({
    roomData: {name: "",
            image: "",
            type: "",
            isChannel: false,
            role: "",
            messages: []},

    updateRoomData: (state) => set( () => ({roomData: state}))

}))

export default useRequestedRoom;