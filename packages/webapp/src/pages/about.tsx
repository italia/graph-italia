import Layout from "../components/layout";
import { HOME_ROUTE } from "../router";
import { useUserStore } from "../store/user_store";

export default function Landing() {
  const { user } = useUserStore();

  const features = [
    {
      name: "Upload & Parse Your Data in Seconds",
      description:
        "Simply upload your CSV file, and Dataviz will instantly parse the data for you. View your data in a clean table format and get ready to visualize it in just a few clicks.",
      icon: "upload",
    },
    {
      name: "Customizable Chart Creation",
      description:
        "Choose how to represent your data by selecting which columns to display as series, and easily define your X and Y axes. Dataviz offers a range of chart types: Bar, Line, Pie charts and Geographical Maps (Geomap). No matter the type, you have full control over your data's presentation!",
      icon: "chart",
    },
    {
      name: "Intuitive Filtering & Data Selection",
      description:
        "Only want to display specific data points? Use our simple filtering options to select which columns or data sets to include in your visualization, ensuring clarity and focus in your chart.",
      icon: "filter",
    },
    {
      name: "Fine-Tune Chart Parameters",
      description:
        "Tweak and customize each aspect of your chart. From colors to data labels, control every detail to ensure your chart perfectly fits your needs and looks great.",
      icon: "palette",
    },
    {
      name: "Save, Edit & Reuse Your Charts",
      description:
        "Dataviz allows you to save your charts for future editing. Come back anytime to update your data, adjust chart settings, or switch the chart type. Your work is always at your fingertips.",
      icon: "save",
    },
    {
      name: "Publish & Embed Your Charts",
      description:
        "Share your work with the world! Once your chart is ready, publish it directly from Dataviz and get an embed code to seamlessly integrate your visualizations into any website or platform.",
      icon: "share",
    },
  ];

  const FeatureIcon = ({ name }: { name: string }) => {
    const c = "text-primary";
    switch (name) {
      case "upload":
        return (
          <svg
            className={`w-8 h-8 ${c}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
            />
          </svg>
        );
      case "chart":
        return (
          <svg
            className={`w-8 h-8 ${c}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z"
            />
          </svg>
        );
      case "filter":
        return (
          <svg
            className={`w-8 h-8 ${c}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75"
            />
          </svg>
        );
      case "palette":
        return (
          <svg
            className={`w-8 h-8 ${c}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.38 3.39a15.995 15.995 0 004.769-2.95m-4.69-4.688a15.99 15.99 0 014.69 4.688"
            />
          </svg>
        );
      case "save":
        return (
          <svg
            className={`w-8 h-8 ${c}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z"
            />
          </svg>
        );
      case "share":
        return (
          <svg
            className={`w-8 h-8 ${c}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z"
            />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <Layout>
      <div className="landing relative isolate min-h-[80vh] z-0">
        {/* Sfondo a quadrati – stessa sfumatura di Quick Start (radiale da top-right) */}
        <svg
          aria-hidden="true"
          className="landing__bg absolute inset-0 z-[-1] h-full w-full stroke-base-content/20 [mask-image:radial-gradient(100%_100%_at_top_right,white,transparent)]"
        >
          <defs>
            <pattern
              x="50%"
              y={-1}
              id="landing-grid"
              width={200}
              height={200}
              patternUnits="userSpaceOnUse"
            >
              <path d="M100 200V.5M.5 .5H200" fill="none" />
            </pattern>
          </defs>
          <svg x="50%" y={-1} className="overflow-visible fill-base-200" aria-hidden="true">
            <path
              d="M-100.5 0h201v201h-201Z M699.5 0h201v201h-201Z M499.5 400h201v201h-201Z M-300.5 600h201v201h-201Z"
              strokeWidth={0}
            />
          </svg>
          <rect
            fill="url(#landing-grid)"
            width="100%"
            height="100%"
            strokeWidth={0}
          />
        </svg>

        {/* Sezione Hero – più alta e UI fantasiosa, sfondo/mask invariati */}
        <section
          className="landing__hero relative isolate min-h-[70vh] flex flex-col justify-center pt-20 pb-32 lg:min-h-[75vh] lg:pt-28 lg:pb-40"
          aria-label="Hero"
        >
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 w-full">
            <div className="text-center">
              <p className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary">
                <span className="relative flex h-2 w-2" aria-hidden>
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary/40" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
                </span>
                Data visualization made simple
              </p>
              <h1 className="mt-8 text-4xl font-bold tracking-tight text-base-content sm:text-5xl lg:text-6xl xl:text-7xl max-w-4xl mx-auto leading-tight">
                <span className="block">Transform Data Into</span>
                <span className="mt-1 block py-1 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent leading-[1.4]">
                  Stunning Visuals
                </span>
                <span className="block mt-1">
                  with{" "}
                  <span className="inline-block bg-gradient-to-r from-primary to-primary/70 bg-clip-text py-0.5 font-semibold tracking-wide text-transparent">
                    Dataviz
                  </span>
                </span>
              </h1>
              <p className="mt-8 text-lg leading-8 text-base-content/70 max-w-2xl mx-auto sm:text-xl">
                Effortlessly convert your CSV data into beautiful, interactive
                charts with Dataviz. Whether you're a data analyst, business
                professional, or content creator, Dataviz offers an intuitive
                interface to bring your numbers to life.
              </p>
              <div className="mt-12 flex flex-wrap items-center justify-center gap-4">
                <a
                  href={user ? HOME_ROUTE : "/login"}
                  className="btn btn-primary"
                >
                  Get started
                </a>
                <a
                  href="/quickstart"
                  className="btn btn-outline"
                >
                  Quick start guide
                </a>
              </div>
              <div
                className="mt-16 flex items-center justify-center gap-8 text-sm text-base-content/60"
                aria-hidden
              >
                <span className="flex items-center gap-2">
                  <svg
                    className="h-5 w-5 text-primary/60"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
                    />
                  </svg>
                  CSV upload
                </span>
                <span className="flex items-center gap-2">
                  <svg
                    className="h-5 w-5 shrink-0 text-primary/80"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z"
                    />
                  </svg>
                  Charts & maps
                </span>
                <span className="flex items-center gap-2">
                  <svg
                    className="h-5 w-5 text-primary/60"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z"
                    />
                  </svg>
                  Publish & embed
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Divisore tra Hero e Features */}
        <div
          className="landing__divider h-px w-full mx-auto bg-base-content/20"
          aria-hidden="true"
        />

        {/* Sezione Everything you need – senza blur per scroll fluido */}
        <section
          className="landing__features relative overflow-hidden py-16 lg:py-24"
          aria-labelledby="features-heading"
        >
          <div
            className="absolute inset-0 bg-gradient-to-b from-base-200 via-base-100 to-base-200"
            aria-hidden="true"
          />

          <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl text-center">
              <span className="inline-block text-sm font-medium text-primary uppercase tracking-wider mb-3">
                Features
              </span>
              <h2
                id="features-heading"
                className="text-3xl font-bold tracking-tight text-base-content sm:text-4xl"
              >
                Everything you need
              </h2>
              <p className="mt-4 text-lg leading-8 text-base-content/70">
                Start visualizing your data with Dataviz today. Dataviz makes
                data visualization quick, simple, and powerful. Try it and see
                how easily you can create, edit, and publish stunning charts in
                minutes.
              </p>
            </div>

            <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((feature) => (
                <article
                  key={feature.name}
                  className="landing__feature-card group relative flex flex-col rounded-2xl border border-base-200 bg-base-100 p-6 shadow-sm transition-[transform,box-shadow,border-color] duration-200 hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/10 hover:border-primary/30"
                >
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary/15">
                    <FeatureIcon name={feature.icon} />
                  </div>
                  <h3 className="text-lg font-semibold text-base-content">
                    {feature.name}
                  </h3>
                  <p className="mt-2 flex-grow text-base leading-relaxed text-base-content/70">
                    {feature.description}
                  </p>
                  <div
                    className="mt-4 h-px w-12 rounded-full bg-primary/30 transition-all group-hover:w-full group-hover:bg-primary/50"
                    aria-hidden="true"
                  />
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Divisore tra Features e CTA */}
        <div
          className="landing__divider h-px w-full bg-base-200"
          aria-hidden="true"
        />

        {/* Sezione Ready to create your first chart */}
        <section
          className="landing__cta relative bg-base-100/80 py-16 lg:py-20"
          aria-label="Call to action"
        >
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-2xl font-bold tracking-tight text-base-content sm:text-3xl">
              Ready to create your first chart?
            </h2>
            <p className="mt-4 text-lg text-base-content/70 max-w-xl mx-auto">
              Follow the step-by-step quick start guide or log in and get
              started.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <a
                href="/quickstart"
                className="btn btn-primary btn-lg"
              >
                Go to Quick start guide
              </a>
              <a
                href={user ? HOME_ROUTE : "/login"}
                className="btn btn-outline btn-lg"
              >
                {user ? "Go to my charts" : "Log in"}
              </a>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}
