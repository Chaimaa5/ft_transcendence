import { Injectable, Res, UnauthorizedException } from '@nestjs/common';
import { PrismaClient, User } from '@prisma/client';
import { Response } from 'express';
import { NOTFOUND } from 'dns';
import { use } from 'passport';

@Injectable()
export class GameService {
    
    prisma = new PrismaClient();
    constructor(){}


    async postChallengeSettings(user: User, body: any) {
        const game = await this.prisma.game.create({data : {
            mode : 'OneVsOne',
            playerId1 : user.id,
            rounds : body.rounds,
            pointsToWin : body.pointsToWin,
            difficulty : body.difficulty,
            status: 'pending'
        }})
        return game.id
    }

    async getChallengeSettings(id : number) {
        const game = await this.prisma.game.findUnique({where : {id : id},
            select:{
                player1: {
                    select: {
                        username: true,
                    }
                }, 
                player2: {
                    select: {
                        username: true,
                    }
                },
                rounds : true,
                pointsToWin : true,
                difficulty : true,
            }
        })
        return(game);
    }

    
}