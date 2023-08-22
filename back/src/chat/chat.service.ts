import { HttpException, HttpStatus, Injectable, Res, UnauthorizedException } from '@nestjs/common';
import { Membership, PrismaClient } from '@prisma/client';
import { Response } from 'express';
import { NOTFOUND } from 'dns';
import { AddMember, CreateChannel, CreateRoom, UpdateChannel } from './dto/Chat.dto';
import * as bcrypt from 'bcrypt';
import {promisify} from 'util';
import { isHexColor } from 'class-validator';
import { UserService } from 'src/user/user.service';
import { hasSubscribers } from 'diagnostics_channel';

@Injectable()
export class ChatService {
 
   


    prisma = new PrismaClient();
    secret = "secret togenerate for bcrypt";
 
    constructor(){}


    
    async unsetAdmin(id: any, membershipId: number) {
       try{
           const membership = await this.prisma.membership.findUnique({where: {id: membershipId}})
           const owner = await this.prisma.room.findFirst({where:{
               AND:[
                   {id: membership?.roomId},
                   {ownerId: id}
               ]
           }})
           if(owner){
               const member = await this.prisma.membership.update({where: {id: membershipId},
               data: {role: 'member'}})
               // await this.user.addNotifications(id, member.userId, "Admin", "Set you as administrator")
           }
           else
               throw new HttpException('User Is Not Owner', HttpStatus.BAD_REQUEST)
       }catch(e){
         throw new HttpException('User Not Granted Full Access', HttpStatus.BAD_REQUEST)
       }
    }

    async updateImage(Object: any[]){
            const ModifiedObject = Object.map((member) =>{
              if (member){
                  if (member.image)
                  {
                      if (member.image){
                        if(!member.image.includes('cdn.intra') && !member.image.includes('https://lh3.googleusercontent.com'))
                            member.image = 'http://' + process.env.HOST + ':' + process.env.BPORT +'/api' + member.image
                      }
                  }
              }
              return member
          })
          return ModifiedObject;
    }
    //dm
    async GetJoinedRooms(id : string){
        try{
            const rooms =  await this.prisma.room.findMany({
                where: {
                    AND:[
                        {isChannel: false},
                        {type: 'private'},
                        {
                            membership: {
                                some: {
                                    userId: {
                                        in: [id]
                                    },
                                    isBanned: false
                                }
                            },
                            
                        }
                    ]},
                include: {
                    membership: {
                        select: {
                            id: true, 
                            userId: true,
                            role: true,
                            roomImage: true,
                            roomName: true,
                            isBanned: true,
                            isMuted: true,
                        }
                    },
                    message:{
                        select:{
                            content: true,
                        }
                    }
                }
            })
            let userId = ''
            let modifiedRooms =  await Promise.all( rooms.map(async (room) =>{
                let message = ''
                if (room){
                    let members = room.membership
                    for (const member of members) {
                        if(member.userId != id){
                            userId = member.userId ;
                            const user = await this.prisma.user.findUnique({where: {id: member.userId}})
                            if(user){
                                if(user.avatar){
                                    if(!user.avatar.includes('cdn.intra') && !user.avatar.includes('https://lh3.googleusercontent.com')){
                                        room.image = 'http://' + process.env.HOST + ':' + process.env.BPORT +'/api' + user.avatar;
                                    }
                                    else
                                        room.image = user.avatar;
                                }
                                room.name = user.username as string;
                            }
                        }
                    }
                    if(room.message){
                        const number  = await this.prisma.message.count({where: {roomId: room.id}})
                        if(number)
                            message = room.message[number - 1].content;
                    }
                }
                    return  {
                        'id': room.id,
                        'name': room.name,
                        'type': room.type,
                        'image': room.image,
                        'ownerId': room.ownerId,
                        'userId': userId,
                        'message': message
                    }
            }))
            return modifiedRooms
        }catch(e){throw new HttpException('Undefined Parameters', HttpStatus.BAD_REQUEST) }
    }

