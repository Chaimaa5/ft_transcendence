/// <reference types="multer" />
import { Request } from 'express';
import { ChatService } from './chat.service';
import { AddMember, CreateChannel } from './dto/Chat.dto';
export declare class ChatController {
    private readonly chatService;
    constructor(chatService: ChatService);
    GetJoinedRooms(req: Request): Promise<({
        membership: {
            id: number;
            userId: string;
            role: string;
            isBanned: boolean;
            isMuted: boolean;
        }[];
    } & import("@prisma/client/runtime/library").GetResult<{
        id: number;
        name: string;
        image: string;
        isChannel: boolean;
        password: string | null;
        createdAt: Date;
        updateAt: Date;
        ownerId: string;
        type: string;
    }, unknown> & {})[]>;
    CreateChannel(req: Request, image: Express.Multer.File, body: CreateChannel): Promise<void>;
    AddMember(req: Request, body: AddMember): Promise<void>;
    GetChannels(req: Request): Promise<{
        id: number;
        name: string;
        type: string;
        image: string;
        ownerId: string;
        count: number;
    }[]>;
    GetJoinedChannels(req: Request): Promise<{
        id: number;
        name: string;
        type: string;
        image: string;
        ownerId: string;
        count: number;
    }[]>;
    SetAdmin(req: Request, Id: any): Promise<void>;
    DeleteChannel(req: Request, Id: any): Promise<void>;
    GetMessages(req: Request, Id: any): Promise<void>;
}
