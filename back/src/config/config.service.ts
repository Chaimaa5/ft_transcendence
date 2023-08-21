import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

@Injectable()
export class ConfigService {
  getSecretKey(): string {
    try{
      const secretKey = process.env.JWT_ACCESS_SECRET;
      if (!secretKey) {
        throw new Error('JWT_SECRET_KEY environment variable is not set');
      }
      return secretKey;
    }catch(e){throw new HttpException('JWT_SECRET_KEY environment variable is not set', HttpStatus.FAILED_DEPENDENCY) }
  }
}
