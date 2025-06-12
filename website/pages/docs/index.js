import Layout from '../../components/Layout';
import Link from 'next/link';
import { useState } from 'react';
import { CodeBracketIcon, BookOpenIcon, QuestionMarkCircleIcon } from '@heroicons/react/24/outline';

// Documentation navigation
const sections = [
  { id: 'quickstart', name: 'Quick-start', icon: CodeBracketIcon },
  { id: 'api', name: 'API Reference', icon: BookOpenIcon },
  { id: 'faq', name: 'FAQ', icon: QuestionMarkCircleIcon },
];

export default function Docs() {
  const [activeSection, setActiveSection] = useState('quickstart');

  return (
    <Layout title="Documentation - CancelReady">
      <div className="bg-white">
        {/* Documentation Header */}
        <div className="bg-primary-600 text-white py-12">
          <div className="container-custom">
            <h1 className="text-3xl font-bold mb-4">Documentation</h1>
            <p className="text-primary-100 max-w-3xl">
              Everything you need to know about implementing and using CancelReady for your subscription business.
            </p>
          </div>
        </div>

        {/* Documentation Content */}
        <div className="container-custom py-12">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar Navigation */}
            <div className="lg:w-64 flex-shrink-0">
              <div className="sticky top-8">
                <nav className="space-y-1">
                  {sections.map((section) => (
                    <button
                      key={section.id}
                      onClick={() => setActiveSection(section.id)}
                      className={`flex items-center px-4 py-3 w-full text-left rounded-md ${
                        activeSection === section.id
                          ? 'bg-primary-50 text-primary-700 font-medium'
                          : 'text-secondary-600 hover:bg-secondary-50'
                      }`}
                    >
                      <section.icon className="h-5 w-5 mr-3" aria-hidden="true" />
                      <span>{section.name}</span>
                    </button>
                  ))}
                </nav>
                <div className="mt-8 p-4 bg-secondary-50 rounded-md">
                  <h3 className="text-sm font-medium text-secondary-900 mb-2">Need help?</h3>
                  <p className="text-sm text-secondary-600 mb-3">
                    Can't find what you're looking for or have questions?
                  </p>
                  <Link
                    href="/support"
                    className="text-sm font-medium text-primary-600 hover:text-primary-700"
                  >
                    Contact Support →
                  </Link>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1">
              {/* Quick-start Section */}
              {activeSection === 'quickstart' && (
                <div>
                  <h2 className="text-2xl font-bold text-secondary-900 mb-6">Quick-start Guide</h2>
                  
                  <div className="prose max-w-none">
                    <p>
                      Getting started with CancelReady is simple. Follow these steps to add a cancellation button to your website in minutes.
                    </p>

                    <h3>Step 1: Add the CancelReady Script</h3>
                    <p>
                      Add the following script tag to your website's HTML, preferably just before the closing <code>&lt;/body&gt;</code> tag:
                    </p>
                    <div className="bg-secondary-800 text-white p-4 rounded-md overflow-x-auto">
                      <pre className="text-sm">
                        {`<script src="https://cancelready.com/cancelkit.min.js"></script>
<script>
  CancelReady.init({
    vendorKey: 'your_vendor_key',
    userId: 'current_user_id'
  });
</script>`}
                      </pre>
                    </div>

                    <h3>Step 2: Add a Target Element</h3>
                    <p>
                      Add a div with the ID <code>ck-target</code> where you want the cancellation button to appear:
                    </p>
                    <div className="bg-secondary-800 text-white p-4 rounded-md overflow-x-auto">
                      <pre className="text-sm">
                        {`<div id="ck-target"></div>`}
                      </pre>
                    </div>

                    <h3>Step 3: User ID Mapping (Critical)</h3>
                    <p>The <code>userId</code> parameter is critical for successful cancellation. It must match the identifier you used when creating the subscription in your payment processor:</p>
                    
                    <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 my-4">
                      <h4 className="text-yellow-800 font-medium">Important: User ID Mapping</h4>
                      <p className="text-yellow-700 mt-1">The <code>userId</code> you provide must match how you've stored the user in your payment processor:</p>
                      <ul className="list-disc pl-5 text-yellow-700 mt-2">
                        <li><strong>For Stripe:</strong> Store the user ID in subscription metadata when creating subscriptions</li>
                        <li><strong>For Paddle:</strong> Store the user ID in the passthrough field when creating subscriptions</li>
                      </ul>
                    </div>
                    
                    <h4>Stripe Integration Example:</h4>
                    <div className="bg-secondary-800 text-white p-4 rounded-md overflow-x-auto mb-4">
                      <pre className="text-sm">
                        {`// When creating a subscription in Stripe\nconst subscription = await stripe.subscriptions.create({\n  customer: stripeCustomerId,\n  items: [{ price: 'price_123' }],\n  metadata: {\n    userId: 'user_123'  // MUST MATCH the userId you pass to CancelReady\n  }\n});`}
                      </pre>
                    </div>
                    
                    <h4>Paddle Integration Example:</h4>
                    <div className="bg-secondary-800 text-white p-4 rounded-md overflow-x-auto mb-4">
                      <pre className="text-sm">
                        {`// When creating a subscription in Paddle\nconst subscription = await paddle.createSubscription({\n  planId: 'plan_123',\n  customerId: 'paddle-customer-id',\n  passthrough: JSON.stringify({\n    userId: 'user_123'  // MUST MATCH the userId you pass to CancelReady\n  })\n});`}
                      </pre>
                    </div>
                    
                    <h3>Step 4: Customize (Optional)</h3>
                    <p>You can customize the appearance and behavior of the cancellation button by passing additional options to the <code>init</code> method:</p>
                    <div className="bg-secondary-800 text-white p-4 rounded-md overflow-x-auto">
                      <pre className="text-sm">
                        {`CancelReady.init({\n  vendorKey: 'your_vendor_key',\n  userId: 'user_123',  // MUST match the ID in your payment processor\n  buttonText: 'Cancel your subscription',\n  buttonColor: '#ef4444',\n  modalTitle: 'Cancel Subscription',\n  modalMessage: 'Are you sure you want to cancel?',\n  confirmButtonText: 'Yes, cancel now',\n  cancelButtonText: 'No, keep my subscription',\n  successMessage: 'Your subscription has been canceled successfully.',\n  errorMessage: 'There was an error canceling your subscription. Please try again.',\n  testMode: true  // Set to false in production\n});`}
                      </pre>
                    </div>

                    <h3>Step 4: Test the Integration</h3>
                    <p>
                      After adding the script and target element, you should see a "Cancel subscription" button on your page. Click it to test the cancellation flow.
                    </p>
                    <p>
                      For testing purposes, you can use the test vendor key <code>test_vendor_key</code> and any user ID. This will simulate the cancellation process without making actual API calls.
                    </p>

                    <div className="bg-primary-50 border-l-4 border-primary-500 p-4 my-6">
                      <h4 className="text-primary-800 font-medium">Pro Tip</h4>
                      <p className="text-primary-700 mt-1">
                        For a more guided setup experience, use our <Link href="/onboard" className="text-primary-600 underline">onboarding wizard</Link> to generate a custom integration snippet for your specific needs.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* API Reference Section */}
              {activeSection === 'api' && (
                <div>
                  <h2 className="text-2xl font-bold text-secondary-900 mb-6">API Reference</h2>
                  
                  <div className="prose max-w-none">
                    <p>
                      CancelReady provides a simple API for integrating with your existing systems. This reference documents all available endpoints and parameters.
                    </p>

                    <h3>Authentication</h3>
                    <p>
                      All API requests require authentication using your vendor key. Include your vendor key in the <code>vendorKey</code> header of all requests.
                    </p>

                    <h3>Base URL</h3>
                    <p>
                      All API endpoints are relative to:
                    </p>
                    <div className="bg-secondary-800 text-white p-4 rounded-md overflow-x-auto">
                      <pre className="text-sm">
                        {`https://api.cancelready.com/v1`}
                      </pre>
                    </div>

                    <h3>Endpoints</h3>

                    <h4>Cancel Subscription</h4>
                    <div className="bg-secondary-50 p-4 rounded-md mb-6">
                      <div className="flex items-center mb-2">
                        <span className="bg-green-500 text-white px-2 py-1 rounded text-xs font-bold mr-2">POST</span>
                        <code className="text-secondary-800">/cancel</code>
                      </div>
                      <p className="text-sm text-secondary-600 mb-4">
                        Cancels a user's subscription immediately.
                      </p>
                      <h5 className="font-medium text-secondary-900 mb-2">Headers</h5>
                      <ul className="list-disc pl-5 mb-4 text-sm">
                        <li><code>vendorKey</code> (required): Your vendor API key</li>
                        <li><code>Content-Type</code>: application/json</li>
                      </ul>
                      <h5 className="font-medium text-secondary-900 mb-2">Request Body</h5>
                      <div className="bg-secondary-800 text-white p-3 rounded-md overflow-x-auto mb-4">
                        <pre className="text-sm">
                          {`{
  "userId": "user_123"
}`}
                        </pre>
                      </div>
                      <h5 className="font-medium text-secondary-900 mb-2">Response</h5>
                      <div className="bg-secondary-800 text-white p-3 rounded-md overflow-x-auto">
                        <pre className="text-sm">
                          {`{
  "status": "done"
}`}
                        </pre>
                      </div>
                    </div>

                    <h4>Get Cancellation Records</h4>
                    <div className="bg-secondary-50 p-4 rounded-md mb-6">
                      <div className="flex items-center mb-2">
                        <span className="bg-blue-500 text-white px-2 py-1 rounded text-xs font-bold mr-2">GET</span>
                        <code className="text-secondary-800">/cancellations</code>
                      </div>
                      <p className="text-sm text-secondary-600 mb-4">
                        Retrieves cancellation records for your vendor account.
                      </p>
                      <h5 className="font-medium text-secondary-900 mb-2">Headers</h5>
                      <ul className="list-disc pl-5 mb-4 text-sm">
                        <li><code>vendorKey</code> (required): Your vendor API key</li>
                      </ul>
                      <h5 className="font-medium text-secondary-900 mb-2">Query Parameters</h5>
                      <ul className="list-disc pl-5 mb-4 text-sm">
                        <li><code>startDate</code>: Filter by start date (ISO format)</li>
                        <li><code>endDate</code>: Filter by end date (ISO format)</li>
                        <li><code>limit</code>: Maximum number of records to return (default: 50)</li>
                        <li><code>offset</code>: Pagination offset (default: 0)</li>
                      </ul>
                      <h5 className="font-medium text-secondary-900 mb-2">Response</h5>
                      <div className="bg-secondary-800 text-white p-3 rounded-md overflow-x-auto">
                        <pre className="text-sm">
                          {`{
  "data": [
    {
      "id": "cancel_123",
      "userId": "user_456",
      "time": "2025-05-24T12:34:56Z",
      "ip": "192.168.1.1",
      "result": { "status": "success" }
    },
    // More records...
  ],
  "pagination": {
    "total": 120,
    "limit": 50,
    "offset": 0
  }
}`}
                        </pre>
                      </div>
                    </div>

                    <h4>Get Monthly Reports</h4>
                    <div className="bg-secondary-50 p-4 rounded-md">
                      <div className="flex items-center mb-2">
                        <span className="bg-blue-500 text-white px-2 py-1 rounded text-xs font-bold mr-2">GET</span>
                        <code className="text-secondary-800">/reports</code>
                      </div>
                      <p className="text-sm text-secondary-600 mb-4">
                        Retrieves links to monthly compliance reports.
                      </p>
                      <h5 className="font-medium text-secondary-900 mb-2">Headers</h5>
                      <ul className="list-disc pl-5 mb-4 text-sm">
                        <li><code>vendorKey</code> (required): Your vendor API key</li>
                      </ul>
                      <h5 className="font-medium text-secondary-900 mb-2">Query Parameters</h5>
                      <ul className="list-disc pl-5 mb-4 text-sm">
                        <li><code>year</code>: Filter by year (e.g., 2025)</li>
                        <li><code>month</code>: Filter by month (1-12)</li>
                      </ul>
                      <h5 className="font-medium text-secondary-900 mb-2">Response</h5>
                      <div className="bg-secondary-800 text-white p-3 rounded-md overflow-x-auto">
                        <pre className="text-sm">
                          {`{
  "reports": [
    {
      "id": "report_123",
      "month": "May 2025",
      "url": "https://storage.cancelready.com/reports/vendor_123/2025-05-report.pdf",
      "createdAt": "2025-06-01T00:00:00Z"
    },
    // More reports...
  ]
}`}
                        </pre>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* FAQ Section */}
              {activeSection === 'faq' && (
                <div>
                  <h2 className="text-2xl font-bold text-secondary-900 mb-6">Frequently Asked Questions</h2>
                  
                  <div className="space-y-6">
                    {[
                      {
                        question: "How does CancelReady handle different payment processors?",
                        answer: "CancelReady integrates with major payment processors including Stripe, PayPal, and Paddle. When a user cancels their subscription, we use the appropriate API to cancel the subscription in your payment processor. You can specify which payment processor you're using in your account settings."
                      },
                      {
                        question: "Is CancelReady compliant with the FTC's Click to Cancel rule?",
                        answer: "Yes, CancelReady is fully compliant with the FTC's Click to Cancel rule. Our solution provides a simple cancellation mechanism that's as easy to use as the signup process, as required by the regulation. We also provide compliance documentation and regular updates to ensure ongoing compliance as regulations evolve."
                      },
                      {
                        question: "Can I customize the appearance of the cancellation button and modal?",
                        answer: "Yes, you can fully customize the appearance of the cancellation button and modal to match your brand. This includes colors, text, fonts, and even the layout of the modal. You can make these customizations through our dashboard or by passing configuration options to the CancelReady.init() method."
                      },
                      {
                        question: "Does CancelReady work with single-page applications (SPAs)?",
                        answer: "Yes, CancelReady works seamlessly with single-page applications built with frameworks like React, Vue, or Angular. For SPAs, we recommend initializing CancelReady after your app has loaded and the target element is available in the DOM."
                      },
                      {
                        question: "How do I test CancelReady without affecting real subscriptions?",
                        answer: "CancelReady provides a test mode that you can use to simulate the cancellation flow without making actual API calls to your payment processor. To enable test mode, use the test vendor key provided in your dashboard and set the 'testMode' option to true in your initialization code."
                      },
                      {
                        question: "Can I collect feedback from users when they cancel?",
                        answer: "Yes, CancelReady includes an optional feedback collection feature. When enabled, users will be prompted to provide a reason for cancellation before confirming. This data is stored in your dashboard and can be exported for analysis to help improve your retention strategies."
                      },
                      {
                        question: "How does CancelReady handle errors during the cancellation process?",
                        answer: "If an error occurs during the cancellation process, CancelReady will display a customizable error message to the user. The error details are logged in your dashboard, and you can set up notifications to be alerted when errors occur. You can also specify a fallback action, such as redirecting to a support page or showing contact information."
                      },
                      {
                        question: "Can I use CancelReady with multiple websites or products?",
                        answer: "Yes, depending on your plan. The Agency Bundle specifically allows you to use CancelReady on up to 5 domains. For each website or product, you'll need to use a different configuration with the appropriate vendorKey and settings."
                      },
                    ].map((faq, index) => (
                      <div key={index} className="bg-white border border-secondary-200 rounded-lg shadow-sm">
                        <div className="px-6 py-5">
                          <h3 className="text-lg font-semibold text-secondary-900">{faq.question}</h3>
                        </div>
                        <div className="px-6 py-5 bg-secondary-50 border-t border-secondary-200">
                          <p className="text-secondary-600">{faq.answer}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
