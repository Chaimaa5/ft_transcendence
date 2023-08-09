import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Friendship, PrismaClient } from '@prisma/client';


@Injectable()
export class ProfileService {
  
    prisma = new PrismaClient();
    constructor(){}


    async Profile(id: string, username: string) {
        if(id){

            let isOwner = true;
            let isFriend = false;
            let isSender = false;
            let isReceiver = false;
            let isBlocked = false;
            const owner = await this.prisma.user.findUnique({where:{id : id},})
            const friends = await this.CountFriends(username);
            const user = await this.prisma.user.findUnique({where:{username : username},
                select: {
                    id: true,
                    username: true,
                    level: true,
                    XP: true,
                    rank: true,
                    avatar: true,
                    loss: true,
                    win: true
                }
            });
            if (user?.id != owner?.id)
                isOwner = false;
                if (user){
    
                    if (user.avatar)
                    {
                        if (!user.avatar.includes('cdn.intra')){
                            user.avatar = 'http://' + process.env.HOST + ':3000/api' + user.avatar
                        }
                    }        
                    if (!isOwner){
                const ownerFriend =  await this.prisma.friendship.findFirst({
                    where:{
                            OR: [
                              { senderId: id, receiverId: user.id } ,
                                { senderId: user.id, receiverId: id } 
                            ]
                    },
                    select: {
                        id: true,
                        receiverId: true,
                        senderId: true,
                        status: true
                    }
                });
                if(ownerFriend?.status.includes('accepted'))
                    isFriend = true;
                else if (ownerFriend?.status.includes('blocked'))
                    isBlocked = true;
                else if (ownerFriend?.status.includes('pending'))
                {
                    if (user?.id == ownerFriend.senderId)
                        isSender = true;
                    else
                        isReceiver = true;
                }
            }
        }
            return{
                'username': user?.username,
                'losses': user?.loss,
                'wins' :user?.win,
                'level':user?.level,
                'xp': user?.XP,
                'rank': user?.rank,
                'avatar': user?.avatar,
                'friend':friends,
                'isOwner': isOwner,
                'isFriend': isFriend,
                'isSender': isSender,
                'isReceiver': isReceiver,
                'isBlocked': isBlocked
    
            }
        }
        else
            throw new UnauthorizedException('User  not found')
    }


    async User(id: string, username: string) {
        if(id){

            let isOwner = true;
            let isFriend = false;
            let isSender = false;
            let isReceiver = false;
            let isBlocked = false;
            const owner = await this.prisma.user.findUnique({where:{id : id}})
            const friends = await this.CountFriends(username);
            const user = await this.prisma.user.findUnique({where:{username : username},
                select: {
                    id: true,
                    username: true,
                    level: true,
                    XP: true,
                    rank: true,
                    avatar: true,
                    loss: true,
                    win: true
                }
            });
            if (user?.id != owner?.id)
                isOwner = false;
            if (!isOwner && user){
                const ownerFriend =  await this.prisma.friendship.findFirst({
                    where:{
                            OR: [
                              { senderId: id, receiverId: user.id } ,
                                { senderId: user.id, receiverId: id } 
                            ]
                    },
                    select: {
                        id: true,
                        receiverId: true,
                        senderId: true,
                        status: true
                    }
                });
                if(ownerFriend?.status.includes('accepted'))
                    isFriend = true;
                else if (ownerFriend?.status.includes('blocked'))
                    isBlocked = true;
                else if (ownerFriend?.status.includes('pending'))
                {
                    if (user?.id == ownerFriend.senderId)
                        isSender = true;
                    else
                        isReceiver = true;
                }
            }
            return{
                'id': user?.id,
                'isOwner': isOwner,
                'isFriend': isFriend,
                'isSender': isSender,
                'isReceiver': isReceiver,
                'isBlocked': isBlocked
    
            }
        }
        else
            throw new UnauthorizedException('User not found')
    }


    async Badges(username: string) {
        if(username){
            return await this.prisma.user.findUnique({where:{username : username},
                select: {
                    badge: true,
                }
            });
        }
        else
            throw new UnauthorizedException('User  not found')
    }


    async CountFriends(username: string){
        if(username){
            const user  = await this.prisma.user.findUnique({where: {username: username}});
            const id = user?.id
            const number = await this.prisma.friendship.count({
                where: {
                    status: 'accepted',
                    OR: [
                      { senderId: id },
                      { receiverId: id },
                    ],
                }
            });
            return number;
        }
        else
            throw new UnauthorizedException('User  not found')
    }

