import Layout from "../components/layout";

export default function QuickStartPage() {
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
          <svg x="50%" y={-1} className="overflow-visible fill-base-200" aria-hidden="true">
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
              ← Back to home
            </a>
          </p>

          <article className="rounded-xl bg-base-100 p-8 shadow-sm ring-1 ring-base-content/10 prose max-w-none">
            <h1 className="text-3xl font-bold tracking-tight text-base-content sm:text-4xl">
              Quick Start Guide: Creating Your First Chart with Dataviz
            </h1>
            <p className="lead">
              Follow this guide to visualize your data in minutes. You can use
              sample data or upload your own.
            </p>

            <h2 className="text-xl font-semibold text-base-content mt-10">
              Step 1: Click on &quot;Create New Chart&quot;
            </h2>
            <ul>
              <li>Log in to your Dataviz account.</li>
              <li>
                On the dashboard, click the{" "}
                <strong>&quot;Create New Chart&quot;</strong> button to start a
                new project.
              </li>
            </ul>

            <h2 className="text-xl font-semibold text-base-content mt-8">
              Step 2: Upload your data
            </h2>
            <ul>
              <li>
                If you don&apos;t have data yet, you can:
                <ul>
                  <li>
                    <strong>Sample data</strong>: use the datasets provided by
                    Dataviz (option &quot;Use Sample Data&quot;).
                  </li>
                  <li>
                    <strong>Generate data</strong>: from the Tools section →{" "}
                    <a href="/generate-data" className="link link-primary">
                      Generate Data
                    </a>{" "}
                    to create a CSV automatically.
                  </li>
                  <li>
                    <strong>Upload a CSV</strong>: upload your CSV file; Dataviz
                    will parse it and display the data in a table.
                  </li>
                </ul>
              </li>
            </ul>

            <h2 className="text-xl font-semibold text-base-content mt-8">
              Step 3: Choose your chart type and configure (optional)
            </h2>
            <ul>
              <li>
                After uploading your data, choose the chart type: Bar, Line,
                Pie, or Geomap.
              </li>
              <li>Customize: select columns, X/Y axes, colors, and labels.</li>
            </ul>

            <h2 className="text-xl font-semibold text-base-content mt-8">
              Step 4: Save your chart
            </h2>
            <ul>
              <li>
                Click <strong>&quot;Save&quot;</strong> to save your chart to
                your dashboard.
              </li>
              <li>
                You can reopen it, edit it, publish it, and get the embed code
                to add it to your website.
              </li>
            </ul>

            <hr className="my-8" />

            <p>
              That&apos;s it! Keep experimenting with datasets, chart types, and
              settings to get the most out of your visualizations.
            </p>

            <p className="mt-8">
              <a href="/login" className="btn-italia btn-italia-primary">
                Log in and get started
              </a>
            </p>
          </article>
        </div>
      </div>
    </Layout>
  );
}
