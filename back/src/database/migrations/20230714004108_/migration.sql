/*
  Warnings:

  - You are about to drop the `Achievement` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Achievement" DROP CONSTRAINT "Achievement_use_fkey";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "badge" TEXT[];

-- DropTable
DROP TABLE "Achievement";
