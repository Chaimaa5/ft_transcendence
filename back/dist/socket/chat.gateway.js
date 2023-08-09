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
exports.ChatGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const websocket_strategy_1 = require("../auth/jwt/websocket.strategy");
const chat_service_1 = require("../chat/chat.service");
const user_service_1 = require("../user/user.service");
let ChatGateway = exports.ChatGateway = class ChatGateway {
    constructor() {
        this.clients = new Map();
        this.rooms = new Map();
        this.chatService = new chat_service_1.ChatService;
        this.socketStrategy = new websocket_strategy_1.SocketStrategy;
        this.userService = new user_service_1.UserService;
    }
    async afterInit(client) {
        console.log('WebSocket gateway initialized!');
    }
    async handleDisconnect(client) {
        console.log('WebSocket gateway disconnected!');
        this.clients.forEach((socket, key) => {
            if (socket === socket) {
                this.clients.delete(key);
            }
        });
    }
    async handleConnection(server) {
        let token = server.handshake.headers['authorization'];
        token = token.split(' ')[1];
        server.data.payload = await this.socketStrategy.validate(token);
        console.log('WebSocket gateway connected!');
        console.log(server.data.payload.id);
        if (server.data.payload.id) {
            let user = await this.userService.GetById(server.data.payload.id);
            if (user) {
                this.clients.set(server.data.payload.id, server);
                server.to(server.id).emit('connectionSuccess', { message: 'Connected successfully!' });
            }
        }
    }
    addToRoom(roomId, client) {
        if (!this.rooms.has(roomId)) {
            this.rooms.set(roomId, []);
        }
        const sockets = this.rooms.get(roomId);
        sockets === null || sockets === void 0 ? void 0 : sockets.push(client);
    }
    deleteFromRoom(roomId, client) {
        if (this.rooms.has(roomId)) {
            let sockets = this.rooms.get(roomId);
            const index = sockets === null || sockets === void 0 ? void 0 : sockets.indexOf(client);
            const deletCount = 1;
            if (index != -1) {
                sockets = sockets !== null && sockets !== void 0 ? sockets : [];
                if (index)
                    sockets.splice(index, deletCount);
            }
        }
    }
    joinRoom(client, roomId) {
        console.log('WebSocket gateway joined!');
        this.addToRoom(roomId, client);
        client.join(roomId);
    }
    async handleMessage(client, body) {
        const { roomId, message } = body;
        const room = parseInt(roomId);
        const userId = client.data.payload.id;
        console.log(userId);
        console.log(message);
        const isMuted = await this.chatService.checkMute(room, userId);
        if (!isMuted) {
            this.chatService.storeMessage(room, userId, message);
            this.server.to(roomId).emit('message', message);
        }
    }
    leaveRoom(client, roomId) {
        this.deleteFromRoom(roomId, client);
    }
};
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], ChatGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('join'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, String]),
    __metadata("design:returntype", void 0)
], ChatGateway.prototype, "joinRoom", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('message'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "handleMessage", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('leave'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, String]),
    __metadata("design:returntype", void 0)
], ChatGateway.prototype, "leaveRoom", null);
exports.ChatGateway = ChatGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({ cors: true, namespace: '/chat' })
], ChatGateway);
//# sourceMappingURL=chat.gateway.js.map