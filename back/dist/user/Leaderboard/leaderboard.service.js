"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LeaderboardService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const user_service_1 = require("../user.service");
let LeaderboardService = exports.LeaderboardService = class LeaderboardService {
    constructor() {
        this.prisma = new client_1.PrismaClient();
        this.userService = new user_service_1.UserService;
    }
    async Leaderboard(ownerId) {
        if (ownerId) {
            const userBlocked = await this.prisma.friendship.findMany({
                where: {
                    AND: [
                        { senderId: ownerId },
                        { status: 'blocked' }
                    ]
                },
                select: {
                    receiverId: true
                }
            });
            const userBlockers = await this.prisma.friendship.findMany({
                where: {
                    AND: [
                        { receiverId: ownerId },
                        { status: 'blocked' }
                    ]
                },
                select: {
                    senderId: true
                }
            });
            let res = await this.prisma.user.findMany({
                take: 3,
                orderBy: {
                    XP: 'desc',
                },
                where: {
                    AND: [
                        {
                            id: {
                                notIn: userBlocked.map(friendship => friendship.receiverId)
                            }
                        },
                        {
                            id: {
                                notIn: userBlockers.map(friendship => friendship.senderId)
                            }
                        }
                    ]
                },
                select: {
                    id: true,
                    rank: true,
                    username: true,
                    avatar: true,
                    XP: true,
                    badge: true,
                }
            });
            res = await this.userService.updateAvatar(res);
            return res;
        }
        else
            throw new common_1.UnauthorizedException('User  not found');
    }
    async Palyers(ownerId) {
        if (ownerId) {
            const userBlocked = await this.prisma.friendship.findMany({
                where: {
                    AND: [
                        { senderId: ownerId },
                        { status: 'blocked' }
                    ]
                },
                select: {
                    receiverId: true
                }
            });
            const userBlockers = await this.prisma.friendship.findMany({
                where: {
                    AND: [
                        { receiverId: ownerId },
                        { status: 'blocked' }
                    ]
                },
                select: {
                    senderId: true
                }
            });
            const bestRanked = await this.prisma.user.findMany({
                take: 3,
                orderBy: {
                    XP: 'desc',
                },
                where: {
                    AND: [
                        {
                            id: {
                                notIn: userBlocked.map(friendship => friendship.receiverId)
                            }
                        },
                        {
                            id: {
                                notIn: userBlockers.map(friendship => friendship.senderId)
                            }
                        }
                    ]
                },
            });
            let players = await this.prisma.user.findMany({
                orderBy: {
                    XP: 'desc',
                },
                where: {
                    AND: [
                        {
                            id: {
                                notIn: userBlocked.map(friendship => friendship.receiverId)
                            }
                        },
                        {
                            id: {
                                notIn: bestRanked.map(friendship => friendship.id)
                            }
                        },
                        {
                            id: {
                                notIn: userBlockers.map(friendship => friendship.senderId)
                            }
                        }
                    ]
                },
                select: {
                    id: true,
                    avatar: true,
                    rank: true,
                    username: true,
                    level: true,
                    XP: true,
                    topaz: true,
                }
            });
            players = await this.userService.updateAvatar(players);
            return players;
        }
        else
            throw new common_1.UnauthorizedException('User  not found');
    }
};
exports.LeaderboardService = LeaderboardService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], LeaderboardService);
//# sourceMappingURL=leaderboard.service.js.map