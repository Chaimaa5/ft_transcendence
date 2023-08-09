import { Injectable, Res, UnauthorizedException } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { UpdateUserDTO } from './dto/updatedto.dto'
import { Response } from 'express';
import { NOTFOUND } from 'dns';
import { ChatService } from 'src/chat/chat.service';

@Injectable()
export class UserService {
   
    
    
    
    prisma = new PrismaClient();
    chatService = new ChatService;
    constructor(){}

    async GetById(id: string){
        const user = await this.prisma.user.findUnique({where : {id:id}})
        // if(!user)
        //     throw new UnauthorizedException('User Does not exist')
        return user
    }
    async CreateUser(user: any)
    {
        if(user){

            const UserExists = await this.prisma.user.findUnique({
                where:{id: user.id},
            });
            if(UserExists){
                console.log('User already exists');
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
                                Achievement: "x", Achieved: false,
                            },
                            {
                                Achievement: "y", Achieved: false,
                            },
                            {
                                Achievement: "z", Achieved: false,
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
        else
            throw new UnauthorizedException('User not found')
    }

    async FindUser(user: any) {
        if(user)
        {
            const Exists = await this.prisma.user.findUnique({
                where:{id: user.id},
            });
    
            if (Exists)
                return 1;
            else
                return 2;
        }
        else
            throw new UnauthorizedException('User not found')
    }
    async GetUser(user: any) {
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
    }

   
    
    async userSetup(id: string, avatar: Express.Multer.File, data: UpdateUserDTO) {
        if (id)
        {
            let  imagePath = '';
            if(avatar)
               imagePath = "/upload/" + avatar.filename;
            else
                imagePath = "/upload/avatar.png";
            const username = data.username as string
            await this.prisma.user.update({where: {id: id}, data: {avatar: imagePath}});
            if (username){
                await this.prisma.user.update({where: {id: id}, data: {username: username}});
            }
        }
        else
            throw new UnauthorizedException('User not found')

    }

    async updateOnlineStatus(id: string, status: boolean) {
        if (id)
            await this.prisma.user.update({where: {id: id}, data: {status: status}})
        else
            throw new UnauthorizedException('User  not found')
    }

    
    async UpdateRefreshToken(id: string, Rt: string) {
        if (id)
            return this.prisma.user.update({where: {id: id}, data: {refreshToken : Rt}});
        else
            throw new UnauthorizedException('User  not found')
    }
    
    async GetMany() {
        return await this.prisma.user.findMany();
    }

    async  deleteGroups(id: string) {
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
    }
    async DeleteUser(id: string, @Res() res: Response) {

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
    }

    async deleteGames(id: string) {
        await this.prisma.game.deleteMany({
            where: {
                OR: [
                    {playerId1: id},
                    {playerId2: id}
                ]
            }
           })
    }
    async deleteAchievements(id: string) {
       await this.prisma.achievement.deleteMany({
        where: {userId: id}
       })
    }
    async FindbyID(id: string) {
        if (id)
        {
            const user = await this.prisma.user.findUnique({
                where:  {id: id},
            }).then((user)=>{
                if (user){
                    if (user.avatar)
                    {
                        if (!user.avatar.includes('cdn.intra')){
                            user.avatar = 'http://' + process.env.HOST + ':3000/api' + user.avatar
                        }
                    }
                return user
                }
            })
            return user;
        }
        else
            throw new UnauthorizedException('User  not found')

    }


    //Friendship

              
    async addFriend(id : string, Id: string){

        if (id){
                const exist = await this.FindbyID(Id)
                if (exist){
                    await this.prisma.friendship.create({
                        data: {
                            sender: {connect: {id: id}},
                            receiver: {connect: {id: Id}},
                            status: 'pending',
                            blockerId: '',
                        },
                    });
            
                    await this.addNotifications(id, Id as string, 'friendship', 'sent you an invite')
                    //emit notification
                }
                else
                    throw new UnauthorizedException('User Does Not Exist')
        }
        else
            throw new UnauthorizedException('User not found')
     
    }

    async removeFriend(id : string, Id: string){
        if (id)
        {
            const exist = await this.FindbyID(Id)
            if (exist){
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

    }

    async acceptFriend(id : string, Id: string){

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
                await this.addNotifications(id, Id, 'friendship', 'accepted your invite')
            }
            else
                throw new UnauthorizedException('User Does Not Exist')
        }
        else
            throw new UnauthorizedException('User Does Not Exist')
    }

    async blockFriend(id : string, Id: string){
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
                        status: 'blocked',
                        blockerId: id,
                    },
                });
            }
            else
                throw new UnauthorizedException('User Does Not Exist')
        }
        else
            throw new UnauthorizedException('User  not found')

    }

    //should be updated
    async getFriends(id : string){
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
    }

    //should be updated
    async getFriend(id : string, Id: string){
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


    async getInvitations(id : string){
        if (id){
            const res = await this.prisma.friendship.findMany({where: {
                AND:[{
                    OR: [
                        {receiverId: id},
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
    }


    async Players() {
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
     }

    updateAvatar(Object: any[]) {
          const ModifiedObject = Object.map((player) =>{
            if (player){
                if (player.avatar)
                {
                    if (!player.avatar.includes('cdn.intra')){
                        player.avatar = 'http://' + process.env.HOST + ':3000/api' + player.avatar
                    }
                }
            }
            return player
        })
        return ModifiedObject;
    }

   async GetNotifications(id : string){
    if(id){
        const res = await this.prisma.notification.findMany({
            where: {receiverId: id }
        });

        return res;
    }
    else
        throw new UnauthorizedException('User  not found')
   }

   async addNotifications(senderId : string, receiverId: string, type: string, context: string){
        const sender = await this.prisma.user.findUnique({where: {id: senderId}})
        const receiver = await this.prisma.user.findUnique({where: {id: receiverId}})

        const content = sender?.username + context + receiver?.username

        await this.prisma.notification.create({
            data: {
                sender: {connect: {id: senderId}},
                receiver: {connect: {id: receiverId}},
                status: 'not seen',
                type: type,
                content: content
            },
        });
    }

    async deleteNotification(id: number)
    {
        await this.prisma.notification.delete({where: {id : id}})
    }

    async DeleteAvatar(id: string) {
        await this.prisma.user.update({
            where: {id: id},
            data:{avatar: ''}
        })
    }
    
}


