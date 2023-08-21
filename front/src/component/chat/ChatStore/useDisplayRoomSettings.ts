import { create } from "zustand"

interface DisplayRoom
{
    myPrev: string,
    On: boolean,
    update: (state: boolean) => void
    setPrev: (state: string) => void
    
    
}

const useDisplayRoomSettings = create<DisplayRoom>(set => ({
    On: false,
    myPrev: '',
    update: (state) => ( set(() => ({On: state})) ),
    setPrev: (state) => ( set(() => ({myPrev: state})) ),
   

}))

export default useDisplayRoomSettings;