import { useTranslation } from "react-i18next";
import { PASSWORD_RULES } from "./passwordRules";

function RuleIcon({ met }: { met: boolean }) {
  if (met) {
    return (
      <svg
        aria-hidden="true"
        className="shrink-0 size-3.5"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M20 6 9 17l-5-5" />
      </svg>
    );
  }
  return (
    <svg
      aria-hidden="true"
      className="shrink-0 size-3.5"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
    >
      <circle cx="12" cy="12" r="9" />
    </svg>
  );
}

function PasswordRequirements({
  password,
  visible,
}: {
  password: string;
  visible: boolean;
}) {
  const { t } = useTranslation("components", {
    keyPrefix: "components.auth.passwordRequirements",
  });

  if (!visible) {
    return null;
  }

  return (
    <ul className="mt-2 space-y-1 text-sm" aria-live="polite" role="status">
      {PASSWORD_RULES.map((rule) => {
        const met = rule.test(password);
        return (
          <li
            key={rule.key}
            className={`flex items-center gap-2 ${
              met ? "text-success" : "text-base-content/60"
            }`}
          >
            <RuleIcon met={met} />
            <span>{t(`items.${rule.key}`)}</span>
            <span className="sr-only">
              {met ? t(`status.met`) : t(`status.unmet`)}
            </span>
          </li>
        );
      })}
    </ul>
  );
}

export default PasswordRequirements;
