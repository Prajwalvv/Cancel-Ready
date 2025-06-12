import Layout from '../../components/Layout';
import Link from 'next/link';
import { useState } from 'react';
import { ChevronRightIcon, ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/solid';

// FAQ categories and questions
const faqCategories = [
  {
    id: 'general',
    name: 'General Questions',
    questions: [
      {
        id: 'what-is-cancelready',
        question: 'What is CancelReady?',
        answer: `CancelReady is a comprehensive subscription management platform that helps businesses comply with the FTC's "Click to Cancel" rule. Our solution combines an easy-to-implement cancellation flow with a powerful dashboard for managing cancellations, all while ensuring full regulatory compliance and providing valuable analytics.`
      },
      {
        id: 'ftc-compliance',
        question: 'Is CancelReady compliant with the FTC\'s Click to Cancel rule?',
        answer: `Yes, CancelReady is specifically designed to help businesses comply with the FTC's Click to Cancel rule. Our solution provides a simple cancellation mechanism that's as easy to use as the signup process, as required by the regulation. We also provide compliance documentation and regular updates to ensure ongoing compliance as regulations evolve.`
      },
      {
        id: 'how-works',
        question: 'How does CancelReady work?',
        answer: `CancelReady consists of two main components: a website with an onboarding flow and an admin dashboard. The onboarding flow guides you through setting up a cancellation button on your website. When a user clicks this button, they're presented with a customizable cancellation flow. The admin dashboard allows you to manage cancellations, view analytics, and ensure compliance. All cancellation data is securely stored and accessible through the dashboard, with authentication required for access.`
      },
      {
        id: 'pricing',
        question: 'How much does CancelReady cost?',
        answer: `CancelReady offers several pricing options to fit your needs. We have an Early-bird Lifetime plan for $999 (one-time payment), a Compliance SaaS plan at $49/month, a Done-For-You (DFY) plan for $9,999 with white-glove installation, and an Agency Bundle for $4,999 that covers 5 domains. Each plan includes different features like compliance reporting, API access, custom branding, and support options. Visit our <a href="/pricing" class="text-primary-600 hover:underline">pricing page</a> for complete details.`
      },
      {
        id: 'refund-policy',
        question: 'What is your refund policy?',
        answer: `We offer a 14-day no-questions-asked money-back guarantee on all our plans. If you're not satisfied with CancelReady for any reason, simply contact us within 14 days of your purchase for a full refund. For more details, please visit our <a href="/refund" class="text-primary-600 hover:underline">refund policy page</a>.`
      }
    ]
  },
  {
    id: 'technical',
    name: 'Technical Questions',
    questions: [
      {
        id: 'integration',
        question: 'How do I integrate CancelReady with my website?',
        answer: `Integrating CancelReady is straightforward. First, you'll create an account and go through our onboarding flow. After authentication, you'll be guided through the setup process where you can customize your cancellation flow. Then, you'll receive a JavaScript snippet to add to your website along with instructions for implementation. Our dashboard provides all the tools you need to manage your integration, view analytics, and ensure compliance. For detailed instructions, check out our <a href="/docs" class="text-primary-600 hover:underline">documentation</a>.`
      },
      {
        id: 'payment-processors',
        question: 'Which payment processors does CancelReady support?',
        answer: `CancelReady integrates with all major payment processors including Stripe, PayPal, Braintree, Chargebee, Recurly, and more. Our dashboard allows you to configure multiple payment processor connections and manage them all from one central location. If you use a payment processor not on our list, please <a href="/support" class="text-primary-600 hover:underline">contact us</a> to discuss custom integration options.`
      },
      {
        id: 'customization',
        question: 'Can I customize the cancellation button and modal?',
        answer: `Absolutely! You can customize the button text, colors, and placement. Premium plans also allow for full branding customization of the cancellation modal, including custom text, logos, and styling to match your brand.`
      },
      {
        id: 'spa-compatibility',
        question: 'Does CancelReady work with single-page applications (SPAs)?',
        answer: `Yes, CancelReady works seamlessly with single-page applications built with frameworks like React, Vue, or Angular. For SPAs, we recommend initializing CancelReady after your app has loaded and the target element is available in the DOM. Check our <a href="/docs/tutorials" class="text-primary-600 hover:underline">tutorials</a> for framework-specific integration guides.`
      },
      {
        id: 'testing',
        question: 'How do I test CancelReady without affecting real subscriptions?',
        answer: `CancelReady provides a test mode that you can use to simulate the cancellation flow without making actual API calls to your payment processor. To enable test mode, set the 'testMode' option to true in your initialization code. All test cancellations will be logged in your dashboard for verification.`
      }
    ]
  },
  {
    id: 'compliance',
    name: 'Compliance & Security',
    questions: [
      {
        id: 'data-storage',
        question: 'How does CancelReady store cancellation data?',
        answer: `CancelReady securely stores cancellation records in our SOC 2 compliant database. Each record includes the timestamp, user ID, subscription details, and outcome of the cancellation request. This data is used to generate compliance reports and is accessible through your dashboard.`
      },
      {
        id: 'reports',
        question: 'How does CancelReady handle cancellation reporting?',
        answer: `CancelReady automatically generates monthly compliance reports that document all cancellation requests and their outcomes. These reports are stored securely and can be accessed through your dashboard. They provide an audit trail that can be invaluable in case of regulatory inquiries.`
      },
      {
        id: 'data-retention',
        question: 'How long does CancelReady retain cancellation data?',
        answer: `CancelReady retains cancellation records for a minimum of 7 years to ensure compliance with various regulations. This exceeds the FTC's requirement of 3 years for record keeping. If you need a custom data retention policy, please contact our support team.`
      },
      {
        id: 'security',
        question: 'How secure is CancelReady?',
        answer: `CancelReady employs industry-standard security measures, including encryption of data in transit and at rest, regular security audits, and secure API authentication. We do not store payment information directly; instead, we integrate with your existing payment processor's secure API.`
      },
      {
        id: 'regulatory-updates',
        question: 'How does CancelReady stay current with regulatory changes?',
        answer: `Our legal and compliance team continuously monitors changes to FTC regulations and other relevant laws. When regulations change, we update our service to ensure continued compliance and notify our customers about important changes and how our updates address new requirements.`
      }
    ]
  },
  {
    id: 'features',
    name: 'Features & Functionality',
    questions: [
      {
        id: 'feedback-collection',
        question: 'Can I collect feedback from users when they cancel?',
        answer: `Yes, CancelReady includes an optional feedback collection feature. When enabled, users will be prompted to provide a reason for cancellation before confirming. This data is stored in your dashboard and can be exported for analysis to help improve your retention strategies.`
      },
      {
        id: 'error-handling',
        question: 'How does CancelReady handle errors during the cancellation process?',
        answer: `If an error occurs during the cancellation process, CancelReady will display a customizable error message to the user. The error details are logged in your dashboard, and you can set up notifications to be alerted when errors occur. You can also specify a fallback action, such as redirecting to a support page or showing contact information.`
      },
      {
        id: 'multiple-sites',
        question: 'Can I use CancelReady with multiple websites or products?',
        answer: `Yes, depending on your plan. The Agency Bundle specifically allows you to use CancelReady on multiple domains. For each website or product, you'll need to use a different configuration with the appropriate vendorKey and settings.`
      },
      {
        id: 'analytics',
        question: 'Does CancelReady provide analytics on cancellations?',
        answer: `Yes, the CancelReady dashboard provides analytics on cancellation rates, common cancellation reasons (if feedback collection is enabled), and trends over time. This data can help you identify patterns and potentially address issues that are causing customers to cancel.`
      },
      {
        id: 'api-access',
        question: 'Does CancelReady offer API access?',
        answer: `Yes, CancelReady provides a REST API that allows you to programmatically retrieve cancellation records, generate reports, and manage your CancelReady configuration. API access is available on Pro plans and above. For complete API documentation, visit our <a href="/docs/api" class="text-primary-600 hover:underline">API Reference</a>.`
      }
    ]
  },
  {
    id: 'support',
    name: 'Support & Resources',
    questions: [
      {
        id: 'support-options',
        question: 'What support options are available?',
        answer: `CancelReady offers email support for all plans, with response times typically within 1 business day. Pro plans and above also have access to live chat support during business hours. Our Enterprise plan includes dedicated support with custom SLAs. Visit our <a href="/support" class="text-primary-600 hover:underline">support page</a> for contact information.`
      },
      {
        id: 'documentation',
        question: 'Where can I find documentation for CancelReady?',
        answer: `Comprehensive documentation is available in our <a href="/docs" class="text-primary-600 hover:underline">documentation center</a>, including a quick-start guide, API reference, and integration tutorials for various platforms and frameworks.`
      },
      {
        id: 'custom-development',
        question: 'Do you offer custom development or integration services?',
        answer: `Yes, our team can provide custom development and integration services for businesses with specific needs. This is particularly useful for complex integrations or custom workflows. Contact our sales team to discuss your requirements and get a quote.`
      },
      {
        id: 'training',
        question: 'Do you provide training for using CancelReady?',
        answer: `Yes, we offer onboarding sessions for new customers to help them get the most out of CancelReady. Pro and Enterprise plans include personalized onboarding calls. We also provide regular webinars and training materials in our knowledge base.`
      },
      {
        id: 'feature-requests',
        question: 'How can I request new features?',
        answer: `We welcome feature requests from our customers. You can submit feature requests through your dashboard or by contacting our support team. We regularly review customer feedback and prioritize new features based on demand and alignment with our product roadmap.`
      }
    ]
  }
];

export default function FAQ() {
  const [activeCategory, setActiveCategory] = useState('general');
  const [expandedQuestions, setExpandedQuestions] = useState({});

  // Toggle question expansion
  const toggleQuestion = (questionId) => {
    setExpandedQuestions(prev => ({
      ...prev,
      [questionId]: !prev[questionId]
    }));
  };

  // Find the current category
  const currentCategory = faqCategories.find(category => category.id === activeCategory);

  return (
    <Layout title="FAQ - CancelReady Documentation">
      <div className="bg-white">
        {/* Header */}
        <div className="bg-primary-600 text-white py-12">
          <div className="container-custom">
            <div className="flex items-center space-x-2 text-sm text-primary-100 mb-2">
              <Link href="/docs" className="hover:text-white">Documentation</Link>
              <ChevronRightIcon className="h-4 w-4" />
              <span>Frequently Asked Questions</span>
            </div>
            <h1 className="text-3xl font-bold mb-4">Frequently Asked Questions</h1>
            <p className="text-primary-100 max-w-3xl">
              Find answers to common questions about CancelReady and how it can help your business comply with the FTC's "Click to Cancel" rule.
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="container-custom py-12">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar Navigation */}
            <div className="lg:w-64 flex-shrink-0">
              <div className="sticky top-8">
                <h2 className="text-xs font-semibold text-secondary-900 uppercase tracking-wider mb-3">
                  Categories
                </h2>
                <nav className="space-y-1 mb-8">
                  {faqCategories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setActiveCategory(category.id)}
                      className={`flex items-center px-4 py-2 w-full text-left text-sm rounded-md ${
                        activeCategory === category.id
                          ? 'bg-primary-50 text-primary-700 font-medium'
                          : 'text-secondary-600 hover:bg-secondary-50'
                      }`}
                    >
                      {category.name}
                    </button>
                  ))}
                </nav>
                
                <div className="mt-8 p-4 bg-secondary-50 rounded-md">
                  <h3 className="text-sm font-medium text-secondary-900 mb-2">Can't find an answer?</h3>
                  <p className="text-sm text-secondary-600 mb-3">
                    Our support team is ready to help with any questions you may have.
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
              {currentCategory && (
                <div>
                  <h2 className="text-2xl font-bold text-secondary-900 mb-6">{currentCategory.name}</h2>
                  
                  <div className="space-y-4">
                    {currentCategory.questions.map((faq) => (
                      <div key={faq.id} className="border border-secondary-200 rounded-lg overflow-hidden">
                        <button
                          onClick={() => toggleQuestion(faq.id)}
                          className="w-full flex justify-between items-center px-6 py-4 text-left focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                        >
                          <h3 className="text-lg font-medium text-secondary-900">{faq.question}</h3>
                          {expandedQuestions[faq.id] ? (
                            <ChevronUpIcon className="h-5 w-5 text-secondary-500" />
                          ) : (
                            <ChevronDownIcon className="h-5 w-5 text-secondary-500" />
                          )}
                        </button>
                        
                        {expandedQuestions[faq.id] && (
                          <div className="px-6 py-4 bg-secondary-50 border-t border-secondary-200">
                            <div 
                              className="prose prose-primary max-w-none"
                              dangerouslySetInnerHTML={{ __html: faq.answer }}
                            />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Search and Related Links */}
              <div className="mt-12 pt-8 border-t border-secondary-200">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Search */}
                  <div>
                    <h3 className="text-lg font-semibold text-secondary-900 mb-4">Search the FAQ</h3>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <input
                        type="text"
                        className="focus:ring-primary-500 focus:border-primary-500 block w-full pl-4 pr-10 py-3 sm:text-sm border-secondary-300 rounded-md"
                        placeholder="Search for answers..."
                      />
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-secondary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                  
                  {/* Related Links */}
                  <div>
                    <h3 className="text-lg font-semibold text-secondary-900 mb-4">Related Resources</h3>
                    <ul className="space-y-3">
                      <li>
                        <Link 
                          href="/docs/api" 
                          className="text-primary-600 hover:text-primary-700 flex items-center"
                        >
                          <ChevronRightIcon className="h-4 w-4 mr-1 flex-shrink-0" />
                          <span>API Reference</span>
                        </Link>
                      </li>
                      <li>
                        <Link 
                          href="/docs/tutorials" 
                          className="text-primary-600 hover:text-primary-700 flex items-center"
                        >
                          <ChevronRightIcon className="h-4 w-4 mr-1 flex-shrink-0" />
                          <span>Integration Tutorials</span>
                        </Link>
                      </li>
                      <li>
                        <Link 
                          href="/compliance" 
                          className="text-primary-600 hover:text-primary-700 flex items-center"
                        >
                          <ChevronRightIcon className="h-4 w-4 mr-1 flex-shrink-0" />
                          <span>FTC Compliance Statement</span>
                        </Link>
                      </li>
                      <li>
                        <Link 
                          href="/pricing" 
                          className="text-primary-600 hover:text-primary-700 flex items-center"
                        >
                          <ChevronRightIcon className="h-4 w-4 mr-1 flex-shrink-0" />
                          <span>Pricing Plans</span>
                        </Link>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
