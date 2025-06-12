import Layout from '../components/Layout';
import Link from 'next/link';
import { CheckIcon } from '@heroicons/react/24/solid';

export default function Compliance() {
  return (
    <Layout title="Compliance Statement - CancelKit">
      <div className="bg-white">
        {/* Header */}
        <div className="bg-primary-600 text-white py-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold mb-4">FTC Compliance Statement</h1>
            <p className="text-primary-100">
              How CancelReady helps you comply with the FTC's "Click to Cancel" rule
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="py-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="prose prose-lg max-w-none">
              <p>
                The Federal Trade Commission (FTC) has implemented the "Click to Cancel" rule, which requires businesses to make it as easy for consumers to cancel their subscriptions as it was to sign up. CancelKit is designed specifically to help businesses comply with these regulations while maintaining a positive customer experience.
              </p>

              <p>
                This document outlines how CancelKit maps to specific sections of the FTC rule and helps your business achieve compliance.
              </p>

              <div className="bg-primary-50 p-6 rounded-lg my-8">
                <h2 className="text-primary-800 text-xl font-bold mt-0">Key FTC Requirements and CancelKit Compliance</h2>
                
                <div className="space-y-6 mt-6">
                  {[
                    {
                      rule: "16 CFR § 425.1(b)(1) - Simple Cancellation Mechanism",
                      requirement: "Sellers must provide a simple cancellation mechanism that is at least as easy to use as the method the consumer used to sign up for the subscription.",
                      implementation: "CancelKit provides a one-click cancellation button that can be placed anywhere on your website, making it as easy to cancel as it was to sign up."
                    },
                    {
                      rule: "16 CFR § 425.1(b)(2) - Cancellation Methods",
                      requirement: "If a consumer can sign up online, the seller must provide a simple cancellation mechanism online.",
                      implementation: "CancelKit's solution is entirely online, allowing customers to cancel with minimal steps directly from your website."
                    },
                    {
                      rule: "16 CFR § 425.1(b)(3) - Immediate Effect",
                      requirement: "Cancellation requests must be effective immediately upon receipt.",
                      implementation: "CancelKit processes cancellations immediately through direct API integration with your payment processor (Stripe, PayPal, etc.)."
                    },
                    {
                      rule: "16 CFR § 425.1(c) - Record Keeping",
                      requirement: "Sellers must maintain records of cancellation requests for at least 3 years.",
                      implementation: "CancelKit automatically logs all cancellation requests, timestamps, and results, storing this data securely for a minimum of 7 years."
                    },
                    {
                      rule: "16 CFR § 425.1(d) - Confirmation",
                      requirement: "Sellers must provide consumers with confirmation of their cancellation.",
                      implementation: "CancelKit displays a confirmation message immediately after cancellation and can optionally send an email confirmation to the customer."
                    },
                    {
                      rule: "16 CFR § 425.2 - Negative Option Disclosure",
                      requirement: "Clear and conspicuous disclosure of material terms before obtaining billing information.",
                      implementation: "While primarily focused on cancellation, CancelKit's modal can include links to your terms and conditions for full transparency."
                    }
                  ].map((item, index) => (
                    <div key={index} className="border-l-4 border-primary-500 pl-4">
                      <h3 className="text-primary-800 font-bold mt-0">{item.rule}</h3>
                      <p className="font-medium text-secondary-700 mb-2">{item.requirement}</p>
                      <div className="flex">
                        <CheckIcon className="h-6 w-6 text-green-500 flex-shrink-0 mr-2" />
                        <p className="text-secondary-600 mb-0">{item.implementation}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <h2>Monthly Compliance Reports</h2>
              <p>
                In addition to the core cancellation functionality, CancelKit provides monthly compliance reports that:
              </p>
              <ul>
                <li>Document all cancellation requests and their outcomes</li>
                <li>Track key metrics such as cancellation rates and processing times</li>
                <li>Provide an audit trail for regulatory compliance</li>
                <li>Are stored securely and accessible through your dashboard</li>
              </ul>
              <p>
                These reports can be invaluable in the event of a regulatory inquiry or audit, demonstrating your commitment to compliance.
              </p>

              <h2>Staying Current with Regulatory Changes</h2>
              <p>
                The regulatory landscape is constantly evolving. CancelKit is committed to staying current with changes to FTC regulations and other relevant laws. When regulations change, we update our service to ensure continued compliance, providing you with:
              </p>
              <ul>
                <li>Regular updates to our cancellation flow to maintain compliance</li>
                <li>Notifications about important regulatory changes</li>
                <li>Documentation on how our updates address new requirements</li>
              </ul>

              <div className="bg-yellow-50 border-l-4 border-yellow-500 p-5 my-8">
                <h3 className="text-yellow-800 font-bold mt-0">Legal Disclaimer</h3>
                <p className="text-yellow-700 mb-0">
                  While CancelKit is designed to help businesses comply with FTC regulations, we recommend consulting with legal counsel to ensure that your specific implementation meets all applicable requirements. Regulatory compliance ultimately remains the responsibility of your business.
                </p>
              </div>

              <h2>Additional Resources</h2>
              <p>
                For more information about FTC compliance and the "Click to Cancel" rule, we recommend the following resources:
              </p>
              <ul>
                <li><a href="https://www.ftc.gov/news-events/news/press-releases/2023/03/ftc-proposes-rule-would-make-it-easier-consumers-cancel-subscriptions" className="text-primary-600 hover:text-primary-700" target="_blank" rel="noopener noreferrer">FTC Press Release on the Click to Cancel Rule</a></li>
                <li><a href="https://www.ftc.gov/legal-library/browse/federal-register-notices/negative-option-rule" className="text-primary-600 hover:text-primary-700" target="_blank" rel="noopener noreferrer">FTC Negative Option Rule</a></li>
                <li><a href="https://www.ecfr.gov/current/title-16/chapter-I/subchapter-D/part-425" className="text-primary-600 hover:text-primary-700" target="_blank" rel="noopener noreferrer">16 CFR Part 425 - Negative Option Rule</a></li>
              </ul>

              <h2>Contact Us</h2>
              <p>
                If you have questions about how CancelKit can help your business comply with FTC regulations, please contact our compliance team at:
              </p>
              <p>
                <a href="mailto:compliance@cancelkit.com" className="text-primary-600 hover:text-primary-700">compliance@cancelkit.com</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
