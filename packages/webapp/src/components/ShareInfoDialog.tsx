import { FaCopy } from "react-icons/fa6";
import { useTranslation } from "react-i18next";
import Dialog from "./layout/Dialog";
import { type ShareInfo } from "../lib/shareInfo";

type ShareInfoDialogProps = {
  /** null quando la dialog è chiusa */
  share: ShareInfo | null;
  onClose: () => void;
  onCopy: (text: string) => () => void;
};

/**
 * Mostra API URL, id e host di un grafico o di una dashboard; ogni riga ha il
 * proprio pulsante che ne copia il solo valore. Condivisa da ChartTable e
 * DashboardTable.
 */
export default function ShareInfoDialog({
  share,
  onClose,
  onCopy,
}: ShareInfoDialogProps) {
  const { t } = useTranslation("components", {
    keyPrefix: "components.shareInfoDialog",
  });

  const rows: { key: keyof ShareInfo; label: string }[] = [
    { key: "apiUrl", label: t("apiUrl", { defaultValue: "API URL" }) },
    { key: "id", label: t("id", { defaultValue: "ID" }) },
    { key: "host", label: t("host", { defaultValue: "Host" }) },
  ];

  return (
    <Dialog
      toggle={share ? true : false}
      title={t("title", { defaultValue: "API URL, ID e host" })}
      callback={onClose}
    >
      {share && (
        <div className="flex flex-col gap-4 p-4">
          {rows.map(({ key, label }) => (
            <div key={key} className="flex items-end justify-between gap-2">
              <div className="min-w-0">
                <div className="text-sm font-medium">{label}</div>
                <p className="font-mono text-sm break-all">{share[key]}</p>
              </div>
              <button
                type="button"
                aria-label={t("copyValue", {
                  defaultValue: "Copia {{label}}",
                  label,
                })}
                title={t("copyValue", {
                  defaultValue: "Copia {{label}}",
                  label,
                })}
                className="btn btn-ghost btn-xs btn-square shrink-0"
                onClick={onCopy(share[key])}
              >
                <FaCopy aria-hidden="true" />
              </button>
            </div>
          ))}
        </div>
      )}
    </Dialog>
  );
}
