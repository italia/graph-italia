-- Add the OIDC subject identifier (SPID/CIE) to User. Nullable so existing
-- rows and email/password signups are unaffected; unique so a `sub` maps to at
-- most one account (multiple NULLs are allowed by Postgres unique indexes).

-- AlterTable
ALTER TABLE "User" ADD COLUMN "sub" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "User_sub_key" ON "User"("sub");
