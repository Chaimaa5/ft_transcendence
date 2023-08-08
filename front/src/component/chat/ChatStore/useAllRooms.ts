import { create } from "zustand"

  
export  interface RoomObj
{
    id: number,
    name: string,
    image: string,
    count: string,
    type: string 
}
  
interface AllRooms
{
    myRooms: RoomObj[],
    otherRooms: RoomObj[],
    setJoinedRooms: (state: RoomObj[]) => void
    setUnjoinedRooms: (state: RoomObj[]) => void
}

const useAllRooms =  create<AllRooms>(set  => ({
    myRooms: [],
    otherRooms: [],
    setJoinedRooms: (state) => set(()=> ({myRooms: state})),
    setUnjoinedRooms: (state) => set(()=> ({otherRooms: state}))
}))

export default useAllRooms;