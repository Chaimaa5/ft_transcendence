import { HttpException, HttpStatus, Injectable, Res, UnauthorizedException } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { UpdateUserDTO } from './dto/updatedto.dto'
import { Response } from 'express';
import { NOTFOUND } from 'dns';
import { ChatService } from 'src/chat/chat.service';
import { NotificationService } from './Notifications/notification.service';
import { TransformationType } from 'class-transformer';

@Injectable()
export class UserService {
   
    
    
    
    prisma = new PrismaClient();
    chatService = new ChatService;
    constructor(){}
    notifications = new NotificationService
    async GetById(id: string){
        try{
            const user = await this.prisma.user.findUnique({where : {id:id}})
            return user
        }catch(e){throw new HttpException('Access Denied', HttpStatus.FORBIDDEN) }

    }
    async CreateUser(user: any)
    {
        try{

            if(user){
                const UserExists = await this.prisma.user.findUnique({
                    where:{id: user.id},
                });
                if(UserExists){
                    return user;
                }
                else{
                    let rankCount = await this.prisma.user.count();
                    rankCount += 1
        
                      const newUser = await this.prisma.user.create({
                        data:{
                            id: user.id,
                            username: user.username,
                            fullname: user.fullname,
                            avatar: user.avatar,
                            isTwoFacEnabled: false,
                            TwoFacSecret: '',
                            XP: 0,
                            win: 0,
                            loss: 0,
                            status: false,
                            rank: rankCount,
                            level: 0,
                            badge: {
                                create: [{
                                    //first win
                                    Achievement: "Beginner's Luck", Achieved: false, Image: '/upload/achievments/3.png'
                                },
                                {
                                    //ranked first
                                    Achievement: "Golden Paddle", Achieved: false,  Image: '/upload/achievments/1.png'
                                },
                                {
                                    // ranked second
                                    Achievement: "Sharpshooter", Achieved: false,  Image: '/upload/achievments/5.png'
                                },
                                {
                                    //ranked third
                                    Achievement: "Backhand Master", Achieved: false,  Image: '/upload/achievments/4.png'
                                },
                                {
                                    //win against the bot
                                    Achievement: "Worthy Adversary", Achieved: false,  Image: '/upload/achievments/2.png'
                                }
                            ]
                            },
                            refreshToken: '',
                            createdAt: new Date(),
                        }
                    });
                    return newUser;
                }
                return false;
            }
        }catch(e){}

    }

    async FindUser(user: any) {
        try{
            if(user)
            {
                const Exists = await this.prisma.user.findUnique({
                    where:{id: user.id},
                });
                console.log(Exists)
                if (Exists)
                    return 1;
                else
                    return 2;
            }
            else
                throw new UnauthorizedException('User not found')
        }catch(e){}
    }
    async GetUser(user: any) {
        try{
            if(user){
                const Exists = await this.prisma.user.findUnique({
                    where:{id: user.id},
                });
        
                if (Exists)
                    return Exists;
                else
                {
                    const UserExists = await this.CreateUser(user);
                    return UserExists;
                }
            }
            else
                throw new UnauthorizedException('User not found')
        }catch(e){}
    }

   
    
    async userSetup(id: string, avatar: Express.Multer.File, data: UpdateUserDTO) {
        try{
            if (id)
            {
                if(avatar){
                    let imagePath = "/upload/" + avatar.filename;
                    await this.prisma.user.update({where: {id: id}, data: {avatar: imagePath}}); 
                }
                const username = data.username as string
                if (username){
                    await this.prisma.user.update({where: {id: id}, data: {username: username}});
                }
            }
            else
                throw new UnauthorizedException('User not found')
        }catch(e){throw new HttpException('Undefined Parameters', HttpStatus.BAD_REQUEST) }


    }

    async updateOnlineStatus(id: string, status: boolean) {
        try{
            if (id)
                await this.prisma.user.update({where: {id: id}, data: {status: status}})
            else
                throw new UnauthorizedException('User  not found')
        }catch(e){}
    }

    
    async UpdateRefreshToken(id: string, Rt: string) {
        try{
            if (id)
                return this.prisma.user.update({where: {id: id}, data: {refreshToken : Rt}});
            else
                throw new UnauthorizedException('User  not found')
        }catch(e){throw new HttpException('Undefined Parameters', HttpStatus.UNAUTHORIZED) }
    }
    
