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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const client_1 = require("@prisma/client");
const crypto = require("crypto");
const user_service_1 = require("../user/user.service");
const config_service_1 = require("../config/config.service");
const otplib_1 = require("otplib");
let AuthService = exports.AuthService = class AuthService {
    constructor() {
        this.jwtService = new jwt_1.JwtService;
        this.userService = new user_service_1.UserService;
        this.configService = new config_service_1.ConfigService;
        this.prisma = new client_1.PrismaClient();
        this.secretKey = 'secret';
    }
    async signIn(res, req) {
        const find = this.userService.FindUser(req.user);
        const check = await this.userService.GetUser(req.user);
        const Access_Token = this.generateToken(req.user);
        const Refresh_Token = this.generateRefreshToken(req.user);
        res.cookie('access_token', Access_Token, { httpOnly: true });
        res.cookie('refresh_token', Refresh_Token, { httpOnly: true });
        const encryptedToken = this.encryptToken(Refresh_Token);
        this.userService.UpdateRefreshToken(check.id, encryptedToken);
        return find;
    }
    signOut(res) {
        res.clearCookie('access_token');
        res.clearCookie('refresh_token');
        res.redirect('http://localhost/login');
    }
    encryptToken(token) {
        if (token) {
            const cipher = crypto.createCipher('aes-256-cbc', this.secretKey);
            let encrypted = cipher.update(JSON.stringify(token), 'utf8', 'hex');
            encrypted += cipher.final('hex');
            return encrypted;
        }
        else
            throw new common_1.UnauthorizedException('Token Not Valid');
    }
    decryptToken(encryptedToken) {
        if (encryptedToken) {
            const decipher = crypto.createDecipher('aes-256-cbc', this.secretKey);
            let decrypted = decipher.update(encryptedToken, 'hex', 'utf8');
            decrypted += decipher.final('utf8');
            return JSON.parse(decrypted);
        }
        else
            throw new common_1.UnauthorizedException('Token Not Valid');
    }
    generateToken(user) {
        if (user) {
            const payload = { id: user.id, username: user.username, isTwoFacEnabled: user.isTwoFacEnabled };
            return this.jwtService.sign(payload, { secret: process.env.JWT_ACCESS_SECRET });
        }
        else
            throw new common_1.UnauthorizedException('User  not found');
    }
    generateRefreshToken(user) {
        if (user) {
            const payload = { id: user.id, username: user.username, isTwoFacEnabled: user.isTwoFacEnabled };
            return this.jwtService.sign(payload, { secret: process.env.JWT_REFRESH_SECRET, expiresIn: '30d' });
        }
        else
            throw new common_1.UnauthorizedException('User  not found');
    }
    async RefreshTokens(req, res) {
        const users = req.user;
        const user = await this.userService.GetUser(users);
        if (!user)
            throw new common_1.ForbiddenException('User Does not exist');
        const decryptedToken = this.decryptToken(user.refreshToken);
        const decodedToken = this.jwtService.verify(decryptedToken);
        const cookieToken = this.jwtService.verify(req.cookies['refresh_token']);
        if (decryptedToken == req.cookies['refresh_token']) {
            const Access_Token = this.generateToken(user);
            const Refresh_Token = this.generateRefreshToken(user);
            res.cookie('access_token', Access_Token, { httpOnly: true, secure: true, });
            res.cookie('refresh_token', Refresh_Token, { httpOnly: true, secure: true, });
            const encryptedToken = this.encryptToken(Refresh_Token);
            await this.userService.UpdateRefreshToken(user.id, encryptedToken);
            console.log('finished');
        }
        else {
            throw new common_1.ForbiddenException('Access Denied');
        }
    }
    async generateQRCode(id) {
        if (id) {
            const secret = otplib_1.authenticator.generateSecret();
            const app = "Trans";
            const account = "celmhan";
            await this.prisma.user.update({
                where: { id: id },
                data: { TwoFacSecret: secret }
            });
            const authUrl = otplib_1.authenticator.keyuri(account, app, secret);
            return (authUrl);
        }
        else
            throw new common_1.UnauthorizedException('User  not found');
    }
    async verifyTFA(user, code) {
        if (user) {
            return await otplib_1.authenticator.verify({
                token: code,
                secret: user.TwoFacSecret
            });
        }
        else
            throw new common_1.UnauthorizedException('User  not found');
    }
    async activateTFA(id) {
        if (id) {
            await this.prisma.user.update({
                where: { id: id },
                data: { isTwoFacEnabled: true }
            });
        }
        else
            throw new common_1.UnauthorizedException('User  not found');
    }
    async disableTFA(id) {
        if (id) {
            await this.prisma.user.update({
                where: { id: id },
                data: { isTwoFacEnabled: false }
            });
        }
        else
            throw new common_1.UnauthorizedException('User  not found');
    }
};
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], AuthService);
//# sourceMappingURL=auth.service.js.map