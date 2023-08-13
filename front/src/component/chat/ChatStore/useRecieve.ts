import { create } from "zustand"

interface rcvFlag
{
    rcvMsgFlag: number,
    setRcvFlag: () => void
}


const useRcvflag = create<rcvFlag>(set => ({
    rcvMsgFlag: 0,
    setRcvFlag: () => set((store)=>({rcvMsgFlag: store.rcvMsgFlag + 1}))
}))

export default useRcvflag;