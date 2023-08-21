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
    chatService = new ChatService;
    socketStrategy = new SocketStrategy;
    userService = new UserService;
    
    rooms = new Map<number, Socket[]>()

    async afterInit(client: Socket) {
    }
    
    async handleDisconnect(client: Socket){ 
        this.clients.forEach((socket, key) =>{
            if(socket === socket){
                this.clients.delete(key);
            }
        });
    }
    
    async handleConnection(client: Socket) {
        let token : any =  client.handshake.headers['authorization'];
        if(token){
            token = token.split(' ')[1]
            client.data.payload = await this.socketStrategy.validate(token);
            if(client.data.payload.id){
                let user = await this.userService.GetById(client.data.payload.id)
                if (user)
                    this.clients.set(client.data.payload.id , client);
            }
        }
    }


    addToRoom(roomId: string, client: Socket){
        const room = parseInt(roomId)
        if(!this.rooms.has(room)){
            this.rooms.set(room, [client])
        }
        const sockets = this.rooms.get(room)
        sockets?.push(client)
    }

    deleteFromRoom(roomId: string, client: Socket){
        const room = parseInt(roomId)
        if(this.rooms.has(room)){
            let sockets = this.rooms.get(room)
            
            const index = sockets?.indexOf(client)

            const deletCount = 1;
            if(index != -1){
                sockets = sockets ?? []
                if(index)
                    sockets.splice(index, deletCount);
            }
        }
    }

    @SubscribeMessage('joinChat')
    joinChat(client: Socket, roomId: string){
        console.log('WebSocket gateway joined!');
        this.addToRoom(roomId, client);
        client.join(roomId);
    }


    @SubscribeMessage('joinChat')
    joinRoom(client: Socket, roomId: string){
        this.addToRoom(roomId, client);
        client.join(roomId);
    }

    @SubscribeMessage('sendMessage')
    async handleMessage(client: Socket, body : {roomId: string, message: string}){

        const { roomId, message } = body;
        const room = parseInt(roomId);
        const userId = client.data.payload.id;
        if(message){
            const isMuted = await this.chatService.checkMute(room, userId)
            const isBanned = await this.chatService.checkBan(room, userId)
            if(!isMuted && !isBanned){
                const rcvData = await this.chatService.storeMessage(room, userId, message);
                if(rcvData)
                    this.emitMessage(rcvData, room, userId)
            }
        }
    }
    
    async emitMessage(rcvData: any, roomId: number, userId: string) {
        let ChatRoom = this.rooms.get(roomId)
        if(ChatRoom ){
            let Banned = await this.userService.GetBanned(roomId);
            let Blocked = await this.userService.getBlockedUsers(userId);
            ChatRoom = ChatRoom.filter(ChatRoom => {
                    const id = ChatRoom.data.payload.id;
                    if(!Blocked.some(user => user.id === id) && !Banned?.some(member => member.userId === id))
                        return  id;
                })
            ChatRoom.forEach(socket =>{
                this.server.to(socket.id).emit('receiveMessage', rcvData)
            })
        }
    }

    @SubscribeMessage('leave')
    leaveRoom(client: Socket, roomId: string){
        this.deleteFromRoom(roomId, client);
    }
}
