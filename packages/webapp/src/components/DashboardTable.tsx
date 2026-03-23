import dayjs from "dayjs";
import { useCallback, useRef } from "react";
import DataTable, { type TableColumn } from "react-data-table-component";
import {
  FaEye,
  FaLink,
  FaPenToSquare,
  FaTrashCan,
} from "react-icons/fa6";
import { useNavigate } from "react-router-dom";

import type { FieldDataType } from "../types";
import { useAriaSort } from "../hooks/useAriaSort";
import { useSettingsStore } from "../store/settings_store.ts";
import registerDarkTheme from "./layout/DataTableDarkTheme.ts";
import { useState } from "react";

registerDarkTheme();

type DashboardTableProps = {
  list: FieldDataType[];
  handleDeleteDashboard: (id: string) => void;
  handleEditDashboard: (item: FieldDataType) => void;
  handleViewDashboard: (id: string) => void;
};

export default function DashboardTable({
  list,
  handleDeleteDashboard,
  handleEditDashboard,
  handleViewDashboard,
}: DashboardTableProps) {
  const { settings } = useSettingsStore();
  const currentTheme = settings?.preferredTheme === "dark" ? "dark" : "default";
  const actionColor = currentTheme === "dark" ? "#fff" : "#111";
  const actionSize = 16;

  const [sortState, setSortState] = useState<{
    columnKey: string;
    direction: "asc" | "desc";
  } | null>(null);
  const tableRef = useRef<HTMLDivElement>(null);
  useAriaSort(tableRef, sortState);

  const handleSort = useCallback(
    (
      column: TableColumn<FieldDataType>,
      direction: "asc" | "desc",
    ) => {
      const key = typeof column.name === "string" ? column.name : "";
      if (key) setSortState({ columnKey: key, direction });
    },
    [],
  );

  const navigate = useNavigate();

  const columns: TableColumn<FieldDataType>[] = [
    {
      name: "Name",
      selector: (row) => row.name ?? "",
      sortable: true,
      cell: (row) => (
        <div className="text-md font-medium">{row.name}</div>
      ),
    },
    {
      name: "Description",
      selector: (row) => row.description ?? "",
      sortable: true,
      cell: (row) => (
        <div className="text-sm text-base-content/70 truncate max-w-xs">
          {row.description || "—"}
        </div>
      ),
    },
    {
      name: "Visibility",
      cell: (row) => (
        <span className="text-sm">
          {row.publish ? "Public" : "Private"}
        </span>
      ),
    },
    {
      name: "Created",
      selector: (row) => row.createdAt ?? "",
      sortable: true,
      cell: (row) =>
        row.createdAt ? dayjs(row.createdAt).format("YYYY-MM-DD HH:mm") : "—",
    },
    {
      name: "Updated",
      selector: (row) => row.updatedAt ?? "",
      sortable: true,
      cell: (row) =>
        row.updatedAt ? dayjs(row.updatedAt).format("YYYY-MM-DD HH:mm") : "—",
    },
    {
      name: "Actions",
      cell: (row) => (
        <div className="flex gap-2">
          <button
            type="button"
            aria-label="view"
            className="btn btn-ghost btn-xs btn-square"
            onClick={() => handleViewDashboard(row.id ?? "")}
          >
            <FaEye fill={actionColor} size={actionSize} aria-hidden="true" />
          </button>
          <button
            type="button"
            aria-label="edit"
            className="btn btn-ghost btn-xs btn-square"
            onClick={() => handleEditDashboard(row)}
          >
            <FaPenToSquare fill={actionColor} size={actionSize} aria-hidden="true" />
          </button>
          <a
            href={`/display/dashboards/${row.id}`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="open published dashboard"
            className="btn btn-ghost btn-xs btn-square"
          >
            <FaLink fill={actionColor} size={actionSize} aria-hidden="true" />
          </a>
          <button
            type="button"
            aria-label="delete"
            className="btn btn-ghost btn-xs btn-square"
            onClick={() => handleDeleteDashboard(row.id ?? "")}
          >
            <FaTrashCan fill={actionColor} size={actionSize} aria-hidden="true" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div ref={tableRef}>
      <DataTable
        columns={columns}
        data={list}
        theme={currentTheme}
        onSort={handleSort}
        onRowClicked={(row) => navigate(`/edit/dashboard/${row.id}`)}
        pagination
        highlightOnHover
      />
    </div>
  );
}
