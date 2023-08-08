import React from 'react'
import Button_ from '../../button'
import useChannelData from '../ChatStore/useChannelData'
import axios from 'axios';
import Instanse from '../../api/api';

export const SubmitButton = () => {
    const {channelAvatar, channelName, channelType, channelPwd,updateChannelName,  updateChannelPwd, updateChannelType, updateChannelAvatar } = useChannelData();
    const sendData = () =>{
         const CreateChannel =  new FormData();
         CreateChannel.append('name', channelName);
        CreateChannel.append('image', channelAvatar);
         CreateChannel.append('type', channelType);
         CreateChannel.append('password', channelPwd);
         const header = {   
            headers: { 'content-type': 'multipart/form-data' }
          }
        Instanse.post("api/chat/create", CreateChannel, header);
        updateChannelName("");
        updateChannelPwd("");
        updateChannelType("");
        updateChannelAvatar("");

    }
 
    return (
        <div className={'h-[4vw] w-[17vw] flex justify-center items-center mb-[1vw]'}>
            <button type="button"  onClick={sendData}>
                <Button_ option="continue"/>
            </button>
        </div>
    )
}
