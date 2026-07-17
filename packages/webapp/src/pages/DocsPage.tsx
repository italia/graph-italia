import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Helmet } from "react-helmet";
import { useTranslation } from "react-i18next";
import { Link, Navigate, useParams } from "react-router-dom";
import Layout from "../components/layout";
import { ROUTES } from "../router";

import introduzione from "../docs/it/introduzione.md?raw";
import caricareDati from "../docs/it/caricare-dati.md?raw";
import graficiBarre from "../docs/it/grafici-barre.md?raw";
import graficiLinee from "../docs/it/grafici-linee.md?raw";
import graficiTorta from "../docs/it/grafici-torta.md?raw";
import mappe from "../docs/it/mappe.md?raw";
import kpi from "../docs/it/kpi.md?raw";
import dashboard from "../docs/it/dashboard.md?raw";
import sorgentiDati from "../docs/it/sorgenti-dati.md?raw";
import condivisione from "../docs/it/condivisione.md?raw";
import organizzazioni from "../docs/it/organizzazioni.md?raw";
import api from "../docs/it/api.md?raw";
import strumenti from "../docs/it/strumenti.md?raw";

type Chapter = { slug: string; title: string; content: string };
type ChapterGroup = { label: string; chapters: Chapter[] };

const GROUPS: ChapterGroup[] = [
  {
    label: "Primi passi",
    chapters: [
      { slug: "introduzione", title: "Introduzione", content: introduzione },
      { slug: "caricare-dati", title: "Caricare i dati", content: caricareDati },
    ],
  },
  {
    label: "Visualizzazioni",
    chapters: [
      { slug: "grafici-barre", title: "Grafico a barre", content: graficiBarre },
      { slug: "grafici-linee", title: "Grafico a linee", content: graficiLinee },
      { slug: "grafici-torta", title: "Grafico a torta", content: graficiTorta },
      { slug: "mappe", title: "Mappe", content: mappe },
      { slug: "kpi", title: "Gruppi KPI", content: kpi },
      { slug: "dashboard", title: "Dashboard", content: dashboard },
    ],
  },
  {
    label: "Dati e collaborazione",
    chapters: [
      { slug: "sorgenti-dati", title: "Sorgenti dati", content: sorgentiDati },
      { slug: "condivisione", title: "Pubblicare e condividere", content: condivisione },
      { slug: "organizzazioni", title: "Progetti e organizzazioni", content: organizzazioni },
    ],
  },
  {
    label: "Per chi sviluppa",
    chapters: [
      { slug: "api", title: "API REST", content: api },
      { slug: "strumenti", title: "Strumenti", content: strumenti },
    ],
  },
];

const ALL_CHAPTERS = GROUPS.flatMap((group) => group.chapters);

/** Internal links in the markdown go through the SPA router. */
function MarkdownLink({
  href,
  children,
}: {
  href?: string;
  children?: React.ReactNode;
}) {
  if (href && href.startsWith("/")) {
    return (
      <Link to={href} className="link link-primary">
        {children}
      </Link>
    );
  }
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className="link link-primary">
      {children}
    </a>
  );
}

export default function DocsPage() {
  const { section } = useParams();
  const { t } = useTranslation("menu");

  const current = ALL_CHAPTERS.find((chapter) => chapter.slug === section);
  if (!section) return <Navigate to={ROUTES.docs(ALL_CHAPTERS[0].slug)} replace />;
  if (!current) return <Navigate to={ROUTES.docs()} replace />;

  const docsLabel = t("menu.items.docs.label", { defaultValue: "Documentazione" });

  return (
    <Layout>
      <Helmet>
        <title>
          {docsLabel}: {current.title}
        </title>
      </Helmet>
      <div className="px-4 lg:px-10 py-8 flex flex-col lg:flex-row gap-8 items-start">
        <nav
          aria-label={docsLabel}
          className="w-full lg:w-64 shrink-0 lg:sticky lg:top-6"
        >
          <h1 className="text-xl font-bold mb-4">{docsLabel}</h1>
          <ul className="menu w-full p-0 gap-1">
            <li>
              <Link to={ROUTES.quickStart} className="font-normal">
                Come iniziare
              </Link>
            </li>
            {GROUPS.map((group) => (
              <li key={group.label}>
                <span className="menu-title text-base uppercase opacity-60 px-3 pt-4">
                  {group.label}
                </span>
                <ul className="p-0 gap-1">
                  {group.chapters.map((chapter) => (
                    <li key={chapter.slug}>
                      <Link
                        to={ROUTES.docs(chapter.slug)}
                        aria-current={chapter.slug === current.slug ? "page" : undefined}
                        className={
                          chapter.slug === current.slug
                            ? "active font-normal"
                            : "font-normal"
                        }
                      >
                        {chapter.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </nav>

        <article className="prose max-w-3xl min-w-0 grow bg-base-100 border border-base-300 rounded-xl p-8 [--tw-prose-body:var(--color-base-content)] [--tw-prose-headings:var(--color-base-content)] [--tw-prose-bold:var(--color-base-content)] [--tw-prose-links:var(--color-primary)] [--tw-prose-bullets:var(--color-base-content)] [--tw-prose-counters:var(--color-base-content)] [--tw-prose-quotes:var(--color-base-content)] [--tw-prose-code:var(--color-base-content)] [--tw-prose-th-borders:var(--color-base-300)] [--tw-prose-td-borders:var(--color-base-300)]">
          <ReactMarkdown remarkPlugins={[remarkGfm]} components={{ a: MarkdownLink }}>
            {current.content}
          </ReactMarkdown>
        </article>
      </div>
    </Layout>
  );
}
