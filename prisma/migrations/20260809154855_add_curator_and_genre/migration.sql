-- AlterTable
ALTER TABLE "playlists" ADD COLUMN     "genre" TEXT;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "isCurator" BOOLEAN NOT NULL DEFAULT false;
