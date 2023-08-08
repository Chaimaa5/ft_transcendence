import { PrismaClient } from '@prisma/client';
import { UserService } from '../user.service';
export declare class HomeService {
    prisma: PrismaClient<import(".prisma/client").Prisma.PrismaClientOptions, never, import("@prisma/client/runtime/library").DefaultArgs>;
    userService: UserService;
    constructor();
    bestRanked(ownerId: string): Promise<any[]>;
    NavBar(id: string): Promise<{
        progress: number;
        username?: string | undefined;
        avatar?: string | undefined;
        XP?: number | undefined;
        level?: number | null | undefined;
        games?: number | null | undefined;
        win?: number | undefined;
        loss?: number | undefined;
        badge?: (import("@prisma/client/runtime/library").GetResult<{
            id: number;
            Achievement: string;
            Achieved: boolean;
            userId: string;
        }, unknown> & {})[] | undefined;
    }>;
    OnlineStatus(id: string): Promise<{
        username: string;
        avatar: string;
        status: boolean;
    } | null | undefined>;
    OnlineFriends(id: string): Promise<{
        id: string;
        username: string;
        avatar: string;
        status: boolean;
        XP: number;
        level: number | null;
    }[]>;
    Search(input: string): Promise<{
        id: string;
        username: string;
        fullname: string;
        avatar: string;
    }[]>;
}
