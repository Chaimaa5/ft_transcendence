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
      }catch(e){throw new HttpException('Undefined Parameters', HttpStatus.BAD_REQUEST) }
     }
 
     async NavBar(id : string) {
      try{

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
  
            let progress = "";
            if (nav)
            {
              if (nav.level){
                  let percentage = parseFloat((nav.level % 1).toFixed(2));
                  progress = percentage.toString()
                  progress = progress.split('.')[1]
                  if(progress.length == 1)
                      progress = progress.concat("0")
                  progress = progress.concat('%')
              }
              else
                  progress = "0%";
              if (!nav.avatar.includes('cdn.intra')  && !nav.avatar.includes('https://lh3.googleusercontent.com')){
               nav.avatar = 'http://' + process.env.HOST +':' + process.env.BPORT +'/api'+ nav.avatar
            }
          }
           return {
             ...nav,
            'progress': progress,
          };
        }
        else
            throw new UnauthorizedException('User  not found')
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
            console.log(blocked)
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
