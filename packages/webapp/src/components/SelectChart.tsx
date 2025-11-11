function SelectChart({
  chart,
  setChart,
}: {
  chart?: string;
  setChart: Function;
}) {
  return (
    <div
      style={{ display: "flex", justifyContent: "start", alignItems: "center" }}
    >
      <label style={{ width: "200px" }}>Select a chart type:</label>
      <select
        className='select select-primary my-2 p-2 max-w-lg'
        value={chart}
        onChange={(e) => setChart(e.target.value || "")}
      >
        <option value=''>{`-seleziona una tipologi di grafico-`}</option>
        <option value='bar'>Bar</option>
        <option value='line'>Line</option>
        <option value='pie'>Pie</option>
        <option value='map'>GeoMap</option>
      </select>
    </div>
  );
}

export default SelectChart;
