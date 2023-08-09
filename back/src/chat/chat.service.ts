import { Injectable, Res, UnauthorizedException } from '@nestjs/common';
import { Membership, PrismaClient } from '@prisma/client';
import { Response } from 'express';
import { NOTFOUND } from 'dns';
import { AddMember, CreateChannel, CreateRoom, UpdateChannel } from './dto/Chat.dto';
import * as crypto from 'crypto';
import { isHexColor } from 'class-validator';

@Injectable()
export class ChatService {
    
   

    prisma = new PrismaClient();
    constructor(){}

    //avatar
    //username
    // last message
    encryptPassword(password: string) {
        if(password){
            const secret = process.env.JWT_REFRESH_SECRET as string
            const cipher = crypto.createCipher('aes-256-cbc', secret);
            let encrypted = cipher.update(JSON.stringify(password), 'utf8', 'hex');
            encrypted += cipher.final('hex');
            return encrypted;
        }
        else
            throw new UnauthorizedException('Password is NULL')
      }


    async updateImage(Object: any[]){
            const ModifiedObject = Object.map((member) =>{
              if (member){
                  if (member.image)
                  {
                      if (member.image){
                          member.image = 'http://' + process.env.HOST + ':3000/api' + member.image
                      }
                  }
              }
              return member
          })
          return ModifiedObject;
    }
    async GetJoinedRooms(id : string){
        const rooms =  await this.prisma.room.findMany({
            where: {
                AND:[
                    {isChannel: false},
                    {type: 'private'}
                ]},
            include: {
                membership: {
                    where: {userId: id},
                    select: {
                        id: true,
                        userId: true,
                        role: true,
                        isBanned: true,
                        isMuted: true,
                    }
                },
            }
        })
        return rooms

    }

    async CreateRoom(ownerId: string, memberId: string, name: string) {

    
        const room = await this.prisma.room.create({
            data: {
                name: name ,
                image: 'imagePath',
                type: 'private',
                ownerId: ownerId,
                isChannel: false,

            }
        })

        await this.prisma.membership.createMany({
            data: [
                {
                    roomId: room.id,
                    userId: ownerId,
                    role: 'owner',
                    isBanned: false,
                    isMuted: false
                },
                {
                    roomId: room.id,
                    userId: memberId,
                    role: 'owner',
                    isBanned: false,
                    isMuted: false
                }
             ]
        })
    }

