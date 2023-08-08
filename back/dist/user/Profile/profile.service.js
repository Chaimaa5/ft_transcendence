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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProfileService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
let ProfileService = exports.ProfileService = class ProfileService {
    constructor() {
        this.prisma = new client_1.PrismaClient();
    }
    async Profile(id, username) {
        if (id) {
            let isOwner = true;
            let isFriend = false;
            let isSender = false;
            let isReceiver = false;
            let isBlocked = false;
            const owner = await this.prisma.user.findUnique({ where: { id: id }, });
            const friends = await this.CountFriends(username);
            const user = await this.prisma.user.findUnique({ where: { username: username },
                select: {
                    id: true,
                    username: true,
                    level: true,
                    XP: true,
                    rank: true,
                    avatar: true,
                    loss: true,
                    win: true
                }
            });
            if ((user === null || user === void 0 ? void 0 : user.id) != (owner === null || owner === void 0 ? void 0 : owner.id))
                isOwner = false;
            if (user) {
                if (user.avatar) {
                    if (!user.avatar.includes('cdn.intra')) {
                        user.avatar = 'http://' + process.env.HOST + '/api' + user.avatar;
                    }
                }
                if (!isOwner) {
                    const ownerFriend = await this.prisma.friendship.findFirst({
                        where: {
                            OR: [
                                { senderId: id, receiverId: user.id },
                                { senderId: user.id, receiverId: id }
                            ]
                        },
                        select: {
                            id: true,
                            receiverId: true,
                            senderId: true,
                            status: true
                        }
                    });
                    if (ownerFriend === null || ownerFriend === void 0 ? void 0 : ownerFriend.status.includes('accepted'))
                        isFriend = true;
                    else if (ownerFriend === null || ownerFriend === void 0 ? void 0 : ownerFriend.status.includes('blocked'))
                        isBlocked = true;
                    else if (ownerFriend === null || ownerFriend === void 0 ? void 0 : ownerFriend.status.includes('pending')) {
                        if ((user === null || user === void 0 ? void 0 : user.id) == ownerFriend.senderId)
                            isSender = true;
                        else
                            isReceiver = true;
                    }
                }
            }
            return {
                'username': user === null || user === void 0 ? void 0 : user.username,
                'losses': user === null || user === void 0 ? void 0 : user.loss,
                'wins': user === null || user === void 0 ? void 0 : user.win,
                'level': user === null || user === void 0 ? void 0 : user.level,
                'xp': user === null || user === void 0 ? void 0 : user.XP,
                'rank': user === null || user === void 0 ? void 0 : user.rank,
                'avatar': user === null || user === void 0 ? void 0 : user.avatar,
                'friend': friends,
                'isOwner': isOwner,
                'isFriend': isFriend,
                'isSender': isSender,
                'isReceiver': isReceiver,
                'isBlocked': isBlocked
            };
        }
        else
            throw new common_1.UnauthorizedException('User  not found');
    }
    async User(id, username) {
        if (id) {
            let isOwner = true;
            let isFriend = false;
            let isSender = false;
            let isReceiver = false;
            let isBlocked = false;
            const owner = await this.prisma.user.findUnique({ where: { id: id } });
            const friends = await this.CountFriends(username);
            const user = await this.prisma.user.findUnique({ where: { username: username },
                select: {
                    id: true,
                    username: true,
                    level: true,
                    XP: true,
                    rank: true,
                    avatar: true,
                    loss: true,
                    win: true
                }
            });
            if ((user === null || user === void 0 ? void 0 : user.id) != (owner === null || owner === void 0 ? void 0 : owner.id))
                isOwner = false;
            if (!isOwner && user) {
                const ownerFriend = await this.prisma.friendship.findFirst({
                    where: {
                        OR: [
                            { senderId: id, receiverId: user.id },
                            { senderId: user.id, receiverId: id }
                        ]
                    },
                    select: {
                        id: true,
                        receiverId: true,
                        senderId: true,
                        status: true
                    }
                });
                if (ownerFriend === null || ownerFriend === void 0 ? void 0 : ownerFriend.status.includes('accepted'))
                    isFriend = true;
                else if (ownerFriend === null || ownerFriend === void 0 ? void 0 : ownerFriend.status.includes('blocked'))
                    isBlocked = true;
                else if (ownerFriend === null || ownerFriend === void 0 ? void 0 : ownerFriend.status.includes('pending')) {
                    if ((user === null || user === void 0 ? void 0 : user.id) == ownerFriend.senderId)
                        isSender = true;
                    else
                        isReceiver = true;
                }
            }
            return {
                'id': user === null || user === void 0 ? void 0 : user.id,
                'isOwner': isOwner,
                'isFriend': isFriend,
                'isSender': isSender,
                'isReceiver': isReceiver,
                'isBlocked': isBlocked
            };
        }
        else
            throw new common_1.UnauthorizedException('User not found');
    }
    async Badges(username) {
        if (username) {
            return await this.prisma.user.findUnique({ where: { username: username },
                select: {
                    badge: true,
                }
            });
        }
        else
            throw new common_1.UnauthorizedException('User  not found');
    }
    async CountFriends(username) {
        if (username) {
            const user = await this.prisma.user.findUnique({ where: { username: username } });
            const id = user === null || user === void 0 ? void 0 : user.id;
            const number = await this.prisma.friendship.count({
                where: {
                    status: 'accepted',
                    OR: [
                        { senderId: id },
                        { receiverId: id },
                    ],
                }
            });
            return number;
        }
        else
            throw new common_1.UnauthorizedException('User  not found');
    }
    async CalculatePercentage(username) {
        var _a, _b, _c;
        if (username) {
            const user = await this.prisma.user.findUnique({ where: { username: username } });
            const id = user === null || user === void 0 ? void 0 : user.id;
            const losses = (_a = user === null || user === void 0 ? void 0 : user.loss) !== null && _a !== void 0 ? _a : 0;
            const wins = (_b = user === null || user === void 0 ? void 0 : user.win) !== null && _b !== void 0 ? _b : 0;
            const games = (_c = user === null || user === void 0 ? void 0 : user.games) !== null && _c !== void 0 ? _c : 0;
            let winPer = games > 0 ? (wins / games) * 100 : 0;
            let win = winPer.toFixed(2);
            let lossPer = games > 0 ? (losses / games) * 100 : 0;
            let loss = lossPer.toFixed(2);
            return {
                win: win,
                loss: loss,
            };
        }
        else
            throw new common_1.UnauthorizedException('User  not found');
    }
    async Friends(username, ownerId) {
        if (username) {
            const user = await this.prisma.user.findUnique({ where: { username: username } });
            const id = user === null || user === void 0 ? void 0 : user.id;
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
            const sentPromise = await this.prisma.user.findUnique({
                where: { id: id },
            }).sentFriendships({
                where: {
                    status: 'accepted',
                    AND: [
                        {
                            receiver: {
                                id: {
                                    notIn: userBlocked.map(friendship => friendship.receiverId)
                                }
                            }
                        },
                        {
                            receiver: {
                                id: {
                                    notIn: userBlockers.map(friendship => friendship.senderId)
                                }
                            }
                        }
                    ]
                },
                select: {
                    receiver: {
                        select: {
                            id: true,
                            username: true,
                            avatar: true,
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
                    AND: [
                        {
                            sender: {
                                id: {
                                    notIn: userBlocked.map(friendship => friendship.receiverId)
                                }
                            }
                        },
                        {
                            sender: {
                                id: {
                                    notIn: userBlockers.map(friendship => friendship.senderId)
                                }
                            }
                        }
                    ]
                },
                select: {
                    sender: {
                        select: {
                            id: true,
                            username: true,
                            avatar: true,
                            XP: true,
                            level: true,
                        },
                    },
                },
            });
            const senderData = receivedPromise ? receivedPromise.map((friendship) => friendship.sender) : [];
            const senderDataModified = senderData.map((sender) => {
                if (sender) {
                    if (sender.avatar) {
                        if (!sender.avatar.includes('cdn.intra')) {
                            sender.avatar = 'http://' + process.env.HOST + '/api' + sender.avatar;
                        }
                    }
                }
                return sender;
            });
            const receiverData = sentPromise ? sentPromise.map((friendship) => friendship.receiver) : [];
            const receiverDataModified = receiverData.map((receiver) => {
                if (receiver) {
                    if (receiver.avatar) {
                        if (!receiver.avatar.includes('cdn.intra')) {
                            receiver.avatar = 'http://' + process.env.HOST + '/api' + receiver.avatar;
                        }
                    }
                }
                return receiver;
            });
            const combinedData = [...senderDataModified, ...receiverDataModified];
            const valuesOnlyWithoutKeys = combinedData.map((_a) => {
                var { username } = _a, rest = __rest(_a, ["username"]);
                return rest;
            });
            return valuesOnlyWithoutKeys;
        }
        else
            throw new common_1.UnauthorizedException('User  not found');
    }
    async MatchHistory(username) {
        if (username) {
            const user = await this.prisma.user.findUnique({ where: { username: username } });
            const id = user === null || user === void 0 ? void 0 : user.id;
            return await this.prisma.game.findMany({
                where: {
                    OR: [
                        { playerId1: id },
                        { playerId2: id }
                    ],
                },
                select: {
                    winner: true,
                    player1: {
                        select: {
                            username: true,
                        }
                    },
                    player2: {
                        select: {
                            username: true,
                        }
                    },
                },
            });
        }
        else
            throw new common_1.UnauthorizedException('User  not found');
    }
};
exports.ProfileService = ProfileService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], ProfileService);
//# sourceMappingURL=profile.service.js.map