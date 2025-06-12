import Layout from '../components/Layout';
import Link from 'next/link';
import { EnvelopeIcon, ChatBubbleLeftRightIcon, DocumentTextIcon, AcademicCapIcon } from '@heroicons/react/24/outline';

export default function Support() {
  return (
    <Layout title="Support - CancelKit">
      <div className="bg-white">
        {/* Header */}
        <div className="bg-primary-600 text-white py-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold mb-4">Support</h1>
            <p className="text-primary-100">
              We're here to help you get the most out of CancelReady
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="py-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Contact Methods */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
              <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
                <div className="flex items-center mb-4">
                  <div className="bg-primary-100 p-3 rounded-full mr-4">
                    <EnvelopeIcon className="h-6 w-6 text-primary-600" />
                  </div>
                  <h2 className="text-xl font-semibold text-secondary-900">Email Support</h2>
                </div>
                <p className="text-secondary-600 mb-4">
                  Our team typically responds within 1 business day to all inquiries.
                </p>
                <a 
                  href="mailto:support@cancelkit.com" 
                  className="text-primary-600 font-medium hover:text-primary-700 flex items-center"
                >
                  support@cancelkit.com
                </a>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
                <div className="flex items-center mb-4">
                  <div className="bg-primary-100 p-3 rounded-full mr-4">
                    <ChatBubbleLeftRightIcon className="h-6 w-6 text-primary-600" />
                  </div>
                  <h2 className="text-xl font-semibold text-secondary-900">Live Chat</h2>
                </div>
                <p className="text-secondary-600 mb-4">
                  Available Monday through Friday, 9am to 5pm Eastern Time.
                </p>
                <button 
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  onClick={() => alert('Chat functionality would open here')}
                >
                  Start Chat
                </button>
              </div>
            </div>

            {/* FAQ Section */}
            <div className="mb-16">
              <h2 className="text-2xl font-bold text-secondary-900 mb-6">Frequently Asked Questions</h2>
              
              <div className="space-y-6">
                {[
                  {
                    question: "How do I integrate CancelKit with my website?",
                    answer: "Integrating CancelKit is simple. After signing up, you'll receive a JavaScript snippet to add to your website. For detailed instructions, check out our onboarding wizard or documentation."
                  },
                  {
                    question: "Which payment processors does CancelKit support?",
                    answer: "CancelKit currently supports Stripe, PayPal, Paddle, Chargebee, and Recurly. We're constantly adding more integrations. If you use a different payment processor, please contact us."
                  },
                  {
                    question: "Is CancelKit compliant with the FTC's Click to Cancel rule?",
                    answer: "Yes, CancelKit is specifically designed to help businesses comply with the FTC's Click to Cancel rule. Our solution makes it as easy for customers to cancel as it was to sign up, as required by the regulations."
                  },
                  {
                    question: "Can I customize the cancellation button and modal?",
                    answer: "Absolutely! You can customize the button text, colors, and placement. Premium plans also allow for full branding customization of the cancellation modal."
                  },
                  {
                    question: "How does CancelKit handle cancellation reporting?",
                    answer: "CancelKit automatically generates monthly compliance reports that document all cancellation requests and their outcomes. These reports are stored securely and can be accessed through your dashboard."
                  }
                ].map((faq, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-lg font-medium text-secondary-900 mb-2">{faq.question}</h3>
                    <p className="text-secondary-600">{faq.answer}</p>
                  </div>
                ))}
              </div>
              
              <div className="mt-6">
                <Link href="/docs" className="text-primary-600 font-medium hover:text-primary-700">
                  View all FAQs in our documentation →
                </Link>
              </div>
            </div>

            {/* Resources */}
            <div>
              <h2 className="text-2xl font-bold text-secondary-900 mb-6">Resources</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 flex flex-col">
                  <div className="flex items-center mb-4">
                    <DocumentTextIcon className="h-6 w-6 text-primary-600 mr-2" />
                    <h3 className="text-lg font-medium text-secondary-900">Documentation</h3>
                  </div>
                  <p className="text-secondary-600 mb-4 flex-grow">
                    Detailed guides and API references to help you integrate and use CancelKit.
                  </p>
                  <Link 
                    href="/docs" 
                    className="text-primary-600 font-medium hover:text-primary-700"
                  >
                    Browse Documentation →
                  </Link>
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 flex flex-col">
                  <div className="flex items-center mb-4">
                    <AcademicCapIcon className="h-6 w-6 text-primary-600 mr-2" />
                    <h3 className="text-lg font-medium text-secondary-900">Tutorials</h3>
                  </div>
                  <p className="text-secondary-600 mb-4 flex-grow">
                    Step-by-step tutorials for integrating CancelKit with various platforms.
                  </p>
                  <Link 
                    href="/docs/tutorials" 
                    className="text-primary-600 font-medium hover:text-primary-700"
                  >
                    View Tutorials →
                  </Link>
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 flex flex-col">
                  <div className="flex items-center mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-6 w-6 text-primary-600 mr-2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 0 1-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 0 1 1.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 0 0-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 0 1-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 0 0-3.375-3.375h-1.5a1.125 1.125 0 0 1-1.125-1.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H9.75" />
                    </svg>
                    <h3 className="text-lg font-medium text-secondary-900">Code Samples</h3>
                  </div>
                  <p className="text-secondary-600 mb-4 flex-grow">
                    Example code for various programming languages and frameworks.
                  </p>
                  <Link 
                    href="/docs/code-samples" 
                    className="text-primary-600 font-medium hover:text-primary-700"
                  >
                    Explore Code Samples →
                  </Link>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="mt-16 bg-gray-50 rounded-lg p-8">
              <h2 className="text-2xl font-bold text-secondary-900 mb-6">Contact Us</h2>
              <p className="text-secondary-600 mb-8">
                Can't find what you're looking for? Send us a message and we'll get back to you as soon as possible.
              </p>
              
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-secondary-700 mb-1">
                      Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      id="name"
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-secondary-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      id="email"
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-secondary-700 mb-1">
                    Subject
                  </label>
                  <input
                    type="text"
                    name="subject"
                    id="subject"
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                  />
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-secondary-700 mb-1">
                    Message
                  </label>
                  <textarea
                    name="message"
                    id="message"
                    rows={4}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                  ></textarea>
                </div>
                
                <div>
                  <button
                    type="submit"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    Send Message
                  </button>
                </div>
              </form>
            </div>

            {/* Office Information */}
            <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h2 className="text-xl font-bold text-secondary-900 mb-4">Our Office</h2>
                <p className="text-secondary-600 mb-2">
                  CancelKit, Inc.
                </p>
                <p className="text-secondary-600 mb-2">
                  123 Compliance Way, Suite 456
                </p>
                <p className="text-secondary-600 mb-2">
                  San Francisco, CA 94103
                </p>
                <p className="text-secondary-600 mb-2">
                  United States
                </p>
              </div>
              
              <div>
                <h2 className="text-xl font-bold text-secondary-900 mb-4">Business Hours</h2>
                <p className="text-secondary-600 mb-2">
                  <strong>Monday - Friday:</strong> 9:00 AM - 5:00 PM (Eastern Time)
                </p>
                <p className="text-secondary-600 mb-2">
                  <strong>Saturday - Sunday:</strong> Closed
                </p>
                <p className="text-secondary-600 mt-4">
                  Email support is available 24/7, with responses during business hours.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
