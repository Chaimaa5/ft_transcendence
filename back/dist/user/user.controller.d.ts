/// <reference types="multer" />
import { UserService } from './user.service';
import { UpdateUserDTO } from './dto/updatedto.dto';
import { Request, Response } from 'express';
export declare class UserController {
    private readonly userservice;
    constructor(userservice: UserService);
    FindbyID(req: Request): Promise<(import("@prisma/client/runtime/library").GetResult<{
        id: string;
        username: string;
        fullname: string;
        avatar: string;
        isTwoFacEnabled: boolean;
        TwoFacSecret: string;
        XP: number;
        level: number | null;
        topaz: number | null;
        win: number;
        loss: number;
        games: number | null;
        rank: number;
        refreshToken: string | null;
        status: boolean;
        createdAt: Date;
    }, unknown> & {}) | undefined>;
    Players(): Promise<any[]>;
    DeleteUser(req: Request, res: Response): Promise<void>;
    UserSetup(req: Request, avatar: Express.Multer.File, data: UpdateUserDTO): Promise<void>;
    addFriend(req: Request, id: string): Promise<{
        message: string;
    }>;
    removeFriend(req: Request, id: string): Promise<{
        message: string;
    }>;
    acceptFriend(req: Request, id: string): Promise<{
        message: string;
    }>;
    blockFriend(req: Request, id: string): Promise<{
        message: string;
    }>;
    unblockFriend(req: Request, id: string): Promise<{
        message: string;
    }>;
    getFriends(req: Request): Promise<(import("@prisma/client/runtime/library").GetResult<{
        id: number;
        senderId: string;
        receiverId: string;
        status: string;
        blockerId: string;
        createdAt: Date;
    }, unknown> & {})[]>;
    getFriend(req: Request, id: string): Promise<(import("@prisma/client/runtime/library").GetResult<{
        id: number;
        senderId: string;
        receiverId: string;
        status: string;
        blockerId: string;
        createdAt: Date;
    }, unknown> & {}) | null>;
    getPendings(req: Request): Promise<(import("@prisma/client/runtime/library").GetResult<{
        id: number;
        senderId: string;
        receiverId: string;
        status: string;
        blockerId: string;
        createdAt: Date;
    }, unknown> & {})[]>;
    getBlocked(req: Request): Promise<(import("@prisma/client/runtime/library").GetResult<{
        id: number;
        senderId: string;
        receiverId: string;
        status: string;
        blockerId: string;
        createdAt: Date;
    }, unknown> & {})[]>;
}
