import { Body, Controller, Delete, Get, OnApplicationShutdown, Param, Patch, Post, Put, Req, Res, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { Request, Response} from 'express';
import { AuthGuard } from '@nestjs/passport';
import { User } from '@prisma/client';
import { ApiTags } from '@nestjs/swagger';
import { ChatService } from './chat.service';
import { AddMember, CreateChannel, CreateRoom } from './dto/Chat.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { Config } from 'src/user/multer.middlewear';



@Controller('chat')
@ApiTags('chat')
@UseGuards(AuthGuard('jwt'))
export class ChatController{
    constructor(private readonly chat: ChatService){}
    
    //working
    @Get('/rooms')
    async GetJoinedRooms(@Req() req: Request){
        const user = req.user as User
        // if (user)
            return await this.chat.GetJoinedRooms(user.id);
    }

    //working



    //working
    @Post('/create/')
    @UseInterceptors(FileInterceptor('image', Config)) 
    async CreateChannel(@Req() req: Request, @UploadedFile() image: Express.Multer.File, @Body() body: CreateChannel){
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
      @Post(':membershipId/setAdmin')
      async SetAdmin(@Req() req: Request, @Param('membershipId') Id: any){
          const user = req.user as User
          const membershipId = parseInt(Id, 10)
          return await this.chat.setAdmin(user.id, membershipId)
      }

    @Delete()
    async DeleteChannel(@Req() req: Request, @Param('roomId') Id: any){
        const user = req.user as User
        const roomId = parseInt(Id, 10)
        return await this.chat.DeleteChannel(user.id, roomId)
    }

    @Get('/message/:roomId')
    async GetMessages(@Req() req: Request, @Param('roomId') Id: any){
        const user = req.user as User
        const roomId = parseInt(Id, 10)
        return await this.chat.GetMessages(user.id, 1)
    }

    @Post('/ban/:membershpiId')
    async BanMember(@Req() req: Request, @Param('membershipId') Id: any){
        const user = req.user as User
        const membershipId = parseInt(Id, 10)
        return await this.chat.BanUpdate(user.id, membershipId, true)
    }

    @Post('/mute/:membershipId')
    async MuteMember(@Req() req: Request, @Param('membershipId') Id: any, @Body() duration: string){
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
    async GetRoomMembers(@Param('roomId') id: string){

        const roomId = parseInt(id)
        return await this.chat.GetRoomMembers(roomId)
    }

    @Get('joinRoom/:roomId')
    async JoinRoom(@Req() req: Request, @Param('roomId') id: string){
        const roomId = parseInt(id, 10)
        const user = req.user as User
        await this.chat.joinRoom(roomId, user.id)
    }

    @Post('/unmute/:roomId')
    async VerifyPassword(@Req() req: Request, @Param('roomId') Id: any, @Body('password') password: string){
        const roomId = parseInt(Id, 10)
        return await this.chat.VerifyPassword(roomId, password)
    }

}


