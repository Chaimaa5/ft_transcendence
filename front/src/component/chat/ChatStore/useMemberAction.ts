import { create } from "zustand"

interface MemberAction
{
    action: number,
    setAction: () => void
}

const useMemberAction =  create<MemberAction>(set => ({
    action: 0,
    setAction: () => set((store) => ({action: store.action + 1}))
}))

export default useMemberAction ;