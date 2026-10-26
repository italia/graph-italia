import type { ComponentPropsWithoutRef } from "react";
import Markdown from "react-markdown";
import { Link } from "react-router-dom";
import remarkGfm from "remark-gfm";
import Layout from "../../components/layout";

/** Data di "ultimo aggiornamento" comune ai documenti legali (versione 21.10.26). */
export const LEGAL_LAST_UPDATED = "21 ottobre 2026";

// Link interni via router; esterni in nuova finestra, annunciata agli screen reader.
function MarkdownLink({ href = "", children }: ComponentPropsWithoutRef<"a">) {
  if (href.startsWith("/")) return <Link to={href}>{children}</Link>;
  if (href.startsWith("http")) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer">
        {children}
        <span className="sr-only"> (si apre in una nuova finestra)</span>
      </a>
    );
  }
  return <a href={href}>{children}</a>;
}

/**
 * Pagina pubblica per un documento legale (informativa privacy, note legali,
 * nomina a responsabile). I testi sono solo in italiano, qualunque sia la lingua
 * dell'interfaccia: il contenuto è il testo giuridico approvato.
 */
export default function LegalPage({ content }: { content: string }) {
  return (
    <Layout>
      <div className="relative px-4 py-14">
        <article lang="it" className="prose mx-auto max-w-4xl pb-24 lg:pb-32">
          <Markdown remarkPlugins={[remarkGfm]} components={{ a: MarkdownLink }}>
            {content}
          </Markdown>
        </article>
      </div>
    </Layout>
  );
}
