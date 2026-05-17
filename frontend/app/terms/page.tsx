'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { FileText } from 'lucide-react'

const SECTIONS = [
  {
    title: '1. Acceptance of Terms',
    content: `By accessing or using the Hilop website (hilop.com), placing an order, or creating an account, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our website or services. We reserve the right to update these terms at any time, and continued use of the site constitutes acceptance of any changes.`,
  },
  {
    title: '2. Eligibility',
    content: `You must be at least 18 years of age to make a purchase on Hilop. By placing an order, you confirm that you are legally capable of entering into a binding contract and that all information you provide is accurate, complete, and current.`,
  },
  {
    title: '3. Products & Pricing',
    content: `All products listed on Hilop are subject to availability. We reserve the right to discontinue any product at any time. Prices are displayed in Indian Rupees (INR) and are inclusive of applicable taxes unless stated otherwise. We reserve the right to modify prices without prior notice. In the event of a pricing error, we will notify you before processing your order.`,
  },
  {
    title: '4. Orders & Payment',
    content: `Once you place an order, you will receive an email confirmation. This confirmation does not constitute acceptance of your order — acceptance occurs when your order is dispatched. We reserve the right to cancel any order at our discretion, including in cases of suspected fraud, stock unavailability, or pricing errors. Payment must be made in full at the time of purchase through our supported payment methods.`,
  },
  {
    title: '5. Shipping & Delivery',
    content: `We aim to dispatch all orders within 1–2 business days. Delivery timelines vary by location and are estimates only — Hilop is not liable for delays caused by courier partners, customs, or circumstances beyond our control. Risk of loss and title for products pass to you upon delivery. Please inspect your order upon receipt and contact us immediately if there is any damage or discrepancy.`,
  },
  {
    title: '6. Returns & Refunds',
    content: `Our 7-day return policy allows you to return unworn watches in their original condition and packaging within 7 days of delivery. Refunds are processed within 5–7 business days of receiving the returned item. Customised, engraved, or worn items are not eligible for return. You can submit a return or exchange request directly from the My Orders page. Please refer to our Returns & Exchanges page for full details.`,
  },
  {
    title: '7. Warranty',
    content: `All Hilop watches come with a 2-year manufacturer warranty covering defects in materials and workmanship under normal use. The warranty does not cover damage resulting from accidents, misuse, unauthorised modifications, or normal wear and tear. Warranty claims must be submitted through our official support channels. Please refer to our Warranty Policy page for complete terms.`,
  },
  {
    title: '8. Intellectual Property',
    content: `All content on the Hilop website — including text, images, logos, product descriptions, and design — is the exclusive property of Hilop and is protected by applicable intellectual property laws. You may not reproduce, distribute, or use any content from this site without our prior written consent.`,
  },
  {
    title: '9. User Accounts',
    content: `You are responsible for maintaining the confidentiality of your account credentials and for all activity that occurs under your account. You agree to notify us immediately of any unauthorised use of your account. Hilop reserves the right to suspend or terminate accounts that violate these terms or engage in fraudulent activity.`,
  },
  {
    title: '10. Limitation of Liability',
    content: `To the fullest extent permitted by law, Hilop shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of our website or products. Our total liability to you for any claim shall not exceed the amount paid by you for the product in question.`,
  },
  {
    title: '11. Governing Law',
    content: `These Terms of Service are governed by and construed in accordance with the laws of India. Any disputes arising from these terms or your use of the Hilop platform shall be subject to the exclusive jurisdiction of the courts located in Mumbai, Maharashtra, India.`,
  },
  {
    title: '12. Contact Us',
    content: null,
  },
]

export default function TermsPage() {
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
            <FileText className="h-4 w-4 text-hilop-green" />
            <span className="text-sm font-semibold text-white">TERMS OF SERVICE</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            Terms of <span className="text-hilop-green">Service</span>
          </h1>
          <p className="text-gray-300 text-lg max-w-xl mx-auto">
            Please read these terms carefully before using the Hilop platform or placing an order.
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
              transition={{ delay: i * 0.04 }}
              viewport={{ once: true }}
            >
              <h2 className="text-xl font-bold text-gray-900 mb-3">{section.title}</h2>
              {section.content ? (
                <p className="text-gray-600 leading-7 text-sm">{section.content}</p>
              ) : (
                <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                  <p className="text-gray-600 text-sm leading-7">
                    If you have any questions about these Terms of Service, please contact us at{' '}
                    <Link href="/contact" className="text-hilop-green hover:underline font-medium">
                      support@hilop.com
                    </Link>{' '}
                    or visit our{' '}
                    <Link href="/contact" className="text-hilop-green hover:underline font-medium">
                      Contact page
                    </Link>
                    . We're happy to clarify anything.
                  </p>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  )
}
