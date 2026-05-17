'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Shield } from 'lucide-react'

const SECTIONS = [
  {
    title: '1. Information We Collect',
    content: `When you create an account or place an order on Hilop, we collect information you provide directly, including your name, email address, phone number, shipping address, and payment details. We also automatically collect certain technical data such as your IP address, browser type, device information, and browsing behaviour on our website to improve your experience.`,
  },
  {
    title: '2. How We Use Your Information',
    content: `We use your personal information to process and fulfil your orders, send order confirmations and shipping updates, provide customer support, personalise your shopping experience, send promotional emails (only with your consent), prevent fraud and ensure platform security, and comply with legal obligations.`,
  },
  {
    title: '3. Sharing Your Information',
    content: `Hilop does not sell, rent, or trade your personal information to third parties. We share your data only with trusted service providers who assist us in operating our platform — including payment processors, shipping partners, and email service providers — all of whom are bound by strict confidentiality agreements.`,
  },
  {
    title: '4. Payment Security',
    content: `All payment transactions on Hilop are processed through PCI-DSS compliant payment gateways. We do not store your full card details on our servers. All data transmitted between your browser and our servers is encrypted using industry-standard SSL/TLS technology.`,
  },
  {
    title: '5. Cookies',
    content: `We use cookies and similar tracking technologies to enhance your browsing experience, remember your preferences, and analyse site traffic. You can control cookie settings through your browser. Disabling cookies may affect certain features of the website.`,
  },
  {
    title: '6. Data Retention',
    content: `We retain your personal data for as long as your account is active or as needed to provide services. You may request deletion of your account and associated data at any time by contacting us at support@hilop.com. We will process your request within 30 days, subject to any legal obligations.`,
  },
  {
    title: '7. Your Rights',
    content: `You have the right to access, correct, or delete your personal data at any time. You may also opt out of marketing communications by clicking "unsubscribe" in any email or by contacting our support team. For any privacy-related requests, email us at privacy@hilop.com.`,
  },
  {
    title: '8. Changes to This Policy',
    content: `We may update this Privacy Policy from time to time. When we do, we will revise the "Last Updated" date at the top of this page and notify you via email if the changes are significant. We encourage you to review this policy periodically.`,
  },
]

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-black py-20 px-4 text-center">
        <motion.div
          className="max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 mb-6">
            <Shield className="h-4 w-4 text-hilop-green" />
            <span className="text-sm font-semibold text-white">PRIVACY POLICY</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            Your Privacy <span className="text-hilop-green">Matters</span>
          </h1>
          <p className="text-gray-300 text-lg max-w-xl mx-auto">
            At Hilop, we are committed to protecting your personal information and being transparent about how we use it.
          </p>
          <p className="text-gray-500 text-sm mt-4">Last Updated: January 2025</p>
        </motion.div>
      </section>

      {/* Content */}
      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto space-y-10">
          {SECTIONS.map((section, i) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              viewport={{ once: true }}
            >
              <h2 className="text-xl font-bold text-gray-900 mb-3">{section.title}</h2>
              <p className="text-gray-600 leading-7 text-sm">{section.content}</p>
            </motion.div>
          ))}

          <motion.div
            className="bg-gray-50 rounded-2xl p-6 border border-gray-100"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-xl font-bold text-gray-900 mb-3">9. Contact Us</h2>
            <p className="text-gray-600 text-sm leading-7">
              If you have any questions or concerns about this Privacy Policy or how we handle your data, please contact us at{' '}
              <Link href="/contact" className="text-hilop-green hover:underline font-medium">
                support@hilop.com
              </Link>{' '}
              or visit our{' '}
              <Link href="/contact" className="text-hilop-green hover:underline font-medium">
                Contact page
              </Link>.
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
