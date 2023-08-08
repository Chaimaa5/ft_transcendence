-- AlterTable
ALTER TABLE "Game" ADD COLUMN     "ballSpeed" INTEGER,
ADD COLUMN     "decreasingpaddleSize" BOOLEAN,
ADD COLUMN     "draw" BOOLEAN,
ADD COLUMN     "flashyMode" BOOLEAN,
ADD COLUMN     "lossLimit" INTEGER,
ADD COLUMN     "maxScore" INTEGER,
ADD COLUMN     "minScore" INTEGER,
ADD COLUMN     "paddleSize" TEXT,
ALTER COLUMN "winner" DROP NOT NULL;
