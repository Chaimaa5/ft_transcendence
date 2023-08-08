import { PrismaClient, User } from '@prisma/client';
export declare class GameService {
    prisma: PrismaClient<import(".prisma/client").Prisma.PrismaClientOptions, never, import("@prisma/client/runtime/library").DefaultArgs>;
    constructor();
    postChallengeSettings(user: User, body: any): Promise<number>;
    getChallengeSettings(id: number): Promise<{
        player1: {
            username: string;
        };
        player2: {
            username: string;
        } | null;
        rounds: number;
        pointsToWin: number | null;
        difficulty: string | null;
    } | null>;
}
