# Datasets

Datasets are the reusable data sources of the project: an independent catalogue of tables to use in charts.

## How to use datasets

- In the dedicated section you find all the datasets of the project, with name, description and visibility. You can browse and edit them in an editable table without touching the charts that use them;
- alternatively, you can **read and update them through the REST API**: an external system (a scheduled script, a management system) can keep the dataset up to date with a read/write API key (see [API](/docs/api)).

## Dataset source types

- **Local**: the dataset is a CSV file uploaded from your computer; the data is stored on the platform;
- **Remote**: the dataset comes from a URL (CSV or JSON) published on an external site; Graph Italia downloads the data when the dataset is created.

## How to create a dataset

1. Go to **Create new**, select **Data Source** and give it a name.
2. Upload the CSV file or enter a URL.
3. From the **Data source files** list in your Private Area, open the editor to view and edit the data.

## Limitations

- The copy of the data of a remote source does not refresh automatically (the 24-hour refresh applies to charts linked directly to a URL);
- charts cannot yet be linked to a source from their editor: for now the source is a browsable catalogue and an access point through the API.
