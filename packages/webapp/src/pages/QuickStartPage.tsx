import { Trans, useTranslation } from "react-i18next";
import Layout from "../components/layout";
import { useUserStore } from "../lib/store/user_store";
import { HOME_ROUTE } from "../router";

// Section keys, in order. "account" is skipped for logged-in users: telling
// them to sign in is noise, and the final CTA points to their private area.
const GUIDE_STEPS = [
  "account",
  "create",
  "data",
  "configure",
  "publish",
  "dashboard",
  "api",
] as const;

export default function QuickStartPage() {
  const { t } = useTranslation("quickstart");
  const { user } = useUserStore();
  const loggedIn = Boolean(user);

  const steps = GUIDE_STEPS.filter((key) => !(loggedIn && key === "account"));

  return (
    <Layout>
      <div className="quickstart-page relative isolate min-h-[60vh]">
        {/* Stesso sfondo a quadrati della landing */}
        <svg
          aria-hidden="true"
          className="absolute inset-0 -z-10 h-full w-full stroke-base-content/20 [mask-image:radial-gradient(100%_100%_at_top_right,white,transparent)]"
        >
          <defs>
            <pattern
              x="50%"
              y={-1}
              id="quickstart-grid"
              width={200}
              height={200}
              patternUnits="userSpaceOnUse"
            >
              <path d="M100 200V.5M.5 .5H200" fill="none" />
            </pattern>
          </defs>
          <svg
            x="50%"
            y={-1}
            className="overflow-visible fill-base-200"
            aria-hidden="true"
          >
            <path
              d="M-100.5 0h201v201h-201Z M699.5 0h201v201h-201Z M499.5 400h201v201h-201Z M-300.5 600h201v201h-201Z"
              strokeWidth={0}
            />
          </svg>
          <rect
            fill="url(#quickstart-grid)"
            width="100%"
            height="100%"
            strokeWidth={0}
          />
        </svg>

        <div className="mx-auto max-w-3xl px-4 py-12 sm:py-16">
          <p className="mb-6">
            <a href="/" className="text-primary hover:underline">
              ← {t("back")}
            </a>
          </p>

          <article className="rounded-xl bg-base-100 p-8 shadow-sm ring-1 ring-base-content/10 prose max-w-none">
            <h1 className="text-3xl font-bold tracking-tight text-base-content sm:text-4xl">
              {t("title")}
            </h1>
            <p className="lead">{t("description")}</p>

            {steps.map((key, index) => {
              const items = t(`guide.${key}.items`, {
                returnObjects: true,
                defaultValue: [],
              }) as string[];
              return (
                <section key={key}>
                  <h2 className="text-xl font-normal text-base-content mt-10">
                    {index + 1} · {t(`guide.${key}.title`)}
                  </h2>
                  <ul>
                    {items.map((_, i) => (
                      <li key={i}>
                        <Trans
                          t={t}
                          i18nKey={`guide.${key}.items.${i}`}
                          components={{ strong: <strong /> }}
                        />
                      </li>
                    ))}
                  </ul>
                </section>
              );
            })}

            <hr className="my-8" />
            <p>{t("footer.text")}</p>
            <p className="mt-8">
              {loggedIn ? (
                <a href={HOME_ROUTE} className="btn-italia btn-italia-primary">
                  {t("actions.goToPrivateArea.label", {
                    defaultValue: "Vai alla tua Area Privata",
                  })}
                </a>
              ) : (
                <a href="/login" className="btn-italia btn-italia-primary">
                  {t("actions.getStarted.label")}
                </a>
              )}
            </p>
          </article>
        </div>
      </div>
    </Layout>
  );
}
