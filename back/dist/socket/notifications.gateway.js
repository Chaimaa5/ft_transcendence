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
exports.NotificationsGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const websocket_strategy_1 = require("../auth/jwt/websocket.strategy");
const user_service_1 = require("../user/user.service");
let NotificationsGateway = exports.NotificationsGateway = class NotificationsGateway {
    constructor() {
        this.clients = new Map();
        this.userService = new user_service_1.UserService;
        this.socketStrategy = new websocket_strategy_1.SocketStrategy;
    }
    async afterInit(server) {
        console.log('WebSocket gateway initialized!');
    }
    async handleDisconnect(client) {
        this.clients.forEach((socket, key) => {
            if (socket === socket) {
                this.clients.delete(key);
            }
        });
        await this.userService.updateOnlineStatus(client.data.payload.id, false);
        console.log('WebSocket gateway disconnected!');
    }
    async handleConnection(server) {
        let token = server.handshake.headers['authorization'];
        token = token.split(' ')[1];
        server.data.payload = await this.socketStrategy.validate(token);
        let user = await this.userService.GetById(server.data.payload.id);
        if (user) {
            this.clients.set(server.data.payload.id, server);
            await this.userService.updateOnlineStatus(user.id, true);
            server.to(server.id).emit('connectionSuccess', { message: 'Connected successfully!' });
        }
        console.log('WebSocket gateway connected!');
    }
};
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], NotificationsGateway.prototype, "server", void 0);
exports.NotificationsGateway = NotificationsGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({ namespace: '/socket.io/' })
], NotificationsGateway);
//# sourceMappingURL=notifications.gateway.js.map