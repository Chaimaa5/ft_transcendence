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
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const auth_service_1 = require("./auth.service");
const swagger_1 = require("@nestjs/swagger");
const qrcode = require("qrcode");
const TFA_dto_1 = require("./dto/TFA.dto");
let AuthController = exports.AuthController = class AuthController {
    constructor(authservice) {
        this.authservice = authservice;
    }
    handleLogin() { }
    async handleAuth(req, res) {
        const check = await this.authservice.signIn(res, req);
        if (check == 1)
            return res.redirect('http://localhost/home');
        else
            return res.redirect('http://localhost/setup');
    }
    async RefreshToken(req, res) {
        res.clearCookie('access_token');
        res.clearCookie('refresh_token');
        await this.authservice.RefreshTokens(req, res);
        return res.send('refreshed');
    }
    async handleLogout(req, res) {
        this.authservice.signOut(res);
    }
    async HandleTFA(req, res) {
        const user = req.user;
        const qr = await this.authservice.generateQRCode(user.id);
        res.setHeader('Content-Type', 'image/png');
        qrcode.toFileStream(res, qr);
    }
    async EnableTFA(req, authTFA) {
        const user = req.user;
        const isCodeValid = await this.authservice.verifyTFA(user, authTFA.code);
        if (!isCodeValid) {
            await this.authservice.activateTFA(user.id);
            return true;
        }
        else
            return false;
    }
    async DisableTFA(req) {
        const user = req.user;
        await this.authservice.disableTFA(user.id);
    }
};
__decorate([
    (0, common_1.Get)('/login'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('42')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "handleLogin", null);
__decorate([
    (0, common_1.Get)('/auth'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('42')),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "handleAuth", null);
__decorate([
    (0, common_1.Get)('/refresh'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('Refresh')),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "RefreshToken", null);
__decorate([
    (0, common_1.Get)('/logout'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "handleLogout", null);
__decorate([
    (0, common_1.Get)('/generate-qrcode'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "HandleTFA", null);
__decorate([
    (0, common_1.Post)('/enable'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)(common_1.ValidationPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, TFA_dto_1.TFA]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "EnableTFA", null);
__decorate([
    (0, common_1.Get)('/disable'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "DisableTFA", null);
exports.AuthController = AuthController = __decorate([
    (0, common_1.Controller)(''),
    (0, swagger_1.ApiTags)('auth'),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map