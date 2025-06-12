import Layout from '../components/Layout';
import Link from 'next/link';
import { CheckIcon } from '@heroicons/react/24/solid';

const plans = [
  {
    name: 'Early-bird Lifetime',
    price: '$999',
    billing: 'one-time',
    description: '"Buy once, never worry again." Fast cash-flow, zero churn.',
    features: [
      'Unlimited cancellations',
      'Basic compliance reporting',
      'Standard support',
      'API access',
      'Custom branding',
      '1-year free access to Compliance SaaS',
    ],
    cta: 'Get Started',
    popular: true,
    extension: {
      name: 'Compliance SaaS Extension',
      price: '$49',
      billing: '/mo after 1-year free period',
      description: 'Optional extension for lifetime buyers who want premium support and advanced features.',
      features: [
        'Priority support',
        'Advanced compliance reporting',
        'Monthly PDF compliance logs',
        'SLA guarantees',
        'New payment gateway support',
      ],
      cta: 'Subscribe Now',
    }
  },
  {
    name: 'Compliance SaaS',
    hidden: true,
    price: '$49',
    billing: '/mo after 1-year free for lifetime buyers',
    description: 'Recurring revenue for PDF logs, new gateways, SLA.',
    features: [
      'Unlimited cancellations',
      'Advanced compliance reporting',
      'Priority support',
      'API access',
      'Custom branding',
      'Monthly PDF compliance logs',
      'SLA guarantees',
      'New payment gateway support',
    ],
    cta: 'Subscribe Now',
    popular: true,
  },
  {
    name: 'Done-For-You (DFY)',
    price: '$9,999',
    billing: '48-h white-glove install',
    description: '5-figure cash from overloaded teams; you do the copy-paste + legal memo.',
    features: [
      'Everything in Compliance SaaS',
      'White-glove installation',
      'Custom integration',
      'Legal compliance memo',
      'Dedicated account manager',
      'Custom development',
      'Priority feature requests',
    ],
    cta: 'Contact Sales',
    popular: false,
  },
  {
    name: 'Agency Bundle',
    price: '$4,999',
    billing: 'for 5 domains',
    description: 'Let marketing/dev shops resell; you get volume without extra support.',
    features: [
      'License for 5 domains',
      'White-label option',
      'Reseller dashboard',
      'Client management tools',
      'Bulk reporting',
      'Marketing materials',
      'Agency support',
    ],
    cta: 'Get Agency Access',
    popular: false,
  },
];

