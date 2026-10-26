-- Verification, through the Oscar service, that the user still belongs to the
-- public administration chosen at signup (lib/oscar.ts, ENABLE_OSCAR_PA_VERIFICATION):
-- NULL = never requested, 0 = pending, 1 = belongs, 2 = does not belong.

-- AlterTable
ALTER TABLE "User" ADD COLUMN "pa_verified" INTEGER;
