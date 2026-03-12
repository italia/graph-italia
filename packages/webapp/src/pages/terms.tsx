import Layout from '../components/layout';
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

export default function Landing() {

  const ourContactEmail = "tech@innovazione.gov.it";


  const terms = `
  Terms of Service
  ================

  **Last Updated:** February 2, 2026

  Welcome to **Dataviz**. By accessing or using our web application, you agree to be bound by these Terms of Service. Please read them carefully.

  ## 1\. Account Registration

  To use the full features of Dataviz, you must create an account.

  *   You agree to provide a valid **email address** for account verification.

  *   You are responsible for maintaining the security of your account and password.

  *   Dataviz cannot and will not be liable for any loss or damage from your failure to comply with this security obligation.


  ## 2\. Use of Service & Data

  Dataviz allows you to upload/connect data and transform it into visualizations.

  *   **Ownership:** You retain full ownership of any data (CSV/JSON files) you upload and any charts you create.

  *   **Storage:** We only store data that you explicitly choose to "Save."

  *   **Responsibility:** You are solely responsible for the content of the data you upload. You agree not to upload data that is illegal, sensitive personal data without authorization, or data that violates any third-party rights.


  ## 3\. Publishing and Embedding

  Dataviz provides features that allow you to publish and embed your charts on external websites.

  *   **Public Access:** Once a chart is published, it is accessible to anyone with the link or anyone visiting the page where it is embedded.

  *   **Availability:** While we strive for maximum uptime, we do not guarantee that embedded charts will be available 100% of the time.


  ## 4\. Account Deletion and Data Destruction

  You have the right to delete your account at any time through your dashboard.

  *   **Permanent Removal:** Upon your request to delete your account, all associated data—including your email address, saved CSV data, and chart configurations—will be permanently destroyed.

  *   **Impact on Published Charts:** **Warning:** Deleting your account will immediately destroy all published and embedded charts. Any website currently embedding your charts will display a broken link or an error. This action is irreversible.


  ## 5\. Acceptable Use

  You agree not to:

  *   Use the service for any illegal or unauthorized purpose.

  *   Attempt to hack, disrupt, or interfere with the server-side authentication or database.

  *   Use the service to host or distribute malicious code or "spam" visualizations.


  ## 6\. Disclaimer of Warranties

  The service is provided on an **"as is"** and **"as available"** basis. Dataviz makes no warranties, expressed or implied, regarding the reliability, accuracy, or availability of the service or the visualizations generated.

  ## 7\. Limitation of Liability

  In no event shall Dataviz be liable for any direct, indirect, incidental, or consequential damages resulting from the use or the inability to use the service, including the loss of data or the breaking of embedded charts due to account deletion.

  ## 8\. Modifications to Service

  We reserve the right to modify or discontinue, temporarily or permanently, the service (or any part thereof) with or without notice.

  ## 9\. Contact Information

  If you have any questions about these Terms, please contact us at: **${ourContactEmail}**.`;

  return (
    <Layout>
      <div className='relative py-14'>
        <div className='mx-auto max-w-6xl pb-24  lg:pb-32  '>
          <p className='mb-5'>
            You may be also interested in our
            <a href="/gdpr" className='text-blue-600 underline'> Privacy Policy</a>
          </p>
          {/* <a href="#" id="terms-of-service" /> */}
          <p className='prose'>
            <Markdown remarkPlugins={[remarkGfm]}>{terms}</Markdown>
          </p>
        </div>
      </div>
    </Layout>
  );
}
