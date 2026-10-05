# Line chart

The line chart shows how one or more series change over time or along an ordered progression.

## When to use it

- For charts with time series (months, years, days);
- for trends and comparisons between the progress of several series.

## How to create the chart

1. Go to **Create new**, select **Chart** and load your data (see [Loading data](/docs/caricare-dati) for more details).
2. Choose the time column (dates or periods) as category and the values as series.
3. In **Configure the chart**, select **Line**.

## Preparing the data

The X axis labels follow the row order: make sure the data is sorted chronologically. If there are too many periods (for example daily data over several years), consider aggregating them before loading (for example by month or week): a chart with a few dozen points is much easier to read.

If your data has the periods on the columns instead of the rows, use the **Transpose** tool in the data table.

## Main settings

They are the same as for the bar chart: palette, legend, height, logarithmic scale, tooltip, grid and axes. For time series, the tooltip triggered on the axis (the default setting) shows all the values of the period under the cursor.
