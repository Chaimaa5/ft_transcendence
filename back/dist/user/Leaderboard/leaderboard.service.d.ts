import { PrismaClient } from '@prisma/client';
import { UserService } from '../user.service';
export declare class LeaderboardService {
    prisma: PrismaClient<import(".prisma/client").Prisma.PrismaClientOptions, never, import("@prisma/client/runtime/library").DefaultArgs>;
    userService: UserService;
    constructor();
    Leaderboard(ownerId: string): Promise<{
        id: string;
        rank: number;
        username: string;
        avatar: string;
        XP: number;
        badge: (import("@prisma/client/runtime/library").GetResult<{
            id: number;
            Achievement: string;
            Achieved: boolean;
            userId: string;
        }, unknown> & {})[];
    }[]>;
    Palyers(ownerId: string): Promise<{
        id: string;
        avatar: string;
        rank: number;
        username: string;
        level: number | null;
        XP: number;
        topaz: number | null;
    }[]>;
}
