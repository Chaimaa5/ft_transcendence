import { Controller, Get,  Post, UseGuards,  Res, Req, Headers, Body, ValidationPipe} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { Request, Response } from 'express';
import { ApiTags } from '@nestjs/swagger';
import * as qrcode from 'qrcode';
import { User } from '@prisma/client';
import { TFA } from './dto/TFA.dto';


@Controller('')
@ApiTags('auth')

export class AuthController {
    constructor(private readonly authservice: AuthService){}
    @Get('/login')
    @UseGuards(AuthGuard('42'))
    handleLogin(){}

 
    @Get('/auth')
    @UseGuards(AuthGuard('42'))
    async handleAuth(@Req() req: Request, @Res() res: Response){
        const check = await this.authservice.signIn(res, req);
        if (check == 1)
            return res.redirect('http://localhost/home');
        else
            return res.redirect('http://localhost/setup');
    }

    @Get('/refresh')
    @UseGuards(AuthGuard('Refresh'))
    async RefreshToken(@Req() req: Request, @Res() res: Response){
        res.clearCookie('access_token');
        res.clearCookie('refresh_token');
        await this.authservice.RefreshTokens(req, res);
        return res.send('refreshed');

    }
    
    @Get('/logout')
    async handleLogout(@Req() req: Request, @Res() res: Response){
        this.authservice.signOut(res);
    }

    @Get('/generate-qrcode')
    @UseGuards(AuthGuard('jwt'))
    async HandleTFA(@Req() req: Request, @Res() res: Response){
        const user : User = req.user as User;
        const qr = await this.authservice.generateQRCode(user.id);
        res.setHeader('Content-Type', 'image/png');
        qrcode.toFileStream(res, qr);
    }

    @Post('/enable')
    @UseGuards(AuthGuard('jwt'))
    async EnableTFA(@Req() req: Request, @Body(ValidationPipe) authTFA: TFA){
        const user : User = req.user as User;
        const isCodeValid  = await this.authservice.verifyTFA(user, authTFA.code);
        if(!isCodeValid)
        {
            await this.authservice.activateTFA(user.id);
            return true
        }
        else
            return false
    }

    @Get('/disable')
    @UseGuards(AuthGuard('jwt'))
    async DisableTFA(@Req() req: Request){
        const user : User = req.user as User;
        await this.authservice.disableTFA(user.id);
    }
    
}