    async AddMember(id: string, data: AddMember) {
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
                        throw new UnauthorizedException('User Already Exists')
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
                    }
                }else
                    throw new UnauthorizedException('User Not Granted Full Access')
        }
    }

    async CreateChannel(ownerId: string, data: CreateChannel, image: Express.Multer.File) {
        let  imagePath = '';
        if(image)
            imagePath = "/upload/" + image.filename
        else
            imagePath = "/upload/avatar.png";
        let EncryptedPaswword = ''

        console.log(imagePath)
        if(data.type === 'protected')
            EncryptedPaswword = this.encryptPassword(data.password as string)
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
    
    
    async kick(ownerId: string, roomId: number, memberId: number){
        const member = await this.prisma.room.findUnique({
            where: {id:  roomId}
        }).membership({where: {userId: ownerId}}) 
        if(member)
        {
            //need membership id
            if(member[0].role != 'member')
                await this.prisma.membership.delete({where: {id:  memberId}})
        }

        
    }

    async leaveChannel(membershipId: number){
        const membership = await this.prisma.membership.findUnique({where: {id: membershipId}})
        this.deleteMembership(membershipId)
        if(membership?.role === 'owner')
        {
            //set owner
            const newOwner = await this.prisma.membership.findFirst({
                where: {roomId: membership.roomId}
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
            }
        }
        
    }

    async setAdmin(id : string, membershipId: number){

        const membership = await this.prisma.membership.findUnique({where: {id: membershipId}})
        const owner = await this.prisma.room.findFirst({where:{
            AND:[
                {id: membership?.roomId},
                {ownerId: id}
            ]
        }})
        if(owner){
            await this.prisma.membership.update({where: {id: membershipId},
            data: {role: 'admin'}})
        }
        else
            throw new UnauthorizedException('User Is Not Owner')
    }

    async changePrivacy(roomId: number, id: string, type: string, pw: string){
        if (type === 'protected'){
            let password = this.encryptPassword(pw)  
            await this.prisma.room.update({
                where: {id: roomId},
                data: {
                    type: type,
                    password: password
                },

            })
        }
        else{
            await this.prisma.room.update({
                where: {id: roomId},
                data: {type: type,},

            })
        }
    }


    async UpdateChannel(room : UpdateChannel, image: Express.Multer.File){
        const {name, type, password} = room
        const imagePath = "/upload/" + image.filename
        let passwordEncrypted = this.encryptPassword(password as string)  
        await this.prisma.room.update({where: {id: room.roomId},
            data: {
                name: room.name as string,
                image: imagePath,
                type: room.type as string,
                password: passwordEncrypted,

            }  
        })
    }

    
    async SetPassword(roomId: number, pw: string){
        const passwordEncrypted =  this.encryptPassword(pw)
        await this.prisma.room.update({
            where: {id: roomId},
            data: {
                password: passwordEncrypted,
            }
        })
    }

    async deleteMembership(id: number){
        await this.prisma.membership.delete({
            where: {id: id}
        })
    }

    async deleteRoom(id: number){
        await this.prisma.room.delete({where: {id: id}})
    }

    async deleteMessages(roomId: number, memberId: string){
        await this.prisma.message.deleteMany({
            where:{
                AND:[
                    {roomId: roomId},
                    {userId: memberId}
                ]
            }
        })
    }

    async muteMember(id: string, membershipId: number,  muteDuration: string){
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

    }

    async UnmuteMember(id: string, membershipId: number){
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
                    muteExpiration: ''
                }
            })
        }
        else
            throw new UnauthorizedException('Permission Denied')

    }
  
   

    async BanUpdate(id: string, membershipId: number, bool: boolean){
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
    }



    async GetChannels(id: string){
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
                channel.image = 'http://' + process.env.HOST + ':3000/api' + channel.image
            }
                let count = await this.prisma.membership.count({
                    where: {roomId: channel.id}
                })
                return {'id': channel.id,
                        'name': channel.name,
                        'type': channel.type,
                        'image': channel.image,
                        'ownerId': channel.ownerId,
                        'count': count}
            })

        );

        return channelsModified
    }


    async GetJoinedChannels(id: string){
        let channels = await this.prisma.room.findMany({
            where: {
                membership: {
                    some: {userId: id}
                },
                AND: [
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

        // const channelModified = this.updateImage(channels) 
        const channelss = await Promise.all(
        channels.map(async(channel) => {
            if (channel.image){
                channel.image = 'http://' + process.env.HOST + ':3000/api' + channel.image
            }
                let count = await this.prisma.membership.count({
                    where: {roomId: channel.id}
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
    }
     

    async DeleteChannel(id: string, roomId: number) {
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
    }

    async storeMessage(roomId: number, userId: string, content: string){
        const room = await this.prisma.room.findUnique({where: {id: roomId}})
        if(room){
            await this.prisma.message.create({
                data: {
                    roomId: roomId,
                    userId: userId,
                    content: content
                }
            })
        }
    }

    async GetMessages(id: string, roomId: number) {
        const roomData = await this.prisma.room.findUnique({where: {id: roomId},
            select:{
                name: true,
                image: true,
                type: true,
                isChannel: true
            }
        }) 

        if (roomData?.image){
            roomData.image = 'http://' + process.env.HOST + ':3000/api' + roomData.image
        }
        let message = await this.prisma.message.findMany({
            where: {roomId: roomId},
            orderBy: {
                createdAt: 'desc',
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

        let messages = await Promise.all(
        message.map(async(message) => {
            if (message.user.avatar){
                message.user.avatar = 'http://' + process.env.HOST + ':3000/api' + message.user.avatar
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

    async checkMute(roomId: number, userId: string){
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
    }
  

    async GetRoomMembers(roomId: number) {
        const member = await this.prisma.membership.findMany({
            where: {roomId: roomId},
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

           let members = await Promise.all(
            member.map(async(member) => {
                if (member.user.avatar){
                    member.user.avatar = 'http://' + process.env.HOST + ':3000/api' + member.user.avatar
                }
                   
                    return {
                        'membershipId': member.id,
                        'userId': member.user.id,
                        'username': member.user.username,
                        'avatar': member.user.avatar,
                        'role': member.role,
                        'isBanned': member.isBanned,
                        'isMuted': member.isMuted,
                    }
                })
    
            );
            return members
    }


}