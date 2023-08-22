import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { Friendship, PrismaClient } from '@prisma/client';


@Injectable()
export class ProfileService {
  
    prisma = new PrismaClient();
    constructor(){}


    async Profile(id: string, username: string) {
        try{

            if(id){
    
                let isOwner = true;
                let isFriend = false;
                let isSender = false;
                let isReceiver = false;
                let isBlocked = false;
                let roomId = 0 ;
                let rank = 0;
                const owner = await this.prisma.user.findUnique({where:{id : id},})
                const friends = await this.CountFriends(username);
                const user = await this.prisma.user.findUnique({where:{username : username},});
                const users = await this.prisma.user.findMany({orderBy: {XP: 'desc'}});
                if(user){
                    let name = user?.username
                    rank = users.findIndex(instance => instance.username === name) + 1;
                }
                if (user?.id != owner?.id)

                    isOwner = false;
                    let progress = "";
                    if (user){
                        if(user.level){
                            let percentage = parseFloat((user.level % 1).toFixed(2));
                            progress = percentage.toString()
                            progress = progress.split('.')[1]
                            if(progress.length == 1)
                                progress = progress.concat("0%")
                            else
                                progress.concat('%')
                            
                        }
                        else
                            progress = "0%";
                        if (user.avatar)
                        {
                            if (!user.avatar.includes('cdn.intra')  && !user.avatar.includes('https://lh3.googleusercontent.com')){
                                user.avatar = 'http://' + process.env.HOST + ':' + process.env.BPORT +'/api' + user.avatar
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
                    {
                        isFriend = true;
                        const room = await this.prisma.room.findFirst({where:{
                            AND: [
    
                               { membership: {
                                    some: {
                                        userId: {
                                            in: [id, user.id]
                                        }
                                    }
                                },},
                                {isChannel: false}
                            ]
    
                        }})
                        if(room)
                            roomId = room.id
                    }
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
                    'progress': progress,
                    'xp': user?.XP,
                    'rank': rank,
                    'avatar': user?.avatar,
                    'friend':friends,
                    'isOwner': isOwner,
                    'isFriend': isFriend,
                    'isSender': isSender,
                    'isReceiver': isReceiver,
                    'isBlocked': isBlocked,
                    'roomId': roomId
        
                }
            }
            else
                throw new UnauthorizedException('User  not found')
        }catch(e){throw new HttpException('Undefined Parameters', HttpStatus.BAD_REQUEST) }
    }


    async User(id: string, username: string) {
        try{
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
        }catch(e){throw new HttpException('Undefined Parameters', HttpStatus.BAD_REQUEST) }
    }


    async Badges(username: string) {
        try{

            if(username){
                let badges = await this.prisma.user.findUnique({where:{username : username},
                  select: {badge: true}
                });
                if(badges){
                    let achievements = await Promise.all( badges.badge.map(async(badge) => {
                        if (badge.Image){
                            badge.Image = 'http://' + process.env.HOST + ':' + process.env.BPORT + '/api' + badge.Image
                        }
                        return {
                            'id': badge.id,
                            'Achievement': badge.Achievement,
                            'Achieved': badge.Achieved,
                            'Image': badge.Image,
                        }
                    })
                    );
                    return achievements
                }
            }
            else
                throw new UnauthorizedException('User  not found')
        }catch(e){throw new HttpException('Undefined Parameters', HttpStatus.BAD_REQUEST) }
    }


    async CountFriends(username: string){
        try{

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
        }catch(e){throw new HttpException('Undefined Parameters', HttpStatus.BAD_REQUEST) }
    }

    async CalculatePercentage(username: string){
        try{

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
                    win: parseFloat(win),
                    loss: parseFloat(loss),
                };
            }
            else
                throw new UnauthorizedException('User  not found')
        }catch(e){throw new HttpException('Undefined Parameters', HttpStatus.BAD_REQUEST) }
    }


    async Friends(username: string, ownerId: string) {
        try{

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
                            createdAt: true,
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
                            createdAt: true,
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
                            if (!sender.avatar.includes('cdn.intra') && !sender.avatar.includes('https://lh3.googleusercontent.com')){
                                sender.avatar = 'http://' + process.env.HOST +':' + process.env.BPORT +'/api' + sender.avatar
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
                            if (!receiver.avatar.includes('cdn.intra') && !receiver.avatar.includes('https://lh3.googleusercontent.com')){
                                receiver.avatar = 'http://' + process.env.HOST + ':' + process.env.BPORT +'/api' + receiver.avatar
                            }
                        }
                    }
                    return receiver
                    });
        
                   const combinedData = [...senderDataModified, ...receiverDataModified];
        
        
                    const valuesOnlyWithoutKeys = combinedData.map(({ createdAt, ...rest }) => rest);
                            
                    return valuesOnlyWithoutKeys;
            }
            else
                throw new UnauthorizedException('User  not found')
        }catch(e){throw new HttpException('Undefined Parameters', HttpStatus.BAD_REQUEST) }

    }
    async MatchHistory(username: string) {
        try{

            if(username){
                const user  = await this.prisma.user.findUnique({where: {username: username}});
                const id = user?.id
                //should add the result
               let games =  await this.prisma.game.findMany({
                where: {
                    AND: [
                        {OR: [
                          { playerId1: id },
                          { playerId2: id }
                        ],},
                        {mode: {not: 'training'}} 
                    ]
                },
                select: {
                    winner: true,
                    player1: {
                        select: {
                            username: true,
                            avatar: true,
                        
                        }
                    },
                    player2: {
                        select: {
                            username: true,
                            avatar: true,
                        }
                    },
                    playerXp1: true,
                    playerXp2: true,
                    draw: true
                },
                
        
               });
    
               if(games){
                 let result = await Promise.all( games.map(async(game) => {
                    if (game.player1.avatar){
                        if(!game.player1.avatar.includes('cdn.intra') && !game.player1.avatar.includes('https://lh3.googleusercontent.com'))
                            game.player1.avatar = 'http://' + process.env.HOST + ':' + process.env.BPORT + '/api' + game.player1.avatar
                    }
                    if (game.player2){
                        if (game.player2.avatar){
                            if(!game.player2.avatar.includes('cdn.intra')  && !game.player2.avatar.includes('https://lh3.googleusercontent.com'))
                                game.player2.avatar = 'http://' + process.env.HOST + ':' + process.env.BPORT + '/api' + game.player2.avatar
                        }
                        let gameResult = ''
                        if(game.winner){
                            if(game.winner === username)
                                gameResult = 'win'
                            else
                                gameResult = 'loss'
                        }else gameResult = 'draw'
                        return {
                            'winner': game.winner,
                            'player1':{
                                'avatar': game.player1.avatar,
                                'username': game.player1.username,
                                'hits': game.playerXp1,
                            },
                            'player2':{
                                'avatar': game.player2.avatar,
                                'username': game.player2.username,
                                'hits': game.playerXp2,
                            },
                            'result': gameResult
                        }
                    }
                })
                );
                return result
            }
            }
            else
                throw new UnauthorizedException('User  not found')
        }catch(e){throw new HttpException('Undefined Parameters', HttpStatus.BAD_REQUEST) }
    }

}
