import { useEffect, useId, useMemo, useState, type KeyboardEvent, type Ref } from "react";
import { useTranslation } from "react-i18next";
import useSWR from "swr";
import * as api from "../../lib/api";
import { createIpaSearch, formatPa, MIN_QUERY_LENGTH, parsePa } from "../../lib/ipa";

const MAX_RESULTS = 50;

/**
 * «PA di appartenenza» picker: autocomplete with fuzzy search over the IndicePA
 * enti (ARIA 1.2 combobox + listbox). `value` is "<codice IPA>#<denominazione>"
 * once an ente is picked from the list, "" while the user is typing: free text
 * is never a valid value.
 */
export default function PaCombobox({
  id,
  value,
  onChange,
  onBlur,
  inputRef,
  invalid,
  describedBy,
}: {
  id: string;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  inputRef?: Ref<HTMLInputElement>;
  invalid?: boolean;
  describedBy?: string;
}) {
  const { t } = useTranslation("components", {
    keyPrefix: "components.auth.paCombobox",
  });
  const listId = useId();
  const statusId = useId();
  const { data: enti, error, isLoading, mutate } = useSWR("ipa-enti", api.getIpaEnti, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });
  const search = useMemo(() => (enti ? createIpaSearch(enti) : null), [enti]);

  const [query, setQuery] = useState(() => (value ? parsePa(value).name : ""));
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);

  const { results, total } = useMemo(
    () => (search && open ? search(query, MAX_RESULTS) : { results: [], total: 0 }),
    [search, query, open],
  );
  const optionId = (i: number) => `${listId}-opt-${i}`;

  useEffect(() => {
    if (active >= 0) document.getElementById(optionId(active))?.scrollIntoView?.({ block: "nearest" });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  function select(ente: api.IpaEnte) {
    onChange(formatPa(ente));
    setQuery(ente.name);
    setOpen(false);
    setActive(-1);
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        if (!open) setOpen(true);
        else if (results.length) setActive((i) => (i + 1) % results.length);
        break;
      case "ArrowUp":
        e.preventDefault();
        if (results.length) setActive((i) => (i <= 0 ? results.length - 1 : i - 1));
        break;
      case "Enter":
        // Never submit the form from here: Enter picks the highlighted ente.
        if (open && active >= 0 && results[active]) {
          e.preventDefault();
          select(results[active]);
        }
        break;
      case "Escape":
        if (open) {
          e.preventDefault();
          setOpen(false);
          setActive(-1);
        }
        break;
    }
  }

  const showList = open && query.trim().length >= MIN_QUERY_LENGTH;
  let status = "";
  if (error) status = t("loadError");
  else if (isLoading) status = t("loading");
  else if (showList) {
    status = results.length
      ? total > results.length
        ? t("moreResults", { count: results.length, total })
        : t("results", { count: results.length })
      : t("noResults");
  }

  return (
    <div className="relative">
      <input
        ref={inputRef}
        id={id}
        type="text"
        role="combobox"
        aria-autocomplete="list"
        aria-expanded={showList && results.length > 0}
        aria-controls={listId}
        aria-activedescendant={showList && active >= 0 ? optionId(active) : undefined}
        aria-invalid={invalid || undefined}
        aria-describedby={[statusId, describedBy].filter(Boolean).join(" ")}
        autoComplete="off"
        placeholder={t("placeholder")}
        className="input input-bordered w-full"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
          setActive(-1);
          if (value) onChange(""); // typing again drops the previous choice
        }}
        onFocus={() => setOpen(true)}
        onBlur={() => {
          setOpen(false);
          setActive(-1);
          onBlur?.();
        }}
        onKeyDown={handleKeyDown}
      />
      <ul
        id={listId}
        role="listbox"
        aria-label={t("listLabel")}
        hidden={!showList || results.length === 0}
        className="absolute z-20 mt-1 max-h-72 w-full overflow-auto rounded-box border border-base-300 bg-base-100 p-1 shadow-lg"
      >
        {showList &&
          results.map((ente, i) => (
            <li
              key={ente.code}
              id={optionId(i)}
              role="option"
              aria-selected={i === active}
              className={`cursor-pointer rounded-field px-3 py-2 ${i === active ? "bg-primary text-primary-content" : "hover:bg-base-200"}`}
              // mousedown, not click: keeps focus in the input (no blur first)
              onMouseDown={(e) => {
                e.preventDefault();
                select(ente);
              }}
              onMouseEnter={() => setActive(i)}
            >
              <span className="block">{ente.name}</span>
              {ente.type && (
                <span className={`block text-xs ${i === active ? "" : "text-base-content/70"}`}>
                  {ente.type}
                </span>
              )}
            </li>
          ))}
      </ul>
      <p
        id={statusId}
        role="status"
        className={error || (open && isLoading) || (showList && !results.length) ? "mt-1 text-sm" : "sr-only"}
      >
        {status}
      </p>
      {error && (
        <button type="button" className="btn btn-link btn-sm px-0" onClick={() => mutate()}>
          {t("retry")}
        </button>
      )}
    </div>
  );
}
