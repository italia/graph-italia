-- Refactor auth models to align with the schema changes that landed in
-- main without a migration:
--   - User.verifyed -> User.verified (column rename)
--   - ApiKey: drop plaintext "key" column, replace with prefix + keyHash
--     and add revokedAt; make projectId NOT NULL
--   - Code -> VerificationCode (table rename) with new "type" enum
--     (ACTIVATION/RECOVERY), "consumedAt" timestamp, and a (userId, type)
--     index
--
-- Existing ApiKey rows cannot be back-filled (keyHash is one-way) and
-- existing Code rows have no "type" — both tables are emptied as part of
-- this migration. Affected users will need to recreate their API keys
-- and re-request any pending verification codes.

BEGIN;

-- ─── CodeType enum ──────────────────────────────────────────────────────────
CREATE TYPE "CodeType" AS ENUM ('ACTIVATION', 'RECOVERY');

-- ─── User: rename verifyed -> verified ──────────────────────────────────────
ALTER TABLE "User" RENAME COLUMN "verifyed" TO "verified";

-- ─── ApiKey: drop legacy plaintext column, add prefix/keyHash/revokedAt ─────
-- Drop the FK from ApiLog so we can safely empty ApiKey.
ALTER TABLE "ApiLog" DROP CONSTRAINT IF EXISTS "ApiLog_apiKeyId_fkey";

-- Empty existing rows (no migration path for plaintext -> bcrypt hash).
DELETE FROM "ApiKey";
DELETE FROM "ApiLog";

-- Drop legacy unique index on the plaintext key column.
DROP INDEX IF EXISTS "ApiKey_key_key";

-- Drop legacy column.
ALTER TABLE "ApiKey" DROP COLUMN "key";

-- Add new columns.
ALTER TABLE "ApiKey" ADD COLUMN "prefix" TEXT NOT NULL;
ALTER TABLE "ApiKey" ADD COLUMN "keyHash" TEXT NOT NULL;
ALTER TABLE "ApiKey" ADD COLUMN "revokedAt" TIMESTAMP(3);

-- Project relation must be NOT NULL per schema.
ALTER TABLE "ApiKey" ALTER COLUMN "projectId" SET NOT NULL;

-- Unique constraints.
CREATE UNIQUE INDEX "ApiKey_prefix_key" ON "ApiKey"("prefix");
CREATE UNIQUE INDEX "ApiKey_keyHash_key" ON "ApiKey"("keyHash");

-- Re-add the ApiLog -> ApiKey FK with ON DELETE SET NULL.
ALTER TABLE "ApiLog"
  ADD CONSTRAINT "ApiLog_apiKeyId_fkey"
  FOREIGN KEY ("apiKeyId") REFERENCES "ApiKey"("id")
  ON DELETE SET NULL ON UPDATE CASCADE;

-- ─── Code -> VerificationCode rename + add type/consumedAt ──────────────────
-- Existing rows have no "type". Drop them — pending codes will need to be
-- re-issued by the affected users.
DELETE FROM "Code";

ALTER TABLE "Code" RENAME TO "VerificationCode";
ALTER TABLE "VerificationCode"
  RENAME CONSTRAINT "Code_pkey" TO "VerificationCode_pkey";
ALTER TABLE "VerificationCode"
  RENAME CONSTRAINT "Code_userId_fkey" TO "VerificationCode_userId_fkey";

ALTER TABLE "VerificationCode"
  ADD COLUMN "type" "CodeType" NOT NULL DEFAULT 'ACTIVATION',
  ADD COLUMN "consumedAt" TIMESTAMP(3);

-- Drop the default once the column is in place — the application sets
-- the type explicitly on insert.
ALTER TABLE "VerificationCode" ALTER COLUMN "type" DROP DEFAULT;

CREATE INDEX "VerificationCode_userId_type_idx"
  ON "VerificationCode"("userId", "type");

COMMIT;
