import { Injectable } from "@nestjs/common";
import { PrismaClient } from '@prisma/client';

@Injectable({})
export class GameService {

	prisma = new PrismaClient();
	async getAccess(id: string) {
		const user = await this.prisma.user.findUnique({
			where: {id: id}
		})

		return user?.accessToken
	}
}