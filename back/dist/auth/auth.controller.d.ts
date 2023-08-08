import { AuthService } from './auth.service';
import { Request, Response } from 'express';
import { TFA } from './dto/TFA.dto';
export declare class AuthController {
    private readonly authservice;
    constructor(authservice: AuthService);
    handleLogin(): void;
    handleAuth(req: Request, res: Response): Promise<void>;
    RefreshToken(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    handleLogout(req: Request, res: Response): Promise<void>;
    HandleTFA(req: Request, res: Response): Promise<void>;
    EnableTFA(req: Request, authTFA: TFA): Promise<boolean>;
    DisableTFA(req: Request): Promise<void>;
}
