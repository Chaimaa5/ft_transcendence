import { create } from "zustand"
import av_icon from '../../tools/profile.png'

interface ChannelAvatar
{
    img_: string,
    setImg: (new_img: string) => void
}

const useChannelAvatar = create<ChannelAvatar>(set => ({
    img_: av_icon,
    setImg: (im) => set(() => ({img_: im}))

}))

export default useChannelAvatar;