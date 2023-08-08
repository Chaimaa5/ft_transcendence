/// <reference types="multer" />
import { PrismaClient } from '@prisma/client';
import { AddMember, CreateChannel, UpdateChannel } from './dto/Chat.dto';
export declare class ChatService {
    prisma: PrismaClient<import(".prisma/client").Prisma.PrismaClientOptions, never, import("@prisma/client/runtime/library").DefaultArgs>;
    constructor();
    encryptPassword(password: string): string;
    updateImage(Object: any[]): Promise<any[]>;
    GetJoinedRooms(id: string): Promise<({
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
    CreateRoom(ownerId: string, memberId: string, name: string): Promise<void>;
    AddMember(id: string, data: AddMember): Promise<void>;
    CreateChannel(ownerId: string, data: CreateChannel, image: Express.Multer.File): Promise<void>;
    kick(ownerId: string, roomId: number, memberId: number): Promise<void>;
    leaveChannel(membershipId: number): Promise<void>;
    setAdmin(id: string, membershipId: number): Promise<void>;
    changePrivacy(roomId: number, id: string, type: string, pw: string): Promise<void>;
    UpdateChannel(room: UpdateChannel, image: Express.Multer.File): Promise<void>;
    SetPassword(roomId: number, pw: string): Promise<void>;
    deleteMembership(id: number): Promise<void>;
    deleteRoom(id: number): Promise<void>;
    deleteMessages(roomId: number, memberId: string): Promise<void>;
    muteMember(membershipId: number, muteDuration: number): Promise<void>;
    banMember(membershipId: number): Promise<void>;
    fetchDms(): Promise<void>;
    GetChannels(id: string): Promise<{
        id: number;
        name: string;
        type: string;
        image: string;
        ownerId: string;
        count: number;
    }[]>;
    GetJoinedChannels(id: string): Promise<{
        id: number;
        name: string;
        type: string;
        image: string;
        ownerId: string;
        count: number;
    }[]>;
    DeleteChannel(id: string, roomId: number): Promise<void>;
    storeMessage(roomId: number, userId: string, content: string): Promise<void>;
    GetMessages(id: string, roomId: number): Promise<void>;
    checkMute(roomId: number, userId: string): Promise<boolean | undefined>;
}
