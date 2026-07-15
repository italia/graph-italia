// Shared react-data-table-component style overrides: stronger header
// contrast and consistent row breathing room across list tables.
// Colors are left untouched so the registered dark theme keeps working.
const dataTableStyles = {
  headCells: {
    style: {
      fontSize: "0.8125rem",
      fontWeight: 700,
      textTransform: "uppercase" as const,
      letterSpacing: "0.02em",
    },
  },
  rows: {
    style: {
      minHeight: "48px",
    },
  },
};

export default dataTableStyles;
