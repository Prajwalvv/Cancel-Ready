import Head from 'next/head';
import Header from './Header';
import Footer from './Footer';

export default function Layout({ children, title = 'CancelReady - Subscription Cancellation Made Easy' }) {
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content="CancelReady - The easiest way to add subscription cancellation to your website. FTC compliant, easy to integrate." />
        <link rel="icon" href="/icon_logo.png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Lexend:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </Head>

      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow">{children}</main>
        <Footer />
      </div>
    </>
  );
}
