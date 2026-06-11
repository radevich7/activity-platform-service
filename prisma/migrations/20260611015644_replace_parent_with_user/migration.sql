/*
  Warnings:

  - You are about to drop the column `childId` on the `Booking` table. All the data in the column will be lost.
  - You are about to drop the column `parentId` on the `Booking` table. All the data in the column will be lost.
  - You are about to drop the column `providerId` on the `Booking` table. All the data in the column will be lost.
  - You are about to drop the column `parentId` on the `Child` table. All the data in the column will be lost.
  - You are about to drop the column `auth0Id` on the `Provider` table. All the data in the column will be lost.
  - You are about to drop the column `avatarUrl` on the `Provider` table. All the data in the column will be lost.
  - You are about to drop the column `email` on the `Provider` table. All the data in the column will be lost.
  - You are about to drop the column `isVerified` on the `Provider` table. All the data in the column will be lost.
  - You are about to drop the `Parent` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[adminUserId]` on the table `Provider` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `bookedByUserId` to the `Booking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `participantType` to the `Booking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ownerId` to the `Child` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('CLIENT', 'PROVIDER_ADMIN', 'TEACHER');

-- CreateEnum
CREATE TYPE "ParticipantType" AS ENUM ('SELF', 'CHILD');

-- DropForeignKey
ALTER TABLE "Booking" DROP CONSTRAINT "Booking_childId_fkey";

-- DropForeignKey
ALTER TABLE "Booking" DROP CONSTRAINT "Booking_parentId_fkey";

-- DropForeignKey
ALTER TABLE "Booking" DROP CONSTRAINT "Booking_providerId_fkey";

-- DropForeignKey
ALTER TABLE "Child" DROP CONSTRAINT "Child_parentId_fkey";

-- DropIndex
DROP INDEX "Provider_auth0Id_key";

-- DropIndex
DROP INDEX "Provider_email_key";

-- AlterTable
ALTER TABLE "Activity" ALTER COLUMN "ageMin" DROP NOT NULL,
ALTER COLUMN "ageMax" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Booking" DROP COLUMN "childId",
DROP COLUMN "parentId",
DROP COLUMN "providerId",
ADD COLUMN     "bookedByUserId" TEXT NOT NULL,
ADD COLUMN     "participantChildId" TEXT,
ADD COLUMN     "participantType" "ParticipantType" NOT NULL,
ADD COLUMN     "participantUserId" TEXT;

-- AlterTable
ALTER TABLE "Child" DROP COLUMN "parentId",
ADD COLUMN     "ownerId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Provider" DROP COLUMN "auth0Id",
DROP COLUMN "avatarUrl",
DROP COLUMN "email",
DROP COLUMN "isVerified",
ADD COLUMN     "adminUserId" TEXT,
ADD COLUMN     "logoUrl" TEXT;

-- DropTable
DROP TABLE "Parent";

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "auth0Id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "phone" TEXT,
    "avatarUrl" TEXT,
    "role" "UserRole" NOT NULL DEFAULT 'CLIENT',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Teacher" (
    "id" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "userId" TEXT,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT,
    "bio" TEXT,
    "avatarUrl" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Teacher_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ActivityTeacher" (
    "activityId" TEXT NOT NULL,
    "teacherId" TEXT NOT NULL,

    CONSTRAINT "ActivityTeacher_pkey" PRIMARY KEY ("activityId","teacherId")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_auth0Id_key" ON "User"("auth0Id");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Teacher_userId_key" ON "Teacher"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Provider_adminUserId_key" ON "Provider"("adminUserId");

-- AddForeignKey
ALTER TABLE "Provider" ADD CONSTRAINT "Provider_adminUserId_fkey" FOREIGN KEY ("adminUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Teacher" ADD CONSTRAINT "Teacher_providerId_fkey" FOREIGN KEY ("providerId") REFERENCES "Provider"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Teacher" ADD CONSTRAINT "Teacher_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActivityTeacher" ADD CONSTRAINT "ActivityTeacher_activityId_fkey" FOREIGN KEY ("activityId") REFERENCES "Activity"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActivityTeacher" ADD CONSTRAINT "ActivityTeacher_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "Teacher"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Child" ADD CONSTRAINT "Child_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_bookedByUserId_fkey" FOREIGN KEY ("bookedByUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_participantChildId_fkey" FOREIGN KEY ("participantChildId") REFERENCES "Child"("id") ON DELETE SET NULL ON UPDATE CASCADE;
