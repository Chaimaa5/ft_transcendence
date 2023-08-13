import { Socket } from "socket.io-client";
import { create } from "zustand";

interface socketStore{
    chatSocket: Socket | null,
    setChatsocket: (state: Socket | null) => void
}

const useSocket = create<socketStore>(set => ({
    chatSocket: null,
    setChatsocket: (state) => set(()=>({chatSocket: state}))
}))

export default useSocket;