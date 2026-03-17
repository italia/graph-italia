import { useTranslation } from "react-i18next";

type ToggleTableColumnsProps = {
  columnOrder: string[];
  visibleColumns: Set<string>;
  onToggle: (colName: string) => void;
};

export default function ToggleTableColumns({
  columnOrder,
  visibleColumns,
  onToggle,
}: ToggleTableColumnsProps) {
  const { t } = useTranslation();

  return (
    <div className="my-4">
      <h4 className="text-sm font-semibold mb-2 text-base-content/70">
        {/* {t(`table.actions.toggleColumns.label`)} */}
        Toggle Columns
      </h4>
      <div className="flex flex-wrap gap-2">
        {columnOrder.map((colName) => (
          <label
            key={colName}
            className={`flex items-center gap-1.5 px-2 py-1 rounded-md cursor-pointer text-xs border transition-colors ${visibleColumns.has(colName)
                ? "bg-primary/10 border-primary/30 text-primary"
                : "bg-base-200 border-base-300 text-base-content/40 line-through"
              }`}
          >
            <input
              type="checkbox"
              checked={visibleColumns.has(colName)}
              onChange={() => onToggle(colName)}
              className="checkbox checkbox-xs checkbox-primary"
            />
            {colName}
          </label>
        ))}
      </div>
    </div>
  );
}