    async CreateRoom(ownerId: string, memberId: string, name: string) {
        try{
            const roomCheck = await this.prisma.room.findFirst({
                where: {
                    AND: [
                        {membership: {
                            some: {
                              userId: memberId,
                            },
                          },},
                          {membership: {
                            some: {
                              userId: ownerId,
                            },
                          },},
                        {isChannel: false}
                    ]
                },
                select: {membership: true}
            })
            if(!roomCheck){

                const room = await this.prisma.room.create({
                    data: {
                        name: name ,
                        image: '/upload/avatar.png',
                        type: 'private',
                        ownerId: ownerId,
                        isChannel: false,
    
                    }
                })
                const member1 = await this.prisma.user.findUnique({where: {id: ownerId}})
                const member2 = await this.prisma.user.findUnique({where: {id: memberId}})
                if(member1 && member2){
                    await this.prisma.membership.createMany({
                        data: [
                            {
                                roomId: room.id,
                                userId: ownerId,
                                role: 'owner',
                                isBanned: false,
                                roomImage: member2.avatar,
                                roomName: member2.username,
                                isMuted: false
                            },
                            {
                                roomId: room.id,
                                userId: memberId,
                                role: 'owner',
                                roomImage: member1.avatar,
                                roomName: member1.username,
                                isBanned: false,
                                isMuted: false
                            }
                         ]
                    })
                }
            } 
        }catch(e){throw new HttpException('Undefined Parameters', HttpStatus.BAD_REQUEST) }
    }

    async AddMember(id: string, data: AddMember) {
        try{

            if (id){
                const membership = await this.prisma.room.findUnique({
                    where: {id: data.roomId}
                }).membership({where: {userId: id}}) 
    
                if(membership)
                    if (membership[0].role != 'member'){
                        //check if user already exists
                        const member = await this.prisma.membership.findFirst({where: {
                            AND:[
                                {roomId: data.roomId},
                                {userId: data.userId as string}
                            ]
                        }})
                        if(member)
                            throw new HttpException('User Already Exists', HttpStatus.BAD_REQUEST)
                        else{
                                await this.prisma.membership.create({
                                data: {
                                    roomId: data.roomId,
                                    userId: data.userId as string,
                                    role: 'member',
                                    isBanned: false,
                                    isMuted: false
                                }
                            })
                            // await this.user.addNotifications(id, data.userId as string, "Channel", "Added you to a Channel")
                        }
                    }
                    else
                        throw new HttpException('User Not Granted Full Access', HttpStatus.BAD_REQUEST)
            }
        }catch(e){throw new HttpException('Undefined Parameters', HttpStatus.BAD_REQUEST) }
    }

    async CreateChannel(ownerId: string, data: CreateChannel, image: Express.Multer.File) {
        try{
            const nameCheck = await this.prisma.room.findFirst({where: {name: data.name as string}})
            if(nameCheck)
                return false;
            let  imagePath = '';
            if(image)
                imagePath = "/upload/" + image.filename
            else
                imagePath = "/upload/avatar.png";
            if(data.type === 'protected'){
    
                const EncryptedPaswword =  await bcrypt.hash(data.password as string, 10);
                const room = await this.prisma.room.create({
                    data: {
                        name: data.name as string,
                        image: imagePath,
                        type: data.type as string,
                        ownerId: ownerId,
                        password: EncryptedPaswword,
                        isChannel: true,
                    }
                })
                const createMember = await this.prisma.membership.create({
                    data: {
                        roomId: room.id,
                        userId: ownerId as string,
                        role: 'owner',
                        isBanned: false,
                        isMuted: false
                    }
                })
            }
           else{
    
                const EncryptedPaswword =  await bcrypt.hash(data.password as string, 10);
                const room = await this.prisma.room.create({
                    data: {
                        name: data.name as string,
                        image: imagePath,
                        type: data.type as string,
                        ownerId: ownerId,
                        password: '',
                        isChannel: true,
                    }
                })
                const createMember = await this.prisma.membership.create({
                    data: {
                        roomId: room.id,
                        userId: ownerId as string,
                        role: 'owner',
                        isBanned: false,
                        isMuted: false
                    }
                })
           }
        }catch(e){throw new HttpException('Undefined Parameters', HttpStatus.BAD_REQUEST) }

    }

