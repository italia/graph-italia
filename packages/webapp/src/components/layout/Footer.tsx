import { useTranslation } from "react-i18next";

export default function Footer() {
  const { t } = useTranslation("components", {
    keyPrefix: "components.layout.footer",
  });
  const tagline = t(`brand.tagline`);

  return (
    <footer className="footer bg-accent text-accent-content p-4 lg:px-10 py-6">
      <div>
        <div className="flex items-center">
          <img className="w-12 h-12 shrink-0 text-primary-content" aria-hidden="true" src="/logo_header.svg" alt="" />
          <div>
            <span className="block font-semibold text-2xl leading-tight">{t(`brand.title`)}</span>
            {tagline && (
              <p className="text-sm font-normal m-0 mt-0.5 ml-0.5">
                {tagline}
              </p>
            )}
          </div>
        </div>
        {/* Ente di appartenenza nel footer, come da UI Kit: "è un progetto di"
            + logo dell'ente (stesso modello di Designers Italia). */}
        <p className="m-0 mt-3 text-sm">
          <span className="font-semibold">{t(`brand.title`)}</span>{" "}
          {t(`brand.projectOf`)}
        </p>
        <a
          href="https://innovazione.gov.it/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block mt-2"
        >
          <img
            src="/footer-logo-dipartimento.png"
            alt={t(`brand.projectOwner`)}
            className="h-10 w-auto"
          />
          <span className="sr-only">{t(`license.newWindow`)}</span>
        </a>
      </div>
      <nav
        aria-label={t(`navLabel`, { defaultValue: "Link del footer" })}
        className="grid-flow-col gap-4 md:place-self-center md:justify-self-end"
      >
        <span>
          {t(`license.prefix`)}{" "}
          <a
            href="https://www.gnu.org/licenses/gpl-3.0.html"
            target="_blank"
            rel="noopener noreferrer"
            className="underline inline-flex items-center gap-1"
          >
            {t(`license.name`)}
            <svg
              className="w-4 h-4 shrink-0"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
              focusable="false"
            >
              <path d="M14 3v2h3.59l-9.3 9.29 1.42 1.42L19 6.41V10h2V3h-7zM19 19H5V5h7V3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-7h-2v7z" />
            </svg>
            <span className="sr-only">{t(`license.newWindow`)}</span>
          </a>
        </span>
        <a href="/terms-of-service" className="underline">
          {t(`links.tos.label`)}
        </a>
        <a href="/gdpr" className="underline">
          {t(`links.privacy.label`)}
        </a>
        <a
          href="https://form.agid.gov.it/PCM/Graph_Italia/dichiarazione"
          target="_blank"
          rel="noopener noreferrer"
          className="underline inline-flex items-center gap-1"
        >
          {t(`links.accessibility.label`)}
          <svg
            className="w-4 h-4 shrink-0"
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden="true"
            focusable="false"
          >
            <path d="M14 3v2h3.59l-9.3 9.29 1.42 1.42L19 6.41V10h2V3h-7zM19 19H5V5h7V3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-7h-2v7z" />
          </svg>
          <span className="sr-only">{t(`license.newWindow`)}</span>
        </a>
      </nav>
    </footer>
  );
}
