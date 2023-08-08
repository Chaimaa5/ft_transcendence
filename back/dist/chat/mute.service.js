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
exports.MuteService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const schedule_1 = require("@nestjs/schedule");
let MuteService = exports.MuteService = class MuteService {
    constructor() {
        this.prisma = new client_1.PrismaClient;
    }
    async unmute(membership) {
        if (membership) {
            await this.prisma.membership.update({ where: { id: membership.id },
                data: {
                    isMuted: false,
                    muteExpiration: null
                }
            });
        }
    }
    async updateMutes() {
        const time = new Date();
        const expiredMute = await this.prisma.membership.findMany({
            where: {
                isMuted: true,
                muteExpiration: {
                    lte: time
                }
            }
        });
        for (const muted of expiredMute) {
            await this.unmute(muted);
        }
    }
};
__decorate([
    (0, schedule_1.Cron)('*/1 * * * *'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], MuteService.prototype, "updateMutes", null);
exports.MuteService = MuteService = __decorate([
    (0, common_1.Injectable)()
], MuteService);
//# sourceMappingURL=mute.service.js.map