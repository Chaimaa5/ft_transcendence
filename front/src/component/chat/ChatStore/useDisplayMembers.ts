import { create } from "zustand";

interface Opt
{
    on: boolean,
    username: string,
    userId: string,
    avatar: string,  

    DmroomId: string
}

interface displayMmbr{
    on: boolean,
    username: string,
    userId: string,
    avatar: string,

    DmroomId: string,
    setDisplayMembers: (obj: Opt) => void
    setOff: () => void
}


const useDisplayMembers = create<displayMmbr>(set => ({
    on: false, 
    username: '', 
    userId: '', 
    avatar: '',
    DmroomId: '',

    setDisplayMembers: (obj) => set(() => ({on: obj.on, 
        username: obj.username, 
        userId: obj.userId, 
        avatar: obj.avatar, 
        DmroomId: obj.DmroomId
        })),

    setOff: () => set(() => ({on: false}))
}))

export default useDisplayMembers;