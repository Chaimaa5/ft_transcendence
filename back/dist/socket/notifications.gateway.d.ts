import { OnGatewayDisconnect, OnGatewayConnection } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { SocketStrategy } from 'src/auth/jwt/websocket.strategy';
import { UserService } from 'src/user/user.service';
export declare class NotificationsGateway implements OnGatewayConnection, OnGatewayDisconnect {
    server: Server;
    clients: Map<string, Socket>;
    userService: UserService;
    socketStrategy: SocketStrategy;
    afterInit(server: Socket): Promise<void>;
    handleDisconnect(client: Socket): Promise<void>;
    handleConnection(server: Socket): Promise<void>;
}
