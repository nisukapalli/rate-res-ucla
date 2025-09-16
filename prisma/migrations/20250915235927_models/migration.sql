-- CreateEnum
CREATE TYPE "public"."BuildingType" AS ENUM ('UNIV_APT', 'SUITE', 'PLAZA', 'DELUXE', 'CLASSIC');

-- CreateTable
CREATE TABLE "public"."Building" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "type" "public"."BuildingType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Building_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."User" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "class" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Review" (
    "id" SERIAL NOT NULL,
    "building" TEXT NOT NULL,
    "overall" INTEGER NOT NULL,
    "location" INTEGER NOT NULL,
    "distance" INTEGER NOT NULL,
    "social" INTEGER NOT NULL,
    "noise" INTEGER NOT NULL,
    "clean" INTEGER NOT NULL,
    "value" INTEGER NOT NULL,
    "text" TEXT,
    "authorId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Review_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Building_name_idx" ON "public"."Building"("name");

-- CreateIndex
CREATE INDEX "Building_address_idx" ON "public"."Building"("address");

-- CreateIndex
CREATE INDEX "Building_type_idx" ON "public"."Building"("type");

-- CreateIndex
CREATE UNIQUE INDEX "Building_name_address_key" ON "public"."Building"("name", "address");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "public"."User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "public"."User"("email");

-- CreateIndex
CREATE INDEX "User_email_idx" ON "public"."User"("email");

-- CreateIndex
CREATE INDEX "User_username_idx" ON "public"."User"("username");

-- CreateIndex
CREATE INDEX "Review_building_idx" ON "public"."Review"("building");

-- CreateIndex
CREATE INDEX "Review_authorId_idx" ON "public"."Review"("authorId");

-- AddForeignKey
ALTER TABLE "public"."Review" ADD CONSTRAINT "Review_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
