import { ForbiddenException, HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Achievement, PrismaClient, User } from '@prisma/client';
import { JwtPayload, VerifyOptions } from 'jsonwebtoken';
import { Request, Response } from 'express';
import * as crypto from 'crypto';
import { UserService } from 'src/user/user.service';
import { ConfigService } from 'src/config/config.service';
// import { toDataURL } from 'qrcode';
import { authenticator } from 'otplib';
import { Socket } from 'socket.io';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';
import * as cookie from 'cookie';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthService {

   


   
    constructor(){}
    jwtService = new  JwtService;
    userService= new  UserService;
    configService = new  ConfigService;
    prisma = new PrismaClient();
    secretKey = '84 ef 9b 0e e7 06 9e 8b 04 6b 69 c4 d4 07 04 28 e2 05 ed 64 89 30 87 c9 ef 2e 8d a0 da 07 96 f2';
  
        

    async signIn(res: Response, req: Request) {
        const find = await this.userService.FindUser(req.user);
        const check = await this.userService.GetUser(req.user);
        const Access_Token = this.generateToken(req.user);
        const Refresh_Token = this.generateRefreshToken(req.user);
        res.cookie('access_token', Access_Token, {httpOnly: true});
        res.cookie('refresh_token', Refresh_Token, {httpOnly: true});
        res.cookie('logged', true);
        const encryptedToken = this.encryptToken(Refresh_Token);
        this.userService.UpdateRefreshToken(check.id, encryptedToken)
        return find
    }

    signOut(res: Response) {
        res.clearCookie('access_token');
        res.clearCookie('refresh_token');
        res.cookie('logged', false);
        res.redirect('http://10.14.10.6:8080/login');
    } 


    encryptToken(token: string) {
        if(token){
            const iv = crypto.randomBytes(16);
            const key = crypto.randomBytes(32);
            const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
            let encrypted = cipher.update(JSON.stringify(token), 'utf8', 'hex');
            encrypted += cipher.final('hex');
            return encrypted;
        }
        else
            throw new UnauthorizedException('Token Not Valid')
      }
      
      // Decrypt and retrieve the original payload
    decryptToken(encryptedToken: string) {
        if(encryptedToken){
            const iv = crypto.randomBytes(16);
            const decipher = crypto.createCipheriv('aes-256-cbc', this.secretKey, iv);
            let decrypted = decipher.update(encryptedToken, 'hex', 'utf8');
            decrypted += decipher.final('utf8');
            return JSON.parse(decrypted);
        }
        else
            throw new UnauthorizedException('Token Not Valid')
    }

    generateToken(user: any) : string {
        if(user){
            const payload: JwtPayload = {id: user.id,  username: user.username, isTwoFacEnabled: user.isTwoFacEnabled }; 
            return this.jwtService.sign(payload, {secret: process.env.JWT_ACCESS_SECRET});
        }
        else
            throw new UnauthorizedException('User  not found')
    }

    generateRefreshToken(user: any) : string  {
        if(user){

            const payload: JwtPayload = {id: user.id,  username: user.username, isTwoFacEnabled: user.isTwoFacEnabled}; 
            return this.jwtService.sign(payload, {secret: process.env.JWT_REFRESH_SECRET, expiresIn: '30d'});
        }
        else
            throw new UnauthorizedException('User  not found')
    }

 
    async RefreshTokens(req: Request, res: Response) {
        try{
            const users: any = req.user;
            const user = await this.userService.GetUser(users);
            if (!user)
                throw new ForbiddenException('User Does not exist');
            const decryptedToken = this.decryptToken(user.refreshToken);
            const decodedToken = this.jwtService.verify(decryptedToken) ;
            const cookieToken = this.jwtService.verify(req.cookies['refresh_token']);
    
            if (decryptedToken == req.cookies['refresh_token'])
            {
                const Access_Token = this.generateToken(user);
                const Refresh_Token = this.generateRefreshToken(user);
    
                res.cookie('access_token', Access_Token, {httpOnly: true, secure: true,});
                res.cookie('refresh_token', Refresh_Token, {httpOnly: true, secure: true,});
                const encryptedToken = this.encryptToken(Refresh_Token);
                await this.userService.UpdateRefreshToken(user.id , encryptedToken)
            }
            else{
                throw new ForbiddenException('Access Denied');
            }
        }catch(e){
            throw new HttpException('User Not Granted Full Access', HttpStatus.FORBIDDEN)
        }
    }

    //TwoFactorAuth
    
    async generateQRCode(user: User){
        try{
        const id = user.id
        if(id){
            const secret = authenticator.generateSecret();
            const app = "Transcendence";
            const account = user.username;
    
            //update secret in database
            await this.prisma.user.update({
                where: {id: id}, 
                data: {TwoFacSecret: secret}
            });
            const authUrl = authenticator.keyuri(account, app, secret);
            return (authUrl);
        }
        else
            throw new UnauthorizedException('User Does Not Exist')
    }catch(e){
        throw new HttpException('User Does Not Exist', HttpStatus.FORBIDDEN)

    }
    }

 
    async verifyTFA(user: any, code: string) {
        try{
            if(user){
                return await authenticator.verify({
                    token: code,
                    secret: user.TwoFacSecret
                });
            }
            else
                throw new UnauthorizedException('User  not found')
        }catch(e){
            throw new HttpException('User Does Not Exist', HttpStatus.FORBIDDEN)
        }
    }

    async activateTFA(id: string){
        try{
            if(id){
                await this.prisma.user.update({
                    where: {id: id}, 
                    data: {isTwoFacEnabled: true}
                });
            }
            else
                throw new UnauthorizedException('User  not found')
        }catch(e){
            throw new HttpException('User Does Not Exist', HttpStatus.FORBIDDEN)
        }
    }

    async disableTFA(id: string) {
        try{
            if (id){
                await this.prisma.user.update({
                where: {id: id},
                data: {isTwoFacEnabled: false}
                })
            }
            else
                throw new UnauthorizedException('User  not found')
        }catch(e){
            throw new HttpException('User Does Not Exist', HttpStatus.FORBIDDEN)
        }
    }

    async isEnabled(id: string) {
        try{
            const user = await this.prisma.user.findUnique({
                where: {id:id}
            })
            if(user)
                return user?.isTwoFacEnabled
            throw new UnauthorizedException('User Not Found')
        }catch(e){throw new HttpException('User Does Not Exist', HttpStatus.FORBIDDEN) }
    }
}
