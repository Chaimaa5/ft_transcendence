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
exports.GameController = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const swagger_1 = require("@nestjs/swagger");
const game_service_1 = require("./game.service");
const auth_service_1 = require("../auth/auth.service");
let GameController = exports.GameController = class GameController {
    constructor(gameService) {
        this.gameService = gameService;
        this.authService = new auth_service_1.AuthService;
    }
    async postChallengeSettings(settings, body) {
        const user = settings.user;
        return await this.gameService.postChallengeSettings(user, body);
    }
    async GetAuthAccess(req) {
        const user = req.user;
        return await this.authService.generateToken(user);
    }
    async getChallengeSettings(id) {
        const idNum = parseInt(id);
        return await this.gameService.getChallengeSettings(idNum);
    }
};
__decorate([
    (0, common_1.Post)('Challenge'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], GameController.prototype, "postChallengeSettings", null);
__decorate([
    (0, common_1.Get)('/auth'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], GameController.prototype, "GetAuthAccess", null);
__decorate([
    (0, common_1.Get)('challenge/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], GameController.prototype, "getChallengeSettings", null);
exports.GameController = GameController = __decorate([
    (0, common_1.Controller)('game'),
    (0, swagger_1.ApiTags)('game'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    __metadata("design:paramtypes", [game_service_1.GameService])
], GameController);
//# sourceMappingURL=game.controller.js.map