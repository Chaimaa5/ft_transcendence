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
    GetMessages(req: Request, Id: any): Promise<{
        messages: {
            id: string;
            username: string;
            avatar: string;
            content: string;
        }[];
        role?: string | undefined;
        name?: string | undefined;
        image?: string | undefined;
        type?: string | undefined;
        isChannel?: boolean | undefined;
    }>;
    BanMember(req: Request, Id: any): Promise<void>;
    MuteMember(req: Request, Id: any, duration: string): Promise<void>;
    UnbanMember(req: Request, Id: any): Promise<void>;
    UnmuteMember(req: Request, Id: any): Promise<void>;
    GetRoomMembers(id: string): Promise<{
        membershipId: number;
        userId: string;
        username: string;
        avatar: string;
        role: string;
        isBanned: boolean;
        isMuted: boolean;
    }[]>;
}
