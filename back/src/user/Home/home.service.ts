import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { UserService } from '../user.service';


@Injectable()
export class HomeService {
  
    prisma = new PrismaClient();
    userService= new UserService;
    constructor(){}
    
    async bestRanked(ownerId: string) {
      // if(ownerId){

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

        const bestRanked = await this.prisma.user.findMany({
         take: 5,
         orderBy: {
             rank: 'asc',
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
             username: true,
             avatar: true,
             XP: true,
             level: true,
             topaz: true,
             rank: true,
         }
        });

        const ModifiedObject = await this.userService.updateAvatar(bestRanked)
        return ModifiedObject;
      // }
      // else
      //   throw new UnauthorizedException('User  not found')

     }
 
     async NavBar(id : string) {
      if(id){

        const nav = await this.prisma.user.findFirst({
            where: {id: id},
            select: {
                username: true,
                avatar: true,
                XP: true,
                level: true,
                games: true,
                win: true,
                loss: true,
                badge: true,
            }
           });

           let progress = 0;
          if (nav)
          {
            if (nav.level)
              progress = parseFloat((nav?.level % 1).toFixed(2));
            if (!nav.avatar.includes('cdn.intra')){
             nav.avatar = 'http://' + process.env.HOST + '/api' + nav.avatar
          }
        }
         return {
           ...nav,
          'progress': progress,
        };
      }
      else
          throw new UnauthorizedException('User  not found')
    }


    async OnlineStatus(id : string) {
      if(id){
        const user = await this.prisma.user.findUnique({
             where: {id: id},
             select: {
                 username: true,
                 avatar: true,
                 status: true,
             }
     
            });
 
            if (user)
            {
               if (!user.avatar.includes('cdn.intra')){
                 user.avatar = 'http://' + process.env.HOST + '/api' + user.avatar
               }
            }
         return user
      }
    }
    
    async OnlineFriends(id: string) {
      if(id){

        const sentPromise = await this.prisma.user.findUnique({
            where: { id: id },
          }).sentFriendships({
            where: {
              status: 'accepted',
            },
            select: {
              receiver: {
                select: {
                    id: true,
                    username: true,
                    avatar: true,
                    status: true,
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
            },
            select: {
              sender: {
                select: {
                  id: true,
                  username: true,
                  avatar: true,
                  status:true,
                  XP: true,
                  level: true,
                },
              },
            },
          });

          let receiverData =sentPromise ? sentPromise.map((friendship) => friendship.receiver): [];
          let senderData = receivedPromise ?  receivedPromise.map((friendship) => friendship.sender): [];

          receiverData = this.userService.updateAvatar(receiverData);
          senderData = this.userService.updateAvatar(senderData);

          let combinedData = [...receiverData, ...senderData];
          return combinedData;
      }
      else
            throw new UnauthorizedException('User  not found')
    }


    async Search(input: string){
      if(input){

        let res = await this.prisma.user.findMany({
          where: {
            OR: [
              {
                username: {
                    startsWith: input,
                    mode: "insensitive"}
              },
              {
                fullname: {
                    startsWith: input,
                    mode: "insensitive"}
              }
            ]
          },
          select: {
            id: true,
            username: true,
            fullname: true,
            avatar: true,
        }
        }) 

        res = await this.userService.updateAvatar(res);
        return res;
      }
      else
            throw new UnauthorizedException('User  not found')
    }
}
