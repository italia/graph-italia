import type { ReactNode } from "react";
import { Trans, useTranslation } from "react-i18next";
import { ROUTES } from "../../router";

function NewWindowLink({ href, children }: { href: string; children?: ReactNode }) {
  const { t } = useTranslation("components", {
    keyPrefix: "components.auth.termsAcceptance",
  });
  return (
    <a
      className="link link-primary font-semibold"
      target="_blank"
      rel="noopener noreferrer"
      href={href}
    >
      {children}
      <span className="sr-only"> {t("newWindow")}</span>
    </a>
  );
}

/**
 * "Ho letto e accetto i termini e le condizioni e la privacy policy", with both
 * documents opening in a new window. `i18nKey` picks the variant: the checkbox
 * label or the note shown once acceptance is already recorded.
 */
export default function TermsAcceptanceText({
  i18nKey = "label",
}: {
  i18nKey?: "label" | "alreadyAccepted";
}) {
  const { t } = useTranslation("components", {
    keyPrefix: "components.auth.termsAcceptance",
  });
  return (
    <Trans
      t={t}
      i18nKey={i18nKey}
      components={{
        termsLink: <NewWindowLink href={ROUTES.legalNotes} />,
        privacyLink: <NewWindowLink href={ROUTES.privacy} />,
      }}
    />
  );
}
