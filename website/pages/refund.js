import Layout from '../components/Layout';
import Link from 'next/link';

export default function Refund() {
  return (
    <Layout title="Refund Policy - CancelReady">
      <div className="bg-white">
        {/* Header */}
        <div className="bg-primary-600 text-white py-12">
          <div className="container-custom">
            <h1 className="text-3xl font-bold mb-4">Refund Policy</h1>
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
                At CancelReady, we want you to be completely satisfied with our service. We understand that sometimes a product might not be the right fit for your business, which is why we offer a straightforward refund policy.
              </p>

              <div className="bg-green-50 border-l-4 border-green-500 p-5 my-8">
                <h2 className="text-green-800 text-xl font-bold mt-0">14-Day Money-Back Guarantee</h2>
                <p className="text-green-700 mb-0">
                  We offer a 14-day no-questions-asked money-back guarantee on all our plans. If you're not satisfied with CancelReady for any reason, simply contact us within 14 days of your purchase for a full refund.
                </p>
              </div>

              <h2>How to Request a Refund</h2>
              <p>
                To request a refund, please contact our support team at <a href="mailto:support@cancelready.com" className="text-primary-600 hover:text-primary-700">support@cancelready.com</a> with the following information:
              </p>
              <ul>
                <li>Your account email address</li>
                <li>Date of purchase</li>
                <li>Plan purchased</li>
              </ul>
              <p>
                You can also request a refund through our support chat available on our website during business hours.
              </p>

              <h2>Refund Process</h2>
              <p>
                Once we receive your refund request:
              </p>
              <ol>
                <li>Our team will verify your purchase date to ensure it falls within the 14-day refund period.</li>
                <li>We will process your refund within 3-5 business days.</li>
                <li>The refund will be issued to the original payment method used for the purchase.</li>
                <li>You will receive an email confirmation once the refund has been processed.</li>
              </ol>
              <p>
                Please note that depending on your payment provider, it may take an additional 5-10 business days for the refunded amount to appear in your account.
              </p>

              <h2>Eligibility</h2>
              <p>
                To be eligible for a refund:
              </p>
              <ul>
                <li>Your request must be made within 14 days of the initial purchase.</li>
                <li>Your account must be in good standing.</li>
                <li>For the Done-For-You (DFY) plan, refunds are available only if the implementation process has not yet begun.</li>
              </ul>

              <h2>Special Considerations</h2>
              <p>
                <strong>Early-bird Lifetime Plan:</strong> The 14-day money-back guarantee applies to our Lifetime plan as well. If you're not satisfied within the first 14 days, you can request a full refund.
              </p>
              <p>
                <strong>Agency Bundle:</strong> Refunds for the Agency Bundle are available within 14 days, provided that the service has not been deployed on more than one domain.
              </p>
              <p>
                <strong>Monthly Subscriptions:</strong> For our Compliance SaaS plan, you can cancel your subscription at any time. If you cancel within the first 14 days of your initial subscription, you will receive a full refund. No refunds are provided for partial months.
              </p>

              <h2>After the 14-Day Period</h2>
              <p>
                After the 14-day refund period has expired:
              </p>
              <ul>
                <li>One-time purchases (Lifetime, DFY, Agency Bundle) are non-refundable.</li>
                <li>For subscription plans, you can cancel at any time to prevent future charges, but no refunds will be issued for the current billing period.</li>
              </ul>

              <h2>Exceptions</h2>
              <p>
                In certain circumstances, we may consider refund requests outside of the 14-day period:
              </p>
              <ul>
                <li>If there is a major service outage that significantly impacts your business.</li>
                <li>If we fail to deliver on a promised feature that was material to your purchase decision.</li>
              </ul>
              <p>
                These exceptions are evaluated on a case-by-case basis and are at the sole discretion of CancelReady.
              </p>

              <h2>Contact Us</h2>
              <p>
                If you have any questions about our refund policy, please contact us at:
              </p>
              <p>
                <a href="mailto:support@cancelready.com" className="text-primary-600 hover:text-primary-700">support@cancelready.com</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
