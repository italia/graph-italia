import {
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import {
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  type SortingState,
  type VisibilityState,
} from "@tanstack/react-table";
import React, { useEffect } from "react";
import "./dataTable.css";
import { DataTableContent } from "./DataTableContent";
import { DataTableExport } from "./DataTableExport";
import { DataTableToolbar } from "./DataTableToolbar";
import ScrollButton from "./ScrollButton";
import {
  convertMatrixToTableData,
  createTableColumns,
  defaultFormatNumber,
  extractHeaderRow,
  getFirstColumnId,
  useFadePresence,
  useHorizontalScrollArrows,
  type DataTableProps,
} from "./utils";

export default function DataTable(props: DataTableProps) {
  const { data, id, formatNumber, formatValue, showFilters = true } = props;

  const { wrapperRef, showLeftArrow, showRightArrow, scrollBy } =
    useHorizontalScrollArrows();
  const leftFade = useFadePresence(showLeftArrow, 180);
  const rightFade = useFadePresence(showRightArrow, 180);
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnOrder, setColumnOrder] = React.useState<string[]>([]);
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [isFilterOpen, setIsFilterOpen] = React.useState(false);

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
        formatValue,
      }),
    [headerRow, firstColumnId, format, formatValue]
  );

  const tableData = React.useMemo(
    () => convertMatrixToTableData(data, headerRow),
    [data, headerRow]
  );

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 0,
      },
    })
  );

  const table = useReactTable({
    data: tableData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    state: { sorting, columnOrder, columnVisibility },
    onSortingChange: setSorting,
    onColumnOrderChange: setColumnOrder,
    onColumnVisibilityChange: setColumnVisibility,
  });

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    setColumnOrder((prev) => {
      const oldIndex = prev.indexOf(active.id as string);
      const newIndex = prev.indexOf(over.id as string);
      if (oldIndex === -1 || newIndex === -1) return prev;
      return arrayMove(prev, oldIndex, newIndex);
    });
  };

  useEffect(() => {
    if (headerRow && headerRow.length > 0) {
      setColumnOrder(headerRow.map((h) => String(h)));
    }
  }, [headerRow]);

  if (!hasData) {
    return null;
  }

  return (
    <div className="mid-table-outer">
      <DataTableToolbar
        table={table as any}
        showFilters={showFilters}
        isFilterOpen={isFilterOpen}
        onToggleFilters={() => setIsFilterOpen((prev) => !prev)}
        onCloseFilters={() => setIsFilterOpen(false)}
      />
      <DataTableContent
        table={table as any}
        id={id}
        firstColumnId={firstColumnId}
        wrapperRef={wrapperRef as React.RefObject<HTMLDivElement | null>}
        columnOrder={columnOrder}
        sensors={sensors}
        onDragEnd={handleDragEnd}
      />
      <DataTableExport table={table as any} id={id} />
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
