import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import * as cors from 'cors';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { setupSwagger } from './swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  const port = process.env.BPORT as string;
  const corsOptions = {
    origin: ['http://localhost:8000', 'http://localhost:3000', 'http://localhost:8000/login'],
    methods: ['GET', 'POST', 'DELETE', 'PUT'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  };
  app.useWebSocketAdapter(new IoAdapter(app));
  app.use(cors(corsOptions));
  app.use(cookieParser());
  setupSwagger(app);
  await app.listen(port, '0.0.0.0');
}
bootstrap();