    async CalculatePercentage(username: string){
        if(username){
            const user  = await this.prisma.user.findUnique({where: {username: username}});
            const id = user?.id
            const losses = user?.loss ?? 0
    
            const wins = user?.win ?? 0
            const games = user?.games ?? 0
            let winPer = games > 0 ? (wins / games) * 100 : 0;
            let win  = winPer.toFixed(2);
            let lossPer = games > 0 ? (losses / games) * 100 : 0;
            let loss  = lossPer.toFixed(2);
            return {
                win: win,
                loss: loss,
            };
        }
        else
            throw new UnauthorizedException('User  not found')
    }


    async Friends(username: string, ownerId: string) {
        if(username){

            const user  = await this.prisma.user.findUnique({where: {username: username}});
            const id = user?.id
            const userBlocked = await this.prisma.friendship.findMany({
                where: {
                    AND: [
                        {senderId: ownerId},
                        {status: 'blocked'}
                    ]
                },
                select: {
                    receiverId: true
                }
            });
    
    
            const userBlockers = await this.prisma.friendship.findMany({
                where: {
                    AND: [
                        {receiverId: ownerId},
                        {status: 'blocked'}
                    ]
                },
                select: {
                    senderId: true
                }
            });
    
     
    
            const sentPromise = await this.prisma.user.findUnique({
                 where: { id: id },
               }).sentFriendships({
                 where: {
                   status: 'accepted',
                   AND: [
                    {
                      receiver: {
                        id: {
                          notIn: userBlocked.map(friendship => friendship.receiverId)
                        }
                      }
                    },
                    {
                      receiver: {
                        id: {
                          notIn: userBlockers.map(friendship => friendship.senderId)
                        }
                      }
                    }
                  ]
                  
                 },
                 select: {
                   receiver: {
                     select: {
                         id: true,
                         username: true,
                         avatar: true,
                         XP: true,
                         level: true,
                     },
                   },
                 },
               });
               const receivedPromise = await this.prisma.user.findUnique({
                 where: { id: id },
               }).receivedFriendships({
                 where: {
                   status: 'accepted',
                   AND: [
                    {
                      sender: {
                        id: {
                          notIn: userBlocked.map(friendship => friendship.receiverId)
                        }
                      }
                    },
                    {
                      sender: {
                        id: {
                          notIn: userBlockers.map(friendship => friendship.senderId)
                        }
                      }
                    }
                  ]
                 },
                 select: {
                   sender: {
                     select: {
                       id: true,
                       username: true,
                       avatar: true,
                       XP: true,
                       level: true,
                     },
                   },
                 },
               });
    
               const senderData = receivedPromise ?  receivedPromise.map((friendship) => friendship.sender): [];
               const senderDataModified = senderData.map((sender) =>{
                if (sender){
                    if (sender.avatar)
                    {
                        if (!sender.avatar.includes('cdn.intra')){
                            sender.avatar = 'http://' + process.env.HOST + ':3000/api' + sender.avatar
                        }
                    }
                }
                return sender
                });
    
               const receiverData =sentPromise ? sentPromise.map((friendship) => friendship.receiver): [];
               const receiverDataModified = receiverData.map((receiver) =>{
                if (receiver){
                    if (receiver.avatar)
                    {
                        if (!receiver.avatar.includes('cdn.intra')){
                            receiver.avatar = 'http://' + process.env.HOST + ':3000/api' + receiver.avatar
                        }
                    }
                }
                return receiver
                });
    
               const combinedData = [...senderDataModified, ...receiverDataModified];
    
    
                const valuesOnlyWithoutKeys = combinedData.map(({ username, ...rest }) => rest);
                        
                return valuesOnlyWithoutKeys;
        }
        else
            throw new UnauthorizedException('User  not found')

    }
    async MatchHistory(username: string) {
        if(username){
            const user  = await this.prisma.user.findUnique({where: {username: username}});
            const id = user?.id
            //should add the result
           return await this.prisma.game.findMany({
            where: {
                OR: [
                  { playerId1: id },
                  { playerId2: id }
                ],
            },
            select: {
                winner: true,
                player1: {
                    select: {
                        username: true,
                    }
                },
                player2: {
                    select: {
                        username: true,
                    }
                },
            },
            
    
           });
        }
        else
            throw new UnauthorizedException('User  not found')
    }

}
