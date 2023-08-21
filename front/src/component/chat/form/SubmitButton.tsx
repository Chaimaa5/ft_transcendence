import React from 'react'
import Button_ from '../../button'
import useChannelData from '../ChatStore/useChannelData'
import axios from 'axios';
import Instanse from '../../api/api';
import useProtectedOn from '../ChatStore/useProtectedOn';
import useNewchannelCreate from '../ChatStore/useNewChannelCreate';
import useChannelAvatar from '../ChatStore/usechannelAvatar';
import avatar_img from '../../tools/sign/avatar.png'
import useReload from '../ChatStore/useReload';


export const SubmitButton = () => {
    const {setImg} = useChannelAvatar();
    const {setReloadJoinedRooms} = useReload();
    const {channelAvatar, channelName, channelType, channelPwd,updateChannelName,  updateChannelPwd, updateChannelType, updateChannelAvatar } = useChannelData();
    const { setProtectedOn} = useProtectedOn();
    const {updateAddNewChannel} = useNewchannelCreate();

    const sendData = () =>{
         const CreateChannel =  new FormData();
            CreateChannel.append('name', channelName);
            CreateChannel.append('image', channelAvatar);
            CreateChannel.append('type', channelType);
            CreateChannel.append('password', channelPwd);
         const header = {   
            headers: { 'content-type': 'multipart/form-data' }
          }
        Instanse.post("/chat/create", CreateChannel, header)
        .then(() => {
                setReloadJoinedRooms();
                updateChannelName("");
                updateChannelPwd("");
                updateChannelType('public');
                updateChannelAvatar("");
                setProtectedOn(false);
                updateAddNewChannel(false);
                setImg(avatar_img);
            })
        

    }
 
    return (
        <div className={'h-[4vw] w-[17vw] flex justify-center items-center mb-[1vw]'}>
            <button type="button"  onClick={sendData}>
                <Button_ option="continue"/>
            </button>
        </div>
    )
}
