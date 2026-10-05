import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Helmet } from "react-helmet";
import { useTranslation } from "react-i18next";
import { Link, Navigate, useParams } from "react-router-dom";
import Layout from "../components/layout";
import { ROUTES } from "../router";

import type { AppLanguage } from "../lib/store/settings_store";

import itIntroduzione from "../docs/it/introduzione.md?raw";
import itCaricareDati from "../docs/it/caricare-dati.md?raw";
import itGraficiBarre from "../docs/it/grafici-barre.md?raw";
import itGraficiLinee from "../docs/it/grafici-linee.md?raw";
import itGraficiTorta from "../docs/it/grafici-torta.md?raw";
import itMappe from "../docs/it/mappe.md?raw";
import itKpi from "../docs/it/kpi.md?raw";
import itDashboard from "../docs/it/dashboard.md?raw";
import itSorgentiDati from "../docs/it/sorgenti-dati.md?raw";
import itCondivisione from "../docs/it/condivisione.md?raw";
import itOrganizzazioni from "../docs/it/organizzazioni.md?raw";
import itApi from "../docs/it/api.md?raw";
import itStrumenti from "../docs/it/strumenti.md?raw";

import enIntroduzione from "../docs/en/introduzione.md?raw";
import enCaricareDati from "../docs/en/caricare-dati.md?raw";
import enGraficiBarre from "../docs/en/grafici-barre.md?raw";
import enGraficiLinee from "../docs/en/grafici-linee.md?raw";
import enGraficiTorta from "../docs/en/grafici-torta.md?raw";
import enMappe from "../docs/en/mappe.md?raw";
import enKpi from "../docs/en/kpi.md?raw";
import enDashboard from "../docs/en/dashboard.md?raw";
import enSorgentiDati from "../docs/en/sorgenti-dati.md?raw";
import enCondivisione from "../docs/en/condivisione.md?raw";
import enOrganizzazioni from "../docs/en/organizzazioni.md?raw";
import enApi from "../docs/en/api.md?raw";
import enStrumenti from "../docs/en/strumenti.md?raw";

// Chapter slugs are language-independent so /docs/<slug> links keep working
// whatever the UI language; the sidebar titles come from pages.json ("docs").
const SLUGS = [
  "introduzione",
  "caricare-dati",
  "grafici-barre",
  "grafici-linee",
  "grafici-torta",
  "mappe",
  "kpi",
  "dashboard",
  "sorgenti-dati",
  "condivisione",
  "organizzazioni",
  "api",
  "strumenti",
] as const;
type Slug = (typeof SLUGS)[number];

const CONTENT: Record<AppLanguage, Record<Slug, string>> = {
  it: {
    introduzione: itIntroduzione,
    "caricare-dati": itCaricareDati,
    "grafici-barre": itGraficiBarre,
    "grafici-linee": itGraficiLinee,
    "grafici-torta": itGraficiTorta,
    mappe: itMappe,
    kpi: itKpi,
    dashboard: itDashboard,
    "sorgenti-dati": itSorgentiDati,
    condivisione: itCondivisione,
    organizzazioni: itOrganizzazioni,
    api: itApi,
    strumenti: itStrumenti,
  },
  en: {
    introduzione: enIntroduzione,
    "caricare-dati": enCaricareDati,
    "grafici-barre": enGraficiBarre,
    "grafici-linee": enGraficiLinee,
    "grafici-torta": enGraficiTorta,
    mappe: enMappe,
    kpi: enKpi,
    dashboard: enDashboard,
    "sorgenti-dati": enSorgentiDati,
    condivisione: enCondivisione,
    organizzazioni: enOrganizzazioni,
    api: enApi,
    strumenti: enStrumenti,
  },
};

type ChapterGroup = { key: string; chapters: Slug[] };

const GROUPS: ChapterGroup[] = [
  { key: "gettingStarted", chapters: ["introduzione", "caricare-dati"] },
  {
    key: "visualizations",
    chapters: ["grafici-barre", "grafici-linee", "grafici-torta", "mappe", "kpi", "dashboard"],
  },
  {
    key: "dataAndCollaboration",
    chapters: ["sorgenti-dati", "condivisione", "organizzazioni"],
  },
  { key: "developers", chapters: ["api", "strumenti"] },
];

const isSlug = (value: string | undefined): value is Slug =>
  SLUGS.includes(value as Slug);

/** Markdown for a chapter in the current language, falling back to Italian. */
function chapterContent(slug: Slug, language: string): string {
  const lang = (language in CONTENT ? language : "it") as AppLanguage;
  return CONTENT[lang][slug];
}

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
  const { t, i18n } = useTranslation("menu");
  const { t: tDocs } = useTranslation("pages", { keyPrefix: "docs" });

  if (!section) return <Navigate to={ROUTES.docs(SLUGS[0])} replace />;
  if (!isSlug(section)) return <Navigate to={ROUTES.docs()} replace />;

  const current = {
    slug: section,
    title: tDocs(`chapters.${section}`),
    content: chapterContent(section, i18n.language),
  };

  const docsLabel = t("menu.items.docs.label", { defaultValue: "Documentazione" });
  const quickStartLabel = t("menu.items.quickStart.label", { defaultValue: "Come iniziare" });

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
          <h2 className="text-xl font-bold mb-4">{docsLabel}</h2>
          <ul className="menu w-full p-0 gap-1">
            <li>
              <Link to={ROUTES.quickStart} className="font-normal">
                {quickStartLabel}
              </Link>
            </li>
            {GROUPS.map((group) => (
              <li key={group.key}>
                <span className="menu-title text-base uppercase opacity-70 px-3 pt-4">
                  {tDocs(`groups.${group.key}`)}
                </span>
                <ul className="p-0 gap-1">
                  {group.chapters.map((slug) => (
                    <li key={slug}>
                      <Link
                        to={ROUTES.docs(slug)}
                        aria-current={slug === current.slug ? "page" : undefined}
                        className={
                          slug === current.slug
                            ? "active font-normal"
                            : "font-normal"
                        }
                      >
                        {tDocs(`chapters.${slug}`)}
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
