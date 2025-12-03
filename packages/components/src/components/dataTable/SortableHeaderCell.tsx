import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { Header } from "@tanstack/react-table";
import { flexRender } from "@tanstack/react-table";
import React from "react";
import { getSortIndicator } from "./utils";

type TableRecord = Record<string, unknown>;

export type SortableHeaderProps = {
  header: Header<TableRecord, unknown>;
  reorderAriaLabel: string;
};

export function SortableHeaderCell({
  header,
  reorderAriaLabel,
}: SortableHeaderProps) {
  const sorted = header.column.getIsSorted() as "asc" | "desc" | false;

  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useSortable({
      id: header.column.id,
    });

  const style: React.CSSProperties = {
    opacity: isDragging ? 0.85 : 1,
    position: "relative",
    // Usa translate invece di transform per evitare "schiacciamenti" del contenuto
    transform: CSS.Translate.toString(transform),
    transition: "width transform 0.2s ease-in-out",
    whiteSpace: "nowrap",
  };

  const sortHandler = header.column.getToggleSortingHandler();

  return (
    <th
      ref={setNodeRef}
      scope="col"
      style={style}
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
          {flexRender(header.column.columnDef.header, header.getContext())}{" "}
          {getSortIndicator(sorted)}
        </span>
      )}
      <button
        type="button"
        {...attributes}
        {...listeners}
        onClick={(e) => {
          e.stopPropagation();
        }}
        style={{
          cursor: "grab",
          marginLeft: "0.25rem",
          background: "transparent",
          border: "none",
          padding: 0,
        }}
        aria-label={reorderAriaLabel}
      >
        🟰
      </button>
    </th>
  );
}
