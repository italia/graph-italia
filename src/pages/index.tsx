import Layout from '../components/layout';
import { useUserStore } from '../store/user_store';

export default function Landing() {
  const { user } = useUserStore();

  const faqs = [
    {
      id: 1,
      question: 'What is skishu?',
      answer: 'Skishu is you divinity...',
    },
    {
      id: 2,
      question: 'Shamalaya?',
      answer: 'Yes we can ....',
    },

    {
      id: 3,
      question: 'Who am I?',
      answer: 'Roots of creation...',
    },
  ];

  const features = [
    {
      name: 'Upload & Parse Your Data in Seconds',
      description:
        'Simply upload your CSV file, and Dataviz will instantly parse the data for you. View your data in a clean table format and get ready to visualize it in just a few clicks.',
    },
    {
      name: 'Customizable Chart Creation',
      description:
        "Choose how to represent your data by selecting which columns to display as series, and easily define your X and Y axes. Dataviz offers a range of chart types: <b>Bar </b>, <b>Line</b> , <b>Pie</b> charts and <b>Geographical Maps</b> (Geomap), No matter the type, you have full control over your data's presentation!",
    },
    {
      name: 'Intuitive Filtering & Data Selection',
      description:
        'Only want to display specific data points? No problem. Use our simple filtering options to select which columns or data sets to include in your visualization, ensuring clarity and focus in your chart.',
    },
    {
      name: 'Fine-Tune Chart Parameters',
      description:
        'Tweak and customize each aspect of your chart. From colors to data labels, control every detail to ensure your chart perfectly fits your needs and looks great.',
    },
    {
      name: 'Save, Edit & Reuse Your Charts',
      description:
        'Dataviz allows you to save your charts for future editing. Come back anytime to update your data, adjust chart settings, or switch the chart type. Your work is always at your fingertips.',
    },
    {
      name: 'Publish & Embed Your Charts',
      description:
        'Share your work with the world! Once your chart is ready, publish it directly from Dataviz and get an embed code to seamlessly integrate your visualizations into any website or platform.',
    },
  ];

  return (
    <Layout>
      <div className=''>
        <div className='relative isolate pt-14'>
          <svg
            aria-hidden='true'
            className='absolute inset-0 -z-10 h-full w-full stroke-gray-200 [mask-image:radial-gradient(100%_100%_at_top_right,white,transparent)]'
          >
            <defs>
              <pattern
                x='50%'
                y={-1}
                id='83fd4e5a-9d52-42fc-97b6-718e5d7ee527'
                width={200}
                height={200}
                patternUnits='userSpaceOnUse'
              >
                <path d='M100 200V.5M.5 .5H200' fill='none' />
              </pattern>
            </defs>
            <svg x='50%' y={-1} className='overflow-visible fill-gray-50'>
              <path
                d='M-100.5 0h201v201h-201Z M699.5 0h201v201h-201Z M499.5 400h201v201h-201Z M-300.5 600h201v201h-201Z'
                strokeWidth={0}
              />
            </svg>
            <rect
              fill='url(#83fd4e5a-9d52-42fc-97b6-718e5d7ee527)'
              width='100%'
              height='100%'
              strokeWidth={0}
            />
          </svg>
          <div className='mx-auto max-w-6xl pb-32  lg:pb-56  '>
            <div className='hidden sm:mb-8 sm:flex sm:justify-center'>
              <div className='relative rounded-full px-3 py-1 text-sm leading-6 text-gray-600 ring-1 ring-gray-900/10 hover:ring-gray-900/20'>
                This project is in heavy design/development.{' '}
                <a href='#' className='font-semibold text-primary'>
                  <span aria-hidden='true' className='absolute inset-0' />
                  Get Involved <span aria-hidden='true'>&rarr;</span>
                </a>
              </div>
            </div>
            <div className='text-center'>
              <h1 className='text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl'>
                Transform Data Into Stunning Visuals with Dataviz
              </h1>
              <p className='mt-6 text-lg leading-8 text-gray-600'>
                Effortlessly convert your CSV data into beautiful, interactive
                charts with Dataviz. Whether you're a data analyst, business
                professional, or content creator, Dataviz offers an intuitive
                interface to bring your numbers to life.
              </p>
              <div className='mt-10 flex items-center justify-center gap-x-6'>
                <a href={user ? '/home' : '/login'} className='btn btn-primary'>
                  Get started
                </a>
              </div>
            </div>
          </div>
          <div className='mx-auto max-w-6xl pb-32  lg:pb-56'>
            <div className='mx-auto max-w-7xl px-6 lg:px-8'>
              <div className='mx-auto max-w-4xl lg:mx-0'>
                <h2 className='text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl'>
                  Everything you need
                </h2>
                <p className='mt-6 text-lg leading-8 text-gray-600'>
                  Start Visualizing Your Data with Dataviz Today Dataviz makes
                  data visualization quick, simple, and powerful. Try it and see
                  how easily you can create, edit, and publish stunning charts
                  in minutes.
                </p>
              </div>
              <dl className='mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 text-base leading-7 sm:grid-cols-2 lg:mx-0 lg:max-w-none lg:grid-cols-3'>
                {features.map((feature) => (
                  <div key={feature.name}>
                    <dt className='font-semibold text-gray-900'>
                      {feature.name}
                    </dt>
                    <dd
                      className='mt-1 text-gray-600'
                      dangerouslySetInnerHTML={{
                        __html: `${feature.description}`,
                      }}
                    />
                  </div>
                ))}
              </dl>
            </div>
          </div>

          <div className='bg-primary px-10 sm:mx-auto w-full py-12'>
            <div className='rounded-md mx-auto max-w-6xl p-12 prose bg-base-100'>
              <h2 className='text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl'>
                Quick Start Guide: Creating Your First Chart with Dataviz
              </h2>
              <p>
                Ready to jump in and create your first chart? Follow this simple
                guide to visualize your data in no time. Whether you're using
                sample data or generating your own, these steps will get you
                started.
              </p>
              <h3 className='h3'>Step 1: Click on "Create New Chart"</h3>
              <ul>
                <li>Begin by logging into your Dataviz account.</li>
                <li>
                  On the dashboard, locate and click the{' '}
                  <strong>"Create New Chart"</strong> button to start a new
                  project.
                </li>
              </ul>
              <h3>Step 2: Upload Your Data</h3>
              <ul>
                <li>
                  You'll be prompted to upload your data. If you don't have data
                  yet, no worries—use one of these options:
                  <ul>
                    <li>
                      <strong>Sample Data</strong>: Select from a set of sample
                      data provided by Dataviz. Click{' '}
                      <strong>"Use Sample Data"</strong> to explore how the tool
                      works.
                    </li>
                    <li>
                      <strong>Generate Data</strong>: Click on{' '}
                      <strong>"Generate Data"</strong> in the delegate section
                      to create a simple CSV dataset automatically.
                    </li>
                    <li>
                      <strong>Upload Your Own CSV</strong>: If you have your own
                      data, simply upload a CSV file. Dataviz will instantly
                      parse and display it in a table.
                    </li>
                  </ul>
                </li>
              </ul>
              <h3>Step 3: Choose Your Chart Type and Configure (Optional)</h3>
              <ul>
                <li>
                  After uploading or generating your data, select a chart type
                  that best represents your data. You can choose from:
                  <ul>
                    <li>
                      <strong>Bar Chart</strong>
                    </li>
                    <li>
                      <strong>Line Chart</strong>
                    </li>
                    <li>
                      <strong>Pie Chart</strong>
                    </li>
                    <li>
                      <strong>Geographical Map (Geomap)</strong>
                    </li>
                  </ul>
                </li>
                <li>
                  To customize your chart:
                  <ul>
                    <li>Select which data columns to display.</li>
                    <li>Assign your X and Y axes (for bar or line charts).</li>
                    <li>
                      Adjust chart parameters, such as colors, labels, and data
                      points. This step is optional, but it's a great way to
                      fine-tune your chart's appearance.
                    </li>
                  </ul>
                </li>
              </ul>
              <h3>Step 4: Save Your Chart</h3>
              <ul>
                <li>
                  Once you're satisfied with your chart, click{' '}
                  <strong>"Save"</strong> to store it for future editing.
                </li>
                <li>
                  Your chart will be saved to your dashboard, where you can:
                  <ul>
                    <li>Re-edit it later.</li>
                    <li>Publish it for sharing.</li>
                    <li>
                      Generate an embed code to add the chart to your website.
                    </li>
                  </ul>
                </li>
              </ul>
              <hr />
              <p>
                And that's it! You've successfully created and saved your first
                chart with Dataviz. Continue experimenting with different
                datasets, chart types, and configurations to fully unlock the
                power of your visualizations.
              </p>
            </div>
          </div>

          <div className='space-y-2 mx-auto max-w-4xl pb-32 sm:pb-48 lg:pb-56'>
            <h2 className='text-4xl font-bold'>FAQS</h2>
            {faqs.map((faq) => (
              <details
                className='group [&_summary::-webkit-details-marker]:hidden'
                key={faq.id}
              >
                <summary className='flex cursor-pointer items-center justify-between gap-1.5 rounded-lg  p-4  bg-accent text-accent-content'>
                  <h2 className='font-medium'>{faq.question}</h2>

                  <svg
                    className='size-5 shrink-0 transition duration-300 group-open:-rotate-180'
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'
                    stroke='currentColor'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth='2'
                      d='M19 9l-7 7-7-7'
                    />
                  </svg>
                </summary>

                <p className='mt-4 px-4 leading-relaxed text-content'>
                  {faq.answer}
                </p>
              </details>
            ))}
          </div>
        </div>

        {/* <div className="my-5">

       <div className="mx-auto max-w-4xl pb-32 sm:pb-48 lg:pb-56">
          <h2 className="text-4xl font-bold">How It Works</h2>
          <p>Import your data e create a chart with it in few simple steps</p>
          <ul className="steps steps-vertical">
            <li className="step step-primary">
              1 Upload your data as a CSV file
            </li>
            <li className="step step-primary">
              2 Select and filter what you want from raw data
            </li>
            <li className="step step-primary">
              3 Choose chart type and tweak chart settings
            </li>
            <li className="step step-primary">
              4 Preview and save your chart, publish if you want
            </li>
            <li className="step step-primary">
              5 Organize your charts in dashboard and share with world
            </li>
          </ul>
        </div>
        <div className="stats bg-base-300 border-base-300 border shadow">
          <div className="stat">
            <div className="stat-title">Total Page Views</div>
            <div className="stat-value">89,400</div>
            <div className="stat-desc">21% more than last month</div>
          </div>
        </div>
      </div>
      <div className="my-5">
        <div className="stats shadow my-10">
          <div className="stat">
            <div className="stat-figure text-primary">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                className="inline-block h-8 w-8 stroke-current"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                ></path>
              </svg>
            </div>
            <div className="stat-title">Total Likes</div>
            <div className="stat-value text-primary">25.6K</div>
            <div className="stat-desc">21% more than last month</div>
          </div>

          <div className="stat">
            <div className="stat-figure text-secondary">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                className="inline-block h-8 w-8 stroke-current"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                ></path>
              </svg>
            </div>
            <div className="stat-title">Page Views</div>
            <div className="stat-value text-secondary">2.6M</div>
            <div className="stat-desc">21% more than last month</div>
          </div>

          <div className="stat">
            <div className="stat-figure text-secondary">
              <div className="avatar online">
                <div className="w-16 rounded-full">
                  <img src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" />
                </div>
              </div>
            </div>
            <div className="stat-value">86%</div>
            <div className="stat-title">Tasks done</div>
            <div className="stat-desc text-secondary">31 tasks remaining</div>
          </div>
        </div>
      </div> */}
      </div>
    </Layout>
  );
}
