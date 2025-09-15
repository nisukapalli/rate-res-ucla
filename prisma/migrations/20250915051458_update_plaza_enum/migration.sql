/*
  Warnings:

  - The values [PLAZA_PRIV,PLAZA_SHARED] on the enum `BuildingType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "public"."BuildingType_new" AS ENUM ('UNIV_APT', 'SUITE', 'PLAZA', 'DELUXE', 'CLASSIC');
ALTER TABLE "public"."Building" ALTER COLUMN "type" TYPE "public"."BuildingType_new" USING ("type"::text::"public"."BuildingType_new");
ALTER TYPE "public"."BuildingType" RENAME TO "BuildingType_old";
ALTER TYPE "public"."BuildingType_new" RENAME TO "BuildingType";
DROP TYPE "public"."BuildingType_old";
COMMIT;
