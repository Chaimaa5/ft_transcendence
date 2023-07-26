import { Injectable, Res, UnauthorizedException } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { UpdateUserDTO } from './dto/updatedto.dto'
import { Response } from 'express';

@Injectable()
export class UserService {
    
    
    
    
    prisma = new PrismaClient();
    constructor(){}

    async GetById(id: string){
        return await this.prisma.user.findUnique({where : {id:id}})
    }
    async CreateUser(user: any)
    {
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

    async FindUser(user: any) {
        const Exists = await this.prisma.user.findUnique({
            where:{id: user.id},
        });

        if (Exists)
            return 1;
        else
            return 2;
    }
    async GetUser(user: any) {
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

   
    
    async userSetup(id: string, avatar: Express.Multer.File, data: UpdateUserDTO) {
        const filename = "/upload/" + avatar.filename;
        const username = data.username as string
        await this.prisma.user.update({where: {id: id}, data: {avatar: filename}});
        if (username){
            await this.prisma.user.update({where: {id: id}, data: {username: username}});
        }

    }

    async updateOnlineStatus(id: string, status: boolean) {
       await this.prisma.user.update({where: {id: id}, data: {status: status}})
    }

    
    async UpdateRefreshToken(id: string, Rt: string) {
        return this.prisma.user.update({where: {id: id}, data: {refreshToken : Rt}});
    }
    
    async GetMany() {
        return await this.prisma.user.findMany();
    }

    async  deleteGroups(id: string) {
        await this.prisma.groupMembership.deleteMany({
            where: {
            userId: id
        }})
        await this.prisma.room.deleteMany({where:{ownerId: id}})
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
            throw 'User not Found';
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
        const user = await this.prisma.user.findUnique({
            where:  {id: id},
        }).then((user)=>{
            if (user){
                if (user.avatar)
                {
                    if (!user.avatar.includes('cdn.intra')){
                        user.avatar = 'http://' + process.env.HOST + '/api' + user.avatar
                    }
                }
            return user
            }
        })
        return user;

    }


    //Friendship

              
    async addFriend(id : string, Id: string){
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

    async removeFriend(id : string, Id: string){
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

    async acceptFriend(id : string, Id: string){
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
            await this.addNotifications(id, Id as string, 'friendship', 'accepted your invite')
            //emit notification
        }
        else
            throw new UnauthorizedException('User Does Not Exist')
    }

    async blockFriend(id : string, Id: string){
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

    //should be updated
    async getFriends(id : string){
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

    //should be updated
    async getFriend(id : string, Id: string){
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

    async getPendings(id : string){
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


    async getInvitations(id : string){
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
    async getBlocked(id : string){
        const res = await this.prisma.friendship.findMany({where: {
            AND:[{
                OR: [
                    {senderId: id},
                    {receiverId: id},
                ],
            },
            {status: 'blocked'},
            {blockerId: id},
            ],
            
        },});
        return res;
    }


    async Players() {
        const players = await this.prisma.user.findMany({
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

        const modified = this.updateAvatar(players);
        return modified;
     }

    updateAvatar(Object: any[]) {
          const ModifiedObject = Object.map((player) =>{
            if (player){
                if (player.avatar)
                {
                    if (!player.avatar.includes('cdn.intra')){
                        player.avatar = 'http://' + process.env.HOST + '/api' + player.avatar
                    }
                }
            }
            return player
        })
        return ModifiedObject;
    }

   async GetNotifications(id : string){
        const res = await this.prisma.notification.findMany({
            where: {receiverId: id }
        });

        return res;
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
}


