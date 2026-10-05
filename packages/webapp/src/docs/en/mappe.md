# Maps

Maps link data to the Italian territory. Graph Italia supports two kinds of maps.

## Choropleth maps

Choropleth maps are thematic maps that colour administrative areas (regions or provinces) according to a value: the higher the value, the deeper the colour.

### When to use it

Use the choropleth map to show, for example, population density, per capita income or election results.

### How to create the chart

1. Go to **Create new**, select **Chart** and load your data (see [Loading data](/docs/caricare-dati) for more details); in **Configure the chart**, choose **Geographic map**.
2. Load a table with one column identifying the area (name or ISTAT code of the region or province) and one column with the value.
3. The editor matches the rows to the areas of the map; the preview shows the result straight away.

For the matching to work, the area names must match the official ones (for example "Emilia-Romagna", "Valle d'Aosta"). Alternatively, use the ISTAT codes.

## Point maps

Point maps show specific places on the territory (offices, help desks, events) starting from geographic coordinates.

### When to use it

Use the point map to mark two or more specific points on the territory.

### How to create the chart

1. Go to **Create new**, select **Point map** and load your data (see [Loading data](/docs/caricare-dati) for more details). Before creating the point map, keep in mind that every point on the map needs **latitude** and **longitude** coordinates, plus any descriptive columns shown in the tooltip.
2. In the editor you can search for an address and add points directly from the geographic search: if you do not have coordinates, use the **Generate Pois** tool (in the **Tools** menu) and create a sample dataset.

## Custom GeoJSON

You can check a GeoJSON file with the preview available at **/geo** before using it, which is handy for non-standard boundaries or areas.

## Sharing

Like every chart, a public map has a display link and an embed code. The automatic refresh of remote data applies too (see [Loading data](/docs/caricare-dati)).
