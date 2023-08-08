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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const chat_service_1 = require("../chat/chat.service");
let UserService = exports.UserService = class UserService {
    constructor() {
        this.prisma = new client_1.PrismaClient();
        this.chatService = new chat_service_1.ChatService;
    }
    async GetById(id) {
        const user = await this.prisma.user.findUnique({ where: { id: id } });
        return user;
    }
    async CreateUser(user) {
        if (user) {
            const UserExists = await this.prisma.user.findUnique({
                where: { id: user.id },
            });
            if (UserExists) {
                console.log('User already exists');
                return user;
            }
            else {
                let rankCount = await this.prisma.user.count();
                rankCount += 1;
                const newUser = await this.prisma.user.create({
                    data: {
                        id: user.id,
                        username: user.username,
                        fullname: user.fullname,
                        avatar: user.avatar,
                        isTwoFacEnabled: false,
                        TwoFacSecret: '',
                        XP: 0,
                        win: 0,
                        loss: 0,
                        status: false,
                        rank: rankCount,
                        level: 0,
                        badge: {
                            create: [{
                                    Achievement: "x", Achieved: false,
                                },
                                {
                                    Achievement: "y", Achieved: false,
                                },
                                {
                                    Achievement: "z", Achieved: false,
                                }
                            ]
                        },
                        refreshToken: '',
                        createdAt: new Date(),
                    }
                });
                return newUser;
            }
            return false;
        }
        else
            throw new common_1.UnauthorizedException('User not found');
    }
    async FindUser(user) {
        if (user) {
            const Exists = await this.prisma.user.findUnique({
                where: { id: user.id },
            });
            if (Exists)
                return 1;
            else
                return 2;
        }
        else
            throw new common_1.UnauthorizedException('User not found');
    }
    async GetUser(user) {
        if (user) {
            const Exists = await this.prisma.user.findUnique({
                where: { id: user.id },
            });
            if (Exists)
                return Exists;
            else {
                const UserExists = await this.CreateUser(user);
                return UserExists;
            }
        }
        else
            throw new common_1.UnauthorizedException('User not found');
    }
    async userSetup(id, avatar, data) {
        if (id) {
            let imagePath = '';
            imagePath = "/upload/" + avatar.filename;
            const username = data.username;
            await this.prisma.user.update({ where: { id: id }, data: { avatar: imagePath } });
            if (username) {
                await this.prisma.user.update({ where: { id: id }, data: { username: username } });
            }
        }
        else
            throw new common_1.UnauthorizedException('User not found');
    }
    async updateOnlineStatus(id, status) {
        if (id)
            await this.prisma.user.update({ where: { id: id }, data: { status: status } });
        else
            throw new common_1.UnauthorizedException('User  not found');
    }
    async UpdateRefreshToken(id, Rt) {
        if (id)
            return this.prisma.user.update({ where: { id: id }, data: { refreshToken: Rt } });
        else
            throw new common_1.UnauthorizedException('User  not found');
    }
    async GetMany() {
        return await this.prisma.user.findMany();
    }
    async deleteGroups(id) {
        if (id) {
            await this.prisma.membership.deleteMany({
                where: {
                    userId: id
                }
            });
            await this.prisma.room.deleteMany({ where: { ownerId: id } });
        }
        else
            throw new common_1.UnauthorizedException('User  not found');
    }
    async DeleteUser(id, res) {
        if (id) {
            await this.prisma.friendship.deleteMany({ where: {
                    OR: [
                        { senderId: id },
                        { receiverId: id },
                    ]
                } });
            this.deleteGroups(id);
            this.deleteAchievements(id);
            this.deleteGames(id);
            res.clearCookie('access_token');
            res.clearCookie('refresh_token');
            await this.prisma.user.delete({ where: { id: id } });
        }
        else
            throw new common_1.UnauthorizedException('User  not found');
    }
    async deleteGames(id) {
        await this.prisma.game.deleteMany({
            where: {
                OR: [
                    { playerId1: id },
                    { playerId2: id }
                ]
            }
        });
    }
    async deleteAchievements(id) {
        await this.prisma.achievement.deleteMany({
            where: { userId: id }
        });
    }
    async FindbyID(id) {
        if (id) {
            const user = await this.prisma.user.findUnique({
                where: { id: id },
            }).then((user) => {
                if (user) {
                    if (user.avatar) {
                        if (!user.avatar.includes('cdn.intra')) {
                            user.avatar = 'http://' + process.env.HOST + '/api' + user.avatar;
                        }
                    }
                    return user;
                }
            });
            return user;
        }
        else
            throw new common_1.UnauthorizedException('User  not found');
    }
    async addFriend(id, Id) {
        if (id) {
            const exist = await this.FindbyID(Id);
            if (exist) {
                await this.prisma.friendship.create({
                    data: {
                        sender: { connect: { id: id } },
                        receiver: { connect: { id: Id } },
                        status: 'pending',
                        blockerId: '',
                    },
                });
                await this.addNotifications(id, Id, 'friendship', 'sent you an invite');
            }
            else
                throw new common_1.UnauthorizedException('User Does Not Exist');
        }
        else
            throw new common_1.UnauthorizedException('User not found');
    }
    async removeFriend(id, Id) {
        if (id) {
            const exist = await this.FindbyID(Id);
            if (exist) {
                await this.prisma.friendship.deleteMany({
                    where: {
                        OR: [
                            { senderId: id, receiverId: Id },
                            { senderId: Id, receiverId: id },
                        ],
                    },
                });
            }
            else
                throw new common_1.UnauthorizedException('User Does Not Exist');
        }
        else
            throw new common_1.UnauthorizedException('User not found');
    }
    async acceptFriend(id, Id) {
        if (id) {
            const exist = await this.FindbyID(Id);
            if (exist) {
                await this.prisma.friendship.updateMany({
                    where: {
                        OR: [
                            { senderId: id, receiverId: Id },
                            { senderId: Id, receiverId: id },
                        ],
                    },
                    data: {
                        status: 'accepted',
                    },
                });
                await this.chatService.CreateRoom(id, Id, exist.username);
                await this.addNotifications(id, Id, 'friendship', 'accepted your invite');
            }
            else
                throw new common_1.UnauthorizedException('User Does Not Exist');
        }
        else
            throw new common_1.UnauthorizedException('User Does Not Exist');
    }
    async blockFriend(id, Id) {
        if (id) {
            const exist = await this.FindbyID(Id);
            if (exist) {
                await this.prisma.friendship.updateMany({
                    where: {
                        OR: [
                            { senderId: id, receiverId: Id },
                            { senderId: Id, receiverId: id },
                        ],
                    },
                    data: {
                        status: 'blocked',
                        blockerId: id,
                    },
                });
            }
            else
                throw new common_1.UnauthorizedException('User Does Not Exist');
        }
        else
            throw new common_1.UnauthorizedException('User  not found');
    }
    async getFriends(id) {
        if (id) {
            const res = await this.prisma.friendship.findMany({ where: {
                    AND: [{
                            OR: [
                                { senderId: id },
                                { receiverId: id },
                            ],
                        },
                        { status: 'accepted' },
                    ],
                }, });
            return res;
        }
        else
            throw new common_1.UnauthorizedException('User  not found');
    }
    async getFriend(id, Id) {
        if (id) {
            const res = await this.prisma.friendship.findFirst({ where: {
                    AND: [{
                            OR: [
                                { senderId: id, receiverId: Id },
                                { senderId: Id, receiverId: id },
                            ],
                        },
                        { status: 'accepted' },
                    ],
                },
            });
            return res;
        }
        else
            throw new common_1.UnauthorizedException('User  not found');
    }
    async getPendings(id) {
        if (id) {
            const res = await this.prisma.friendship.findMany({ where: {
                    AND: [{
                            OR: [
                                { senderId: id },
                            ],
                        },
                        { status: 'pending' },
                    ],
                },
            });
            return res;
        }
        else
            throw new common_1.UnauthorizedException('User  not found');
    }
    async getInvitations(id) {
        if (id) {
            const res = await this.prisma.friendship.findMany({ where: {
                    AND: [{
                            OR: [
                                { receiverId: id },
                            ],
                        },
                        { status: 'pending' },
                    ],
                },
            });
            return res;
        }
        else
            throw new common_1.UnauthorizedException('User  not found');
    }
    async getBlocked(id) {
        if (id) {
            const blockedFriendships = await this.prisma.friendship.findMany({ where: {
                    AND: [
                        { blockerId: id },
                        { status: 'blocked' },
                    ]
                },
                select: {
                    sender: {
                        select: {
                            id: true,
                            username: true,
                            avatar: true,
                        }
                    },
                    receiver: {
                        select: {
                            id: true,
                            username: true,
                            avatar: true,
                        }
                    },
                    blockerId: true,
                    receiverId: true,
                    senderId: true
                }
            });
            return blockedFriendships.map((friendship) => {
                return friendship.blockerId === friendship.senderId ? friendship.receiver : friendship.sender;
            });
        }
        else
            throw new common_1.UnauthorizedException('User  not found');
    }
    async Players() {
        let players = await this.prisma.user.findMany({
            orderBy: {
                XP: 'desc',
            },
            select: {
                avatar: true,
                rank: true,
                username: true,
                level: true,
                XP: true,
                topaz: true,
            }
        });
        if (players)
            players = this.updateAvatar(players);
        return players;
    }
    updateAvatar(Object) {
        const ModifiedObject = Object.map((player) => {
            if (player) {
                if (player.avatar) {
                    if (!player.avatar.includes('cdn.intra')) {
                        player.avatar = 'http://' + process.env.HOST + '/api' + player.avatar;
                    }
                }
            }
            return player;
        });
        return ModifiedObject;
    }
    async GetNotifications(id) {
        if (id) {
            const res = await this.prisma.notification.findMany({
                where: { receiverId: id }
            });
            return res;
        }
        else
            throw new common_1.UnauthorizedException('User  not found');
    }
    async addNotifications(senderId, receiverId, type, context) {
        const sender = await this.prisma.user.findUnique({ where: { id: senderId } });
        const receiver = await this.prisma.user.findUnique({ where: { id: receiverId } });
        const content = (sender === null || sender === void 0 ? void 0 : sender.username) + context + (receiver === null || receiver === void 0 ? void 0 : receiver.username);
        await this.prisma.notification.create({
            data: {
                sender: { connect: { id: senderId } },
                receiver: { connect: { id: receiverId } },
                status: 'not seen',
                type: type,
                content: content
            },
        });
    }
    async deleteNotification(id) {
        await this.prisma.notification.delete({ where: { id: id } });
    }
};
__decorate([
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], UserService.prototype, "DeleteUser", null);
exports.UserService = UserService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], UserService);
//# sourceMappingURL=user.service.js.map