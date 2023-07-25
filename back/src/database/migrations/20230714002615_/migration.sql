/*
  Warnings:

  - You are about to drop the column `badge` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "badge";

-- CreateTable
CREATE TABLE "Achievement" (
    "id" INTEGER NOT NULL,
    "Achievement" TEXT NOT NULL,
    "Achieved" BOOLEAN NOT NULL,
    "use" TEXT NOT NULL,

    CONSTRAINT "Achievement_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Achievement" ADD CONSTRAINT "Achievement_use_fkey" FOREIGN KEY ("use") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
