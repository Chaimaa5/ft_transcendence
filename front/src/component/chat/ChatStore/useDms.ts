import { create } from "zustand"

  
export  interface DmObj
{
    id: number,
    name: string,
    image: string,
    message: string,
    userId: string
}

interface MyDms
{
    Dms_List: DmObj[],
    updateDms: (state: DmObj[]) => void
}

const useDms = create<MyDms>(set => ({
    Dms_List: [],
    updateDms: (state) => set(()=>({Dms_List: state}))
}))

export default useDms;