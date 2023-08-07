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
let UserService = exports.UserService = class UserService {
    constructor() {
        this.prisma = new client_1.PrismaClient();
    }
    async GetById(id) {
        return await this.prisma.user.findUnique({ where: { id: id } });
    }
    async CreateUser(user) {
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
    async FindUser(user) {
        const Exists = await this.prisma.user.findUnique({
            where: { id: user.id },
        });
        if (Exists)
            return 1;
        else
            return 2;
    }
    async GetUser(user) {
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
    async userSetup(id, avatar, data) {
        const filename = "/upload/" + avatar.filename;
        const username = data.username;
        await this.prisma.user.update({ where: { id: id }, data: { avatar: filename } });
        if (username) {
            await this.prisma.user.update({ where: { id: id }, data: { username: username } });
        }
    }
    async updateOnlineStatus(id, status) {
        await this.prisma.user.update({ where: { id: id }, data: { status: status } });
    }
    async UpdateRefreshToken(id, Rt) {
        return this.prisma.user.update({ where: { id: id }, data: { refreshToken: Rt } });
    }
    async GetMany() {
        return await this.prisma.user.findMany();
    }
    async deleteGroups(id) {
        await this.prisma.groupMembership.deleteMany({
            where: {
                userId: id
            }
        });
        await this.prisma.room.deleteMany({ where: { ownerId: id } });
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
            throw 'User not Found';
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
        const user = await this.prisma.user.findUnique({
            where: { id: id },
        }).then((user) => {
            if (user) {
                if (user.avatar) {
                    if (!user.avatar.includes('cdn.intra')) {
                        user.avatar = 'http://' + process.env.HOST + ':' + process.env.BPORT + user.avatar;
                    }
                }
                return user;
            }
        });
        return user;
    }
    async addFriend(id, Id) {
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
    async removeFriend(id, Id) {
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
    async acceptFriend(id, Id) {
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
            await this.addNotifications(id, Id, 'friendship', 'accepted your invite');
        }
        else
            throw new common_1.UnauthorizedException('User Does Not Exist');
    }
    async blockFriend(id, Id) {
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
    async getFriends(id) {
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
    async getFriend(id, Id) {
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
    async getPendings(id) {
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
    async getInvitations(id) {
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
    async getBlocked(id) {
        const res = await this.prisma.friendship.findMany({ where: {
                AND: [{
                        OR: [
                            { senderId: id },
                            { receiverId: id },
                        ],
                    },
                    { status: 'blocked' },
                    { blockerId: id },
                ],
            }, });
        return res;
    }
    async Players() {
        const players = await this.prisma.user.findMany({
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
        const modified = this.updateAvatar(players);
        return modified;
    }
    updateAvatar(Object) {
        const ModifiedObject = Object.map((player) => {
            if (player) {
                if (player.avatar) {
                    if (!player.avatar.includes('cdn.intra')) {
                        player.avatar = 'http://' + process.env.HOST + ':' + process.env.BPORT + player.avatar;
                    }
                }
            }
            return player;
        });
        return ModifiedObject;
    }
    async GetNotifications(id) {
        const res = await this.prisma.notification.findMany({
            where: { receiverId: id }
        });
        return res;
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