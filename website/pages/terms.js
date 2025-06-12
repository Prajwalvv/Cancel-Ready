import Layout from '../components/Layout';
import Link from 'next/link';

export default function Terms() {
  return (
    <Layout title="Terms of Service - CancelKit">
      <div className="bg-white">
        {/* Header */}
        <div className="bg-primary-600 text-white py-12">
          <div className="container-custom">
            <h1 className="text-3xl font-bold mb-4">Terms of Service</h1>
            <p className="text-primary-100 max-w-3xl">
              Last updated: May 25, 2025
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="container-custom py-12">
          <div className="max-w-4xl mx-auto">
            <div className="prose prose-lg max-w-none">
              <p>
                Please read these Terms of Service ("Terms", "Terms of Service") carefully before using the CancelKit service operated by CancelKit, Inc. ("us", "we", "our").
              </p>

              <p>
                Your access to and use of the Service is conditioned on your acceptance of and compliance with these Terms. These Terms apply to all visitors, users, and others who access or use the Service.
              </p>

              <p>
                <strong>By accessing or using the Service you agree to be bound by these Terms. If you disagree with any part of the terms, then you may not access the Service.</strong>
              </p>

              <h2>1. Software License</h2>
              <p>
                Subject to your compliance with these Terms, CancelKit grants you a limited, non-exclusive, non-transferable, non-sublicensable license to access and use the CancelKit service and software for your business purposes. This license is for the sole purpose of enabling you to use the CancelKit service as provided by us, in the manner permitted by these Terms.
              </p>

              <p>
                You may not:
              </p>
              <ul>
                <li>Copy, modify, or create derivative works based on the CancelKit software or service</li>
                <li>Reverse engineer, decompile, or attempt to extract the source code of our software</li>
                <li>Redistribute, sell, rent, lease, or sublicense the CancelKit service</li>
                <li>Remove any copyright or other proprietary notices from our materials</li>
              </ul>

              <h2>2. Accounts and Billing</h2>
              <p>
                When you create an account with us, you must provide accurate, complete, and current information. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account.
              </p>

              <p>
                You are responsible for safeguarding the password that you use to access the Service and for any activities or actions under your password. You agree not to disclose your password to any third party. You must notify us immediately upon becoming aware of any breach of security or unauthorized use of your account.
              </p>

              <p>
                For paid plans, you agree to pay all fees associated with your selected plan. All fees are exclusive of all taxes, levies, or duties imposed by taxing authorities, and you shall be responsible for payment of all such taxes, levies, or duties.
              </p>

              <h2>3. Limitation of Liability</h2>
              <p>
                <strong>In no event shall CancelKit, Inc., nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from:</strong>
              </p>
              <ul>
                <li>Your access to or use of or inability to access or use the Service</li>
                <li>Any conduct or content of any third party on the Service</li>
                <li>Any content obtained from the Service</li>
                <li>Unauthorized access, use, or alteration of your transmissions or content</li>
                <li>Any lost revenue, profits, or data</li>
                <li>Any third-party products or services purchased or obtained through the Service</li>
              </ul>

              <p>
                <strong>CancelKit is not liable for any lost revenue resulting from subscription cancellations processed through the Service.</strong> The Service is designed to facilitate subscription cancellations in compliance with applicable regulations, and you acknowledge that such cancellations may result in reduced revenue.
              </p>

              <h2>4. Governing Law</h2>
              <p>
                These Terms shall be governed and construed in accordance with the laws of the State of Delaware, United States, without regard to its conflict of law provisions.
              </p>

              <p>
                Our failure to enforce any right or provision of these Terms will not be considered a waiver of those rights. If any provision of these Terms is held to be invalid or unenforceable by a court, the remaining provisions of these Terms will remain in effect.
              </p>

              <h2>5. Changes to Terms</h2>
              <p>
                We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material, we will try to provide at least 30 days' notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion.
              </p>

              <p>
                By continuing to access or use our Service after those revisions become effective, you agree to be bound by the revised terms. If you do not agree to the new terms, please stop using the Service.
              </p>

              <h2>6. Contact Us</h2>
              <p>
                If you have any questions about these Terms, please contact us at:
              </p>
              <p>
                <a href="mailto:legal@cancelkit.com" className="text-primary-600 hover:text-primary-700">legal@cancelkit.com</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
