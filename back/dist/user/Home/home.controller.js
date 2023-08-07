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
exports.HomeController = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const swagger_1 = require("@nestjs/swagger");
const home_service_1 = require("./home.service");
const serachdto_dto_1 = require("../dto/serachdto.dto");
let HomeController = exports.HomeController = class HomeController {
    constructor(home) {
        this.home = home;
    }
    async bestRanked(req) {
        const user = req.user;
        return await this.home.bestRanked(user.id);
    }
    async NavBar(req) {
        const user = req.user;
        return await this.home.NavBar(user.id);
    }
    async OnlineFriends(req) {
        const user = req.user;
        return await this.home.OnlineFriends(user.id);
    }
    async Search(req, input) {
        const user = req.user;
        return await this.home.Search(input.Value);
    }
};
__decorate([
    (0, common_1.Get)('/bestRanked'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], HomeController.prototype, "bestRanked", null);
__decorate([
    (0, common_1.Get)('/navbar/'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], HomeController.prototype, "NavBar", null);
__decorate([
    (0, common_1.Get)('/onlineFriends/'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], HomeController.prototype, "OnlineFriends", null);
__decorate([
    (0, common_1.Post)('/search'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, serachdto_dto_1.SerachpDTO]),
    __metadata("design:returntype", Promise)
], HomeController.prototype, "Search", null);
exports.HomeController = HomeController = __decorate([
    (0, common_1.Controller)('home'),
    (0, swagger_1.ApiTags)('home'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    __metadata("design:paramtypes", [home_service_1.HomeService])
], HomeController);
//# sourceMappingURL=home.controller.js.map