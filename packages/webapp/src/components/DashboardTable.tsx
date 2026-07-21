import dayjs from "dayjs";
import { useCallback, useRef } from "react";
import DataTable, { type TableColumn } from "react-data-table-component";
import { FaLink, FaPenToSquare, FaTrashCan } from "react-icons/fa6";
import { Link, useNavigate } from "react-router-dom";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useAriaSort } from "../hooks/useAriaSort";
import { usePaginationSelectKeyboard } from "../hooks/usePaginationSelectKeyboard";
import { useSettingsStore } from "../lib/store/settings_store.ts";
import { ROUTES } from "../router.tsx";
import type { FieldDataType } from "../types";
import registerDarkTheme from "./layout/DataTableDarkTheme.ts";
import dataTableStyles, {
  TABLE_COL,
  TABLE_HIDE,
  TABLE_NAME_MIN_WIDTH,
} from "./layout/dataTableStyles.ts";
import { paginationIcons } from "./layout/paginationIcons";

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
}: DashboardTableProps) {
  const { t } = useTranslation("components", {
    keyPrefix: "components.dashboardTable",
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
    (column: TableColumn<FieldDataType>, direction: "asc" | "desc") => {
      const key = typeof column.name === "string" ? column.name : "";
      if (key) setSortState({ columnKey: key, direction });
    },
    [],
  );

  const navigate = useNavigate();

  const columns: TableColumn<FieldDataType>[] = [
    {
      name: t(`columns.name.label`),
      minWidth: TABLE_NAME_MIN_WIDTH,
      grow: 1,
      selector: (row) => row.name ?? "",
      sortable: true,
      // The row is clickable but never focusable, so the name carries the
      // keyboard route to the editor (WCAG 2.1.1).
      cell: (row) => (
        <div className="text-md font-medium py-1">
          <Link
            to={ROUTES.editDashboard(row.id ?? "")}
            onClick={(event) => event.stopPropagation()}
            className="link link-hover"
          >
            {row.name}
          </Link>
        </div>
      ),
    },
    {
      name: t(`columns.visibility.label`),
      width: TABLE_COL.visibility,
      hide: TABLE_HIDE.onTablet,
      cell: (row) => (
        <span className="text-sm">
          {row.publish
            ? t(`columns.visibility.values.public`, { defaultValue: "Pubblico" })
            : t(`columns.visibility.values.private`, { defaultValue: "Privato" })}
        </span>
      ),
    },
    {
      name: t(`columns.createdAt.label`),
      width: TABLE_COL.date,
      hide: TABLE_HIDE.onTablet,
      selector: (row) => row.createdAt ?? "",
      sortable: true,
      cell: (row) =>
        row.createdAt ? dayjs(row.createdAt).format("YYYY-MM-DD HH:mm") : "—",
    },
    {
      name: t(`columns.updatedAt.label`),
      width: TABLE_COL.date,
      hide: TABLE_HIDE.onMobile,
      selector: (row) => row.updatedAt ?? "",
      sortable: true,
      cell: (row) =>
        row.updatedAt ? dayjs(row.updatedAt).format("YYYY-MM-DD HH:mm") : "—",
    },
    {
      name: t(`columns.actions.label`),
      width: TABLE_COL.actions,
      cell: (row) => (
        <div className="flex gap-2">
          {/* <button
            type="button"
            aria-label="view"
            className="btn btn-ghost btn-xs btn-square"
            onClick={() => handleViewDashboard(row.id ?? "")}
          >
            <FaEye fill={actionColor} size={actionSize} aria-hidden="true" />
          </button> */}
          <button
            type="button"
            aria-label={t("actions.edit", { defaultValue: "Modifica" })}
            title={t("actions.edit", { defaultValue: "Modifica" })}
            className="btn btn-ghost btn-xs btn-square"
            onClick={() => handleEditDashboard(row)}
          >
            <FaPenToSquare
              fill={actionColor}
              size={actionSize}
              aria-hidden="true"
            />
          </button>
          {/* A private dashboard's public URL always answers 401: no link */}
          {row.publish && (
            <a
              href={ROUTES.viewDashboard(row.id ?? "")}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={t("actions.view", { defaultValue: "Apri dashboard pubblicata" })}
              title={t("actions.view", { defaultValue: "Apri dashboard pubblicata" })}
              className="btn btn-ghost btn-xs btn-square"
            >
              <FaLink fill={actionColor} size={actionSize} aria-hidden="true" />
            </a>
          )}
          <button
            type="button"
            aria-label={t("actions.delete", { defaultValue: "Elimina" })}
            title={t("actions.delete", { defaultValue: "Elimina" })}
            className="btn btn-ghost btn-xs btn-square"
            onClick={() => handleDeleteDashboard(row.id ?? "")}
          >
            <FaTrashCan
              fill={actionColor}
              size={actionSize}
              aria-hidden="true"
            />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div ref={tableRef}>
      <DataTable
        ariaLabel={t("tableLabel", { defaultValue: "Le mie dashboard" })}
        columns={columns}
        data={list}
        theme={currentTheme}
        onSort={handleSort}
        onRowClicked={(row) => navigate(ROUTES.editDashboard(row.id ?? ""))}
        pagination
        paginationComponentOptions={{
          rowsPerPageText: t("pagination.rowsPerPage", { defaultValue: "Righe per pagina:" }),
          rangeSeparatorText: t("pagination.rangeSeparator", { defaultValue: "di" }),
          selectAllRowsItem: false,
        }}
        {...paginationIcons}
        customStyles={dataTableStyles}
        highlightOnHover
        noDataComponent={
          <div className="py-10 text-base-content/70">{t(`noDataComponent`)}</div>
        }
      />
    </div>
  );
}
