import { create } from "zustand"

interface NewChan
{
    addNewChannel: boolean,
    updateAddNewChannel: (state: boolean) => void
}

const useNewchannelCreate =  create<NewChan>(set => ({
    addNewChannel: false,
    updateAddNewChannel: (state) => set(() => ({addNewChannel: state}))
}))

export default useNewchannelCreate ;