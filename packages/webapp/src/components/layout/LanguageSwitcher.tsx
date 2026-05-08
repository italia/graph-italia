import { useEffect, useRef, useState } from "react";
import type { AppLanguage } from "../../lib/store/settings_store";

const LANGUAGES: Record<AppLanguage, { label: string; name: string }> = {
  it: { label: "ITA", name: "Italiano" },
  en: { label: "ENG", name: "English" },
};

export default function LanguageSwitcher(props: {
  currentLanguage: AppLanguage;
  handleChange: (language: AppLanguage) => void;
}) {
  const { currentLanguage, handleChange } = props;
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const current = LANGUAGES[currentLanguage];

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        className="inline-flex items-center gap-1 text-sm px-1.5 py-0.5 rounded bg-transparent border-none cursor-pointer opacity-90 hover:opacity-100 transition-opacity duration-150"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
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
        <ul className="absolute right-0 top-full mt-1 z-[1100] min-w-[7rem] py-1 bg-base-100 text-base-content rounded shadow-[0_0.5rem_1rem_rgba(0,0,0,0.15)] list-none m-0 p-0">
          {(Object.entries(LANGUAGES) as [AppLanguage, { label: string; name: string }][]).map(
            ([code, { name }]) => (
              <li key={code}>
                <button
                  type="button"
                  className={`w-full text-left px-4 py-2 text-sm bg-transparent border-none cursor-pointer  hover:bg-base-200 hover: text-base-content transition-colors duration-150 ${currentLanguage === code ? "font-semibold text-primary" : ""
                    }`}
                  onClick={() => {
                    handleChange(code);
                    setOpen(false);
                  }}
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
