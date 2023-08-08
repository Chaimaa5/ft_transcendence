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
exports.ChatService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const crypto = require("crypto");
let ChatService = exports.ChatService = class ChatService {
    constructor() {
        this.prisma = new client_1.PrismaClient();
    }
    encryptPassword(password) {
        if (password) {
            const secret = process.env.JWT_REFRESH_SECRET;
            const cipher = crypto.createCipher('aes-256-cbc', secret);
            let encrypted = cipher.update(JSON.stringify(password), 'utf8', 'hex');
            encrypted += cipher.final('hex');
            return encrypted;
        }
        else
            throw new common_1.UnauthorizedException('Password is NULL');
    }
    async updateImage(Object) {
        const ModifiedObject = Object.map((member) => {
            if (member) {
                if (member.image) {
                    if (member.image) {
                        member.image = 'http://' + process.env.HOST + '/api' + member.image;
                    }
                }
            }
            return member;
        });
        return ModifiedObject;
    }
    async GetJoinedRooms(id) {
        const rooms = await this.prisma.room.findMany({
            where: { isChannel: true },
            include: {
                membership: {
                    where: { userId: id },
                    select: {
                        id: true,
                        userId: true,
                        role: true,
                        isBanned: true,
                        isMuted: true,
                    }
                },
            }
        });
        return rooms;
    }
    async CreateRoom(ownerId, memberId, name) {
        const room = await this.prisma.room.create({
            data: {
                name: name,
                image: 'imagePath',
                type: 'private',
                ownerId: ownerId,
                isChannel: false,
            }
        });
        await this.prisma.membership.createMany({
            data: [
                {
                    roomId: room.id,
                    userId: ownerId,
                    role: 'owner',
                    isBanned: false,
                    isMuted: false
                },
                {
                    roomId: room.id,
                    userId: memberId,
                    role: 'owner',
                    isBanned: false,
                    isMuted: false
                }
            ]
        });
    }
    async AddMember(id, data) {
        if (id) {
            const membership = await this.prisma.room.findUnique({
                where: { id: data.roomId }
            }).membership({ where: { userId: id } });
            if (membership)
                if (membership[0].role != 'member') {
                    const member = await this.prisma.membership.findFirst({ where: {
                            AND: [
                                { roomId: data.roomId },
                                { userId: data.userId }
                            ]
                        } });
                    if (member)
                        throw new common_1.UnauthorizedException('User Already Exists');
                    else {
                        await this.prisma.membership.create({
                            data: {
                                roomId: data.roomId,
                                userId: data.userId,
                                role: 'member',
                                isBanned: false,
                                isMuted: false
                            }
                        });
                    }
                }
                else
                    throw new common_1.UnauthorizedException('User Not Granted Full Access');
        }
    }
    async CreateChannel(ownerId, data, image) {
        let imagePath = '';
        if (image)
            imagePath = "/upload/" + image.filename;
        else
            imagePath = "/upload/avatar.png";
        let EncryptedPaswword = '';
        console.log(imagePath);
        if (data.type === 'protected')
            EncryptedPaswword = this.encryptPassword(data.password);
        const room = await this.prisma.room.create({
            data: {
                name: data.name,
                image: imagePath,
                type: data.type,
                ownerId: ownerId,
                password: EncryptedPaswword,
                isChannel: true,
            }
        });
        const createMember = await this.prisma.membership.create({
            data: {
                roomId: room.id,
                userId: ownerId,
                role: 'owner',
                isBanned: false,
                isMuted: false
            }
        });
    }
    async kick(ownerId, roomId, memberId) {
        const member = await this.prisma.room.findUnique({
            where: { id: roomId }
        }).membership({ where: { userId: ownerId } });
        if (member) {
            if (member[0].role != 'member')
                await this.prisma.membership.delete({ where: { id: memberId } });
        }
    }
    async leaveChannel(membershipId) {
        const membership = await this.prisma.membership.findUnique({ where: { id: membershipId } });
        this.deleteMembership(membershipId);
        if ((membership === null || membership === void 0 ? void 0 : membership.role) === 'owner') {
            const newOwner = await this.prisma.membership.findFirst({
                where: { roomId: membership.roomId }
            });
            if (newOwner) {
                await this.prisma.membership.update({
                    where: { id: newOwner.id },
                    data: {
                        role: 'owner'
                    }
                });
                await this.prisma.room.update({
                    where: { id: membership.roomId },
                    data: { ownerId: newOwner.userId }
                });
            }
        }
    }
    async setAdmin(id, membershipId) {
        const membership = await this.prisma.membership.findUnique({ where: { id: membershipId } });
        const owner = await this.prisma.room.findFirst({ where: {
                AND: [
                    { id: membership === null || membership === void 0 ? void 0 : membership.roomId },
                    { ownerId: id }
                ]
            } });
        if (owner) {
            await this.prisma.membership.update({ where: { id: membershipId },
                data: { role: 'admin' } });
        }
        else
            throw new common_1.UnauthorizedException('User Is Not Owner');
    }
    async changePrivacy(roomId, id, type, pw) {
        if (type === 'protected') {
            let password = this.encryptPassword(pw);
            await this.prisma.room.update({
                where: { id: roomId },
                data: {
                    type: type,
                    password: password
                },
            });
        }
        else {
            await this.prisma.room.update({
                where: { id: roomId },
                data: { type: type, },
            });
        }
    }
    async UpdateChannel(room, image) {
        const { name, type, password } = room;
        const imagePath = "/upload/" + image.filename;
        let passwordEncrypted = this.encryptPassword(password);
        await this.prisma.room.update({ where: { id: room.roomId },
            data: {
                name: room.name,
                image: imagePath,
                type: room.type,
                password: passwordEncrypted,
            }
        });
    }
    async SetPassword(roomId, pw) {
        const passwordEncrypted = this.encryptPassword(pw);
        await this.prisma.room.update({
            where: { id: roomId },
            data: {
                password: passwordEncrypted,
            }
        });
    }
    async deleteMembership(id) {
        await this.prisma.membership.delete({
            where: { id: id }
        });
    }
    async deleteRoom(id) {
        await this.prisma.room.delete({ where: { id: id } });
    }
    async deleteMessages(roomId, memberId) {
        await this.prisma.message.deleteMany({
            where: {
                AND: [
                    { roomId: roomId },
                    { userId: memberId }
                ]
            }
        });
    }
    async muteMember(membershipId, muteDuration) {
        const muteExpiration = new Date();
        muteExpiration.setMinutes(muteExpiration.getMinutes() + muteDuration);
        await this.prisma.membership.update({
            where: { id: membershipId },
            data: {
                isMuted: true,
                muteExpiration: muteExpiration.toISOString()
            }
        });
    }
    async banMember(membershipId) {
        await this.prisma.membership.update({
            where: { id: membershipId },
            data: {
                isBanned: true,
            }
        });
    }
    async fetchDms() {
    }
    async GetChannels(id) {
        let channels = await this.prisma.room.findMany({
            where: {
                NOT: {
                    membership: {
                        some: { userId: id }
                    }
                },
                AND: [
                    {
                        OR: [
                            { type: 'protected' },
                            { type: 'public' }
                        ],
                    },
                    { isChannel: true },
                ]
            },
            select: {
                id: true,
                name: true,
                image: true,
                type: true,
                ownerId: true,
            }
        });
        let channelsModified = await Promise.all(channels.map(async (channel) => {
            if (channel.image) {
                channel.image = 'http://' + process.env.HOST + '/api' + channel.image;
            }
            let count = await this.prisma.membership.count({
                where: { roomId: channel.id }
            });
            return { 'id': channel.id,
                'name': channel.name,
                'type': channel.type,
                'image': channel.image,
                'ownerId': channel.ownerId,
                'count': count };
        }));
        return channelsModified;
    }
    async GetJoinedChannels(id) {
        let channels = await this.prisma.room.findMany({
            where: {
                membership: {
                    some: { userId: id }
                },
                AND: [
                    { isChannel: true },
                ]
            },
            select: {
                id: true,
                name: true,
                image: true,
                type: true,
                ownerId: true,
            }
        });
        const channelss = await Promise.all(channels.map(async (channel) => {
            if (channel.image) {
                channel.image = 'http://' + process.env.HOST + '/api' + channel.image;
            }
            let count = await this.prisma.membership.count({
                where: { roomId: channel.id }
            });
            return { 'id': channel.id,
                'name': channel.name,
                'type': channel.type,
                'image': channel.image,
                'ownerId': channel.ownerId,
                'count': count };
        }));
        return channelss;
    }
    async DeleteChannel(id, roomId) {
        const room = await this.prisma.room.findUnique({
            where: { id: roomId }
        });
        if ((room === null || room === void 0 ? void 0 : room.ownerId) === id) {
            await this.prisma.message.deleteMany({ where: { roomId: roomId } });
            await this.prisma.membership.deleteMany({ where: { roomId: roomId } });
            await this.prisma.room.delete({ where: { id: roomId } });
        }
        else
            throw new common_1.UnauthorizedException('User Not Granted Full Access');
    }
    async storeMessage(roomId, userId, content) {
        const room = await this.prisma.room.findUnique({ where: { id: roomId } });
        if (room) {
            await this.prisma.message.create({
                data: {
                    roomId: roomId,
                    userId: userId,
                    content: content
                }
            });
        }
    }
    async GetMessages(id, roomId) {
        await this.prisma.message.findMany({
            where: { roomId: roomId },
            orderBy: {
                createdAt: 'desc',
            },
            select: {
                roomId: true,
                userId: true,
                content: true,
            }
        });
    }
    async checkMute(roomId, userId) {
        const membership = await this.prisma.membership.findFirst({
            where: {
                AND: [
                    { roomId: roomId },
                    { userId: userId }
                ]
            }
        });
        if (membership) {
            if (membership.isBanned)
                return true;
            return false;
        }
    }
};
exports.ChatService = ChatService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], ChatService);
//# sourceMappingURL=chat.service.js.map