    async GetMany() {
        try{
            return await this.prisma.user.findMany();
        }catch(e){}
    }

    async  deleteGroups(id: string) {
        try{
            if (id)
            {
                await this.prisma.membership.deleteMany({
                    where: {
                    userId: id
                }})
                await this.prisma.room.deleteMany({where:{ownerId: id}})
            }
            else
                throw new UnauthorizedException('User  not found')
        }catch(e){ }
    }
    async DeleteUser(id: string, @Res() res: Response) {
        try{
            if (id){
                await this.prisma.friendship.deleteMany({where:  {
                    OR: [
                    {senderId: id},
                    {receiverId: id},]
                }});
                this.deleteGroups(id);
                this.deleteAchievements(id);
                this.deleteGames(id);
                res.clearCookie('access_token');
                res.clearCookie('refresh_token');
                await this.prisma.user.delete({where: {id: id}});
            }
            else
                throw new UnauthorizedException('User  not found')
        }catch(e){throw new HttpException('Undefined Parameters', HttpStatus.BAD_REQUEST) }
    }

    async deleteGames(id: string) {
        try{
            await this.prisma.game.deleteMany({
                where: {
                    OR: [
                        {playerId1: id},
                        {playerId2: id}
                    ]
                }
               })
        }catch(e){ }
    }
    async deleteAchievements(id: string) {
        try{

            await this.prisma.achievement.deleteMany({
             where: {userId: id}
            })
        }catch(e){}
    }
    async FindbyID(id: string) {
        try{

            if (id)
            {
                const user = await this.prisma.user.findUnique({
                    where:  {id: id},
                }).then((user)=>{
                    if (user){
                        if (user.avatar)
                        {
                            if (!user.avatar.includes('cdn.intra')  &&  !user.avatar.includes('https://lh3.googleusercontent.com')){
                                user.avatar = 'http://' + process.env.HOST + ':' + process.env.BPORT +'/api' + user.avatar
                            }
                        }
                    return user
                    }
                })
                return user;
            }
            else
                throw new UnauthorizedException('User  not found')
        }catch(e){throw new HttpException('Undefined Parameters', HttpStatus.BAD_REQUEST) }
    }


    //Friendship

              
    async addFriend(id : string, Id: string){
        try{

            if(id  == Id)
                throw new UnauthorizedException('User Can not Add Himself')
            if (id){
                    const exist = await this.FindbyID(Id)
                    if (exist){
                        const friendshipRequest = await this.prisma.friendship.findFirst({where:{
                            OR:[
                                {senderId : id, receiverId: Id},
                                {receiverId : id, senderId: Id}
                            ]
                        }})
                        if(!friendshipRequest){
                            await this.prisma.friendship.create({
                                data: {
                                    sender: {connect: {id: id}},
                                    receiver: {connect: {id: Id}},
                                    status: 'pending',
                                    blockerId: '',
                                },
                            });
                    
                            await this.notifications.addNotifications(id, Id as string, 'Friendship invite', 'sent you an invite')
                        }
                        //emit notification
                    }
                    else
                        throw new UnauthorizedException('User Does Not Exist')
            }
            else
                throw new UnauthorizedException('User not found')
        }catch(e){throw new HttpException('Undefined Parameters', HttpStatus.BAD_REQUEST) }
    }

