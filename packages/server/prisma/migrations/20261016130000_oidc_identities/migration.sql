-- SPID/CIE identities move from User.sub (one per user) to their own table, so
-- an account can be reached from both SPID and CIE, which issue different
-- subjects. Existing links are copied over before the column is dropped.

-- CreateTable
CREATE TABLE "OidcIdentity" (
    "sub" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OidcIdentity_pkey" PRIMARY KEY ("sub")
);

-- CreateIndex
CREATE INDEX "OidcIdentity_userId_idx" ON "OidcIdentity"("userId");

-- AddForeignKey
ALTER TABLE "OidcIdentity" ADD CONSTRAINT "OidcIdentity_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Copy existing links
INSERT INTO "OidcIdentity" ("sub", "userId", "updatedAt")
SELECT "sub", "id", CURRENT_TIMESTAMP FROM "User" WHERE "sub" IS NOT NULL;

-- DropIndex
DROP INDEX "User_sub_key";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "sub";
