import { create } from "zustand";

interface UserRooms
{
    joinedRooms: boolean;
    updateCurrentRooms: (s: boolean) => void;
}

const useRooms = create<UserRooms>( set => ({
    joinedRooms: true,
    updateCurrentRooms: (s) => set(() => ({joinedRooms: s}) )
}))

export default useRooms;