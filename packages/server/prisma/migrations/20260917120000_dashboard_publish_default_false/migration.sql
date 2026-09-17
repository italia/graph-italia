-- Dashboard.publish defaulted to true, unlike Chart and DataSource: a dashboard
-- created without an explicit value was public from birth. Private by default
-- everywhere now. Existing rows are left untouched — flipping already-published
-- dashboards is a data decision, not a schema one.

-- AlterTable
ALTER TABLE "Dashboard" ALTER COLUMN "publish" SET DEFAULT false;
