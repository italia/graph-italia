import Papa from "papaparse";

export default function parseCSV(csvString: string) {
  return Papa.parse(csvString, {
    header: false,
    skipEmptyLines: true,
    complete: (results) => {
      console.log("Parsed CSV results:", results);
      return results.data
    }
  });
}
