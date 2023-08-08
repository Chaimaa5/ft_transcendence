import { create } from "zustand"

interface DisplayRoom
{
    On: boolean,
    update: (state: boolean) => void
}

const useDisplayRoomSettings = create<DisplayRoom>(set => ({
    On: false,
    update: (state) => ( set(() => ({On: state})) )
}))

export default useDisplayRoomSettings;