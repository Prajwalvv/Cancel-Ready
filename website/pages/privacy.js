import Layout from '../components/Layout';
import Link from 'next/link';

export default function Privacy() {
  return (
    <Layout title="Privacy Policy - CancelKit">
      <div className="bg-white">
        {/* Header */}
        <div className="bg-primary-600 text-white py-12">
          <div className="container-custom">
            <h1 className="text-3xl font-bold mb-4">Privacy Policy</h1>
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
                At CancelKit, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our service. Please read this privacy policy carefully. If you do not agree with the terms of this privacy policy, please do not access the service.
              </p>

              <h2>1. Information We Collect</h2>
              <p>
                We collect information that you provide directly to us when you:
              </p>
              <ul>
                <li>Register for an account</li>
                <li>Use our service</li>
                <li>Contact our support team</li>
                <li>Subscribe to our newsletter</li>
              </ul>

              <p>
                The types of data we may collect include:
              </p>
              <ul>
                <li><strong>Account Information:</strong> Email address, company name, and contact details.</li>
                <li><strong>Integration Information:</strong> API keys, domain names, and other configuration details.</li>
                <li><strong>Cancellation Data:</strong> When a user cancels a subscription through CancelKit, we collect information about the cancellation, including user ID, timestamp, IP address, and the result of the cancellation.</li>
                <li><strong>Usage Data:</strong> Information about how you use our service, including log data, device information, and analytics.</li>
              </ul>

              <h2>2. How We Use Your Information</h2>
              <p>
                We use the information we collect for various purposes, including:
              </p>
              <ul>
                <li>Providing, maintaining, and improving our service</li>
                <li>Processing subscription cancellations</li>
                <li>Generating compliance reports</li>
                <li>Responding to your requests and support inquiries</li>
                <li>Sending you technical notices, updates, and administrative messages</li>
                <li>Detecting and preventing fraudulent or unauthorized activity</li>
              </ul>

              <h2>3. Data Storage and Security</h2>
              <p>
                CancelKit uses Supabase for data storage, which provides enterprise-grade security features. Your data is stored in secure, encrypted databases and storage buckets. We implement appropriate technical and organizational measures to protect your personal data against unauthorized access, alteration, disclosure, or destruction.
              </p>

              <p>
                <strong>Data Retention:</strong> We retain cancellation records for a period of 7 years to comply with regulatory requirements. Compliance reports (PDFs) are stored securely and are accessible only to authorized users.
              </p>

              <h2>4. GDPR Compliance</h2>
              <p>
                For users in the European Economic Area (EEA), we comply with the General Data Protection Regulation (GDPR). This means you have certain rights regarding your personal data:
              </p>
              <ul>
                <li><strong>Right to Access:</strong> You can request a copy of the personal data we hold about you.</li>
                <li><strong>Right to Rectification:</strong> You can request that we correct any inaccurate or incomplete personal data.</li>
                <li><strong>Right to Erasure:</strong> You can request that we delete your personal data, subject to certain exceptions related to compliance requirements.</li>
                <li><strong>Right to Restriction:</strong> You can request that we restrict the processing of your personal data.</li>
                <li><strong>Right to Data Portability:</strong> You can request a copy of your data in a structured, commonly used, and machine-readable format.</li>
                <li><strong>Right to Object:</strong> You can object to our processing of your personal data.</li>
              </ul>

              <p>
                To exercise any of these rights, please contact us at <a href="mailto:privacy@cancelkit.com" className="text-primary-600 hover:text-primary-700">privacy@cancelkit.com</a>.
              </p>

              <h2>5. Data Sharing and Transfers</h2>
              <p>
                We do not sell your personal data to third parties. We may share your information with:
              </p>
              <ul>
                <li><strong>Service Providers:</strong> Third-party vendors who provide services on our behalf, such as hosting, analytics, and customer support.</li>
                <li><strong>Business Partners:</strong> With your consent, we may share data with business partners to offer joint promotions or products.</li>
                <li><strong>Legal Requirements:</strong> When required by law, regulation, or legal process.</li>
              </ul>

              <p>
                For users in the EEA, we ensure that any international transfers of data comply with applicable data protection laws, including the use of Standard Contractual Clauses or other appropriate safeguards.
              </p>

              <h2>6. Data Deletion</h2>
              <p>
                You can request deletion of your account and associated data by contacting us at <a href="mailto:privacy@cancelkit.com" className="text-primary-600 hover:text-primary-700">privacy@cancelkit.com</a>. Upon receiving your request, we will:
              </p>
              <ul>
                <li>Delete your account information</li>
                <li>Anonymize any cancellation records that are required to be retained for compliance purposes</li>
                <li>Remove your data from our active systems</li>
              </ul>

              <p>
                Please note that some information may be retained for legal, compliance, or audit purposes. Backup copies of data may also exist for a limited time as part of our disaster recovery procedures.
              </p>

              <h2>7. Cookies and Tracking</h2>
              <p>
                We use cookies and similar tracking technologies to track activity on our service and hold certain information. Cookies are files with a small amount of data that may include an anonymous unique identifier.
              </p>

              <p>
                You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do not accept cookies, you may not be able to use some portions of our service.
              </p>

              <h2>8. Children's Privacy</h2>
              <p>
                Our service is not intended for use by children under the age of 16. We do not knowingly collect personally identifiable information from children under 16. If you are a parent or guardian and you are aware that your child has provided us with personal data, please contact us.
              </p>

              <h2>9. Changes to This Privacy Policy</h2>
              <p>
                We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date at the top of this page. You are advised to review this Privacy Policy periodically for any changes.
              </p>

              <h2>10. Contact Us</h2>
              <p>
                If you have any questions about this Privacy Policy, please contact us at:
              </p>
              <p>
                <a href="mailto:privacy@cancelkit.com" className="text-primary-600 hover:text-primary-700">privacy@cancelkit.com</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
