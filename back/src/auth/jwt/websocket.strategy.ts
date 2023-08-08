import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy} from "@nestjs/passport";
import { PrismaClient, User } from "@prisma/client";
import { Request } from "express";
import { JwtPayload } from "jsonwebtoken";
import { ExtractJwt, Strategy } from "passport-jwt";
import * as jwt from 'jsonwebtoken';
import { Socket } from "socket.io";

@Injectable()
export class SocketStrategy extends PassportStrategy(Strategy, 'Websocket'){
     constructor(){
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: process.env.JWT_ACCESS_SECRET,
          });
    }
    // prisma = new PrismaClient();
    async validate(token: string){

        

        // try{
            const payload = jwt.verify(token, process.env.JWT_ACCESS_SECRET as jwt.Secret)
        // }catch(err){
        //     if(err instanceof jwt.TokenExpiredError )
        //         throw  new UnauthorizedException('Expired Token Exception');
        // }

        // const user = await this.prisma.user.findUnique({
        //     where:{id: client.data.payload.id,},
        // });
        return payload;
    }
}