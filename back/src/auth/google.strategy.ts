import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-google-oauth20';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor() {
    super({
      clientID: process.env.GOOGLECLIENTID,
      clientSecret: process.env.GOOGLECLIENTSECRET,
      callbackURL: process.env.GOOGLECALLBACK,
      scope: ['email', 'profile']
    });
  }



  async validate(accessToken: string, refreshToken: string, profile: any){
    try{
      const user =  {
        id: profile.id,
        username: profile._json.given_name,
        fullname: profile.displayName,
        avatar: profile._json.picture, 
      }
      return user;
    }catch(e){}
  }
}
