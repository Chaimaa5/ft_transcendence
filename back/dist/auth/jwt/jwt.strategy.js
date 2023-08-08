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
exports.JWTStrategy = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const client_1 = require("@prisma/client");
const passport_jwt_1 = require("passport-jwt");
const jwt = require("jsonwebtoken");
let JWTStrategy = exports.JWTStrategy = class JWTStrategy extends (0, passport_1.PassportStrategy)(passport_jwt_1.Strategy, 'jwt') {
    constructor() {
        super({
            jwtFromRequest: passport_jwt_1.ExtractJwt.fromExtractors([(request) => {
                    let data = request.cookies["access_token"];
                    return data;
                }]),
            secretOrKey: process.env.JWT_ACCESS_SECRET,
        });
        this.prisma = new client_1.PrismaClient();
    }
    async validate(payload) {
        try {
            jwt.verify(payload.token, process.env.JWT_ACCESS_SECRET);
        }
        catch (err) {
            if (err instanceof jwt.TokenExpiredError)
                throw new common_1.UnauthorizedException('Expired Token Exception');
        }
        const user = await this.prisma.user.findUnique({
            where: { id: payload.id, },
        });
        return Object.assign({}, user);
    }
};
exports.JWTStrategy = JWTStrategy = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], JWTStrategy);
//# sourceMappingURL=jwt.strategy.js.map