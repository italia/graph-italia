import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import GenericDialog from "./layout/GenericDialog";
import GeoPresetSelect from "./GeoPresetSelect";

// Opens as soon as a new map is created, so the territory is picked up front
// rather than buried in the configuration step.
//
// The choice is held as a draft and only committed on confirm: dismissing the
// dialog leaves the default preset that was applied when it opened, so a map
// is never left without boundaries by accident.
function GeoPresetDialog({
  open,
  presetId,
  onConfirm,
  onCancel,
}: {
  open: boolean;
  presetId: string;
  onConfirm: (presetId: string) => void;
  onCancel: () => void;
}) {
  const { t } = useTranslation("components", {
    keyPrefix: "components.geoPresets",
  });

  const [draftPresetId, setDraftPresetId] = useState(presetId);

  useEffect(() => {
    if (open) setDraftPresetId(presetId);
  }, [open, presetId]);

  return (
    <GenericDialog
      toggle={open}
      title={t("dialog.title")}
      description={t("dialog.description")}
      labels={{
        cancel: t("dialog.cancel"),
        confirm: t("dialog.confirm"),
      }}
      confirmCb={() => onConfirm(draftPresetId)}
      cancelCb={onCancel}
    >
      <GeoPresetSelect
        id="geo-preset-dialog-select"
        value={draftPresetId}
        onChange={setDraftPresetId}
      />
    </GenericDialog>
  );
}

export default GeoPresetDialog;
