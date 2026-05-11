import { useState } from "react";
import { useTranslation } from "react-i18next";
import Layout from "../components/layout";
import { useUserStore } from "../lib/store/user_store";
import { HOME_ROUTE } from "../router";

// ── Types ─────────────────────────────────────────────────────────────────────

interface FeatureItem {
  emoji: string;
  title: string;
  description: string;
}

interface StepItem {
  title: string;
  body: string;
}

interface LevelItem {
  badge: string;
  icon: string;
  title: string;
  description: string;
}

interface StackItem {
  layer: string;
  items: string[];
}

// ── Constants ─────────────────────────────────────────────────────────────────

const CHART_SNIPPET = `import { ChartProvider } from 'graph-italia-components';

// Renders a single chart by ID — fetches config and data automatically
<ChartProvider
  apiKey="dv_your_project_key"
  endpoint="https://your-server-api.com"
  chartId="unique-chart-id-123"
/>

// With full wrapper UI (tabs, data table, download) and dark-mode detection
<ChartProvider
  apiKey="dv_your_project_key"
  endpoint="https://your-server-api.com"
  chartId="unique-chart-id-123"
  withWrapper
  detectUserPrefColorsSchema
/>`;

const DASHBOARD_SNIPPET = `import { DashboardGridProvider } from 'graph-italia-components';

// Renders a full dashboard grid by ID — all slots fetched automatically
<DashboardGridProvider
  apiKey="dv_your_project_key"
  endpoint="https://your-server-api.com"
  dashboardId="unique-dashboard-id-123"
/>

// With heading, custom row height and system colour-scheme detection
<DashboardGridProvider
  apiKey="dv_your_project_key"
  endpoint="https://your-server-api.com"
  dashboardId="unique-dashboard-id-123"
  showHeading
  rowHeight={400}
  detectUserPrefColorsSchema
/>`;

const NPM_INSTALL = "npm install graph-italia-components";

// ── Sub-components ────────────────────────────────────────────────────────────

function GitHubIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  );
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 20 20"
      fill="currentColor"
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-xs font-bold uppercase tracking-[0.15em] text-primary">
      {children}
    </span>
  );
}

function SectionHeading({
  id,
  children,
}: {
  id?: string;
  children: React.ReactNode;
}) {
  return (
    <h2
      id={id}
      className="mt-3 text-3xl font-extrabold tracking-tight text-base-content sm:text-4xl [text-wrap:balance]"
    >
      {children}
    </h2>
  );
}

function Divider() {
  return <div className="h-px w-full bg-base-content/10" aria-hidden="true" />;
}

