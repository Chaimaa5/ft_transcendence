import { Request } from 'express';
import { HomeService } from './home.service';
import { SerachpDTO } from '../dto/serachdto.dto';
export declare class HomeController {
    private readonly home;
    constructor(home: HomeService);
    bestRanked(req: Request): Promise<any[]>;
    NavBar(req: Request): Promise<{
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
    OnlineFriends(req: Request): Promise<{
        id: string;
        username: string;
        avatar: string;
        status: boolean;
        XP: number;
        level: number | null;
    }[]>;
    Search(req: Request, input: SerachpDTO): Promise<{
        id: string;
        username: string;
        fullname: string;
        avatar: string;
    }[]>;
}
