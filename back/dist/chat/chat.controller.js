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
exports.ChatController = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const swagger_1 = require("@nestjs/swagger");
const chat_service_1 = require("./chat.service");
const Chat_dto_1 = require("./dto/Chat.dto");
const platform_express_1 = require("@nestjs/platform-express");
const multer_middlewear_1 = require("../user/multer.middlewear");
let ChatController = exports.ChatController = class ChatController {
    constructor(chatService) {
        this.chatService = chatService;
    }
    async GetJoinedRooms(req) {
        const user = req.user;
        return await this.chatService.GetJoinedRooms(user.id);
    }
    async CreateChannel(req, image, body) {
        const user = req.user;
        return await this.chatService.CreateChannel(user.id, body, image);
    }
    async AddMember(req, body) {
        const user = req.user;
        return await this.chatService.AddMember(user.id, body);
    }
    async GetChannels(req) {
        const user = req.user;
        return await this.chatService.GetChannels(user.id);
    }
    async GetJoinedChannels(req) {
        const user = req.user;
        return await this.chatService.GetJoinedChannels(user.id);
    }
    async SetAdmin(req, Id) {
        const user = req.user;
        const membershipId = parseInt(Id, 10);
        return await this.chatService.setAdmin(user.id, membershipId);
    }
    async DeleteChannel(req, Id) {
        const user = req.user;
        const roomId = parseInt(Id, 10);
        return await this.chatService.DeleteChannel(user.id, roomId);
    }
    async GetMessages(req, Id) {
        const user = req.user;
        const roomId = parseInt(Id, 10);
        return await this.chatService.GetMessages(user.id, roomId);
    }
};
__decorate([
    (0, common_1.Get)('/rooms'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "GetJoinedRooms", null);
__decorate([
    (0, common_1.Post)('/create/'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('image', multer_middlewear_1.Config)),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.UploadedFile)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Chat_dto_1.CreateChannel]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "CreateChannel", null);
__decorate([
    (0, common_1.Post)('/add'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Chat_dto_1.AddMember]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "AddMember", null);
__decorate([
    (0, common_1.Get)('/channels'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "GetChannels", null);
__decorate([
    (0, common_1.Get)('/joinedChannels'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "GetJoinedChannels", null);
__decorate([
    (0, common_1.Post)(':membershipId/setAdmin'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('membershipId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "SetAdmin", null);
__decorate([
    (0, common_1.Delete)(),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('roomId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "DeleteChannel", null);
__decorate([
    (0, common_1.Get)('/message/:roomId'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('roomId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "GetMessages", null);
exports.ChatController = ChatController = __decorate([
    (0, common_1.Controller)('chat'),
    (0, swagger_1.ApiTags)('chat'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    __metadata("design:paramtypes", [chat_service_1.ChatService])
], ChatController);
//# sourceMappingURL=chat.controller.js.map