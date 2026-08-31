/**
 * Real <button> rendered as the column name of sortable data-table columns,
 * following the APG sortable-table pattern: screen readers announce it as a
 * button and Space/Enter activate it natively (WCAG 4.1.2).
 * @see https://www.w3.org/WAI/ARIA/apg/patterns/table/examples/sortable-table/
 *
 * Sorting itself stays with react-data-table-component: the click bubbles to
 * the library's header handler. The legacy keypress handler on the header
 * would double-fire on Enter, so the event is stopped from bubbling.
 */
export default function SortHeaderButton({ label }: { label: string }) {
  return (
    <button
      type="button"
      data-sort-header
      className="rdt-sort-header-btn"
      onKeyPress={(event) => event.stopPropagation()}
    >
      {label}
    </button>
  );
}
