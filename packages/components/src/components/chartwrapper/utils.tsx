import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export function cleanupInfoText(text: string) {
  return text ? text.replace(new RegExp("&gt;", "g"), ">") : "";
}

export function formatUpdatedAt(
  updatedAt: string | number | Date | undefined | null,
  locale: string = "it-IT"
) {
  if (!updatedAt) return "";
  try {
    const dateOptions: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "numeric",
      day: "numeric",
    };
    return new Date(`${updatedAt}`).toLocaleDateString(locale, dateOptions);
  } catch {
    return "";
  }
}

export function computePanelHeights(
  rowHeight: number | undefined,
  hFactor: number | undefined,
  configH: number | string | undefined,
  fallback: number = 600
) {
  const factor = typeof hFactor === "number" ? hFactor : 1;
  const rawHeight =
    typeof rowHeight === "number"
      ? rowHeight * factor
      : typeof configH === "number"
      ? configH
      : typeof configH === "string"
      ? parseInt(configH, 10) || fallback
      : fallback;
  const panelHeightNum =
    typeof rawHeight === "number"
      ? rawHeight
      : parseInt(String(rawHeight), 10) || fallback;
  const panelHeight = `${panelHeightNum}px`;
  return { panelHeightNum, panelHeight };
}

export function createMarkdownRenderer(labelSource?: string) {
  function LinkRenderer(props: any) {
    return (
      <a
        href={props.href}
        className='cw-link'
        target='_blank'
        aria-label={`${labelSource || "Fonte dati"}`}
        rel='noreferrer'
      >
        {props.children}
      </a>
    );
  }
  return function MarkdownRenderer({
    children,
  }: {
    children: string | undefined | null;
  }) {
    return (
      <ReactMarkdown components={{ a: LinkRenderer }} remarkPlugins={[remarkGfm]}>
        {children}
      </ReactMarkdown>
    );
  };
}

export function observeElementHeight(
  getElement: () => HTMLElement | null,
  onHeight: (heightPx: number) => void
) {

  function measure() {
    try {
      const el = getElement();
      if (!el) {
        onHeight(0);
        return;
      }
      const h = Math.ceil(el.getBoundingClientRect().height);
      onHeight(h || 0);
    } catch {
      onHeight(0);
    }
  }

  measure();

  window.addEventListener("resize", measure);
  
  // ResizeObserver
  let ro: ResizeObserver | null = null;
  if (typeof window !== "undefined" && "ResizeObserver" in window) {
    ro = new ResizeObserver(measure);
    const el = getElement();
    if (el) ro.observe(el);
  }

  // Cleanup
  return () => {
    window.removeEventListener("resize", measure);
    if (ro) ro.disconnect();
  };
}


