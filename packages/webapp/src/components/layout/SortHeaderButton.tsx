import { useTranslation } from "react-i18next";

export type SortDirection = "asc" | "desc";
export type SortHeaderState = { columnKey: string; direction: SortDirection } | null;

function useSortLabels() {
  const { t } = useTranslation("components", {
    keyPrefix: "components.sortHeader",
  });
  return {
    sortable: t("sortable", "ordinabile"),
    asc: t("sortedAsc", "ordinato in modo crescente"),
    desc: t("sortedDesc", "ordinato in modo decrescente"),
  };
}

/**
 * Real <button> rendered as the column name of sortable data-table columns,
 * following the APG sortable-table pattern: screen readers announce it as a
 * button and Space/Enter activate it natively (WCAG 4.1.2).
 * @see https://www.w3.org/WAI/ARIA/apg/patterns/table/examples/sortable-table/
 *
 * aria-sort lives on the columnheader, but several screen readers do not
 * announce an ancestor's aria-sort when the button takes focus: the current
 * state is therefore repeated inside the button's accessible name as
 * visually-hidden text.
 *
 * Sorting itself stays with react-data-table-component: the click bubbles to
 * the library's header handler. The legacy keypress handler on the header
 * would double-fire on Enter, so the event is stopped from bubbling.
 */
export default function SortHeaderButton({
  label,
  direction,
}: {
  label: string;
  direction?: SortDirection;
}) {
  const labels = useSortLabels();
  const state =
    direction === "asc"
      ? labels.asc
      : direction === "desc"
        ? labels.desc
        : labels.sortable;
  return (
    <button
      type="button"
      data-sort-header
      className="rdt-sort-header-btn"
      onKeyPress={(event) => event.stopPropagation()}
    >
      {label}
      <span className="sr-only">, {state}</span>
    </button>
  );
}

/**
 * Screen-reader-only live region announcing sort changes (WCAG 4.1.3):
 * activating a sort button re-renders the header, so relying on the focused
 * element's name change alone is not reliable across screen readers.
 */
export function SortStatus({ sortState }: { sortState: SortHeaderState }) {
  const labels = useSortLabels();
  return (
    <div role="status" className="sr-only">
      {sortState
        ? `${sortState.columnKey}: ${sortState.direction === "asc" ? labels.asc : labels.desc}`
        : ""}
    </div>
  );
}
