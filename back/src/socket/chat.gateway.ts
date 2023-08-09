import { SubscribeMessage, WebSocketGateway, OnGatewayDisconnect, OnGatewayConnection, WebSocketServer} from '@nestjs/websockets';
import { CorsOptions } from 'cors';
import { Server, Socket } from 'socket.io';
import { SocketStrategy } from 'src/auth/jwt/websocket.strategy';
import { ChatService } from 'src/chat/chat.service';
import { UserService } from 'src/user/user.service';
@WebSocketGateway({cors: true, namespace: '/chat'})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect{
   
    @WebSocketServer()
    server: Server;

  
    clients: Map<string, Socket> = new Map<string, Socket>()
    rooms: Map<string, Socket[]> = new Map<string, Socket[]>()
    chatService = new ChatService;
    socketStrategy = new SocketStrategy;
    userService = new UserService;



    async afterInit(client: Socket) {
        console.log('WebSocket gateway initialized!');
    }
    
    async handleDisconnect(client: Socket){ 
        console.log('WebSocket gateway disconnected!');
        this.clients.forEach((socket, key) =>{
            if(socket === socket){
                this.clients.delete(key);
            }
        });
    }
    
    async handleConnection(server: Socket) {
        let token : any =  server.handshake.headers['authorization'];
        token = token.split(' ')[1]
        server.data.payload = await this.socketStrategy.validate(token);
        console.log('WebSocket gateway connected!');
        console.log(server.data.payload.id)
        if(server.data.payload.id){

            let user = await this.userService.GetById(server.data.payload.id)
            if (user)
            {
                this.clients.set(server.data.payload.id , server);
                server.to(server.id).emit('connectionSuccess', { message: 'Connected successfully!' });
            }
        }
        }


    addToRoom(roomId: string, client: Socket){
        if(!this.rooms.has(roomId)){
            this.rooms.set(roomId, [])
        }

        const sockets = this.rooms.get(roomId)
        sockets?.push(client)
    }
    deleteFromRoom(roomId: string, client: Socket){
        if(this.rooms.has(roomId)){
            let sockets = this.rooms.get(roomId)

            const index = sockets?.indexOf(client)

            const deletCount = 1;
            if(index != -1){
                sockets = sockets ?? []
                if(index)
                    sockets.splice(index, deletCount);
            }
        }
       
    }
    @SubscribeMessage('join')
    joinRoom(client: Socket, roomId: string){
        console.log('WebSocket gateway joined!');
        this.addToRoom(roomId, client);
        client.join(roomId);
    }

    @SubscribeMessage('message')
    async handleMessage(client: Socket, body : {roomId: string, message: string}){
        const {roomId, message} = body;
        const room = parseInt(roomId);
        const userId = client.data.payload.id;
        console.log(userId);
        console.log(message);
        const isMuted = await this.chatService.checkMute(room, userId)
        if(!isMuted ){
            this.chatService.storeMessage(room, userId, message);
            // const Blocked = this.userService.getBlocked(userId);
            // this.server.to(roomId).except(client.id).emit('message', message);

            this.server.to(roomId).emit('message', message);
        }
    }

    @SubscribeMessage('leave')
    leaveRoom(client: Socket, roomId: string){
        this.deleteFromRoom(roomId, client);
    }
}