    async removeFriend(id : string, Id: string){
        try{

            if (id)
            {
                const exist = await this.FindbyID(Id)
                if (exist){
                   
    
                    const room = await this.prisma.room.findFirst({
                        where:{
                            AND: [
                                {membership: {
                                    some: {
                                        userId: {
                                            in: [id, Id]
                                        }
                                    }
                                },},
                                {isChannel: false}
                            ]
                        },
                        include: {
                            membership: true}
                    })
                    if(room){
                        await this.chatService.deleteMessages(room.id, id)
                        await this.chatService.deleteMessages(room.id, Id)
                        if(room.membership){
                            for(const membership of room.membership){
                                await this.chatService.deleteMembership(membership.id)
                            }
                        }
                        await this.prisma.room.delete({where: {id: room.id}})
    
                    }
                    await this.prisma.friendship.deleteMany({
                        where: {
                            OR: [
                                {senderId: id, receiverId: Id},
                                {senderId: Id, receiverId: id},
                            ],
                        },
                    });
                }
                else
                    throw new UnauthorizedException('User Does Not Exist')
            }
            else
                throw new UnauthorizedException('User not found')
        }catch(e){throw new HttpException('Undefined Parameters', HttpStatus.BAD_REQUEST) }

    }

    async acceptFriend(id : string, Id: string){
        try{
            if (id){
                const exist = await this.FindbyID(Id)
                if (exist){
                    await this.prisma.friendship.updateMany({
                        where: {
                            OR: [
                                {senderId: id, receiverId: Id},
                                {senderId: Id, receiverId: id},
                            ],
                        },
                        data: {
                            status: 'accepted',
                        },
                    });
                    await this.chatService.CreateRoom(id, Id, exist.username);
                    await this.notifications.addNotifications(id, Id, 'Friendship acceptance', 'accepted your invite')
                }
                else
                    throw new UnauthorizedException('User Does Not Exist')
            }
            else
                throw new UnauthorizedException('User Does Not Exist')
        }catch(e){throw new HttpException('Undefined Parameters', HttpStatus.BAD_REQUEST) }
    }

    async blockFriend(id : string, Id: string){
        try{

            if(id  == Id)
                throw new UnauthorizedException('User Can not Block Himself')
            if (id){
                const exist = await this.FindbyID(Id)
                if (exist){
                    const friendship = await this.prisma.friendship.findFirst({where:{
                        OR: [
                            {senderId: id, receiverId: Id},
                            {senderId: Id, receiverId: id},
                        ],
                    }})
                    if(friendship){
                        const room = await this.prisma.room.findFirst({
                            where:{
                                AND: [
                                    {membership: {
                                        some: {
                                            userId: {
                                                in: [id, Id]
                                            }
                                        }
                                    },},
                                    {isChannel: false}
                                ]
                            },
                            include: {
                                membership: true}
                        })
                        if(room){
                            await this.prisma.membership.updateMany({where: {roomId: room.id},
                            data:{
                                isBanned: true
                            }})
                        }
                        await this.prisma.friendship.updateMany({
                            where: {
                                OR: [
                                    {senderId: id, receiverId: Id},
                                    {senderId: Id, receiverId: id},
                                ],
            
                            },
                            data: {
                                status: 'blocked',
                                blockerId: id,
                            },
                        });
                    }
                    else{
                        await this.prisma.friendship.create({
                            data: {
                                senderId: id,
                                receiverId: Id,
                                status: 'blocked',
                                blockerId: id,
                            },
                        });
                    }
                }
                else
                    throw new UnauthorizedException('User Does Not Exist')
            }
            else
                throw new UnauthorizedException('User  not found')
        }catch(e){throw new HttpException('Undefined Parameters', HttpStatus.BAD_REQUEST) }
    }

    //should be updated
    async getFriends(id : string){
        try{
            if (id)
            {
                const res = await this.prisma.friendship.findMany({where: {
                    AND:[{
                        OR: [
                            {senderId: id},
                            {receiverId: id},
                        ],
                    },
                    {status: 'accepted'},
                    ], 
                },});
                return res;
            }
            else
                throw new UnauthorizedException('User  not found')
        }catch(e){throw new HttpException('Undefined Parameters', HttpStatus.BAD_REQUEST) }
    }

    //should be updated
    async getFriend(id : string, Id: string){
        try{

            if (id){
                const res = await this.prisma.friendship.findFirst({ where: {
                    AND:[{
                        OR: [
                            {senderId: id, receiverId: Id},
                            {senderId: Id, receiverId: id},
                        ],
                    },
                    {status: 'accepted'},
                    ],
                },
                });
                return res;
            }
            else
                throw new UnauthorizedException('User  not found')
        }catch(e){throw new HttpException('Undefined Parameters', HttpStatus.BAD_REQUEST) }
    }

