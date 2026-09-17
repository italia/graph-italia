-- Add the "Pubblica Amministrazione di appartenenza" the user belongs to.
-- Nullable so existing rows are unaffected; the signup form asks for it, the
-- model does not enforce it.

-- AlterTable
ALTER TABLE "User" ADD COLUMN "pa" TEXT;
