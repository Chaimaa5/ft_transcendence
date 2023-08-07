import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-42';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class FortyTwoStrategy extends PassportStrategy(Strategy, '42') {
  constructor() {
    super({
      clientID: 'u-s4t2ud-a33178931dc881357a1a66223814603ea19aca5b62a336050138c8d1164dd56b',
      clientSecret: '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',
      callbackURL: 'http://localhost:3000/auth',
    });
  }


  // constructor() {
  //   super({
  //     clientID: 'u-s4t2ud-b634b52bdaf295ec346aab97a42889717ff432ea4a3a707dd491cd650a5c1a18',
  //     clientSecret: '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',
  //     callbackURL: 'http://10.12.2.12:3001/auth',
  //   });
  // }

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
