import { PrismaClient } from '@prisma/client';
export declare class MuteService {
    prisma: PrismaClient<import(".prisma/client").Prisma.PrismaClientOptions, never, import("@prisma/client/runtime/library").DefaultArgs>;
    unmute(membership: any): Promise<void>;
    updateMutes(): Promise<void>;
}
