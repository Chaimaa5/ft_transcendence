import { Body, Controller, Delete, Get, OnApplicationShutdown, Param, Patch, Post, Put, Req, Res, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDTO } from './dto/updatedto.dto'
import { Request, Response} from 'express';
// import { SocketGateway } from 'src/socket/socket.gateway';
import { AuthGuard } from '@nestjs/passport';
import { User } from '@prisma/client';
import { ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { Config } from './multer.middlewear';


@Controller('user')
@ApiTags('user')
@UseGuards(AuthGuard('jwt'))
export class UserController{
    constructor(private readonly userservice: UserService){}
        
    //working
    @Get()
    async FindbyID(@Req() req: Request){
        const user : User = req.user as User;
        return await this.userservice.FindbyID(user.id);
    }

    @Get('players')
    async Players(){
        return await this.userservice.Players();
    }
    //working
    @Delete()
    async DeleteUser(@Req() req: Request, @Res() res: Response){
        const user : User = req.user as User;
        return await this.userservice.DeleteUser(user.id, res);
    }

    //working
    @Post('setup')
    @UseInterceptors(FileInterceptor('avatar', Config)) 
    async UserSetup(@Req() req: Request,@Res() res: Response ,@UploadedFile() avatar: Express.Multer.File, @Body() data: UpdateUserDTO){
        const user : User = req.user as User;
        console.log(data)
        await this.userservice.userSetup(user.id, avatar, data);
    }

    //Friendship Management
    //working
    @Get('/add/:id')
    async addFriend(@Req() req: Request, @Param('id') id: string){
        const user : User = req.user as User;
        await this.userservice.addFriend(user.id, id);
         return {message: 'friend added'};
    }
    @Get('/remove/:id')
    async removeFriend(@Req() req: Request, @Param('id') id: string){
        const user : User = req.user as User;
        await this.userservice.removeFriend(user.id, id);
        return {message: 'friend removed'};
    }
    @Get('/accept/:id')
    async acceptFriend(@Req() req: Request, @Param('id') id: string){
        const user : User = req.user as User;
        await this.userservice.acceptFriend(user.id, id);
        return {message: 'friend accepted'};
    }
    @Get('/block/:id')
    async blockFriend(@Req() req: Request, @Param('id') id: string){
        const user : User = req.user as User;
        await this.userservice.blockFriend(user.id, id);
        return {message: 'friend blocked'};
    }
    @Get('/unblock/:id')
    async unblockFriend(@Req() req: Request, @Param('id') id: string){
        const user : User = req.user as User;
        await this.userservice.removeFriend(user.id, id);
        return {message: 'friend unblocked'};
    }
    @Get('/friends')
    async getFriends(@Req() req: Request){
        const user : User = req.user as User;
        return await this.userservice.getFriends(user.id);
    }
    @Get('/friend/:id')
    async getFriend(@Req() req: Request,  @Param('id') id: string){
        const user : User = req.user as User;
        return await this.userservice.getFriend(user.id, id);
    }
    @Get('/pending')
    async getPendings(@Req() req: Request){
        const user : User = req.user as User;
        return await this.userservice.getPendings(user.id);
    }

    @Get('/blocked')
    async getBlocked(@Req() req: Request){
        const user : User = req.user as User;
        return await this.userservice.getBlocked(user.id);
    }




    // async onApplicationShutdown(signal?: string): Promise<void>{
    //     const connectedUsers = Array.from(this.socketGateway.connectedUsers);
    //     for(const userId of connectedUsers)
    //         await this.updateOnlineStatus(userId, false);
    // }

}


