import { OnGatewayConnection } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
export declare class GameGateway implements OnGatewayConnection {
    server: Server;
    roomIdCounter: number;
    private readonly rooms;
    private logger;
    clients: Map<string, Socket<import("socket.io/dist/typed-events").DefaultEventsMap, import("socket.io/dist/typed-events").DefaultEventsMap, import("socket.io/dist/typed-events").DefaultEventsMap, any>>;
    afterInit(): void;
    handleConnection(client: Socket): Promise<void>;
    private joinPlayerToRoom;
    private randomInitialDirection;
    private createRoom;
    handleDisconnection(client: Socket): void;
    handleNewPaddlePosition(client: Socket, payload: {
        roomId: string;
        direction: number;
    }): void;
    handleResetRound(client: Socket): void;
}
