
export default function TermsPage() {
  return (
    <main className="p-8 max-w-3xl mx-auto prose prose-sm sm:prose-base lg:prose-lg xl:prose-xl 2xl:prose-2xl dark:prose-invert">
      <h1 className="text-3xl font-bold mb-6">Terms & Conditions</h1>
      <p className="text-muted-foreground">Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>

      <p className="mt-4">
        Welcome to CleanCSV! These terms and conditions outline the rules and regulations for the use of our website and services, located at this website.
      </p>
      <p>
        By accessing this website and/or using our services, we assume you accept these terms. Do not continue to use CleanCSV if you do not agree to all of the terms and conditions stated on this page.
      </p>

      <h2 className="text-2xl font-bold mt-8 mb-4">1. Services Provided</h2>
      <p>
        CleanCSV provides tools that allow users to upload, clean, process, and download CSV files. Features may vary between free and paid subscription tiers. We reserve the right to modify or discontinue the service at any time without notice.
      </p>

      <h2 className="text-2xl font-bold mt-8 mb-4">2. User Accounts & Responsibilities</h2>
      <ul className="list-disc pl-6 space-y-2">
        <li>To access certain features, you must create an account. You are responsible for maintaining the confidentiality of your account information and for all activities that occur under your account.</li>
        <li>You are solely responsible for the data you upload. You warrant that you have the necessary rights to upload and process the data and that it does not infringe on any third-party rights or violate any laws.</li>
        <li>You agree not to use the service for any illegal or unauthorized purpose.</li>
      </ul>

      <h2 className="text-2xl font-bold mt-8 mb-4">3. Data Privacy & Security</h2>
      <ul className="list-disc pl-6 space-y-2">
        <li>We take your data privacy seriously. Files you upload are processed in memory and are permanently deleted from our servers within one (1) hour of being uploaded.</li>
        <li>We do not store, share, or sell the contents of your uploaded files. We only store metadata related to your account, such as your plan and usage statistics.</li>
      </ul>

      <h2 className="text-2xl font-bold mt-8 mb-4">4. Payments, Subscriptions, and Refunds</h2>
       <ul className="list-disc pl-6 space-y-2">
        <li>All paid features are billed on a subscription basis. Payments are processed securely via our third-party payment processor (Paddle).</li>
        <li>Subscriptions can be canceled at any time from your account dashboard. Your service will remain active until the end of the billing period.</li>
        <li>Due to the nature of the digital service, we generally do not offer refunds once a subscription period has started, unless required by law.</li>
      </ul>

      <h2 className="text-2xl font-bold mt-8 mb-4">5. Limitation of Liability</h2>
      <p>
        The service is provided "as is." In no event shall CleanCSV, nor its directors, employees, or partners, be liable for any indirect, incidental, or consequential damages, including but not limited to, data loss, service interruptions, or loss of profits arising out of the use or inability to use the service.
      </p>

      <h2 className="text-2xl font-bold mt-8 mb-4">6. Modifications to Terms</h2>
      <p>
        We reserve the right to update these terms at any time. We will notify users of any significant changes. Your continued use of the website and service after such changes constitutes your acceptance of the new terms.
      </p>

      <h2 className="text-2xl font-bold mt-8 mb-4">Contact Us</h2>
      <p>
        If you have any questions about these Terms & Conditions, please contact us by email at: <a href="mailto:kmish9685@gmail.com" className="text-primary hover:underline">kmish9685@gmail.com</a>
      </p>
    </main>
  );
}