    async getPendings(id : string){
        if (id){
            const res = await this.prisma.friendship.findMany({where: {
                AND:[{
                    OR: [
                        {senderId: id},
                    ],
                },
                {status: 'pending'},
                ],
                
                },
            
            });
            return res;
        }
        else
            throw new UnauthorizedException('User  not found')
    }


    async getBlocked(id : string){
        try{

            if (id){
                const blockedFriendships = await this.prisma.friendship.findMany({where: {
                    AND:[
                        {blockerId: id},
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
                    return friendship.blockerId === friendship.senderId ? friendship.receiver : friendship.sender;
                  });
            }   
            else
                throw new UnauthorizedException('User  not found')
        }catch(e){throw new HttpException('Undefined Parameters', HttpStatus.BAD_REQUEST) }
    }


    async getBlockedUsers(id : string){
        try{

            if (id){
                let blockedFriendships = await this.prisma.friendship.findMany({where: {
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
                let blocked =  blockedFriendships.map((friendship) => {
                        return friendship.senderId === id ? friendship.receiver : friendship.sender;
                  });
                  return blocked
            }   
            else
                throw new UnauthorizedException('User  not found')
        }catch(e){throw new HttpException('Undefined Parameters', HttpStatus.BAD_REQUEST) }
    }

    async GetBanned(roomId: number){
        try{
            let banned = await this.prisma.membership.findMany({
                where:{
                    AND: [
                        {roomId: roomId},
                        {isBanned: true}
                    ]
                }
            })

            return banned
            
        }catch(e){}
    }
    async Players() {
        try{
            let players = await this.prisma.user.findMany({
               orderBy: {
                 XP: 'desc',
               },
               select: {
                avatar: true,
                 rank: true,
                 username: true,
                 level: true,
                 XP: true,
                 topaz: true,
               }
            });
            if(players)
               players = this.updateAvatar(players);
            return players
        }catch(e){}
     }

    updateAvatar(Object: any[]) {
            const ModifiedObject = Object.map((player) =>{
              if (player){
                  if (player.avatar)
                  {
                      if (!player.avatar.includes('cdn.intra')  &&  !player.avatar.includes('https://lh3.googleusercontent.com')){
                          player.avatar = 'http://' + process.env.HOST + ':' + process.env.BPORT +  '/api' +  player.avatar
                      }
                  }
              }
              return player
          })
          return ModifiedObject;
    }

   async GetNotifications(id : string){
    try{
        if(id){
        const res = await this.prisma.notification.findMany({
            where: {receiverId: id },
            orderBy: {
                createdAt: 'asc',
            },
            select:{
                id: true,
                type: true,
                status: true,
                sender:{
                    select:{
                        id: true,
                        username: true,
                        avatar: true
                    }
                }
            }
        });

            const notifications = res.map((notification) =>{
                if (notification){
                    if (notification.sender.avatar)
                    {
                        if (!notification.sender.avatar.includes('cdn.intra') && !notification.sender.avatar.includes('https://lh3.googleusercontent.com')){
                            notification.sender.avatar = 'http://' + process.env.HOST + ':' + process.env.BPORT +  '/api' + notification.sender.avatar
                        }
                    }
                }
                return notification
            })

                return res;
                }
                else
                throw new UnauthorizedException('User  not found')
        }catch(e){throw new HttpException('Undefined Parameters', HttpStatus.BAD_REQUEST) }
   }


   

    async deleteNotification(id: number)
    {
        try{
            await this.prisma.notification.delete({where: {id : id}})
        }catch(e){}
    }

    async DeleteAvatar(id: string) {
        try{
            await this.prisma.user.update({
                where: {id: id},
                data:{avatar: '/upload/avatar.png'}
            })
        }catch(e){throw new HttpException('Undefined Parameters', HttpStatus.BAD_REQUEST) }
    }
    
}


