import React from "react";
import type { KpiItemType } from "../../types";
import { useResolvedTheme } from "../../context/ColorSchemeContext";
import PoweredBy from "../PoweredBy";

type HeadingLevel = "h2" | "h3" | "h4" | "h5" | "h6";

export default function Kpi({
  data,
  poweredByLabel,
  titleAs = "h3",
  labels,
}: {
  data: KpiItemType;
  poweredByLabel?: string;
  titleAs?: HeadingLevel;
  labels?: {
    increase?: string;
    decrease?: string;
  };
}) {
  const resolvedTheme = useResolvedTheme();
  const themeClass = typeof resolvedTheme === "string" ? resolvedTheme : "";
  const border_classes =
    "dv-kpi-primary-border-color-a9 dv-kpi-border dv-kpi-border-end-0 dv-kpi-border-top-0 dv-kpi-border-bottom-0 dv-kpi-border-4";

  const {
    title,
    value,
    percentage,
    background_color,
    value_prefix,
    value_suffix,
    show_flow,
    flow_value,
    flow_direction,
    flow_detail,
    footer_text,
  } = data;

  let bgClass = "";
  let bgStyle: React.CSSProperties | undefined;
  if (background_color === "accent") {
    bgClass = "dv-kpi-bg-accent";
  } else if (background_color) {
    bgStyle = { backgroundColor: background_color };
  }

  const Heading = titleAs;

  const isIncrease = flow_direction === "+";
  const flowDirectionLabel =
    labels?.[isIncrease ? "increase" : "decrease"] ??
    (isIncrease ? "in aumento" : "in diminuzione");

  const valueAriaLabel = [value_prefix, value, value_suffix]
    .filter(Boolean)
    .join(" ");

  const groupAriaLabel = [title, valueAriaLabel].filter(Boolean).join(": ");

  return (
    <div className={`${themeClass} dv-kpi-item-wrapper`}>
      <div
        className="dv-kpi-item dv-kpi-bg"
        role="group"
        aria-label={groupAriaLabel || undefined}
      >
        <div
          className={`dv-kpi-p-2 dv-kpi-ps-3 ${bgClass} ${border_classes}`}
          style={bgStyle}
        >
          <Heading className="dv-kpi-mid-caption--xlarge dv-kpi-fw-semibold dv-kpi-text-black dv-kpi-title">
            {title}
          </Heading>
          <div className="dv-kpi-value-row" aria-label={valueAriaLabel || undefined}>
            {value_prefix && (
              <span
                className="dv-kpi-mid-caption--xxlarge dv-kpi-primary-color-a9 dv-kpi-fw-semibold dv-kpi-me-3"
                aria-hidden="true"
              >
                {value_prefix}
              </span>
            )}
            <span
              className="dv-kpi-mid-caption--xxlarge dv-kpi-primary-color-a9 dv-kpi-fw-semibold"
              aria-hidden="true"
            >
              {value}
            </span>

            {value_suffix && (
              <span
                className="dv-kpi-mid-caption--xxlarge dv-kpi-primary-color-a9 dv-kpi-fw-semibold dv-kpi-ms-3"
                aria-hidden="true"
              >
                {value_suffix}
              </span>
            )}
            {percentage && (
              <span className="dv-kpi-mid-caption dv-kpi-ms-3">
                {percentage}
              </span>
            )}

            {show_flow && (
              <span
                className={`${
                  isIncrease ? "dv-kpi-bg-success" : "dv-kpi-bg-danger"
                } dv-kpi-text-white dv-kpi-py-1 dv-kpi-px-3 dv-kpi-rounded dv-kpi-ms-3 dv-kpi-mid-caption`}
                role="status"
                aria-label={`${flowDirectionLabel}${
                  flow_value ? ` ${flow_value}` : ""
                }${flow_detail ? ` ${flow_detail}` : ""}`}
              >
                {flow_value && (
                  <span className="dv-kpi-fw-semibold">
                    <span
                      className="dv-kpi-me-3"
                      aria-hidden="true"
                      dangerouslySetInnerHTML={{
                        __html: isIncrease ? "&#8593;" : "&#8595;",
                      }}
                    />
                    <span aria-hidden="true">{flow_value}</span>
                  </span>
                )}
                {flow_detail && (
                  <span className="dv-kpi-ms-3" aria-hidden="true">
                    {flow_detail}
                  </span>
                )}
              </span>
            )}
          </div>
          {footer_text && (
            <div className="dv-kpi-mid-caption dv-kpi-pt-1 dv-kpi-mt-3 dv-kpi-border-top dv-kpi-border-secondary">
              {footer_text}
            </div>
          )}
        </div>
      </div>
      <PoweredBy label={poweredByLabel} />
    </div>
  );
}
