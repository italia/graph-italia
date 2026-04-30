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
        <div className="flex items-center">
          <img className="w-12 h-12 shrink-0 text-primary-content" aria-hidden="true" src="/logo_header.svg" alt={t(`brand.title`)} />
          <div>
            <span className="block font-semibold text-2xl leading-tight">{t(`brand.title`)}</span>
            {tagline && (
              <p className="text-sm font-normal m-0 mt-0.5 ml-0.5">
                {tagline}
              </p>
            )}
          </div>
        </div>
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
