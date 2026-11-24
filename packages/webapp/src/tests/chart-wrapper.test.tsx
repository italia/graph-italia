import { describe, expect, it, vi } from "vitest";
import { useState } from "react";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import itResources from "../i18n/locales/it";
import ChartWrapperSettings from "../components/ChartWrapperSettings";
import {
  DEFAULT_WRAPPER,
  toWrapperProps,
  withWrapperDefaults,
  type ChartWrapperSettings as Settings,
} from "../lib/chartWrapper";
import { renderWithI18n } from "./helpers/renderWithI18n";

describe("toWrapperProps", () => {
  it("leaves empty title and subtitle out, so ChartWrapper falls back on name and description", () => {
    const { info } = toWrapperProps({ enabled: true, title: "  ", subTitle: "", text: "Note" });
    expect(info.title).toBeUndefined();
    expect(info.subTitle).toBeUndefined();
    expect(info.text).toBe("Note");
  });

  it("keeps the texts that are filled in", () => {
    const { info } = toWrapperProps({
      enabled: true,
      title: "Titolo",
      subTitle: "Sottotitolo",
      sourceTextInfo: "[ISTAT](https://www.istat.it)",
      chartFooterText: "Valori in migliaia",
    });
    expect(info).toMatchObject({
      title: "Titolo",
      subTitle: "Sottotitolo",
      sourceTextInfo: "[ISTAT](https://www.istat.it)",
      chartFooterText: "Valori in migliaia",
    });
  });

  it("a wrapper saved with only `enabled` gets the default buttons", () => {
    const props = toWrapperProps({ enabled: true });
    expect(props).toMatchObject({
      showHeading: true,
      enableDownloadData: true,
      enableDownloadImage: true,
      showDataTransposed: false,
      showPoweredBy: false,
    });
    expect(props.shareFunction).toBeUndefined();
  });

  it("the share button calls back only when enabled", () => {
    const share = vi.fn();
    expect(toWrapperProps({ enabled: true, enableShare: false }, share).shareFunction).toBeUndefined();
    toWrapperProps({ enabled: true, enableShare: true }, share).shareFunction?.("share-link-x");
    expect(share).toHaveBeenCalledOnce();
  });

  it("withWrapperDefaults: off by default, saved values win", () => {
    expect(withWrapperDefaults(null)).toEqual(DEFAULT_WRAPPER);
    expect(withWrapperDefaults({ enabled: true, enableDownloadData: false })).toMatchObject({
      enabled: true,
      enableDownloadData: false,
      enableDownloadImage: true,
    });
  });
});

function Harness({ initial = DEFAULT_WRAPPER, onChange }: { initial?: Settings; onChange?: (s: Settings) => void }) {
  const [value, setValue] = useState(initial);
  return (
    <ChartWrapperSettings
      value={value}
      onChange={(v) => {
        setValue(v);
        onChange?.(v);
      }}
      chartName="Vendite 2025"
      chartDescription="Vendite mensili per regione"
    />
  );
}

describe("ChartWrapperSettings form", () => {
  it("shows the wrapper fields only once the switch is on", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    renderWithI18n(<Harness onChange={onChange} />, { resources: itResources });

    expect(screen.queryByLabelText("Titolo del wrapper")).toBeNull();
    await user.click(screen.getByRole("switch", { name: "Mostra con wrapper" }));

    expect(onChange).toHaveBeenLastCalledWith(expect.objectContaining({ enabled: true }));
    expect(screen.getByLabelText("Titolo del wrapper")).toHaveAttribute("placeholder", "Vendite 2025");
    expect(screen.getByLabelText("Descrizione del wrapper")).toHaveAttribute(
      "placeholder",
      "Vendite mensili per regione",
    );
    expect(screen.getByRole("switch", { name: /download dei dati/i })).toBeChecked();
    expect(screen.getByRole("switch", { name: /Condividi/ })).not.toBeChecked();
  });

  it("saves texts and switches in the settings", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    renderWithI18n(<Harness initial={{ ...DEFAULT_WRAPPER, enabled: true }} onChange={onChange} />, {
      resources: itResources,
    });

    await user.type(screen.getByLabelText("Fonte dei dati"), "ISTAT");
    await user.click(screen.getByRole("switch", { name: /Condividi/ }));

    expect(onChange).toHaveBeenLastCalledWith(
      expect.objectContaining({ enabled: true, sourceTextInfo: "ISTAT", enableShare: true }),
    );
  });

  it("has no axe violations with all the fields shown", async () => {
    const { container } = renderWithI18n(<Harness initial={{ ...DEFAULT_WRAPPER, enabled: true }} />, {
      resources: itResources,
    });
    expect(await axe(container)).toHaveNoViolations();
  });
});
