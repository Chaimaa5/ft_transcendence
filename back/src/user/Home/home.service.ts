import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { UserService } from '../user.service';


@Injectable()
export class HomeService {
  
    prisma = new PrismaClient();
    userService= new UserService;
    constructor(){}
    
    async bestRanked(ownerId: string) {
      try{

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
             level: 'desc',
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

        let ModifiedObject = await this.userService.updateAvatar(bestRanked)
        const users = await this.prisma.user.findMany({orderBy: {level: 'desc'}})
        ModifiedObject = ModifiedObject.map((user) =>{
          let name = user.username
          user.rank  = users.findIndex(instance => instance.username === name) + 1;
          return user

        })
        return ModifiedObject;
      }catch(e){throw new HttpException('Undefined Parameters', HttpStatus.BAD_REQUEST) }
     }
 
     async NavBar(id : string) {
      try{          
          const nav = await this.prisma.user.findUnique({
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
  
            let progress = "";
            if (nav)
            {
              if (!nav.XP)
               progress = "0%";
              else{

                let xp = nav.XP ?? 0
                let levelXP = (nav.level + 1) * 250;
                let percentage = (xp / (levelXP)) * 100;
                progress = percentage.toString()
                if(progress)
                    progress += '%'
              }
              if (!nav.avatar.includes('cdn.intra')  && !nav.avatar.includes('https://lh3.googleusercontent.com')){
               nav.avatar = 'http://' + process.env.HOST +':' + process.env.BPORT +'/api'+ nav.avatar
            }
            return {
              ...nav,
             'progress': progress,
           };
          }
      }catch(e){throw new HttpException('Undefined Parameters', HttpStatus.BAD_REQUEST) }
    }


    async OnlineStatus(id : string) {
      try{
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
                 if (!user.avatar.includes('cdn.intra') && !user.avatar.includes('https://lh3.googleusercontent.com')){
                   user.avatar = 'http://' + process.env.HOST + ':' + process.env.BPORT +'/api' + user.avatar
                 }
              }
           return user
        }
      }catch(e){throw new HttpException('Undefined Parameters', HttpStatus.BAD_REQUEST) }
    }
    
    async OnlineFriends(id: string) {
      try{

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
      }catch(e){throw new HttpException('Undefined Parameters', HttpStatus.BAD_REQUEST) }
    }


    async Search(input: string, username: string){
      try{
        
        if(input){
          const user = await this.prisma.user.findUnique({where:{username: username}})
          if(user){
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

            let blocked = await this.userService.getBlockedUsers(user.id)
            
            res = res.filter((user) => {
              return user.username !== username;
            });
            for(const block of blocked){
              res = res.filter((user) => {
                return user.username !== block.username;
              });
            }
            
            res = await this.userService.updateAvatar(res);
            return res;
          }
        }
        else
              throw new UnauthorizedException('User  not found')
      }catch(e){throw new HttpException('Undefined Parameters', HttpStatus.BAD_REQUEST) }
    }
}
