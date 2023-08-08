import { JwtService } from '@nestjs/jwt';
import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';
import { UserService } from 'src/user/user.service';
import { ConfigService } from 'src/config/config.service';
export declare class AuthService {
    constructor();
    jwtService: JwtService;
    userService: UserService;
    configService: ConfigService;
    prisma: PrismaClient<import(".prisma/client").Prisma.PrismaClientOptions, never, import("@prisma/client/runtime/library").DefaultArgs>;
    secretKey: string;
    signIn(res: Response, req: Request): Promise<1 | 2>;
    signOut(res: Response): void;
    encryptToken(token: string): string;
    decryptToken(encryptedToken: string): any;
    generateToken(user: any): string;
    generateRefreshToken(user: any): string;
    RefreshTokens(req: Request, res: Response): Promise<void>;
    generateQRCode(id: string): Promise<string>;
    verifyTFA(user: any, code: string): Promise<boolean>;
    activateTFA(id: string): Promise<void>;
    disableTFA(id: string): Promise<void>;
}
