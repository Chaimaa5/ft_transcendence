-- DropForeignKey
ALTER TABLE "Game" DROP CONSTRAINT "Game_playerId2_fkey";

-- AlterTable
ALTER TABLE "Game" ADD COLUMN     "ball" TEXT,
ADD COLUMN     "map" TEXT,
ALTER COLUMN "playerId2" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Game" ADD CONSTRAINT "Game_playerId2_fkey" FOREIGN KEY ("playerId2") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
