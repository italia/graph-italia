import React from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  getSortedRowModel,
  type SortingState,
} from "@tanstack/react-table";
import {
  useHorizontalScrollArrows,
  useFadePresence,
  type DataTableProps,
  defaultFormatNumber,
  extractHeaderRow,
  getFirstColumnId,
  convertMatrixToTableData,
  createTableColumns,
  getSortIndicator,
} from "./utils";
import ScrollButton from "./ScrollButton";
import "./dataTable.css";

export default function DataTable({
  data,
  id,
  formatNumber,
  prefix,
  suffix,
  excludeColumnsFromPrefixSuffix,
  formatValue,
}: DataTableProps) {
  const { wrapperRef, showLeftArrow, showRightArrow, scrollBy } =
    useHorizontalScrollArrows();
  const leftFade = useFadePresence(showLeftArrow, 180);
  const rightFade = useFadePresence(showRightArrow, 180);
  const [sorting, setSorting] = React.useState<SortingState>([]);

  const hasData = Array.isArray(data) && data.length > 0;
  const headerRow = React.useMemo(() => extractHeaderRow(data), [data]);
  const firstColumnId = React.useMemo(
    () => getFirstColumnId(headerRow),
    [headerRow]
  );
  const format = React.useMemo(
    () => formatNumber ?? defaultFormatNumber,
    [formatNumber]
  );

  const columns = React.useMemo(
    () =>
      createTableColumns({
        headerRow,
        firstColumnId,
        format,
        prefix,
        suffix,
        excludeColumnsFromPrefixSuffix,
        formatValue,
      }),
    [
      headerRow,
      firstColumnId,
      format,
      prefix,
      suffix,
      excludeColumnsFromPrefixSuffix,
      formatValue,
    ]
  );

  const tableData = React.useMemo(
    () => convertMatrixToTableData(data, headerRow),
    [data, headerRow]
  );

  const table = useReactTable({
    data: tableData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    state: { sorting },
    onSortingChange: setSorting,
  });

  if (!hasData) {
    return null;
  }

  return (
    <div className="mid-table-outer">
      <div className="mid-table-wrapper" ref={wrapperRef}>
        <table className="mid-table">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header, i) => {
                  const sorted = header.column.getIsSorted() as
                    | "asc"
                    | "desc"
                    | false;
                  return (
                    <th
                      scope="col"
                      key={`${id ?? ""}-th_${header.id}_${i}`}
                      onClick={header.column.getToggleSortingHandler()}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          header.column.getToggleSortingHandler()?.(e);
                        }
                      }}
                      onMouseDown={(e) => {
                        e.preventDefault();
                      }}
                      tabIndex={0}
                      style={{ cursor: "pointer" }}
                      aria-sort={
                        sorted === "asc"
                          ? "ascending"
                          : sorted === "desc"
                          ? "descending"
                          : "none"
                      }
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}{" "}
                      {getSortIndicator(sorted)}
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr key={`${id ?? ""}-tr_${row.id}`}>
                {row.getVisibleCells().map((cell, index) => {
                  const isFirstColumn = firstColumnId
                    ? cell.column.id === firstColumnId
                    : index === 0;
                  if (isFirstColumn) {
                    return (
                      <th
                        scope="row"
                        key={`${id ?? ""}-r-th_${cell.id}_${index}`}
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </th>
                    );
                  }
                  return (
                    <td key={`${id ?? ""}-r-td_${cell.id}_${index}`}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {leftFade.present && (
        <ScrollButton
          side="left"
          ariaLabel="Scorri a sinistra"
          onClick={() => scrollBy("left")}
          visible={leftFade.visible}
        />
      )}
      {rightFade.present && (
        <ScrollButton
          side="right"
          ariaLabel="Scorri a destra"
          onClick={() => scrollBy("right")}
          visible={rightFade.visible}
        />
      )}
    </div>
  );
}
