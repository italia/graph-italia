// Shared react-data-table-component style overrides: stronger header
// contrast and consistent row breathing room across list tables.
// Colors are left untouched so the registered dark theme keeps working.
// Shared column widths for the private-area list tables (charts, dashboards,
// data sources): every column right of "Name" is fixed so that the common
// trailing columns (dates, actions) align pixel-perfect across the tables.
export const TABLE_COL = {
  type: "110px",
  remote: "110px",
  visibility: "130px",
  source: "130px",
  date: "170px",
  share: "120px",
  actions: "160px",
};

const dataTableStyles = {
  headCells: {
    style: {
      fontSize: "0.875rem",
      fontWeight: 700,
      textTransform: "uppercase" as const,
      letterSpacing: "0.02em",
    },
  },
  cells: {
    style: {
      fontSize: "1rem",
    },
  },
  rows: {
    style: {
      minHeight: "48px",
    },
  },
  pagination: {
    style: {
      fontSize: "0.875rem",
    },
  },
};

export default dataTableStyles;
