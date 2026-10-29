import type { ComponentPropsWithoutRef } from "react";
import Markdown from "react-markdown";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import remarkGfm from "remark-gfm";
import Layout from "../../components/layout";

/** Data di "ultimo aggiornamento" comune ai documenti legali (versione 21.10.26). */
export const LEGAL_LAST_UPDATED = "21 ottobre 2026";
export const LEGAL_LAST_UPDATED_EN = "21 October 2026";

type LegalLanguage = "it" | "en";

const NEW_WINDOW: Record<LegalLanguage, string> = {
  it: " (si apre in una nuova finestra)",
  en: " (opens in a new window)",
};

// Mostrata sopra la traduzione: il testo giuridico approvato è quello italiano.
const TRANSLATION_NOTICE =
  "This English translation is provided for information only. The Italian version is the only legally binding text.";

function makeMarkdownLink(lang: LegalLanguage) {
  // Link interni via router; esterni in nuova finestra, annunciata agli screen reader.
  return function MarkdownLink({ href = "", children }: ComponentPropsWithoutRef<"a">) {
    if (href.startsWith("/")) return <Link to={href}>{children}</Link>;
    if (href.startsWith("http")) {
      return (
        <a href={href} target="_blank" rel="noopener noreferrer">
          {children}
          <span className="sr-only">{NEW_WINDOW[lang]}</span>
        </a>
      );
    }
    return <a href={href}>{children}</a>;
  };
}

const LINKS: Record<LegalLanguage, ReturnType<typeof makeMarkdownLink>> = {
  it: makeMarkdownLink("it"),
  en: makeMarkdownLink("en"),
};

/**
 * Pagina pubblica per un documento legale (informativa privacy, note legali,
 * nomina a responsabile), nella lingua dell'interfaccia. Il testo vincolante è
 * quello italiano: la versione inglese è una traduzione di cortesia e lo dice.
 */
export default function LegalPage({ content }: { content: Record<LegalLanguage, string> }) {
  const { i18n } = useTranslation();
  const lang: LegalLanguage = i18n.language?.startsWith("en") ? "en" : "it";
  return (
    <Layout>
      <div className="relative px-4 py-14">
        <article lang={lang} className="prose mx-auto max-w-4xl pb-24 lg:pb-32">
          {lang === "en" && (
            <p className="alert alert-info not-prose mb-8">{TRANSLATION_NOTICE}</p>
          )}
          <Markdown remarkPlugins={[remarkGfm]} components={{ a: LINKS[lang] }}>
            {content[lang]}
          </Markdown>
        </article>
      </div>
    </Layout>
  );
}
