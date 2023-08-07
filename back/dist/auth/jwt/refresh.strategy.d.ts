import { PrismaClient } from "@prisma/client";
import { JwtPayload } from "jsonwebtoken";
import { Strategy } from "passport-jwt";
declare const RefreshStrategy_base: new (...args: any[]) => Strategy;
export declare class RefreshStrategy extends RefreshStrategy_base {
    constructor();
    prisma: PrismaClient<import(".prisma/client").Prisma.PrismaClientOptions, never, import("@prisma/client/runtime/library").DefaultArgs>;
    validate(payload: JwtPayload): Promise<import("@prisma/client/runtime/library").GetResult<{
        id: string;
        username: string;
        fullname: string;
        avatar: string;
        isTwoFacEnabled: boolean;
        TwoFacSecret: string;
        XP: number;
        level: number | null;
        topaz: number | null;
        win: number;
        loss: number;
        games: number | null;
        rank: number;
        refreshToken: string | null;
        status: boolean;
        createdAt: Date;
    }, unknown> & {}>;
}
export {};
