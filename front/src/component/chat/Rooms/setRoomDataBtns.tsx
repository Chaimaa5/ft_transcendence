import React from 'react'
import Instanse from '../../api/api';
import Button_ from '../../button'
import useChannelAvatar from '../ChatStore/usechannelAvatar';
import useProtectedOn from '../ChatStore/useProtectedOn';
import avatar_img from '../../tools/sign/avatar.png'
import {  useParams } from 'react-router-dom';
import useChannelData from '../ChatStore/useChannelData';
import useDisplayRoomSettings from '../ChatStore/useDisplayRoomSettings';
import { Link } from 'react-router-dom';
import useReload from '../ChatStore/useReload';


export const SetRoomDataBtns = () => {
    const {setReloadJoinedRooms} = useReload();
    const { update} = useDisplayRoomSettings();
    const {setImg} = useChannelAvatar();
    const {channelAvatar, channelName, channelType, channelPwd,updateChannelName,  updateChannelPwd, updateChannelType, updateChannelAvatar } = useChannelData();
    const { setProtectedOn} = useProtectedOn();
    const chatId = useParams().roomId;

    
    const handleSave = () => {
            const UpdateChannel =  new FormData();
            UpdateChannel.append('name', channelName);
            UpdateChannel.append('image', channelAvatar);
            UpdateChannel.append('type', channelType);
            UpdateChannel.append('password', channelPwd);
            if (chatId)
                UpdateChannel.append('roomId', chatId );
            const header = {   
            headers: { 'content-type': 'multipart/form-data' }
        }
        
        Instanse.post("/chat/update", UpdateChannel, header);

        
        updateChannelName("");
        updateChannelPwd("");
        updateChannelType('public');
        updateChannelAvatar("");
        setProtectedOn(false);
        setImg(avatar_img);
        update(false);
    }

    const handleDelete = () => {
        Instanse.delete(`/chat/${chatId}`)
        .then(() => {
            setReloadJoinedRooms() ;
            updateChannelName("");
            updateChannelPwd("");
            updateChannelType('public');
            updateChannelAvatar("");
            setProtectedOn(false);
            setImg(avatar_img); 
            update(false) ;

        })
    }

    return (
        <div className={'h-[4vw] w-[60%] flex justify-center items-center  '} >
            <div className={'h-[100%] w-[17vw] flex justify-center items-center mb-[1vw]'}>
                <Link to={'/chat'}>
                    <button onClick={handleDelete} 
                            type="button"  >
                        <Button_ option="Delete"/>
                    </button>
                </Link>
            </div>
            <div className={'h-[100%] w-[17vw] flex justify-center items-center mb-[1vw]'}>
                <button  onClick={handleSave}
                        type="button" >
                    <Button_ option="Save"/>
                </button>
            </div>
        </div> 
    )
}
