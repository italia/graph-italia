import { useTranslation } from "react-i18next";

export default function ThemeSwitcherComponent(props: {
  currentTheme: "light" | "dark";
  handleChange: (value: string) => void;
  /** Optional contextual prefix for the accessible label (e.g. "Anteprima grafico"). */
  contextLabel?: string;
}) {
  const { currentTheme, handleChange, contextLabel } = props;
  const { t } = useTranslation("components", {
    keyPrefix: "components.themeSwitcher",
  });
  const stateLabel = t(currentTheme === "dark" ? "values.dark" : "values.light");
  const baseLabel = t("label");
  const ariaLabel = contextLabel
    ? `${contextLabel} — ${baseLabel}: ${stateLabel}`
    : `${baseLabel}: ${stateLabel}`;
  return (
    <div className="flex p-2 rounded-lg ">
      <label className="flex items-center gap-4 cursor-pointer">
        <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
        <input
          type="checkbox"
          role="switch"
          className="toggle toggle-sm"
          checked={currentTheme === "dark"}
          aria-label={ariaLabel}
          onChange={(e) => handleChange(e.target.checked ? "dark" : "light")}
        />
        <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"  >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
        </svg>
      </label>
    </div>
  );
}
