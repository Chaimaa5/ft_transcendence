import { OnGatewayDisconnect, OnGatewayConnection } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { SocketStrategy } from 'src/auth/jwt/websocket.strategy';
import { ChatService } from 'src/chat/chat.service';
import { UserService } from 'src/user/user.service';
export declare class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
    server: Server;
    clients: Map<string, Socket>;
    rooms: Map<string, Socket[]>;
    chatService: ChatService;
    socketStrategy: SocketStrategy;
    userService: UserService;
    afterInit(client: Socket): Promise<void>;
    handleDisconnect(client: Socket): Promise<void>;
    handleConnection(server: Socket): Promise<void>;
    addToRoom(roomId: string, client: Socket): void;
    deleteFromRoom(roomId: string, client: Socket): void;
    joinRoom(client: Socket, roomId: string): void;
    handleMessage(client: Socket, body: {
        roomId: string;
        message: string;
    }): Promise<void>;
    leaveRoom(client: Socket, roomId: string): void;
}