    async hashPassword(password: string){
        try{
            const hashed =  await bcrypt.hash(password, 10);
            return hashed;
        }catch(e){throw new HttpException('Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR) }
    }
    
    
    async kick(ownerId: string, memberId: number){
        try{
            const member = await this.prisma.membership.findUnique({
                where: {id:  memberId}
            })
            if(member){
                const user = await this.prisma.membership.findFirst({
                    where:{AND: [
                        {roomId:  member.roomId},
                        {userId: ownerId}
                    ] }
                })
                if(user)
                {
                    if(user.role != 'member')
                        await this.prisma.membership.delete({where: {id:  memberId}})
                }
            }
        }
        catch(e){throw new HttpException('Undefined Parameters', HttpStatus.BAD_REQUEST) }
        
    }

    async leaveChannel(membershipId: number){

        try{

            const membership = await this.prisma.membership.findUnique({where: {id: membershipId}})
            if(membership){
                if(membership?.role === 'owner')
                {
                    let count = await this.prisma.membership.count({
                        where: {roomId: membership.roomId}
                    })
                    if(count > 1){    
                        //set owner
                        const newOwner = await this.prisma.membership.findFirst({
                            where: {
                                AND:[
                                    {roomId: membership.roomId},
                                    {userId:{
                                        notIn: [membership.userId]
                                    }},
                                    {isBanned: false},
                                ]    
                            }
                        })
                    
                        if (newOwner){
                            await this.prisma.membership.update({
                                where: {id: newOwner.id},
                                data: {
                                    role: 'owner'
                                }
                            })
                        
                            await this.prisma.room.update({
                                where: {id: membership.roomId},
                                data: {ownerId: newOwner.userId}
                            })
                            // await this.user.addNotifications(membership.userId, newOwner.userId, "Owner", "Set you as owner")
                        }
                        this.deleteMessages(membership.roomId, membership.userId)
                        this.deleteMembership(membershipId);
                    }
                    else{
                        this.deleteMembership(membershipId)
                        this.deleteRoom(membership.roomId);
                    }
    
                }
                else{
                    this.deleteMessages(membership.roomId, membership.userId)
                    this.deleteMembership(membershipId)
                }
            }
        }catch(e){throw new HttpException('Undefined Parameters', HttpStatus.BAD_REQUEST) }
    }

    async setAdmin(id : string, membershipId: number){
        try{

            const membership = await this.prisma.membership.findUnique({where: {id: membershipId}})
            const owner = await this.prisma.room.findFirst({where:{
                AND:[
                    {id: membership?.roomId},
                    {ownerId: id}
                ]
            }})
            if(owner){
                const member = await this.prisma.membership.update({where: {id: membershipId},
                data: {role: 'admin'}})
                // await this.user.addNotifications(id, member.userId, "Admin", "Set you as administrator")
            }
            else
                throw new UnauthorizedException('User Is Not Owner')
        }catch(e){throw new HttpException('Undefined Parameters', HttpStatus.BAD_REQUEST) }
    }

    async changePrivacy(roomId: number, id: string, type: string, pw: string){
        try{ 
            if (type === 'protected'){
                // let password = this.hash(pw)  
                await this.prisma.room.update({
                    where: {id: roomId},
                    data: {
                        type: type,
                        // password: password
                    },
    
                })
            }
            else{
                await this.prisma.room.update({
                    where: {id: roomId},
                    data: {type: type,},
    
                })
            }
        }catch(e){throw new HttpException('Permission Denied', HttpStatus.FORBIDDEN) }
    }


    async UpdateChannel(room : UpdateChannel, image: Express.Multer.File){
        try{
            const {roomId, name, type, password} = room
            const id = parseInt(roomId as string)
            let imagePath = ''
            if(image)
                imagePath = "/upload/" + image.filename
            if (type && password){
                let passwordEncrypted =  await bcrypt.hash(password as string, 10);
                await this.prisma.room.update({where: {id: id},
                    data: {
                        type: room.type as string,
                        password: passwordEncrypted,
        
                    }  
                })
            }
            else if(name){
                await this.prisma.room.update({where: {id: id},
                    data: {
                        name: room.name as string,
                    }  
                })
            }
            else if(image){
                await this.prisma.room.update({where: {id: id},
                    data: {
                        image: imagePath
                    }  
                })
            }
            else if(name && image){
                await this.prisma.room.update({where: {id: id},
                    data: {
                        name: room.name as string,
                        image: imagePath
                    }  
                })
            }
            else{
                let passwordEncrypted =  await bcrypt.hash(password as string, 10);
                await this.prisma.room.update({where: {id: id},
                    data: {
                        name: room.name as string,
                        image: imagePath,
                        type: room.type as string,
                        password: passwordEncrypted,
                    }  
                })
            }
        }catch(e){throw new HttpException('Permission Denied', HttpStatus.FORBIDDEN) }
    }

    
    async SetPassword(roomId: number, pw: string){
        try{
            const passwordEncrypted =   await bcrypt.hash(pw , 10);
            await this.prisma.room.update({
                where: {id: roomId},
                data: {
                    password: passwordEncrypted,
                }
            })
        }catch(e){throw new HttpException('Permission Denied', HttpStatus.FORBIDDEN) }
    }

    async deleteMembership(id: number){
        try{
            await this.prisma.membership.delete({
                where: {id: id}
            })
        }catch(e){throw new HttpException('Permission Denied', HttpStatus.FORBIDDEN) }
    }

    async deleteRoom(id: number){
        try{
            await this.prisma.message.deleteMany({where: {roomId: id}})
            await this.prisma.room.delete({where: {id: id}})
        }catch(e){throw new HttpException('Permission Denied', HttpStatus.FORBIDDEN) }
    }

    async deleteMessages(roomId: number, memberId: string){
        try{
            await this.prisma.message.deleteMany({
                where:{
                    AND:[
                        {roomId: roomId},
                        {userId: memberId}
                    ]
                }
            })
        }catch(e){throw new HttpException('Permission Denied', HttpStatus.FORBIDDEN) }
    }

    async muteMember(id: string, membershipId: number,  duration: any){
        try{
            const muteDuration = duration.duration
            const membership = await this.prisma.membership.findUnique({where: {id: membershipId}})
            if(membership){
                const user = await this.prisma.membership.findFirst({
                    where: {
                        AND:[
                            {roomId: membership?.roomId},
                            {userId: id}
                        ]
                    }
                })
                if(user?.role === 'member')
                    throw new UnauthorizedException('Permission Denied')
                const muteExpiration = new Date()
                if(muteDuration === '4 h')
                    muteExpiration.setMinutes(muteExpiration.getMinutes() + (4 * 60))
                if(muteDuration === '8 h')
                    muteExpiration.setMinutes(muteExpiration.getMinutes() + (8 * 60))
                if(muteDuration === '1 d')
                    muteExpiration.setMinutes(muteExpiration.getMinutes() + (24 * 60))
                if(muteDuration === '1 y')
                    muteExpiration.setMinutes(muteExpiration.getMinutes() + (8760 * 60))
                await this.prisma.membership.update({
                    where: {id: membershipId},
                    data:{
                        isMuted: true,
                        muteExpiration: muteExpiration.toISOString()
                    }
                })
            }
            else
                throw new UnauthorizedException('Permission Denied')
        }catch(e){throw new HttpException('Permission Denied', HttpStatus.FORBIDDEN) }
    }

    async UnmuteMember(id: string, membershipId: number){
        try{
            const membership = await this.prisma.membership.findUnique({where: {id: membershipId}})
            if(membership){
                const user = await this.prisma.membership.findFirst({
                    where: {
                        AND:[
                            {roomId: membership?.roomId},
                            {userId: id}
                        ]
                    }
                })
                if(user?.role === 'member')
                    throw new UnauthorizedException('Permission Denied')
                const muteExpiration = new Date()
    
                // muteExpiration.setMinutes(muteExpiration.getMinutes() + muteDuration)
                await this.prisma.membership.update({
                    where: {id: membershipId},
                    data:{
                        isMuted: false,
                        muteExpiration: null
                    }
                })
            }
            else
                throw new UnauthorizedException('Permission Denied')
        }catch(e){throw new HttpException('Undefined Parameters', HttpStatus.FORBIDDEN) }
    }
  
   

    async BanUpdate(id: string, membershipId: number, bool: boolean){
        try{

            const membership = await this.prisma.membership.findUnique({where: {id: membershipId}})
            if(membership){
                const user = await this.prisma.membership.findFirst({
                    where: {
                        AND:[
                            {roomId: membership?.roomId},
                            {userId: id}
                        ]
                    }
                })
                if(user?.role === 'member')
                    throw new UnauthorizedException('Permission Denied')
                await this.prisma.membership.update({
                    where: {id: membershipId},
                    data:{
                        isBanned: bool,
                    }
                })
            }
            else
                throw new UnauthorizedException('Permission Denied')
        }catch(e){throw new HttpException('Permission Denied', HttpStatus.FORBIDDEN) }

    }



    async GetChannels(id: string){
        try{

            let channels = await this.prisma.room.findMany({
                where: {
                    NOT: {
                        membership: {
                            some: {userId: id}
                        }
                    },
                    AND:[
                        {
                            OR: [
                                {type: 'protected'},
                                {type: 'public'}
                            ],
                        },
                        {isChannel: true},
                    ]
                },
                select:{
                    id: true,
                    name: true,
                    image: true,
                    type: true,
                    ownerId: true,
                }
            })
            let  channelsModified = await Promise.all(
            channels.map(async(channel) => {
                if (channel.image){
                    if(!channel.image.includes('cdn.intra') && !channel.image.includes('https://lh3.googleusercontent.com'))
                        channel.image = 'http://' + process.env.HOST + ':' + process.env.BPORT +'/api' + channel.image
                }
                    let count = await this.prisma.membership.count({
                        where: {roomId: channel.id, isBanned: false}
                    }) 
                    console.log(count)
                    return {'id': channel.id,
                            'name': channel.name,
                            'type': channel.type,
                            'image': channel.image,
                            'ownerId': channel.ownerId,
                            'count': count}
                })
    
            );
    
            return channelsModified
        }catch(e){throw new HttpException('Undefined Parameters', HttpStatus.BAD_REQUEST) }
    }


    async GetJoinedChannels(id: string){
        try{

            let channels = await this.prisma.room.findMany({
                where: {
                    AND: [
                        {isChannel: true},
                        {membership: {
                            some: {
                                userId: {
                                    in: [id]
                                },
                                isBanned: false
                            }
                        },}
                    ]
                },
                select:{
                    id: true,
                    name: true,
                    image: true,
                    type: true,
                    ownerId: true,
                }
            })
    
            // const channelModified = this.updateImage(channels) 
            const channelss = await Promise.all(
            channels.map(async(channel) => {
                if (channel.image){
                    if(!channel.image.includes('cnd.intra'))
                        channel.image = 'http://' + process.env.HOST + ':' + process.env.BPORT +'/api'+ channel.image
                }
                    let count = await this.prisma.membership.count({
                        where: {roomId: channel.id, isBanned: false}
                    })
                    return {'id': channel.id,
                            'name': channel.name,
                            'type': channel.type,
                            'image': channel.image,
                            'ownerId': channel.ownerId,
                            'count': count}
                })
            );
            return channelss
        }catch(e){throw new HttpException('Undefined Parameters', HttpStatus.BAD_REQUEST) }
    }
     

    async DeleteChannel(id: string, roomId: number) {
        try{

            const room = await this.prisma.room.findUnique({
                where: {id: roomId}
            })
            if(room?.ownerId === id)
            {
                await this.prisma.message.deleteMany({where: {roomId: roomId}})
                await this.prisma.membership.deleteMany({where: {roomId: roomId}})
                await this.prisma.room.delete({where: {id: roomId}})
            }
            else
                throw new UnauthorizedException('User Not Granted Full Access')
        }catch(e){throw new HttpException('Permission Denied', HttpStatus.FORBIDDEN) }
    }

    async storeMessage(roomId: number, userId: string, content: string){
        const room = await this.prisma.room.findUnique({where: {id: roomId}})
        if(room){
            const message = await this.prisma.message.create({
                data: {
                    roomId: roomId,
                    userId: userId,
                    content: content
                }
            })

            let user = await this.prisma.user.findUnique({where: {id: userId}})
            if (user?.avatar){
                if(!user.avatar.includes('cdn.intra') && ! user.avatar.includes('https://lh3.googleusercontent.com'))
                    user.avatar = 'http://' + process.env.HOST + ':' + process.env.BPORT +'/api' + user.avatar
            }
            return {
                'roomId': message.roomId,
                'type': room.type,
                'ischannel': room.isChannel,
                'userId': message.userId,
                'content': message.content,
                'avatar': user?.avatar,
            }
            //
            // await this.user.addNotifications()
        }
    }
    async getBlocked(id : string){
        try{
            if (id){
                const blockedFriendships = await this.prisma.friendship.findMany({where: {
                    AND:[
                        {
                            OR: [
                                {senderId: id},
                                {receiverId: id}
                            ]
                        },
                        {status: 'blocked'},
                    ]},
                    select:{
                        sender: {
                            select: {
                                id: true,
                                username: true,
                                avatar: true,
                            }
                        },
                        receiver: {
                            select: {
                                id: true,
                                username: true,
                                avatar: true,
                            }
                        },
                        blockerId: true,
                        receiverId: true,
                        senderId: true
                    }
                });
                return blockedFriendships.map((friendship) => {
                    return friendship.senderId === id ? friendship.receiver : friendship.sender;
                });
            }   
            else
                throw new UnauthorizedException('User  not found')
        }catch(e){throw new HttpException('Undefined Parameters', HttpStatus.BAD_REQUEST) }
    }

    async GetMessages(id: string, roomId: number) {
        try{
            const roomData = await this.prisma.room.findUnique({where: {id: roomId},
                select:{
                    name: true,
                    image: true,
                    type: true,
                    isChannel: true,
                    membership: true
                }
            }) 
            if(roomData){
    
                if(!roomData.isChannel){
                    if(roomData.membership){
                        for (const member of roomData.membership) {
                            if(member.userId == id){
                                if(member.roomImage)
                                    roomData.image = member.roomImage;
                                roomData.name = member.roomName as string;
                            }
                          }
                    }
                }
                if (roomData.image){
                    if(!roomData.isChannel){
                    let members = roomData.membership
                    for (const member of members) {
                        if(member.userId != id){
                            const user = await this.prisma.user.findUnique({where: {id: member.userId}})
                            if(user){
                                if(user.avatar){
                                    if(!user.avatar.includes('cdn.intra') && !user.avatar.includes('https://lh3.googleusercontent.com')){
                                        roomData.image = 'http://' + process.env.HOST + ':' + process.env.BPORT +'/api'+ user.avatar;
                                    }
                                    else
                                        roomData.image = user.avatar;
                                }
                                roomData.name = user.username as string;
                            }
                        }
                        }
                    }
                    else{
                        if(!roomData.image.includes('cdn.intra') && !roomData.image.includes('https://lh3.googleusercontent.com'))
                            roomData.image = 'http://' + process.env.HOST +':' + process.env.BPORT +'/api' + roomData.image                
                    }
                }
                let message = await this.prisma.message.findMany({
                    where: {roomId: roomId},
                    orderBy: {
                        createdAt: 'asc',
                    },
                    select: {
                        user:{
                            select:{
                                id: true,
                                username: true,
                                avatar: true,
                            }
                        },
                        content: true,
                    }
               })
               let Blocked = await this.getBlocked(id);
               message = message.filter(message => {
                const id = message.user.id;
                return  !Blocked.some(user => user.id === id);
            })
                let messages = await Promise.all(
                message.map(async(message) => {
                    if (message.user.avatar){
                        if(!message.user.avatar.includes('cdn.intra')  && !message.user.avatar.includes('https://lh3.googleusercontent.com'))
                            message.user.avatar = 'http://' + process.env.HOST + ':' + process.env.BPORT +'/api' + message.user.avatar
                    }
                       
                        return {'id': message.user.id,
                                'username': message.user.username,
                                'avatar': message.user.avatar,
                                'content': message.content}
                    })
        
                );
        
               const membership = await this.prisma.membership.findFirst({
                where: {
                    AND:[
                        {roomId: roomId},
                        {userId: id}
                    ]
                    },
                    select:{
                        role: true
                    }
               })
               return {...roomData, ...membership, messages}
            }
        }catch(e){throw new HttpException('Undefined Parameters', HttpStatus.BAD_REQUEST) }
    }

    async checkMute(roomId: number, userId: string){
        try{
            const membership = await this.prisma.membership.findFirst({
                where: {
                    AND:[
                        {roomId: roomId},
                        {userId: userId}
                    ]
                }
            })
            if(membership){
                if(membership.isMuted)
                    return true
                return false
            }
        }catch(e){}
    }
  

    async checkBan(roomId: number, userId: string){
        try{
            const membership = await this.prisma.membership.findFirst({
                where: {
                    AND:[
                        {roomId: roomId},
                        {userId: userId}
                    ]
                }
            })
            if(membership){
                if(membership.isBanned)
                    return true
                return false
            }
        }catch(e){throw new HttpException('Undefined Parameters', HttpStatus.BAD_REQUEST) }
    }
  

    async GetRoomMembers(roomId: number, userId: string) {
        try{
            let isFriend = false;
            let isSender = false;
            let isReceiver = false;
            let isBlocked = false;
            let DMroomId = 0 ;
            let member = await this.prisma.membership.findMany({
                where: {
                    AND: [
                            {roomId: roomId},
                            {isBanned: false}
                        ]
                },
                select:{
                    id: true,
                    role: true,
                    isBanned: true,
                    isMuted: true,
                    user: {
                        select:{
                            id: true,
                            username: true,
                            avatar: true
                        }
                    }
                }
               })
    
               let Blocked = await this.getBlocked(userId);
               member = member.filter(member => {
                const id = member.user.id;
                return  !Blocked.some(user => user.id === id);
            })
    
               let members = await Promise.all(
                member.map(async(member) => {
                    const ownerFriend =  await this.prisma.friendship.findFirst({
                        where:{
                                OR: [
                                  { senderId: member.user.id, receiverId: userId } ,
                                    { senderId: userId, receiverId: member.user.id } 
                                ]
                        },
                        select: {
                            id: true,
                            receiverId: true,
                            senderId: true,
                            status: true
                        }
                    });
                    if (ownerFriend?.status.includes('blocked'))
                        isBlocked = true;
                    else if (ownerFriend?.status.includes('pending'))
                    {
                        if (member.user.id == ownerFriend.senderId)
                            isSender = true;
                        else
                            isReceiver = true;
                    }
                    
                    if (member.user.avatar){
                        if(!member.user.avatar.includes('cdn.intra')  &&  !member.user.avatar.includes('https://lh3.googleusercontent.com'))
                        member.user.avatar = 'http://' + process.env.HOST + ':' + process.env.BPORT +'/api' + member.user.avatar
                    }
                    if(ownerFriend?.status.includes('accepted')){
                        isFriend = true;
                        const room = await this.prisma.room.findFirst({where:{
                            AND: [
    
                               { membership: {
                                    some: {
                                        userId: {
                                            in: [userId, member.user.id]
                                        }
                                    }
                                },},
                                {isChannel: false}
                            ]
    
                        }})
                        if(room)
                            DMroomId = room.id
                    }
                    
                        return {
                            'membershipId': member.id,
                            'userId': member.user.id,
                            'username': member.user.username,
                            'avatar': member.user.avatar,
                            'role': member.role,
                            'isBanned': member.isBanned,
                            'isMuted': member.isMuted,
                            'isFriend': isFriend,
                            'isSender': isSender,
                            'isReceiver': isReceiver,
                            'isBlocked': isBlocked,
                            'DmroomId': DMroomId
                        }
                    })
                    );
                    return members
        }catch(e){throw new HttpException('Undefined Parameters', HttpStatus.BAD_REQUEST) }
    }


    async joinRoom(roomId: number, userId: string) {
        try{

            //check if room exist
            const room = await this.prisma.room.findUnique({where: {id: roomId}})
            if(room){
    
                const member = await this.prisma.membership.findFirst({where: {
                    AND:[
                        {roomId: roomId},
                        {userId: userId as string}
                    ]
                }})
                if(member)
                    throw new UnauthorizedException('User Already Exists')
                else{
                    await this.prisma.membership.create({
                        data: { 
                            roomId: roomId,
                            userId: userId as string,
                            role: 'member',
                            isBanned: false,
                            isMuted: false
                        }
                    })
                }
            }
            else
                throw new UnauthorizedException('Room does Not Exist')
        }catch(e){throw new HttpException('Room does Not Exist', HttpStatus.BAD_REQUEST) }

    }

    async VerifyPassword(roomId: number, password: string){
        try{
            const room = await this.prisma.room.findUnique({where: {id: roomId}})
            if(room){
                if(room.password){
                    const match = await bcrypt.compare(password, room.password)
                    if(match)
                        return true;
                    else
                        return false;
    
                }
                return false
            }
            else
                throw new UnauthorizedException('Room does Not Exist')
        } catch(e){throw new HttpException('Room does Not Exist', HttpStatus.BAD_REQUEST) }
    }


    async createMembership(roomId: number, id: string) {
        try{
            await this.prisma.membership.create({
                data: {
                    roomId: roomId,
                    userId: id,
                    role: 'member',
                    isBanned: false,
                    isMuted: false
                }
            });
        }catch(e){throw new HttpException('Undefined Parameters', HttpStatus.BAD_REQUEST) }
    }
}