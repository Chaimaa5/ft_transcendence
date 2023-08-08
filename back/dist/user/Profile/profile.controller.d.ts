import { ProfileService } from './profile.service';
import { Request } from 'express';
export declare class ProfileController {
    private readonly profile;
    constructor(profile: ProfileService);
    Profile(username: string, req: Request): Promise<{
        username: string | undefined;
        losses: number | undefined;
        wins: number | undefined;
        level: number | null | undefined;
        xp: number | undefined;
        rank: number | undefined;
        avatar: string | undefined;
        friend: number;
        isOwner: boolean;
        isFriend: boolean;
        isSender: boolean;
        isReceiver: boolean;
        isBlocked: boolean;
    }>;
    GetAcheivments(username: string, req: Request): Promise<{
        badge: (import("@prisma/client/runtime/library").GetResult<{
            id: number;
            Achievement: string;
            Achieved: boolean;
            userId: string;
        }, unknown> & {})[];
    } | null>;
    MatchHistory(username: string, req: Request): Promise<{
        winner: string | null;
        player1: {
            username: string;
        };
        player2: {
            username: string;
        } | null;
    }[]>;
    UserStatistics(username: string, req: Request): Promise<{
        win: string;
        loss: string;
    }>;
    Friends(username: string, req: Request): Promise<{
        id: string;
        avatar: string;
        XP: number;
        level: number | null;
    }[]>;
    User(username: string, req: Request): Promise<{
        id: string | undefined;
        isOwner: boolean;
        isFriend: boolean;
        isSender: boolean;
        isReceiver: boolean;
        isBlocked: boolean;
    }>;
}