export default function Pricing() {
  // Custom CSS for pricing cards
  const cardStyles = {
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    willChange: 'transform, box-shadow',
  };
  
  const cardHoverStyles = {
    transform: 'translateY(-5px)',
    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  };
  return (
    <Layout title="Pricing - CancelReady">
      {/* Pricing Header */}
      <section className="bg-gradient-to-b from-white to-primary-50 pt-16 pb-24 sm:pt-24">
        <div className="container-custom">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-secondary-900 mb-6">
              Simple, Transparent Pricing
            </h1>
            <p className="text-xl text-secondary-600 mb-8">
              Choose the plan that's right for your business. All plans include our core cancellation functionality.
            </p>
          </div>
        </div>
      </section>

      {/* Pricing Plans */}
      <section className="section bg-white -mt-16">
        <div className="container-custom max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 w-full justify-center">
            {plans.filter(plan => !plan.hidden).map((plan, index) => (
              <div 
                key={index} 
                className={`bg-white rounded-xl shadow-lg overflow-hidden border ${
                  plan.popular ? 'border-primary-500 ring-2 ring-primary-500' : 'border-secondary-200'
                } flex flex-col h-full hover:shadow-xl transition-all duration-300 w-full max-w-md mx-auto`}
                style={cardStyles}
                onMouseEnter={(e) => {
                  Object.assign(e.currentTarget.style, cardHoverStyles);
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = '';
                  e.currentTarget.style.boxShadow = '';
                }}
              >
                {plan.popular && (
                  <div className="bg-primary-500 text-white text-center py-2 font-medium text-sm">
                    Most Popular
                  </div>
                )}
                <div className="p-6 flex-grow relative overflow-hidden">
                  {/* Decorative elements */}
                  <div className="absolute top-0 right-0 w-24 h-24 bg-secondary-100 opacity-20 rounded-full -mr-12 -mt-12"></div>
                  
                  <div className="relative z-10"> {/* Content wrapper */}
                    <h3 className="text-xl font-bold text-secondary-900 mb-2">{plan.name}</h3>
                    <div className="flex items-baseline mb-3">
                      <span className="text-3xl font-extrabold text-secondary-900">{plan.price}</span>
                      <span className="ml-2 text-sm text-secondary-600">{plan.billing}</span>
                    </div>
                    <p className="text-secondary-600 mb-6 text-sm leading-relaxed">{plan.description}</p>
                    
                    <Link 
                      href="/onboard" 
                      className={`btn w-full mb-6 ${
                        plan.popular
                          ? 'bg-primary-500 text-white hover:bg-primary-600'
                          : 'bg-secondary-100 text-secondary-700 hover:bg-secondary-200'
                      } py-3 px-4 rounded-md font-medium transition-colors duration-200 inline-block text-center shadow-sm hover:shadow-md`}
                    >
                      {plan.cta}
                    </Link>
                    
                    <h4 className="text-sm font-semibold uppercase text-secondary-500 mb-4">WHAT'S INCLUDED</h4>
                    <ul className="space-y-3">
                      {plan.features.map((feature, i) => (
                        <li key={i} className="flex items-start">
                          <CheckIcon className="h-5 w-5 text-green-500 flex-shrink-0 mr-2" />
                          <span className="text-secondary-600 text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  {/* Extension section for Early-bird Lifetime plan */}
                  {plan.extension && (
                    <div className="mt-8 pt-6 border-t border-secondary-200">
                      <div className="bg-gradient-to-br from-primary-50 to-primary-100 p-5 rounded-lg shadow-sm border border-primary-200 relative overflow-hidden">
                        {/* Decorative elements */}
                        <div className="absolute top-0 right-0 w-20 h-20 bg-primary-200 opacity-20 rounded-full -mr-10 -mt-10"></div>
                        <div className="absolute bottom-0 left-0 w-16 h-16 bg-primary-300 opacity-10 rounded-full -ml-8 -mb-8"></div>
                        
                        <div className="relative z-10">  {/* Content wrapper to ensure it's above decorative elements */}
                          <div className="flex items-center mb-3">
                            <span className="bg-primary-500 text-white text-xs font-bold px-2 py-1 rounded-full mr-2 shadow-sm">UPGRADE</span>
                            <h4 className="text-md font-bold text-secondary-900">{plan.extension.name}</h4>
                          </div>
                          
                          <div className="flex items-baseline mb-3">
                            <span className="text-2xl font-bold text-primary-600">{plan.extension.price}</span>
                            <span className="ml-2 text-sm text-secondary-600">{plan.extension.billing}</span>
                          </div>
                          
                          <p className="text-secondary-600 mb-4 text-sm leading-relaxed">{plan.extension.description}</p>
                          
                          <Link 
                            href="/onboard" 
                            className="btn w-full mb-4 bg-primary-500 text-white hover:bg-primary-600 py-2 px-4 rounded-md font-medium transition-colors duration-200 inline-block text-center text-sm shadow-sm hover:shadow-md"
                          >
                            {plan.extension.cta}
                          </Link>
                          
                          <h5 className="text-xs font-semibold uppercase text-secondary-500 mb-3">ADDITIONAL BENEFITS</h5>
                          <ul className="space-y-2.5">
                            {plan.extension.features.map((feature, i) => (
                              <li key={i} className="flex items-start">
                                <CheckIcon className="h-4 w-4 text-green-500 flex-shrink-0 mr-2 mt-0.5" />
                                <span className="text-secondary-700 text-sm">{feature}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="section bg-secondary-50">
        <div className="container-custom">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-6">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-secondary-600">
              Have questions about our pricing? Find answers to common questions below.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {[
              {
                question: "What's included in the Early-bird Lifetime plan?",
                answer: "The Early-bird Lifetime plan includes unlimited cancellations, basic compliance reporting, standard support, API access, and custom branding. You'll also get 1 year of free access to our Compliance SaaS features."
              },
              {
                question: "How does the $49/mo Compliance SaaS extension work with the Lifetime plan?",
                answer: "The Compliance SaaS extension is an optional add-on for Lifetime plan members. After your included 1-year free period, you can continue with premium support and advanced features for $49/month while retaining all your Lifetime benefits."
              },
              {
                question: "What does the Done-For-You plan include?",
                answer: "Our DFY plan includes white-glove installation by our team, custom integration with your systems, a legal compliance memo, a dedicated account manager, custom development work, and priority for feature requests."
              },
              {
                question: "How does the Agency Bundle work?",
                answer: "The Agency Bundle allows you to use CancelReady on up to 5 domains. It includes white-label options, a reseller dashboard, client management tools, bulk reporting, marketing materials, and dedicated agency support."
              },
              {
                question: "Do you offer a refund policy?",
                answer: "Yes, we offer a 14-day no-questions-asked money-back guarantee on all our plans. If you're not satisfied for any reason, simply contact us for a full refund."
              },
              {
                question: "What payment methods do you accept?",
                answer: "We accept all major credit cards, PayPal, and wire transfers for enterprise customers. All payments are processed securely through our payment providers."
              },
            ].map((faq, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-lg font-bold text-secondary-900 mb-3">{faq.question}</h3>
                <p className="text-secondary-600">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section bg-primary-600 text-white">
        <div className="container-custom">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold mb-6 text-white">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-primary-100 mb-8">
              Choose the plan that's right for your business and start offering compliant cancellation today.
            </p>
            <Link href="/onboard" className="btn bg-white text-primary-600 hover:bg-primary-50 btn-lg">
              Get CancelReady Now
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
}
