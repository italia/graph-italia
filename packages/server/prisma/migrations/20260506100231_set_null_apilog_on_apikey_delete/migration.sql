-- DropForeignKey
ALTER TABLE "ApiLog" DROP CONSTRAINT "ApiLog_apiKeyId_fkey";

-- AlterTable
ALTER TABLE "ApiLog" ALTER COLUMN "apiKeyId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "ApiLog" ADD CONSTRAINT "ApiLog_apiKeyId_fkey" FOREIGN KEY ("apiKeyId") REFERENCES "ApiKey"("id") ON DELETE SET NULL ON UPDATE CASCADE;
