-- CreateEnum
CREATE TYPE "CuratorType" AS ENUM ('ARTIST', 'PLACE', 'CURATOR');

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "curatorType" "CuratorType";
