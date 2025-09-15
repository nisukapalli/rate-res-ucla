-- CreateEnum
CREATE TYPE "public"."BuildingType" AS ENUM ('UNIV_APT', 'SUITE', 'PLAZA_PRIV', 'PLAZA_SHARED', 'DELUXE', 'CLASSIC');

-- CreateTable
CREATE TABLE "public"."Building" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "type" "public"."BuildingType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "uid" TEXT NOT NULL,

    CONSTRAINT "Building_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Building_uid_key" ON "public"."Building"("uid");

-- CreateIndex
CREATE INDEX "Building_name_idx" ON "public"."Building"("name");

-- CreateIndex
CREATE INDEX "Building_address_idx" ON "public"."Building"("address");

-- CreateIndex
CREATE INDEX "Building_type_idx" ON "public"."Building"("type");

-- CreateIndex
CREATE UNIQUE INDEX "Building_name_address_key" ON "public"."Building"("name", "address");
