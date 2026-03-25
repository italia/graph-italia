import { useTranslation } from "react-i18next";

export default function Footer() {
  const { t } = useTranslation("components", {
    keyPrefix: "components.layout.footer",
  });
  return (
    <footer className="footer bg-accent text-accent-content p-4">
      <aside>
        <p>
          <span className="text-lg font-bold">{t(`brand.title`)}</span>:{" "}
          <em> {t(`brand.tagline`)}</em>
        </p>
      </aside>
      <nav className="grid-flow-col gap-4 md:place-self-center md:justify-self-end">
        <a href="/quickstart" className="underline">
          {t(`links.quickstart.label`)}
        </a>
        <a href="/terms-of-service" className="underline">
          {t(`links.tos.label`)}
        </a>
        <a href="/gdpr" className="underline">
          {t(`links.privacy.label`)}
        </a>
      </nav>
    </footer>
  );
}
