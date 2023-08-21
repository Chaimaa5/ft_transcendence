import { create } from "zustand";

interface reload
{
    reloadMembers: number,
    reloadDm: number,
    reloadJoinedRooms: number,
    reloadUnjoined: number,
    setReloadDm: () => void,
    setReloadJoinedRooms: () => void,
    setReloadUnjoined: () => void,
    setReloadMembers: () => void
}

const useReload = create<reload>((set) => ({
    reloadMembers: 0,
    reloadDm: 0,
    reloadJoinedRooms: 0,
    reloadUnjoined: 0,
    setReloadDm: () => set((store) => ({reloadDm: store.reloadDm + 1})),
    setReloadJoinedRooms: () => (set((store) => ({reloadJoinedRooms: store.reloadJoinedRooms + 1}))),
    setReloadUnjoined: () => set((store) => ({reloadUnjoined: store.reloadUnjoined + 1})),
    setReloadMembers: () => set((store) => ({reloadMembers: store.reloadMembers + 1}))
}))

export default  useReload;