import { create } from "zustand"

export interface memberObj{
    membershipId: number,
    userId: string,
    username: string,
    avatar: string,
    role: string,
    isBanned: boolean,
    isMuted: boolean,
    isFriend: boolean,
    isSender: boolean,
    isReceiver: boolean,
    isBlocked: boolean,
    DmroomId: string
}

interface MembersStore{
    membersList: memberObj[],
    setMembersList: (state: memberObj[]) => void
}

const useRoomMembers =  create<MembersStore>(set => ({
    membersList: [],
    setMembersList: state => set(() => ({membersList: state}))
}))

export default useRoomMembers;