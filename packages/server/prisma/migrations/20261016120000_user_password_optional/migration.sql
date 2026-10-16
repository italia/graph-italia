-- Accounts created through SPID/CIE when password authentication is disabled
-- (ENABLE_PASSWORD_AUTH="false") have no password. Existing rows keep theirs.

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "password" DROP NOT NULL;
