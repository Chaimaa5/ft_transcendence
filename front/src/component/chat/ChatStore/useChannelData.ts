import { create } from "zustand"


interface ChannelFormInput
{
    channelAvatar: any,
    channelName: string,
    channelPwd: string,
    channelType: string,
    updateChannelName: (state: string) => void,
    updateChannelPwd: (state: string) => void,
    updateChannelType: (state: string) => void,
    updateChannelAvatar: (state: string) => void
}

const useChannelData = create<ChannelFormInput>(set => ({
    channelAvatar: "" ,
    channelName: "",
    channelPwd: "",
    channelType: "public",
    updateChannelName: (state) => ( set(() => ({channelName: state}))),
    updateChannelPwd: (state) => set(() => ({channelPwd: state})),
    updateChannelType: (state) => set(() => ({channelType: state})),
    updateChannelAvatar: (state)=> set(() => ({channelAvatar: state}))
}))

export default useChannelData;