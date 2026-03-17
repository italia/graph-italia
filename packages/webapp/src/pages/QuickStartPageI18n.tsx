import { Trans, useTranslation } from "react-i18next";
import Layout from "../components/layout";

export default function QuickStartPage() {
  const { t } = useTranslation("quickstart");
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

            <h2 className="text-xl font-semibold text-base-content mt-10">
              <Trans t={t} i18nKey="steps.step1.title" />
            </h2>
            {t("steps.step1.text") ? (
              <Trans
                t={t}
                i18nKey="steps.step1.text"
                components={{ strong: <strong /> }}
              />
            ) : (
              <ul>
                <li>{t("steps.step1.listItems.item1")}</li>
                <li>
                  <Trans
                    t={t}
                    i18nKey="steps.step1.listItems.item2"
                    components={{ strong: <strong /> }}
                  />
                </li>
              </ul>
            )}

            <h2 className="text-xl font-semibold text-base-content mt-8">
              {t("steps.step2.title")}
            </h2>
            {t("steps.step2.text") ? (
              <Trans
                t={t}
                i18nKey="steps.step2.text"
                components={{ strong: <strong /> }}
              />
            ) : (
              <ul>
                <li>
                  {t("steps.step2.listItems.item1.text")}:
                  <ul>
                    <li>
                      <Trans
                        t={t}
                        i18nKey="steps.step2.listItems.item1.items.item1"
                        components={{ strong: <strong /> }}
                      />
                    </li>
                    <li>
                      <Trans
                        t={t}
                        i18nKey="steps.step2.listItems.item1.items.item2"
                        components={{
                          strong: <strong />,
                          a: (
                            <a
                              href="/generate-data"
                              className="link link-primary"
                            />
                          ),
                        }}
                      />
                    </li>
                    <li>
                      <Trans
                        t={t}
                        i18nKey="steps.step2.listItems.item1.items.item3"
                        components={{ strong: <strong /> }}
                      />
                    </li>
                  </ul>
                </li>
              </ul>
            )}

            <h2 className="text-xl font-semibold text-base-content mt-8">
              {t("steps.step3.title")}
            </h2>
            {t("steps.step3.text") ? (
              <Trans
                t={t}
                i18nKey="steps.step3.text"
                components={{ strong: <strong /> }}
              />
            ) : (
              <ul>
                <li>{t("steps.step3.listItems.item1")}</li>
                <li>{t("steps.step3.listItems.item2")}</li>
              </ul>
            )}

            <h2 className="text-xl font-semibold text-base-content mt-8">
              {t("steps.step4.title")}
            </h2>
            {t("steps.step4.text") ? (
              <Trans
                t={t}
                i18nKey="steps.step4.text"
                components={{ strong: <strong /> }}
              />
            ) : (
              <ul>
                <li>
                  <Trans
                    t={t}
                    i18nKey="steps.step4.listItems.item1"
                    components={{ strong: <strong /> }}
                  />
                </li>
                <li>{t("steps.step4.listItems.item2")}</li>
              </ul>
            )}

            <hr className="my-8" />

            <p>{t("footer.text")}</p>

            <p className="mt-8">
              <a href="/login" className="btn-italia btn-italia-primary">
                {t("actions.getStarted.label")}
              </a>
            </p>
          </article>
        </div>
      </div>
    </Layout>
  );
}
