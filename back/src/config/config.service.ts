import { Injectable } from '@nestjs/common';

@Injectable()
export class ConfigService {
  getSecretKey(): string {
    const secretKey = process.env.JWT_SECRET_KEY;
    if (!secretKey) {
      throw new Error('JWT_SECRET_KEY environment variable is not set');
    }
    return secretKey;
  }
}
