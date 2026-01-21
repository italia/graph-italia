import React from "react";
import type { KpiItemType } from "../../types";

export default function Kpi({ data }: { data: KpiItemType }) {
  let border_classes =
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

  return (
    <div className="dv-kpi-item dv-kpi-white-bg">
      <div
        className={`dv-kpi-p-2 dv-kpi-ps-3 ${
          background_color || ""
        } ${border_classes}`}
      >
        <div className="dv-kpi-mid-caption--xlarge dv-kpi-fw-semibold dv-kpi-text-black">
          {title}
        </div>
        <div>
          {value_prefix && (
            <span className="dv-kpi-mid-caption--xxlarge dv-kpi-primary-color-a9 dv-kpi-fw-semibold dv-kpi-me-3">
              {value_prefix}
            </span>
          )}
          <span className="dv-kpi-mid-caption--xxlarge dv-kpi-primary-color-a9 dv-kpi-fw-semibold">
            {value}
          </span>

          {value_suffix && (
            <span className="dv-kpi-mid-caption--xxlarge dv-kpi-primary-color-a9 dv-kpi-fw-semibold dv-kpi-ms-3">
              {value_suffix}
            </span>
          )}
          {percentage && (
            <span className="dv-kpi-mid-caption--xsmall dv-kpi-ms-1">
              {percentage}
            </span>
          )}

          {show_flow && (
            <span
              className={`${
                flow_direction == "+" ? "dv-kpi-bg-success" : "dv-kpi-bg-danger"
              } dv-kpi-text-white dv-kpi-py-1 dv-kpi-px-1 dv-kpi-rounded dv-kpi-ms-1 dv-kpi-mid-caption--xsmall`}
            >
              {flow_value && (
                <span className="dv-kpi-fw-semibold">
                  <span
                    className="dv-kpi-me-1"
                    dangerouslySetInnerHTML={{
                      __html: flow_direction == "+" ? "&#8593;" : "&#8595;",
                    }}
                  />
                  {flow_value}
                </span>
              )}
              {flow_detail && (
                <span className="dv-kpi-ms-1">{flow_detail}</span>
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
  );
}
