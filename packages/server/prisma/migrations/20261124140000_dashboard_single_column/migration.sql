-- Dashboard shown in a single column (every slot full width, in reading
-- order) instead of the grid. Off for existing dashboards.

-- AlterTable
ALTER TABLE "Dashboard" ADD COLUMN "singleColumn" BOOLEAN NOT NULL DEFAULT false;
