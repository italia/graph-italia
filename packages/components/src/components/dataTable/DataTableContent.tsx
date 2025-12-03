import { closestCenter, DndContext, type DragEndEvent } from "@dnd-kit/core";
import {
  horizontalListSortingStrategy,
  SortableContext,
} from "@dnd-kit/sortable";
import type { Header, Table } from "@tanstack/react-table";
import { flexRender } from "@tanstack/react-table";
import React from "react";
import { SortableHeaderCell } from "./SortableHeaderCell";
import { getSortIndicator } from "./utils";

type TableRecord = Record<string, unknown>;

type DataTableContentProps = {
  table: Table<TableRecord>;
  id?: string;
  firstColumnId?: string;
  wrapperRef: React.RefObject<HTMLDivElement | null>;
  columnOrder: string[];
  sensors: any;
  onDragEnd: (event: DragEndEvent) => void;
  enableColumnReorder?: boolean;
  reorderColumnAriaLabel?: string;
};

export function DataTableContent({
  table,
  id,
  firstColumnId,
  wrapperRef,
  columnOrder,
  sensors,
  onDragEnd,
  enableColumnReorder = false,
  reorderColumnAriaLabel = "Riordina colonna",
}: DataTableContentProps) {
  const renderTable = () => (
    <div className="mid-table-wrapper" ref={wrapperRef}>
      <table className="mid-table">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {enableColumnReorder ? (
                <SortableContext
                  items={
                    columnOrder.length
                      ? columnOrder
                      : headerGroup.headers.map((h) => h.column.id)
                  }
                  strategy={horizontalListSortingStrategy}
                >
                  {headerGroup.headers.map((header) => (
                    <SortableHeaderCell
                      key={header.id}
                      header={header as Header<TableRecord, unknown>}
                      reorderAriaLabel={reorderColumnAriaLabel}
                    />
                  ))}
                </SortableContext>
              ) : (
                headerGroup.headers.map((header) => {
                  const sorted = header.column.getIsSorted() as
                    | "asc"
                    | "desc"
                    | false;
                  const sortHandler = header.column.getToggleSortingHandler();

                  return (
                    <th
                      key={header.id}
                      scope="col"
                      aria-sort={
                        sorted === "asc"
                          ? "ascending"
                          : sorted === "desc"
                          ? "descending"
                          : "none"
                      }
                      onClick={(e) => {
                        sortHandler?.(e);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          sortHandler?.(e as any);
                        }
                      }}
                    >
                      {header.isPlaceholder ? null : (
                        <span style={{ cursor: "pointer" }}>
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}{" "}
                          {getSortIndicator(sorted)}
                        </span>
                      )}
                    </th>
                  );
                })
              )}
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
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return enableColumnReorder ? (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={onDragEnd}
    >
      {renderTable()}
    </DndContext>
  ) : (
    renderTable()
  );
}
