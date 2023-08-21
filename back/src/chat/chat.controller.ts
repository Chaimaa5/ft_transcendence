import { Body, Controller, Delete, Get, HttpException, HttpStatus, OnApplicationShutdown, Param, Patch, Post, Put, Req, Res, UploadedFile, UseFilters, UseGuards, UseInterceptors, ValidationPipe } from '@nestjs/common';
import { Request, Response} from 'express';
import { AuthGuard } from '@nestjs/passport';
import { User } from '@prisma/client';
import { ApiTags } from '@nestjs/swagger';
import { ChatService } from './chat.service';
import { AddMember, CreateChannel, CreateRoom, PasswordDTO, UpdateChannel } from './dto/Chat.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { Config } from 'src/user/multer.middlewear';
import { HttpExceptionFilter } from 'src/auth/exception.filter';



@Controller('chat')
@ApiTags('chat')
@UseGuards(AuthGuard('jwt'))
@UseFilters(HttpExceptionFilter)
export class ChatController{
    constructor(private readonly chat: ChatService){}
    
    //working
    @Get('/rooms')
    async GetJoinedRooms(@Req() req: Request){
        const user = req.user as User
        return await this.chat.GetJoinedRooms(user.id);
    }

    @Post('/create/')
    @UseInterceptors(FileInterceptor('image', Config)) 
    async CreateChannel(@Req() req: Request, @UploadedFile() image: Express.Multer.File, @Body(ValidationPipe) body: CreateChannel){
        const user = req.user as User
        return await this.chat.CreateChannel(user.id, body, image);
    }

    //working
    @Post('/add')
    async AddMember(@Req() req: Request, @Body() body: AddMember ){
        const user = req.user as User
        return await this.chat.AddMember(user.id, body);
    }
   
    //working
    @Get('/channels')
    async GetChannels(@Req() req: Request){
        const user = req.user as User
        return await this.chat.GetChannels(user.id)
    }


    //working
    @Get('/joinedChannels')
    async GetJoinedChannels(@Req() req: Request){
        const user = req.user as User
        return await this.chat.GetJoinedChannels(user.id)
    }

   
      //working
      @Post('/:membershipId/setAdmin/')
      async SetAdmin(@Req() req: Request, @Param('membershipId') Id: any){
          const user = req.user as User
          const membershipId = parseInt(Id, 10)
          return await this.chat.setAdmin(user.id, membershipId)
      }

    @Get('/:membershipId/unsetAdmin/')
      async UnSetAdmin(@Req() req: Request, @Param('membershipId') Id: any){
          const user = req.user as  User
          const membershipId = parseInt(Id, 10)
          return await this.chat.unsetAdmin(user.id, membershipId)
      }

    @Delete('/:chatId')
    async DeleteChannel(@Req() req: Request, @Param('chatId') Id: string){
        const user = req.user as User
        const roomId = parseInt(Id, 10)
        if(roomId)
            return await this.chat.DeleteChannel(user.id, roomId)

    }

    @Get('/message/:roomId')
    async GetMessages(@Req() req: Request, @Param('roomId') Id: any){
        const user = req.user as User
        const roomId = parseInt(Id, 10)
        return await this.chat.GetMessages(user.id, roomId)
    }

    @Post('/ban/:membershipId')
    async BanMember(@Req() req: Request, @Param('membershipId') Id: any){
        const user = req.user as User
        const membershipId = parseInt(Id, 10)
        return await this.chat.BanUpdate(user.id, membershipId, true)
    }
    @Post('/mute/:membershipId')
    async MuteMember(@Req() req: Request, @Param('membershipId') Id: any, @Body() duration: any){
        const user = req.user as User
        const membershipId = parseInt(Id, 10)
        return await this.chat.muteMember(user.id, membershipId, duration)
    }
    @Post('/unban/:membershipId')
    async UnbanMember(@Req() req: Request, @Param('membershipId') Id: any){
        const user = req.user as User
        const membershipId = parseInt(Id, 10)
        return await this.chat.BanUpdate(user.id, membershipId, false)
    }

    @Post('/unmute/:membershipId')
    async UnmuteMember(@Req() req: Request, @Param('membershipId') Id: any){
        const user = req.user as User
        const membershipId = parseInt(Id, 10)
        return await this.chat.UnmuteMember(user.id, membershipId)
    }

    @Get('/roomMembers/:roomId')
    async GetRoomMembers(@Req() req: Request, @Param('roomId') id: string){
        const user = req.user as User
        const roomId = parseInt(id)
        return await this.chat.GetRoomMembers(roomId, user.id)
    }

    @Get('joinRoom/:roomId')
    async JoinRoom(@Req() req: Request, @Param('roomId') id: string){
        const roomId = parseInt(id, 10)
        const user = req.user as User
        await this.chat.joinRoom(roomId, user.id)
    }

    @Post('/joinProtected/:roomId')
    async JoinProtectedChannel(@Req() req: Request, @Res() res: Response, @Param('roomId') Id: any, @Body(ValidationPipe) body: PasswordDTO){
        const roomId = parseInt(Id, 10)
        const user = req.user as User
        console.log(body)
        const verified = await this.chat.VerifyPassword(roomId, body.password as string)
        if(verified){
            await this.chat.createMembership(roomId, user.id)
            res.json("success")
        }
        else
            res.json("password incorrect")
    }

    @Get('/leave/:membershipId')
    async LeaveRoom(@Req() req: Request, @Param('membershipId') id: string){
        const membershipId = parseInt(id, 10)
        const user = req.user as User;
        await this.chat.leaveChannel(membershipId);
    }
   
    @Post('/update')
    @UseInterceptors(FileInterceptor('image', Config)) 
    async UpdateChannel(@Req() req: Request,@Res() res: Response ,@UploadedFile() avatar: Express.Multer.File, @Body(ValidationPipe) room: UpdateChannel){
        const user : User = req.user as User;
        await this.chat.UpdateChannel(room, avatar);
    }
    @Get('kick/:membershipId')
    async Kick(@Req() req: Request, @Param('membershipId') id: string){
        const membershipId = parseInt(id, 10)
        const user = req.user as User
        await this.chat.kick(user.id, membershipId)
    }

}


