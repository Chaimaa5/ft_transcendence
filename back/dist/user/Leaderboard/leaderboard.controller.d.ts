import { Request } from 'express';
import { LeaderboardService } from './leaderboard.service';
export declare class LeaderboardController {
    private readonly profile;
    constructor(profile: LeaderboardService);
    Leaderboard(req: Request): Promise<{
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
    Palyers(req: Request): Promise<{
        id: string;
        avatar: string;
        rank: number;
        username: string;
        level: number | null;
        XP: number;
        topaz: number | null;
    }[]>;
}
