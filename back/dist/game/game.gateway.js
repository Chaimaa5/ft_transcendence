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
exports.GameGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const common_1 = require("@nestjs/common");
const gameState_interface_1 = require("./gameState.interface");
let GameGateway = exports.GameGateway = class GameGateway {
    constructor() {
        this.roomIdCounter = 1;
        this.rooms = new Map();
        this.logger = new common_1.Logger('gameGateway');
        this.clients = new Map();
        this.randomInitialDirection = () => {
            const minValue = -Math.PI / 4;
            const maxValue = Math.PI / 4;
            const randomZeroToOne = Math.random();
            const randomValueInRange = randomZeroToOne * (maxValue - minValue) + minValue;
            return (randomValueInRange);
        };
    }
    afterInit() {
        this.logger.log('game server initialized');
    }
    async handleConnection(client) {
        this.logger.log(`server side : client connected : ${client.id}`);
        this.clients.set(client.id, client);
        this.joinPlayerToRoom(client);
    }
    joinPlayerToRoom(client) {
        var _a;
        let roomId;
        const availableRoom = [...this.rooms.values()].find(room => room.playersNumber === 1);
        if (availableRoom) {
            roomId = availableRoom.roomId;
            availableRoom.players.push({ playerId: client.id, side: gameState_interface_1.PaddleSide.Right, y: 0 });
            availableRoom.playersNumber++;
            client.join(availableRoom.roomId);
            this.logger.log("joined an already created game");
            client.emit('joinedRoom', { roomId: roomId, side: gameState_interface_1.PaddleSide.Right });
        }
        else {
            roomId = this.createRoom();
            this.rooms.set(roomId, {
                roomId: roomId,
                playersNumber: 1,
                ball: { x: 0, y: 0 },
                players: [{ playerId: client.id, side: gameState_interface_1.PaddleSide.Left, y: 0 }],
            });
            client.join(roomId);
            this.logger.log("waiting for another player");
            client.emit('joinedRoom', { roomId: roomId, side: gameState_interface_1.PaddleSide.Left });
        }
        if (((_a = this.rooms.get(roomId)) === null || _a === void 0 ? void 0 : _a.playersNumber) === 2) {
            this.logger.log("game is starting now...");
            this.server.emit('startGame', this.randomInitialDirection());
        }
    }
    createRoom() {
        const roomId = `room_${this.roomIdCounter}`;
        this.roomIdCounter++;
        return roomId;
    }
    handleDisconnection(client) {
        console.log("client id  : " + client.id + "disconnected");
    }
    handleNewPaddlePosition(client, payload) {
        client.to(payload.roomId).emit('updatePositions', { playerId: client.id, direction: payload.direction });
    }
    handleResetRound(client) {
        this.server.emit('ballInitialDirection', this.randomInitialDirection());
    }
};
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], GameGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('newPaddlePosition'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", void 0)
], GameGateway.prototype, "handleNewPaddlePosition", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('resetRound'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket]),
    __metadata("design:returntype", void 0)
], GameGateway.prototype, "handleResetRound", null);
exports.GameGateway = GameGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({
        namespace: '/game',
        cors: {
            origin: ['http://localhost:8000'],
            methods: ['GET', 'POST'],
            credentials: true,
        },
    })
], GameGateway);
//# sourceMappingURL=game.gateway.js.map