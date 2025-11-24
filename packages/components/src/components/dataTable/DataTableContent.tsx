import { closestCenter, DndContext, type DragEndEvent } from "@dnd-kit/core";
import {
  horizontalListSortingStrategy,
  SortableContext,
} from "@dnd-kit/sortable";
import type { Header, Table } from "@tanstack/react-table";
import { flexRender } from "@tanstack/react-table";
import React from "react";
import { SortableHeaderCell } from "./SortableHeaderCell";

type TableRecord = Record<string, unknown>;

type DataTableContentProps = {
  table: Table<TableRecord>;
  id?: string;
  firstColumnId?: string;
  wrapperRef: React.RefObject<HTMLDivElement | null>;
  columnOrder: string[];
  sensors: any;
  onDragEnd: (event: DragEndEvent) => void;
};

export function DataTableContent({
  table,
  id,
  firstColumnId,
  wrapperRef,
  columnOrder,
  sensors,
  onDragEnd,
}: DataTableContentProps) {
  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={onDragEnd}
    >
      <div className="mid-table-wrapper" ref={wrapperRef}>
        <table className="mid-table">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                <SortableContext
                  // Se columnOrder è vuoto (inizializzazione), usa l'ordine corrente della tabella
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
                    />
                  ))}
                </SortableContext>
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
    </DndContext>
  );
}
