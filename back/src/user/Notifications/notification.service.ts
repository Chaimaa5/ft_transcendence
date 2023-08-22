import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { EventEmitter } from 'events';
@Injectable()
export class NotificationService {
	
  
    prisma = new PrismaClient();
    private Emitter = new EventEmitter();
    constructor(){}

   async addNotifications(senderId : string, receiverId: string, type: string, context: string){
    const sender = await this.prisma.user.findUnique({where: {id: senderId}})
    const receiver = await this.prisma.user.findUnique({where: {id: receiverId}})

    const content = sender?.username + ' ' + context + ' ' +receiver?.username

    const exist = await this.prisma.notification.findFirst({
        where: {content: content}
    })
    if(exist){
        const notification = await this.prisma.notification.update({
            where:{id: exist.id},
            data:{createdAt: new Date()}
        })
        // this.notificationsGateway.emitNotification(receiverId, notification)
    }
    else{
        const notification = await this.prisma.notification.create({
            data: {
                sender: {connect: {id: senderId}},
                receiver: {connect: {id: receiverId}},
                status: false,
                type: type,
                content: content
            },
        });
        // this.notificationsGateway.emitNotification(receiverId, notification)
    }
}

async addGameInvite(senderId : string, receiverId: string, gameId: number){
    const sender = await this.prisma.user.findUnique({where: {id: senderId}})
    const receiver = await this.prisma.user.findUnique({where: {id: receiverId}})

    if(sender && receiver){

        const notification = await this.prisma.notification.create({
            data: {
                sender: {connect: {id: senderId}},
                receiver: {connect: {id: receiverId}},
                status: false,
                type: 'Game',
                content: '',
                gameId: gameId
            },
        });
        this.Emitter.emit('notifications', notification)
    }
}
   
async addAchievementNotification(id: string, achievement: string) {
    try{
        const content = id + " has successefuly achieved " + achievement
        const notificationCheck = await this.prisma.notification.findFirst({where: {content: content}})
        if(content){
            const notification = await this.prisma.notification.create({
                data:{
                    sender:  {connect:{id: id}},
                    receiver: {connect:{id: id}},
                    status: false,
                    type: 'Achievement',
                    content: content,
    
                }
            })
            this.Emitter.emit('notifications', notification)
        }
    }catch(e){}
}
get  eventsEmitter() {
    return(this.Emitter)
}

}
