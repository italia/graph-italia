export default function QuickstartInfo() {
  return (
    <div className="my-5 prose">
      <h3>Quickstart</h3> If you want start quickly you can generate some dummy
      data for test purpose from the section{" "}
      <a className="link link-primary" href="/generate-data">
        Generate Data
      </a>{" "}
      or from the section{" "}
      <a className="link link-primary" href="/load-data">
        Load Data
      </a>{" "}
      and download th data in CSV format. Then you can upload the data e create
      a new chart.
      <h3>How to use:</h3>
      follow these steps to create a new chart:
      <ul>
        <li>Click on "Create New Chart" to start</li>
        <li>Upload your data</li>
        <li>Configure your chart</li>
        <li>Save your chart</li>
      </ul>
      <hr />
    </div>
  );
}
