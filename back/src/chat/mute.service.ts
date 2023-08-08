import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

import { Cron } from '@nestjs/schedule';

@Injectable()
export class MuteService {
  
    prisma = new PrismaClient
   async unmute(membership: any){
        if(membership){
            await this.prisma.membership.update({where:{id: membership.id},
                data: {
                    isMuted: false,
                    muteExpiration: null
                }
            })
        }
   }

    @Cron('*/1 * * * *')
    async  updateMutes(){
        const time = new Date();

        const expiredMute = await this.prisma.membership.findMany({
            where: {
                isMuted: true,
                muteExpiration: {
                    lte: time
                }
            }
        })



        for (const muted of expiredMute){
            await this.unmute(muted)
        }
    }

}