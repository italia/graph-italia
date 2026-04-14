import { useTranslation } from "react-i18next";

export default function Footer() {
  const { t } = useTranslation("components", {
    keyPrefix: "components.layout.footer",
  });
  const brand = t(`brand.title`);
  const tagline = t(`brand.tagline`);

  return (
    <footer className="footer bg-accent text-accent-content p-4">
      <div>
        <p className="text-lg font-bold m-0">{brand}</p>
        {tagline && <p className="m-0">{tagline}</p>}
      </div>
      <nav
        aria-label={t(`navLabel`, { defaultValue: "Link del footer" })}
        className="grid-flow-col gap-4 md:place-self-center md:justify-self-end"
      >
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
