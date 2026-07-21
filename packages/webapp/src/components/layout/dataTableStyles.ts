import { Media } from "react-data-table-component";

// Shared react-data-table-component style overrides: stronger header
// contrast and consistent row breathing room across list tables.
// Colors are left untouched so the registered dark theme keeps working.
// Shared column widths for the private-area list tables (charts, dashboards,
// data sources): every column right of "Name" is fixed so that the common
// trailing columns (dates, actions) align pixel-perfect across the tables.
export const TABLE_COL = {
  type: "110px",
  remote: "125px",
  visibility: "130px",
  source: "130px",
  date: "170px",
  share: "120px",
  actions: "160px",
};

// `width` in react-data-table-component pins min-width AND max-width, so every
// column above is rigid and "Name" — the only fluid one — absorbs all the
// shrinking, collapsing to roughly one word per line on a phone. A floor on the
// name column plus dropping secondary columns keeps the two things that matter
// on a small screen, the name and the row actions, side by side.
export const TABLE_NAME_MIN_WIDTH = "180px";

// Breakpoints are the library's own media steps, not Tailwind's: Media.MD is
// max-width 959px and Media.SM is max-width 599px.
export const TABLE_HIDE = {
  // Dropped from tablet down: metadata that is rarely why you opened the list
  // in the first place.
  onTablet: Media.MD,
  // Dropped on phones only: still useful on a tablet, but not worth squeezing
  // the name for.
  onMobile: Media.SM,
};

const dataTableStyles = {
  headCells: {
    style: {
      fontSize: "1rem",
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
      fontSize: "1rem",
    },
  },
};

export default dataTableStyles;
