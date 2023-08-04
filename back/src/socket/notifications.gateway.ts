import { SubscribeMessage, WebSocketGateway, OnGatewayDisconnect, OnGatewayConnection, WebSocketServer} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { SocketStrategy } from 'src/auth/jwt/websocket.strategy';
import { UserService } from 'src/user/user.service';
@WebSocketGateway()
export class NotificationsGateway implements OnGatewayConnection, OnGatewayDisconnect{

    @WebSocketServer()
    server: Server;

  
    clients: Map<string, Socket> = new Map<string, Socket>()
    userService = new UserService;
    socketStrategy = new SocketStrategy;



    async afterInit(server: Socket) {
        console.log('WebSocket gateway initialized!');
		
    }
    
    async handleDisconnect(client: Socket){
        
        this.clients.forEach((socket, key) =>{
            if(socket === socket){
                this.clients.delete(key);
            }
        });
        await this.userService.updateOnlineStatus(client.data.payload.id, false)
        console.log('WebSocket gateway desconnected!');
    }
    
    async handleConnection(server: Socket) {
        let token : any =  server.handshake.headers['authorization'];
        token = token.split(' ')[1]
         server.data.payload = await this.socketStrategy.validate(token);
            let user = await this.userService.GetById(server.data.payload.id)
            if (user)
            {
                this.clients.set(server.data.payload.id , server);
                await this.userService.updateOnlineStatus(user.id, true)
                // const notifications = await this.userService.GetNotifications(user.id)
                // server.emit('notifications', notifications);
                server.emit('connectionSuccess', { message: 'Connected successfully!' });

            }
    }

}
