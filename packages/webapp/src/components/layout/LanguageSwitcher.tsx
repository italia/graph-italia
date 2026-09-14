import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import type { AppLanguage } from "../../lib/store/settings_store";

const LANGUAGES: Record<AppLanguage, { label: string; name: string }> = {
  it: { label: "ITA", name: "Italiano" },
  en: { label: "ENG", name: "English" },
};

const LANGUAGE_CODES = Object.keys(LANGUAGES) as AppLanguage[];

export default function LanguageSwitcher(props: {
  currentLanguage: AppLanguage;
  handleChange: (language: AppLanguage) => void;
}) {
  const { currentLanguage, handleChange } = props;
  const { t } = useTranslation("components", {
    keyPrefix: "components.languageSwitcher",
  });
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const optionRefs = useRef<Partial<Record<AppLanguage, HTMLButtonElement | null>>>({});

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (open) {
      optionRefs.current[currentLanguage]?.focus();
    }
  }, [open, currentLanguage]);

  const close = (refocusTrigger: boolean) => {
    setOpen(false);
    if (refocusTrigger) triggerRef.current?.focus();
  };

  const moveFocus = (from: AppLanguage, delta: number) => {
    const index = LANGUAGE_CODES.indexOf(from);
    const next = LANGUAGE_CODES[(index + delta + LANGUAGE_CODES.length) % LANGUAGE_CODES.length];
    optionRefs.current[next]?.focus();
  };

  const handleOptionKeyDown = (code: AppLanguage) => (event: React.KeyboardEvent) => {
    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        moveFocus(code, 1);
        break;
      case "ArrowUp":
        event.preventDefault();
        moveFocus(code, -1);
        break;
      case "Home":
        event.preventDefault();
        optionRefs.current[LANGUAGE_CODES[0]]?.focus();
        break;
      case "End":
        event.preventDefault();
        optionRefs.current[LANGUAGE_CODES[LANGUAGE_CODES.length - 1]]?.focus();
        break;
      case "Escape":
        event.preventDefault();
        close(true);
        break;
      case "Tab":
        setOpen(false);
        break;
    }
  };

  const handleTriggerKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      setOpen(true);
    } else if (event.key === "Escape" && open) {
      event.preventDefault();
      close(true);
    }
  };

  const current = LANGUAGES[currentLanguage];

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        ref={triggerRef}
        className="inline-flex items-center gap-1 text-sm px-1.5 py-0.5 rounded bg-transparent border-none cursor-pointer opacity-90 hover:opacity-100 transition-opacity duration-150"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={`${t("label")}: ${current.name}`}
        onClick={() => setOpen((v) => !v)}
        onKeyDown={handleTriggerKeyDown}
      >
        <span>{current.label}</span>
        <svg
          className={`w-3 h-3 fill-current shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          aria-hidden="true"
          viewBox="0 0 24 24"
        >
          <path d="M11.6 15.4 6 9.8l.7-.8 4.9 4.9L16.5 9l.7.8z" />
        </svg>
      </button>

      {open && (
        <ul
          role="listbox"
          aria-label={t("label")}
          className="absolute right-0 top-full mt-1 z-[1100] min-w-[7rem] py-1 bg-base-100 text-base-content rounded shadow-[0_0.5rem_1rem_rgba(0,0,0,0.15)] list-none m-0 p-0"
        >
          {(Object.entries(LANGUAGES) as [AppLanguage, { label: string; name: string }][]).map(
            ([code, { name }]) => (
              <li key={code} role="none">
                <button
                  type="button"
                  role="option"
                  aria-selected={currentLanguage === code}
                  ref={(el) => {
                    optionRefs.current[code] = el;
                  }}
                  className={`w-full text-left px-4 py-2 text-sm bg-transparent border-none cursor-pointer  hover:bg-base-200 hover: text-base-content transition-colors duration-150 ${currentLanguage === code ? "font-semibold text-primary" : ""
                    }`}
                  onClick={() => {
                    handleChange(code);
                    close(true);
                  }}
                  onKeyDown={handleOptionKeyDown(code)}
                >
                  {name}
                </button>
              </li>
            )
          )}
        </ul>
      )}
    </div>
  );
}
