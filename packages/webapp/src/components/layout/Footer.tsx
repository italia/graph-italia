import { useTranslation } from "react-i18next";

export default function Footer() {
  const { t } = useTranslation();
  const TRANSLATE_KEY_PATH = "components.layout.footer";
  const TRANSLATE_KEY_PATH_BRAND = `${TRANSLATE_KEY_PATH}.brand`;
  const TRANSLATE_KEY_PATH_LINKS = `${TRANSLATE_KEY_PATH}.links`;
  return (
    <footer className="footer bg-secondary text-secondary-content p-4">
      <aside>
        <p>
          <span className="text-lg font-bold">
            {t(`${TRANSLATE_KEY_PATH_BRAND}.title`)}
          </span>
          : <em> {t(`${TRANSLATE_KEY_PATH_BRAND}.tagline`)}</em>
        </p>
      </aside>
      <nav className="grid-flow-col gap-4 md:place-self-center md:justify-self-end">
        <a href="/quickstart" className="underline">
          {t(`${TRANSLATE_KEY_PATH_LINKS}.quickstart.label`)}
        </a>
        <a href="/terms-of-service" className="underline">
          {t(`${TRANSLATE_KEY_PATH_LINKS}.tos.label`)}
        </a>
        <a href="/gdpr" className="underline">
          {t(`${TRANSLATE_KEY_PATH_LINKS}.privacy.label`)}
        </a>
      </nav>
    </footer>
  );
}
