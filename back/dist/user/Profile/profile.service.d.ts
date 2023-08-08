import { PrismaClient } from '@prisma/client';
export declare class ProfileService {
    prisma: PrismaClient<import(".prisma/client").Prisma.PrismaClientOptions, never, import("@prisma/client/runtime/library").DefaultArgs>;
    constructor();
    Profile(id: string, username: string): Promise<{
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
    User(id: string, username: string): Promise<{
        id: string | undefined;
        isOwner: boolean;
        isFriend: boolean;
        isSender: boolean;
        isReceiver: boolean;
        isBlocked: boolean;
    }>;
    Badges(username: string): Promise<{
        badge: (import("@prisma/client/runtime/library").GetResult<{
            id: number;
            Achievement: string;
            Achieved: boolean;
            userId: string;
        }, unknown> & {})[];
    } | null>;
    CountFriends(username: string): Promise<number>;
    CalculatePercentage(username: string): Promise<{
        win: string;
        loss: string;
    }>;
    Friends(username: string, ownerId: string): Promise<{
        id: string;
        avatar: string;
        XP: number;
        level: number | null;
    }[]>;
    MatchHistory(username: string): Promise<{
        winner: string | null;
        player1: {
            username: string;
        };
        player2: {
            username: string;
        } | null;
    }[]>;
}
