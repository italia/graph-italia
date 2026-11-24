-- ChartWrapper settings of a chart (routes/charts.ts, chartWrapperSchema):
-- NULL = shown without the wrapper.

-- AlterTable
ALTER TABLE "Chart" ADD COLUMN "wrapper" JSONB;
