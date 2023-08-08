"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModule = void 0;
const common_1 = require("@nestjs/common");
const user_controller_1 = require("./user.controller");
const user_service_1 = require("./user.service");
const profile_controller_1 = require("./Profile/profile.controller");
const profile_service_1 = require("./Profile/profile.service");
const leaderboard_controller_1 = require("./Leaderboard/leaderboard.controller");
const leaderboard_service_1 = require("./Leaderboard/leaderboard.service");
const home_service_1 = require("./Home/home.service");
const home_controller_1 = require("./Home/home.controller");
const chat_controller_1 = require("../chat/chat.controller");
const chat_service_1 = require("../chat/chat.service");
let UserModule = exports.UserModule = class UserModule {
};
exports.UserModule = UserModule = __decorate([
    (0, common_1.Module)({
        imports: [],
        controllers: [user_controller_1.UserController, profile_controller_1.ProfileController, leaderboard_controller_1.LeaderboardController, home_controller_1.HomeController, chat_controller_1.ChatController],
        providers: [user_service_1.UserService, profile_service_1.ProfileService, leaderboard_service_1.LeaderboardService, home_service_1.HomeService, chat_service_1.ChatService],
        exports: [user_service_1.UserService]
    })
], UserModule);
//# sourceMappingURL=user.module.js.map