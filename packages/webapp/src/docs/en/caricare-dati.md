# Loading data

Loading the source data is the first step in creating your items. You can do it in three ways.

## CSV file

Upload a CSV file from your computer. For the file to be read correctly, it must be set up as follows:

- the **first row** must contain the column names, so the separator is detected automatically;
- numeric values can use the dot as decimal separator.

## JSON file

Alternatively, you can upload a JSON file containing an array (data structure) of objects with the same keys (one per column).

## External URL

Paste the URL of a CSV or JSON published on the web (for example, a file on GitHub or an open data API). The chart **stays linked to the source**: when the chart is public and the saved version is older than **24 hours**, Graph Italia fetches the data from the URL again and applies the changes you defined. This way charts stay up to date without manual work.

## Fixing the table

After loading, you see the data in a table with a toolbar:

- **Filter columns**: exclude the columns you do not need;
- **Reorder columns** and **Rename headers**;
- **Transpose**: swap rows and columns (useful for time series);
- **Reset**: go back to the original data.

## Choosing category and series

For charts, pick the **category column** (the labels, for example the regions) and one or more **numeric series** (the values to plot).

If the category column contains repeated values (for example one row per municipality, with the region repeated), the editor offers to **aggregate**: row count, sum or average of the numeric values. The aggregation is saved in the chart configuration and applied again automatically every time the remote data is refreshed.
