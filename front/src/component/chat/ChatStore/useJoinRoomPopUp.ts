import { create } from "zustand";

interface joinRoom
{
    joinPopupOn: boolean;
    popUpid: number,
    setJoinPopupOn: (state: number) => void,
    setJoinPopupOff: () => void
}

const useJoinRoonPopUp =  create<joinRoom>(set => ({
    joinPopupOn: false,
    popUpid: 0,
    setJoinPopupOn: (state) => set(() => ({popUpid: state, joinPopupOn: true})),
    setJoinPopupOff: () => set(() => ({joinPopupOn: false}))
}))

export default useJoinRoonPopUp;