function CodeBlock({
  code,
  copyLabel,
  copiedLabel,
  note,
}: {
  code: string;
  copyLabel: string;
  copiedLabel: string;
  note: string;
}) {
  const [copied, setCopied] = useState(false);

  const copy = () => {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="rounded-2xl bg-neutral overflow-hidden shadow-lg">
      <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-content/10">
        <div className="flex gap-1.5" aria-hidden="true">
          <span className="h-3 w-3 rounded-full bg-error/50" />
          <span className="h-3 w-3 rounded-full bg-warning/50" />
          <span className="h-3 w-3 rounded-full bg-success/50" />
        </div>
        <button
          type="button"
          onClick={copy}
          className="btn btn-ghost btn-xs gap-1.5 text-neutral-content/50 hover:text-neutral-content"
          aria-label={copyLabel}
        >
          {copied ? (
            <>
              <CheckIcon className="w-4 h-4 text-success" />
              <span className="text-success">{copiedLabel}</span>
            </>
          ) : (
            <>
              <svg
                className="w-4 h-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.5}
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184"
                />
              </svg>
              {copyLabel}
            </>
          )}
        </button>
      </div>
      <pre className="p-5 text-xs leading-relaxed text-neutral-content/80 overflow-x-auto font-mono whitespace-pre">
        {code}
      </pre>
      <p className="px-5 pb-4 text-xs text-neutral-content/40 italic">{note}</p>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function AboutPage() {
  const { user } = useUserStore();
  const { t } = useTranslation("about");

  const features = t("features.items", { returnObjects: true }) as FeatureItem[];
  const steps = t("integration.steps", { returnObjects: true }) as StepItem[];
  const levels = t("adoption.levels", { returnObjects: true }) as LevelItem[];
  const stack = t("architecture.stack", { returnObjects: true }) as StackItem[];
  const badges = t("hero.badges", { returnObjects: true }) as string[];

  return (
    <Layout>
      <div className="relative isolate z-0 overflow-x-hidden">
        {/* Grid background */}
        <svg
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-[-1] h-full w-full stroke-base-content/10 [mask-image:radial-gradient(100%_60%_at_top_center,white,transparent)]"
        >
          <defs>
            <pattern
              id="about-grid"
              x="50%"
              y={-1}
              width={200}
              height={200}
              patternUnits="userSpaceOnUse"
            >
              <path d="M100 200V.5M.5 .5H200" fill="none" />
            </pattern>
          </defs>
          <rect
            fill="url(#about-grid)"
            width="100%"
            height="100%"
            strokeWidth={0}
          />
        </svg>

        {/* ══════════════════════════════════════════════════════════════════
            HERO
           ══════════════════════════════════════════════════════════════════ */}
        <section
          className="relative flex flex-col justify-center pt-20 pb-28 lg:pt-32 lg:pb-40"
          aria-label="Hero"
        >
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center">
            <p className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary mb-8">
              <span
                className="relative flex h-2 w-2 rounded-full bg-primary"
                aria-hidden="true"
              />
              {t("hero.chip")}
            </p>

            <h1 className="text-4xl font-extrabold tracking-tight text-base-content sm:text-5xl lg:text-6xl xl:text-7xl leading-tight [text-wrap:balance]">
              {t("hero.headline1")}{" "}
              <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent py-1 inline-block">
                {t("hero.headlineGradient")}
              </span>{" "}
              {t("hero.headline2")}
            </h1>

            <p className="mt-6 text-lg leading-8 text-base-content/65 max-w-3xl mx-auto sm:text-xl [text-wrap:balance]">
              {t("hero.subheadline")}
            </p>

            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary btn-lg gap-2"
              >
                <GitHubIcon className="w-5 h-5" />
                {t("hero.ctas.github")}
              </a>
              <a href="/quickstart" className="btn btn-outline btn-lg">
                {t("hero.ctas.docs")}
              </a>
            </div>

            <ul className="mt-12 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm text-base-content/55 list-none p-0">
              {badges.map((label) => (
                <li key={label} className="flex items-center gap-2">
                  <CheckIcon className="h-4 w-4 text-primary/70 shrink-0" />
                  {label}
                </li>
              ))}
            </ul>
          </div>
        </section>

        <Divider />

        {/* ══════════════════════════════════════════════════════════════════
            VALUE PROPOSITION
           ══════════════════════════════════════════════════════════════════ */}
        <section
          className="py-16 lg:py-24 bg-base-200/60"
          aria-labelledby="why-heading"
        >
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center">
            <SectionLabel>{t("why.label")}</SectionLabel>
            <SectionHeading id="why-heading">{t("why.title")}</SectionHeading>
            <p className="mt-6 text-lg leading-relaxed text-base-content/65 [text-wrap:balance]">
              {t("why.body")}
            </p>
          </div>
        </section>

        <Divider />

        {/* ══════════════════════════════════════════════════════════════════
            FEATURES
           ══════════════════════════════════════════════════════════════════ */}
        <section className="py-16 lg:py-24" aria-labelledby="features-heading">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <SectionLabel>{t("features.label")}</SectionLabel>
              <SectionHeading id="features-heading">
                {t("features.title")}
              </SectionHeading>
              <p className="mt-4 text-lg text-base-content/65 max-w-2xl mx-auto">
                {t("features.subtitle")}
              </p>
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((f) => (
                <article
                  key={f.title}
                  className="flex flex-col rounded-2xl border border-base-300 bg-base-100 p-6 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
                >
                  <span className="text-3xl mb-4 select-none" aria-hidden="true">
                    {f.emoji}
                  </span>
                  <h3 className="text-base font-semibold text-base-content">
                    {f.title}
                  </h3>
                  <p className="mt-2 flex-grow text-sm leading-relaxed text-base-content/65">
                    {f.description}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <Divider />

        {/* ══════════════════════════════════════════════════════════════════
            API INTEGRATION
           ══════════════════════════════════════════════════════════════════ */}
        <section
          className="py-16 lg:py-24 bg-base-200/60"
          aria-labelledby="integration-heading"
        >
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <SectionLabel>{t("integration.label")}</SectionLabel>
              <SectionHeading id="integration-heading">
                {t("integration.title")}
              </SectionHeading>
              <p className="mt-4 text-lg text-base-content/65 max-w-2xl mx-auto">
                {t("integration.subtitle")}
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">
              <ol className="space-y-8 list-none p-0">
                {steps.map((step, i) => (
                  <li key={step.title} className="flex gap-5">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-content font-bold text-sm">
                      {i + 1}
                    </span>
                    <div>
                      <h3 className="font-semibold text-base-content">
                        {step.title}
                      </h3>
                      <p className="mt-1 text-sm text-base-content/65 leading-relaxed">
                        {step.body}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>

              <div className="space-y-6">
                <CodeBlock
                  code={CHART_SNIPPET}
                  copyLabel={t("integration.copy")}
                  copiedLabel={t("integration.copied")}
                  note="ChartProvider — single chart embed"
                />
                {/* <CodeBlock
                  code={DASHBOARD_SNIPPET}
                  copyLabel={t("integration.copy")}
                  copiedLabel={t("integration.copied")}
                  note="DashboardGridProvider — full dashboard grid embed"
                /> */}
              </div>
            </div>
          </div>
        </section>

        <Divider />

        {/* ══════════════════════════════════════════════════════════════════
            OPEN SOURCE / ADOPTION LEVELS
           ══════════════════════════════════════════════════════════════════ */}
        <section className="py-16 lg:py-24" aria-labelledby="adoption-heading">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <SectionLabel>{t("adoption.label")}</SectionLabel>
              <SectionHeading id="adoption-heading">
                {t("adoption.title")}
              </SectionHeading>
              <p className="mt-4 text-lg text-base-content/65 max-w-2xl mx-auto">
                {t("adoption.subtitle")}
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {levels.map((level, i) => (
                <div
                  key={level.badge}
                  className={`flex flex-col rounded-2xl border p-6 shadow-sm transition-shadow hover:shadow-md ${i === 1
                      ? "border-primary/40 bg-primary/5 ring-1 ring-primary/20"
                      : "border-base-300 bg-base-100"
                    }`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <span className="badge badge-primary badge-outline text-xs font-bold">
                      {level.badge}
                    </span>
                    <span className="text-2xl select-none" aria-hidden="true">
                      {level.icon}
                    </span>
                  </div>
                  <h3 className="text-base font-semibold text-base-content mb-2">
                    {level.title}
                  </h3>
                  <p className="text-sm text-base-content/65 leading-relaxed flex-grow">
                    {level.description}
                  </p>
                  {i === 0 && (
                    <code className="mt-5 block rounded-lg bg-base-300 px-4 py-3 text-xs font-mono text-base-content/80 select-all break-all">
                      {NPM_INSTALL}
                    </code>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-10 text-center">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary btn-lg gap-2"
              >
                <GitHubIcon className="w-5 h-5" />
                {t("adoption.cta")}
              </a>
            </div>
          </div>
        </section>

        <Divider />

        {/* ══════════════════════════════════════════════════════════════════
            ARCHITECTURE
           ══════════════════════════════════════════════════════════════════ */}
        <section
          className="py-16 lg:py-24 bg-base-200/60"
          aria-labelledby="arch-heading"
        >
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <SectionLabel>{t("architecture.label")}</SectionLabel>
              <SectionHeading id="arch-heading">
                {t("architecture.title")}
              </SectionHeading>
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
              {stack.map((s) => (
                <div
                  key={s.layer}
                  className="rounded-2xl border border-base-300 bg-base-100 p-6"
                >
                  <h3 className="text-xs font-bold uppercase tracking-widest text-base-content/50 mb-4">
                    {s.layer}
                  </h3>
                  <ul className="space-y-2 list-none p-0">
                    {s.items.map((item) => (
                      <li key={item}>
                        <span className="badge badge-ghost badge-sm font-mono">
                          {item}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        <Divider />

        {/* ══════════════════════════════════════════════════════════════════
            CTA BAND
           ══════════════════════════════════════════════════════════════════ */}
        <section className="py-16 lg:py-20" aria-label="Call to action">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-2xl font-extrabold tracking-tight text-base-content sm:text-3xl">
              {t("cta.title")}
            </h2>
            <p className="mt-4 text-lg text-base-content/65 max-w-xl mx-auto">
              {t("cta.subtitle")}
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <a href="/quickstart" className="btn btn-primary btn-lg">
                {t("cta.primary")}
              </a>
              <a
                href={user ? HOME_ROUTE : "/login"}
                className="btn btn-outline btn-lg"
              >
                {user ? t("cta.secondaryUser") : t("cta.secondaryGuest")}
              </a>
            </div>
          </div>
        </section>

        <Divider />

        {/* ══════════════════════════════════════════════════════════════════
            FOOTER BAND
           ══════════════════════════════════════════════════════════════════ */}
        <section
          className="py-10 bg-base-300/30"
          aria-label="About this project"
        >
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center space-y-3">
            <p className="text-xl font-bold text-base-content">
              {t("aboutFooter.title")}
            </p>
            <p className="text-sm text-base-content/50">
              {t("aboutFooter.copyright")}
            </p>
            <p className="text-sm text-base-content/50">
              {t("aboutFooter.license")}{" "}
              <a
                href="https://www.gnu.org/licenses/gpl-3.0.html"
                target="_blank"
                rel="noopener noreferrer"
                className="link link-primary"
              >
                {t("aboutFooter.licenseName")}
              </a>
              .
            </p>
            <nav
              className="flex flex-wrap items-center justify-center gap-2 pt-2"
              aria-label="Project links"
            >
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-ghost btn-sm gap-1.5"
              >
                <GitHubIcon className="w-4 h-4" />
                {t("aboutFooter.links.github")}
              </a>
              <a href="/quickstart" className="btn btn-ghost btn-sm">
                {t("aboutFooter.links.docs")}
              </a>
              <a
                href="https://github.com/issues"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-ghost btn-sm"
              >
                {t("aboutFooter.links.issues")}
              </a>
            </nav>
          </div>
        </section>
      </div>
    </Layout>
  );
}
