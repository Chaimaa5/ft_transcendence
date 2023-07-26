import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-42';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class FortyTwoStrategy extends PassportStrategy(Strategy, '42') {
  constructor() {
    super({
      clientID: 'u-s4t2ud-cd5299870d6aa7f626f5651dca02191ec0c4a7ada7ee1d3346a83ee50f29ce00',
      clientSecret: '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',
      callbackURL: 'http://localhost/api/auth',
    });
  }



  async validate(accessToken: string, refreshToken: string, profile: any){
    const user =  {
      id: profile.id,
      username: profile.username,
      fullname: profile._json.usual_full_name,
      avatar: profile._json.image.link, 
    }
    return user;
  }


}
