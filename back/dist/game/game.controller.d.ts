import { Request } from 'express';
import { GameService } from './game.service';
import { AuthService } from 'src/auth/auth.service';
export declare class GameController {
    private readonly gameService;
    authService: AuthService;
    constructor(gameService: GameService);
    postChallengeSettings(settings: Request, body: any): Promise<number>;
    GetAuthAccess(req: Request): Promise<string>;
    getChallengeSettings(id: string): Promise<{
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
