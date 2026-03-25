import Layout from '../components/layout';
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

export default function Landing() {

  const ourContactEmail = "tech@innovazione.gov.it";
  const policy = `
  Privacy Policy
  ==============

  **Last Updated:** February 2, 2026

  At **Dataviz**, we respect your privacy and are committed to protecting your personal data. This Privacy Policy explains how we handle your information when you use our web application.

  ## 1\. Information We Collect

  We adhere to the principle of "Data Minimization." We only collect the information absolutely necessary to provide our services:

  *   **Account Information:** We collect and store your **email address**. This serves as your username, allows us to verify your identity, and enables account recovery.

  *   **Authentication Data:** We store a cryptographically hashed version of your password. We never have access to your plain-text password.

  *   **User-Provided Content:** We store the **CSV/JSON data** and **chart configurations** you explicitly choose to save. This allows you to revisit, edit, and update your visualizations.


  ## 2\. Cookies and Tracking

  Unlike many web platforms, we do not use tracking, advertising, or analytics cookies.

  *   **Strictly Necessary Cookies:** We use a single, server-only session cookie for the sole purpose of user authentication. This cookie identifies you as a logged-in user so you can access your saved charts.

  *   **No Third-Party Tracking:** We do not use Google Analytics, Facebook Pixels, or any other third-party tracking scripts. Your browsing habits remain private.


  ## 3\. Legal Basis for Processing

  Under the General Data Protection Regulation (GDPR), we process your data based on **Contractual Necessity**. We require your email address and your uploaded data to fulfill our service of creating, saving, and managing your data visualizations.

  ## 4\. Data Storage and Security

  *   **Retention:** We retain your email and saved charts for as long as your account is active.

  *   **Deletion:** If you choose to delete a chart or your entire account, that data is permanently removed from our active production databases.

  *   **Security:** We employ industry-standard security protocols to protect your data from unauthorized access, alteration, or disclosure.


  ## 5\. Data Sharing and Third Parties

  We do not sell, trade, or rent your personal information to third parties.

  Data is only processed by our **infrastructure providers** (such as our database and hosting servers) for the exclusive purpose of running the Dataviz application. These providers are bound by strict data processing agreements to ensure your data remains secure.

  ## 6\. Your Rights Under GDPR

  You have the following rights regarding your data:

  *   **The Right to Access:** You can request a copy of the data we hold about you.

  *   **The Right to Rectification:** You can request that we correct any inaccurate information.

  *   **The Right to Erasure:** You may request the deletion of your account and all associated data at any time.

  *   **The Right to Data Portability:** You can export your saved charts and data at any time via the dashboard.


  To exercise any of these rights, please contact us at: **${ourContactEmail}**.

  ## 7\. Changes to This Policy

  We may update this policy from time to time to reflect changes in our practices. We will notify you of any significant changes by posting the new policy on this page and updating the "Last Updated" date.`;

  return (
    <Layout>
      <div className='relative py-14'>
        <div className='mx-auto max-w-6xl pb-24 lg:pb-32'>
          <p className='mb-5'>
            You may be also interested in our
            <a href="/terms-of-service" className='text-blue-600 underline'> Terms of Service</a>
          </p>
          {/* <a href="#" id="privacy-policy" /> */}
          <p className='prose'>
            <Markdown remarkPlugins={[remarkGfm]}>{policy}</Markdown>
          </p>
        </div>
      </div>
    </Layout>
  );
}
