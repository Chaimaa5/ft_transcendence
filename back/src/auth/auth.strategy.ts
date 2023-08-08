import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-42';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class FortyTwoStrategy extends PassportStrategy(Strategy, '42') {
  constructor() {
    super({
      clientID: process.env.CLIENTID,
      clientSecret: process.env.CLIENTSECRET,
      callbackURL: process.env.CALLBACK,
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
