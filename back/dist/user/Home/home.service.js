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
exports.HomeService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const user_service_1 = require("../user.service");
let HomeService = exports.HomeService = class HomeService {
    constructor() {
        this.prisma = new client_1.PrismaClient();
        this.userService = new user_service_1.UserService;
    }
    async bestRanked(ownerId) {
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
            take: 5,
            orderBy: {
                rank: 'asc',
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
                username: true,
                avatar: true,
                XP: true,
                level: true,
                topaz: true,
                rank: true,
            }
        });
        const ModifiedObject = await this.userService.updateAvatar(bestRanked);
        return ModifiedObject;
    }
    async NavBar(id) {
        if (id) {
            const nav = await this.prisma.user.findFirst({
                where: { id: id },
                select: {
                    username: true,
                    avatar: true,
                    XP: true,
                    level: true,
                    games: true,
                    win: true,
                    loss: true,
                    badge: true,
                }
            });
            let progress = 0;
            if (nav) {
                if (nav.level)
                    progress = parseFloat(((nav === null || nav === void 0 ? void 0 : nav.level) % 1).toFixed(2));
                if (!nav.avatar.includes('cdn.intra')) {
                    nav.avatar = 'http://' + process.env.HOST + '/api' + nav.avatar;
                }
            }
            return Object.assign(Object.assign({}, nav), { 'progress': progress });
        }
        else
            throw new common_1.UnauthorizedException('User  not found');
    }
    async OnlineStatus(id) {
        if (id) {
            const user = await this.prisma.user.findUnique({
                where: { id: id },
                select: {
                    username: true,
                    avatar: true,
                    status: true,
                }
            });
            if (user) {
                if (!user.avatar.includes('cdn.intra')) {
                    user.avatar = 'http://' + process.env.HOST + '/api' + user.avatar;
                }
            }
            return user;
        }
    }
    async OnlineFriends(id) {
        if (id) {
            const sentPromise = await this.prisma.user.findUnique({
                where: { id: id },
            }).sentFriendships({
                where: {
                    status: 'accepted',
                },
                select: {
                    receiver: {
                        select: {
                            id: true,
                            username: true,
                            avatar: true,
                            status: true,
                            XP: true,
                            level: true,
                        },
                    },
                },
            });
            const receivedPromise = await this.prisma.user.findUnique({
                where: { id: id },
            }).receivedFriendships({
                where: {
                    status: 'accepted',
                },
                select: {
                    sender: {
                        select: {
                            id: true,
                            username: true,
                            avatar: true,
                            status: true,
                            XP: true,
                            level: true,
                        },
                    },
                },
            });
            let receiverData = sentPromise ? sentPromise.map((friendship) => friendship.receiver) : [];
            let senderData = receivedPromise ? receivedPromise.map((friendship) => friendship.sender) : [];
            receiverData = this.userService.updateAvatar(receiverData);
            senderData = this.userService.updateAvatar(senderData);
            let combinedData = [...receiverData, ...senderData];
            return combinedData;
        }
        else
            throw new common_1.UnauthorizedException('User  not found');
    }
    async Search(input) {
        if (input) {
            let res = await this.prisma.user.findMany({
                where: {
                    OR: [
                        {
                            username: {
                                startsWith: input,
                                mode: "insensitive"
                            }
                        },
                        {
                            fullname: {
                                startsWith: input,
                                mode: "insensitive"
                            }
                        }
                    ]
                },
                select: {
                    id: true,
                    username: true,
                    fullname: true,
                    avatar: true,
                }
            });
            res = await this.userService.updateAvatar(res);
            return res;
        }
        else
            throw new common_1.UnauthorizedException('User  not found');
    }
};
exports.HomeService = HomeService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], HomeService);
//# sourceMappingURL=home.service.js.map