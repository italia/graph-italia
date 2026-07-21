import dayjs from "dayjs";
import { useCallback, useRef, useState } from "react";
import DataTable, { type TableColumn } from "react-data-table-component";
import { FaPenToSquare, FaTrashCan } from "react-icons/fa6";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import type { DatasourceItem } from "../lib/api";
import { useAriaSort } from "../hooks/useAriaSort";
import { usePaginationSelectKeyboard } from "../hooks/usePaginationSelectKeyboard";
import { useSettingsStore } from "../lib/store/settings_store.ts";
import { ROUTES } from "../router.tsx";
import registerDarkTheme from "./layout/DataTableDarkTheme.ts";
import dataTableStyles, {
  TABLE_COL,
  TABLE_HIDE,
  TABLE_NAME_MIN_WIDTH,
} from "./layout/dataTableStyles.ts";
import { paginationIcons } from "./layout/paginationIcons";

registerDarkTheme();

type DataSourceTableProps = {
  list: DatasourceItem[];
  handleDelete: (id: string) => void;
  handleEdit: (item: DatasourceItem) => void;
};

export default function DataSourceTable({
  list,
  handleDelete,
  handleEdit,
}: DataSourceTableProps) {
  const { t } = useTranslation("components", {
    keyPrefix: "components.datasourceTable",
  });
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
  usePaginationSelectKeyboard(tableRef);

  const handleSort = useCallback(
    (column: TableColumn<DatasourceItem>, direction: "asc" | "desc") => {
      const key = typeof column.name === "string" ? column.name : "";
      if (key) setSortState({ columnKey: key, direction });
    },
    [],
  );

  const navigate = useNavigate();

  const columns: TableColumn<DatasourceItem>[] = [
    {
      name: t("columns.name.label", { defaultValue: "Name" }),
      minWidth: TABLE_NAME_MIN_WIDTH,
      grow: 1,
      selector: (row) => row.name ?? "",
      sortable: true,
      // The row is clickable but never focusable, so the name carries the
      // keyboard route to the editor (WCAG 2.1.1).
      cell: (row) => (
        <div className="text-md font-medium py-1">
          <Link
            to={ROUTES.editDataSource(row.id)}
            onClick={(event) => event.stopPropagation()}
            className="link link-hover"
          >
            {row.name}
          </Link>
        </div>
      ),
    },
    {
      name: t("columns.visibility.label", { defaultValue: "Visibility" }),
      width: TABLE_COL.visibility,
      hide: TABLE_HIDE.onTablet,
      cell: (row) => (
        <span className="text-sm">
          {row.publish
            ? t("columns.visibility.values.public", { defaultValue: "Public" })
            : t("columns.visibility.values.private", { defaultValue: "Private" })}
        </span>
      ),
    },
    {
      name: t("columns.source.label", { defaultValue: "Source" }),
      width: TABLE_COL.source,
      hide: TABLE_HIDE.onMobile,
      cell: (row) => (
        <span className="badge badge-outline badge-sm">
          {row.isRemote
            ? t("columns.source.values.remote", { defaultValue: "Remote" })
            : t("columns.source.values.local", { defaultValue: "Local" })}
        </span>
      ),
    },
    {
      name: t("columns.createdAt.label", { defaultValue: "Created" }),
      width: TABLE_COL.date,
      hide: TABLE_HIDE.onTablet,
      selector: (row) => row.createdAt ?? "",
      sortable: true,
      cell: (row) =>
        row.createdAt ? dayjs(row.createdAt).format("YYYY-MM-DD HH:mm") : "—",
    },
    {
      name: t("columns.updatedAt.label", { defaultValue: "Updated" }),
      width: TABLE_COL.date,
      hide: TABLE_HIDE.onMobile,
      selector: (row) => row.updatedAt ?? "",
      sortable: true,
      cell: (row) =>
        row.updatedAt ? dayjs(row.updatedAt).format("YYYY-MM-DD HH:mm") : "—",
    },
    {
      name: t("columns.actions.label", { defaultValue: "Actions" }),
      width: TABLE_COL.actions,
      cell: (row) => (
        <div className="flex gap-2">
          <button
            type="button"
            aria-label={t("actions.edit", { defaultValue: "Edit" })}
            title={t("actions.edit", { defaultValue: "Edit" })}
            className="btn btn-ghost btn-xs btn-square"
            onClick={() => handleEdit(row)}
          >
            <FaPenToSquare fill={actionColor} size={actionSize} aria-hidden="true" />
          </button>
          <button
            type="button"
            aria-label={t("actions.delete", { defaultValue: "Delete" })}
            title={t("actions.delete", { defaultValue: "Delete" })}
            className="btn btn-ghost btn-xs btn-square"
            onClick={() => handleDelete(row.id)}
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
        ariaLabel={t("tableLabel", { defaultValue: "Sorgenti dati" })}
        columns={columns}
        data={list}
        theme={currentTheme}
        onSort={handleSort}
        onRowClicked={(row) => navigate(ROUTES.editDataSource(row.id))}
        pagination
        paginationComponentOptions={{
          rowsPerPageText: t("pagination.rowsPerPage", { defaultValue: "Rows per page:" }),
          rangeSeparatorText: t("pagination.rangeSeparator", { defaultValue: "of" }),
          selectAllRowsItem: false,
        }}
        {...paginationIcons}
        customStyles={dataTableStyles}
        highlightOnHover
        noDataComponent={
          <div className="py-10 text-base-content/70">
            {t("noDataComponent", { defaultValue: "No data sources found" })}
          </div>
        }
      />
    </div>
  );
}
