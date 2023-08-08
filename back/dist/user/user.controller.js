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
exports.UserController = void 0;
const common_1 = require("@nestjs/common");
const user_service_1 = require("./user.service");
const updatedto_dto_1 = require("./dto/updatedto.dto");
const passport_1 = require("@nestjs/passport");
const swagger_1 = require("@nestjs/swagger");
const platform_express_1 = require("@nestjs/platform-express");
const multer_middlewear_1 = require("./multer.middlewear");
let UserController = exports.UserController = class UserController {
    constructor(userservice) {
        this.userservice = userservice;
    }
    async FindbyID(req) {
        const user = req.user;
        return await this.userservice.FindbyID(user.id);
    }
    async Players() {
        return await this.userservice.Players();
    }
    async DeleteUser(req, res) {
        const user = req.user;
        return await this.userservice.DeleteUser(user.id, res);
    }
    async UserSetup(req, res, avatar, data) {
        const user = req.user;
        console.log(data);
        await this.userservice.userSetup(user.id, avatar, data);
    }
    async addFriend(req, id) {
        const user = req.user;
        await this.userservice.addFriend(user.id, id);
        return { message: 'friend added' };
    }
    async removeFriend(req, id) {
        const user = req.user;
        await this.userservice.removeFriend(user.id, id);
        return { message: 'friend removed' };
    }
    async acceptFriend(req, id) {
        const user = req.user;
        await this.userservice.acceptFriend(user.id, id);
        return { message: 'friend accepted' };
    }
    async blockFriend(req, id) {
        const user = req.user;
        await this.userservice.blockFriend(user.id, id);
        return { message: 'friend blocked' };
    }
    async unblockFriend(req, id) {
        const user = req.user;
        await this.userservice.removeFriend(user.id, id);
        return { message: 'friend unblocked' };
    }
    async getFriends(req) {
        const user = req.user;
        return await this.userservice.getFriends(user.id);
    }
    async getFriend(req, id) {
        const user = req.user;
        return await this.userservice.getFriend(user.id, id);
    }
    async getPendings(req) {
        const user = req.user;
        return await this.userservice.getPendings(user.id);
    }
    async getBlocked(req) {
        const user = req.user;
        return await this.userservice.getBlocked(user.id);
    }
};
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "FindbyID", null);
__decorate([
    (0, common_1.Get)('players'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UserController.prototype, "Players", null);
__decorate([
    (0, common_1.Delete)(),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "DeleteUser", null);
__decorate([
    (0, common_1.Post)('setup'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('avatar', multer_middlewear_1.Config)),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __param(2, (0, common_1.UploadedFile)()),
    __param(3, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, updatedto_dto_1.UpdateUserDTO]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "UserSetup", null);
__decorate([
    (0, common_1.Get)('/add/:id'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "addFriend", null);
__decorate([
    (0, common_1.Get)('/remove/:id'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "removeFriend", null);
__decorate([
    (0, common_1.Get)('/accept/:id'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "acceptFriend", null);
__decorate([
    (0, common_1.Get)('/block/:id'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "blockFriend", null);
__decorate([
    (0, common_1.Get)('/unblock/:id'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "unblockFriend", null);
__decorate([
    (0, common_1.Get)('/friends'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getFriends", null);
__decorate([
    (0, common_1.Get)('/friend/:id'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getFriend", null);
__decorate([
    (0, common_1.Get)('/pending'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getPendings", null);
__decorate([
    (0, common_1.Get)('/blocked'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getBlocked", null);
exports.UserController = UserController = __decorate([
    (0, common_1.Controller)('user'),
    (0, swagger_1.ApiTags)('user'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    __metadata("design:paramtypes", [user_service_1.UserService])
], UserController);
//# sourceMappingURL=user.controller.js.map