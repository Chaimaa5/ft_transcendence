import { SubscribeMessage, WebSocketGateway, OnGatewayDisconnect, OnGatewayConnection, WebSocketServer} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { SocketStrategy } from 'src/auth/jwt/websocket.strategy';
import { UserService } from 'src/user/user.service';
import { NotificationService } from './notification.service';
@WebSocketGateway({cors: true, namespace: '/notifications'})
export class NotificationsGateway implements OnGatewayConnection, OnGatewayDisconnect{
   

    @WebSocketServer()
    server: Server;
    constructor(private notificationService: NotificationService){}

  
    clients: Map<string, Socket> = new Map<string, Socket>()
    userService = new UserService;
    socketStrategy = new SocketStrategy;



    async afterInit(server: Socket) {
        console.log('WebSocket gateway initialized!');
        this.notificationService.eventsEmitter.on('notifications', notification =>{
            const socket = this.clients.get(notification.receiverId)
            if(socket){
                console.log(socket,"  " ,notification)
                this.server.to(socket.id).emit('notifications', notification)
            }
        })
    }
    
    async handleDisconnect(client: Socket){
        
        this.clients.forEach((socket, key) =>{
            if(socket === socket){
                this.clients.delete(key);
            }
        });
        await this.userService.updateOnlineStatus(client.data.payload.id, false)
        console.log('WebSocket gateway disconnected!');
    }
    
    async handleConnection(client: Socket) {
        let token : any =  client.handshake.headers['authorization'];
        if(token){
                token = token.split(' ')[1]
                client.data.payload = await this.socketStrategy.validate(token);
                let user = await this.userService.GetById(client.data.payload.id)
                if (user)
                {
                    this.clients.set(client.data.payload.id , client);
                    await this.userService.updateOnlineStatus(user.id, true)
                    const notifications = await this.userService.GetNotifications(user.id)
                    this.server.to(client.id).emit('notifications', notifications);
                    // this.server.emit('connectionSuccess', { message: 'Connected successfully!' });
                }
                console.log('WebSocket gateway connected!' );
            }
        }

    emitNotification(receiverId: string, notification: any) {
        const socket = this.clients.get(receiverId);
        if(socket){
            this.server.to(socket.id).emit('notifications', notification)
        }
    }

}
