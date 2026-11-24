-- Show every chart of a dashboard with its ChartWrapper (Chart.wrapper
-- settings or the defaults) on the display page. Off for existing dashboards.

-- AlterTable
ALTER TABLE "Dashboard" ADD COLUMN "wrapCharts" BOOLEAN NOT NULL DEFAULT false;
