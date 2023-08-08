"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const platform_socket_io_1 = require("@nestjs/platform-socket.io");
const swagger_1 = require("./swagger");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.setGlobalPrefix('api');
    const port = process.env.BPORT;
    const corsOptions = {
        origin: ['http://localhost:8000'],
        methods: ['GET', 'POST'],
        allowedHeaders: ['Content-Type', 'Authorization'],
        credentials: true,
    };
    app.useWebSocketAdapter(new platform_socket_io_1.IoAdapter(app));
    app.use(cors(corsOptions));
    app.use(cookieParser());
    (0, swagger_1.setupSwagger)(app);
    await app.listen(port, '0.0.0.0');
}
bootstrap();
//# sourceMappingURL=main.js.map