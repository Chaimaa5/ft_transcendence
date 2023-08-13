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
    rooms = new Map<string, Socket[]>()
    chatService = new ChatService;
    socketStrategy = new SocketStrategy;
    userService = new UserService;

    // room {[roomId: string], Socket[]} = {}

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
    
    async handleConnection(client: Socket) {
        let token : any =  client.handshake.headers['authorization'];
        if(token){
            token = token.split(' ')[1]
            client.data.payload = await this.socketStrategy.validate(token);
            // console.log('WebSocket gateway connected!');
            // console.log(client.data.payload.id)
            if(client.data.payload.id){
                let user = await this.userService.GetById(client.data.payload.id)
                if (user)
                {
                    this.clients.set(client.data.payload.id , client);
                    // this.server.to(client.id).emit('connectionSuccess', { message: 'Connected successfully!' });
                }
            }
        }
    }


    addToRoom(roomId: string, client: Socket){
        if(!this.rooms.has(roomId)){
            this.rooms.set(roomId, [client])
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

    @SubscribeMessage('joinChat')
    joinChat(client: Socket, roomId: string){
        console.log('WebSocket gateway joined!');
        this.addToRoom(roomId, client);
        client.join(roomId);
    }

    // @SubscribeMessage('sendMessage')
    // async handleMessage(client: Socket, body : {roomId: string, message: string}){
    //     const {roomId, message} = body;
    //     const room = parseInt(roomId);
    //     const userId = client.data.payload.id;
    //     const isMuted = await this.chatService.checkMute(room, userId)
    //     const isBanned = await this.chatService.checkBan(room, userId)
    //     if(!isMuted && !isBanned){
    //         const rcvData : any = await this.chatService.storeMessage(room, userId, message);
    //         const Blocked = new Set(await this.userService.getBlockedUsers(userId));
    //         const ChatRoom = this.rooms.get(roomId)
    //         if(ChatRoom ){
    //             console.log('room: ', ChatRoom)
    //             // ChatRoom = ChatRoom.filter(ChatRoom => {
    //             //     const id = ChatRoom.data.payload.id;
    //             //     return !Blocked.has(id) 
    //             // })
    //             ChatRoom.forEach(socket =>{
    //                 // console.log('id:', socket.data.payload.id)
    //                 this.server.to(socket.id).emit('receiveMessage', rcvData)
    //             })
    //         }
    //     }
    // }



    @SubscribeMessage('joinChat')
    joinRoom(client: Socket, roomId: string){
        console.log('Joined ', roomId)
        this.addToRoom(roomId, client);
        client.join(roomId);
    }

    @SubscribeMessage('sendMessage')
    async handleMessage(client: Socket, body : {roomId: string, message: string}){
        const {roomId, message} = body;
        const room = parseInt(roomId);
        console.log(message)
        const userId = client.data.payload.id;
        if(message){
            const rcvData = await this.chatService.storeMessage(room, userId, message);
            const isMuted = await this.chatService.checkMute(room, userId)
            if(!isMuted ){
                // const Blocked = this.userService.getBlocked(userId);
                // this.server.to(roomId).except(client.id).emit('message', message);
                // console.log(this.rooms)
                console.log("Keys in the map:", [...this.rooms.keys()]);

                let ChatRoom = this.rooms.get(roomId)
                console.log(ChatRoom)
                if(rcvData){
                    this.emitMessage(rcvData, roomId)
                    // this.server.to(client.id).emit('receiveMessage',rcvData);
                }
            }
        }
    }
    
    emitMessage(rcvData: any, roomId: string) {
        const ChatRoom = this.rooms.get(roomId)
            if(ChatRoom ){
                console.log('room: ', ChatRoom)
                // ChatRoom = ChatRoom.filter(ChatRoom => {
                //     const id = ChatRoom.data.payload.id;
                //     return !Blocked.has(id) 
                // })
                ChatRoom.forEach(socket =>{
                    // console.log('id:', socket.data.payload.id)
                    this.server.to(socket.id).emit('receiveMessage', rcvData)
                })
            }
    }

    @SubscribeMessage('leave')
    leaveRoom(client: Socket, roomId: string){
        this.deleteFromRoom(roomId, client);
    }
}
