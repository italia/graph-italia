import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { BsFillTrashFill, BsPencilFill } from "react-icons/bs";

interface KpiDropdownProps {
  title: string;
  onEdit: () => void;
  onDelete: () => void;
}

function KpiDropdown({ title, onEdit, onDelete }: KpiDropdownProps) {
  const { t } = useTranslation("pages", {
    keyPrefix: "charts.editKpiGroup.components.kpiDropdown",
  });
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event: Event) => {
      if (
        dropdownRef.current &&
        !(dropdownRef.current as any).contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleEdit = () => {
    onEdit();
    setIsOpen(false);
  };

  const handleDelete = () => {
    onDelete();
    setIsOpen(false);
  };

  return (
    <div ref={dropdownRef} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="btn btn-xs btn-primary btn-outline m-1"
      >
        {title}
      </button>

      {isOpen && (
        <ul className="menu absolute top-full left-0 mt-1 bg-base-300 rounded-box z-10 w-32 p-2 shadow-lg border">
          <li>
            <span className="text-sm" onClick={handleEdit}>
              <BsPencilFill />
              {t("actions.edit.label")}
            </span>
          </li>
          <li>
            <span className="text-sm" onClick={handleDelete}>
              <BsFillTrashFill />
              {t("actions.delete.label")}
            </span>
          </li>
        </ul>
      )}
    </div>
  );
}

export { KpiDropdown };
