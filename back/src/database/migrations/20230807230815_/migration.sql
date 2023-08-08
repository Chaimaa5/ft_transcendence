/*
  Warnings:

  - You are about to drop the column `flashyMode` on the `Game` table. All the data in the column will be lost.
  - You are about to drop the column `maxScore` on the `Game` table. All the data in the column will be lost.
  - Added the required column `status` to the `Game` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Game" DROP COLUMN "flashyMode",
DROP COLUMN "maxScore",
ADD COLUMN     "difficulty" TEXT,
ADD COLUMN     "pointsToWin" INTEGER,
ADD COLUMN     "status" TEXT NOT NULL;
