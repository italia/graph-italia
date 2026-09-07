import { useTranslation } from "react-i18next";

/**
 * Light/dark switch. The control is a single role="switch" whose accessible
 * name is the option it turns on ("Tema scuro"): checked means dark is
 * active, unchecked means light is active. Putting the current theme in the
 * name ("Tema: Chiaro" + unchecked) made screen readers announce
 * "Tema chiaro, non attivo" while light was the active theme (#129).
 */
export default function ThemeSwitcherComponent(props: {
  currentTheme: "light" | "dark";
  handleChange: (value: string) => void;
  /** Optional contextual prefix for the accessible name (e.g. "Anteprima grafico"). */
  contextLabel?: string;
}) {
  const { currentTheme, handleChange, contextLabel } = props;
  const { t } = useTranslation("components", {
    keyPrefix: "components.themeSwitcher",
  });
  const switchLabel = t("switchLabel", "Tema scuro");
  const ariaLabel = contextLabel ? `${contextLabel}: ${switchLabel}` : switchLabel;
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
