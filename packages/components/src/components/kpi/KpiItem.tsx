import React from "react";
import type { KpiItemType } from "../../types";

export default function Kpi({ data }: { data: KpiItemType }) {
  let border_classes =
    "primary-border-color-a9 border border-end-0 border-top-0 border-bottom-0 border-4";

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
    <div className='kpi-item white-bg'>
      <div className={`p-2 ps-3 ${background_color || ""} ${border_classes}`}>
        <div className='mid-caption--xlarge fw-semibold.text-black'>
          {title}
        </div>
        <div>
          {value_prefix && (
            <span className='mid-caption--xxlarge primary-color-a9 fw-semibold me-3'>
              {value_prefix}
            </span>
          )}
          <span className='mid-caption--xxlarge primary-color-a9 fw-semibold'>
            {value}
          </span>

          {value_suffix && (
            <span className='mid-caption--xxlarge primary-color-a9 fw-semibold ms-3'>
              {value_suffix}
            </span>
          )}
          {percentage && (
            <span className='mid-caption--xsmall ms-1'>{percentage}</span>
          )}

          {show_flow && (
            <span
              className={`${
                flow_direction == "+" ? "bg-success" : "bg-danger"
              } text-white py-1 px-1 rounded ms-1 mid-caption--xsmall`}
            >
              {flow_value && (
                <span className='font-semibold'>
                  <span
                    className='me-1'
                    dangerouslySetInnerHTML={{
                      __html: flow_direction == "+" ? "&#8593;" : "&#8595;",
                    }}
                  />
                  {flow_value}
                </span>
              )}
              {flow_detail && <span className='ms-1'>{flow_detail}</span>}
            </span>
          )}
        </div>
        {footer_text && (
          <div className='mid-caption pt-1 mt-3 border-top border-secondary'>
            {footer_text}
          </div>
        )}
      </div>
    </div>
  );
}
