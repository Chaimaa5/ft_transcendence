import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { UserService } from '../user.service';


@Injectable()
export class LeaderboardService {
    prisma = new PrismaClient();
  userService = new UserService;
    constructor(){}
    
    async Leaderboard(ownerId: string) {
      try{

        if(ownerId){

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
  
  
          let res =  await this.prisma.user.findMany({
              take: 3,
              orderBy: {
                  XP: 'desc',
              },
              where:{
                  AND: [
                      {
                          id: {
                            notIn: userBlocked.map(friendship => friendship.receiverId)
                          }
                        },
                      {
                          id: {
                            notIn: userBlockers.map(friendship => friendship.senderId)
                          }
                      }
                    ]
              },
              select: {
                  id: true,
                  rank: true,
                  username: true,
                  avatar: true,
                  XP: true,
                  badge: true,
              }
          });
          const users = await this.prisma.user.findMany({orderBy: {XP: 'desc'}});
          const ModifiedObject = res.map((user) =>{
            if (user){
                if (user.avatar)
                {
                    if (!user.avatar.includes('cdn.intra')  &&  !user.avatar.includes('https://lh3.googleusercontent.com')){
                        user.avatar = 'http://' + process.env.HOST + ':' + process.env.BPORT +  '/api' +  user.avatar
                    }
                }
                  let name = user?.username
                  user.rank = users.findIndex(instance => instance.username === name) + 1;
            }
            return user
        })
          return ModifiedObject;
        }
        else
            throw new UnauthorizedException('User  not found')
      }catch(e){throw new HttpException('Undefined Parameters', HttpStatus.BAD_REQUEST) }
    }
    async Palyers(ownerId: string) {
      try{

        if(ownerId){
  
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
  
          const bestRanked =  await this.prisma.user.findMany({
              take: 3,
              orderBy: {
                  XP: 'desc',
              },
              where:{
                  AND: [
                      {
                          id: {
                            notIn: userBlocked.map(friendship => friendship.receiverId)
                          }
                        },
                      {
                          id: {
                            notIn: userBlockers.map(friendship => friendship.senderId)
                          }
                      }
                    ]
              },
          });
          
          let players = await this.prisma.user.findMany({
            orderBy: {
              XP: 'desc',
            },
            where:{
              AND: [
                  {
                      id: {
                        notIn: userBlocked.map(friendship => friendship.receiverId)
                      }
                    },
                    {
                      id: {
                        notIn: bestRanked.map(friendship => friendship.id)
                      }
                    },
                  {
                      id: {
                        notIn: userBlockers.map(friendship => friendship.senderId)
                      }
                  }
                ]
          },
            select: {
              id: true,
              avatar: true,
              rank: true,
              username: true,
              level: true,
              XP: true,
              topaz: true,
            }
         });

         const users = await this.prisma.user.findMany({orderBy: {XP: 'desc'}});

         const ModifiedObject = players.map((player) =>{
          if (player){
              if (player.avatar)
              {
                  if (!player.avatar.includes('cdn.intra')  &&  !player.avatar.includes('https://lh3.googleusercontent.com')){
                      player.avatar = 'http://' + process.env.HOST + ':' + process.env.BPORT +  '/api' +  player.avatar
                  }
              }
                let name = player.username
                player.rank = users.findIndex(instance => instance.username === name) + 1;
          }
          return player})
          return ModifiedObject
        }
        else
              throw new UnauthorizedException('User  not found')
      }catch(e){throw new HttpException('Undefined Parameters', HttpStatus.BAD_REQUEST) }
  }
}
