import Layout from '../components/Layout';
import Link from 'next/link';
import Image from 'next/image';
import { CheckIcon, ArrowRightIcon } from '@heroicons/react/24/solid';

export default function Home() {
  return (
    <Layout title="CancelReady - FTC-Compliant Subscription Cancellation">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-white to-primary-50 pt-16 pb-24 sm:pt-24">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-secondary-900 mb-6">
                One-Click Cancellation, <span className="text-primary-600">FTC Compliant</span>
              </h1>
              <p className="text-xl text-secondary-600 mb-8 max-w-2xl">
                Add a simple "Cancel Subscription" button to your site in minutes. Comply with FTC regulations, reduce chargebacks, and keep customers happy.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/onboard" className="btn btn-primary btn-lg">
                  Get CancelReady
                  <ArrowRightIcon className="ml-2 -mr-1 h-5 w-5" />
                </Link>
                <Link href="/docs" className="btn btn-secondary">
                  View Documentation
                </Link>
              </div>
              {/* Trusted by 500+ subscription businesses - Commented out as requested */}
              {/*
              <div className="mt-8 flex items-center">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className={`inline-block h-10 w-10 rounded-full ring-2 ring-white bg-primary-${i*100}`}>
                      <span className="sr-only">User avatar</span>
                    </div>
                  ))}
                </div>
                <p className="ml-4 text-sm font-medium text-secondary-700">
                  Trusted by 500+ subscription businesses
                </p>
              </div>
              */}
            </div>
            <div className="relative">
              <div className="aspect-w-16 aspect-h-9 rounded-xl overflow-hidden shadow-2xl border-8 border-white bg-white">
                {/* Video placeholder - replace with actual video component */}
                <div className="relative w-full h-0 pb-[56.25%] bg-secondary-100 rounded-lg overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-20 h-20 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-4 cursor-pointer hover:bg-primary-700 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <p className="text-secondary-700 font-medium">Watch 60-second demo</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-6 -right-6 bg-white rounded-lg shadow-lg p-4 max-w-xs">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <CheckIcon className="h-6 w-6 text-green-500" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-secondary-900">
                      "We implemented CancelReady in 10 minutes and reduced chargebacks by 32%."
                    </p>
                    <p className="mt-1 text-xs text-secondary-500">
                      — Sarah J., Head of Product at SaaSCo
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="section bg-white">
        <div className="container-custom">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-6">
              Simple Integration, Powerful Results
            </h2>
            <p className="text-xl text-secondary-600">
              CancelReady makes it easy to add FTC-compliant cancellation to your website, with just a few lines of code.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: 'One-Click Install',
                description: 'Add our script to your site and we handle the rest. No complex integration required.',
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                ),
              },
              {
                title: 'FTC Compliant',
                description: 'Meet all regulatory requirements with our pre-built cancellation flow and documentation.',
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                ),
              },
              {
                title: 'Detailed Analytics',
                description: 'Track cancellations, reasons, and user behavior to improve your retention strategies.',
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                ),
              },
            ].map((feature, index) => (
              <div key={index} className="bg-white p-8 rounded-xl shadow-sm border border-secondary-100 hover:shadow-md transition-shadow">
                <div className="bg-primary-50 rounded-lg w-16 h-16 flex items-center justify-center mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-secondary-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="section bg-secondary-50">
        <div className="container-custom">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-6">
              How CancelReady Works
            </h2>
            <p className="text-xl text-secondary-600">
              A simple, three-step process to add compliant cancellation to your site
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: 'Add Our Script',
                description: 'Copy and paste our JavaScript snippet into your website.',
              },
              {
                step: '02',
                title: 'Configure Your Settings',
                description: 'Customize the appearance and behavior to match your brand.',
              },
              {
                step: '03',
                title: 'Go Live',
                description: 'Activate the cancellation button and start tracking metrics.',
              },
            ].map((step, index) => (
              <div key={index} className="relative">
                <div className="bg-white p-8 rounded-xl shadow-sm border border-secondary-100 h-full">
                  <div className="text-4xl font-bold text-primary-200 mb-4">{step.step}</div>
                  <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                  <p className="text-secondary-600">{step.description}</p>
                </div>
                {index < 2 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M9 5L16 12L9 19" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section - Commented out as requested */}
      {/*
      <section className="section bg-white">
        <div className="container-custom">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-6">
              Trusted by Subscription Businesses
            </h2>
            <p className="text-xl text-secondary-600">
              See why companies choose CancelReady for their cancellation needs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                quote: "CancelReady saved us from potential FTC penalties and improved our customer satisfaction scores at the same time.",
                author: "Michael T.",
                role: "CEO, SubscribeNow",
              },
              {
                quote: "Implementation was incredibly easy. Our developers had it up and running in less than an hour.",
                author: "Jennifer L.",
                role: "CTO, MembershipPro",
              },
            ].map((testimonial, index) => (
              <div key={index} className="bg-secondary-50 p-8 rounded-xl">
                <svg className="h-10 w-10 text-primary-300 mb-4" fill="currentColor" viewBox="0 0 32 32" aria-hidden="true">
                  <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
                </svg>
                <p className="text-lg text-secondary-700 mb-4">{testimonial.quote}</p>
                <div>
                  <p className="font-medium text-secondary-900">{testimonial.author}</p>
                  <p className="text-secondary-600">{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      */}

      {/* CTA Section */}
      <section className="section bg-primary-600 text-white">
        <div className="container-custom">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold mb-6 text-white">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-primary-100 mb-8">
              Join hundreds of businesses already using CancelReady to improve compliance and customer satisfaction.
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
