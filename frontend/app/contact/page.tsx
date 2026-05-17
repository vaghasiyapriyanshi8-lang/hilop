'use client'

import { motion } from 'framer-motion'
import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Phone, Mail, MapPin, Clock, Send, MessageSquare, CheckCircle2 } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { useSearchParams } from 'next/navigation'
import api from '@/lib/api'

const CONTACT_INFO = [
  {
    icon: Phone,
    title: 'Call Us',
    detail: '+91 98765 43210',
    sub: 'Mon–Sat, 10am–7pm IST',
  },
  {
    icon: Mail,
    title: 'Email Us',
    detail: 'support@hilop.com',
    sub: 'Response within 24 hours',
  },
  {
    icon: MapPin,
    title: 'Visit Us',
    detail: 'Hilop Flagship, Mumbai, India',
    sub: 'By appointment only',
  },
  {
    icon: Clock,
    title: 'Working Hours',
    detail: 'Mon – Sat: 10am – 7pm',
    sub: 'Closed on Sundays & public holidays',
  },
]

export default function ContactPage() {
  const { toast } = useToast()
  const searchParams = useSearchParams()
  const formRef = useRef<HTMLDivElement>(null)
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [isLoading, setIsLoading] = useState(false)
  const [sent, setSent] = useState(false)

  useEffect(() => {
    const subject = searchParams.get('subject')
    if (subject) {
      setForm((prev) => ({ ...prev, subject }))
      setTimeout(() => formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 300)
    }
  }, [searchParams])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name || !form.email || !form.message) {
      toast({ title: 'Please fill in all required fields.', variant: 'destructive' })
      return
    }
    setIsLoading(true)
    try {
      await api.post('/contact/send', form)
      setSent(true)
      setForm({ name: '', email: '', subject: '', message: '' })
    } catch (error: any) {
      toast({
        title: 'Failed to send message',
        description: error.response?.data?.message || 'Please try again later.',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

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
            <MessageSquare className="h-4 w-4 text-hilop-green" />
            <span className="text-sm font-semibold text-white">CONTACT US</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            We're Here to <span className="text-hilop-green">Help</span>
          </h1>
          <p className="text-gray-300 text-lg max-w-xl mx-auto">
            Have a question about an order, a watch, or anything else? Our team is ready to assist you.
          </p>
        </motion.div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5">
            {CONTACT_INFO.map((info, i) => (
              <motion.div
                key={info.title}
                className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                viewport={{ once: true }}
              >
                <div className="inline-flex p-3 rounded-full bg-hilop-green/10 mb-3">
                  <info.icon className="w-5 h-5 text-hilop-green" />
                </div>
                <p className="font-semibold text-gray-900 text-sm mb-1">{info.title}</p>
                <p className="text-gray-700 text-sm font-medium">{info.detail}</p>
                <p className="text-gray-400 text-xs mt-1">{info.sub}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-20 px-4">
        <div className="max-w-2xl mx-auto" ref={formRef}>
          <motion.div
            className="text-center mb-10"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold mb-3">Send Us a Message</h2>
            <p className="text-gray-500">Fill in the form below and we'll respond within 24 hours.</p>
          </motion.div>

          {sent ? (
            <motion.div
              className="bg-green-50 border border-green-100 rounded-2xl p-10 text-center"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <div className="inline-flex p-4 rounded-full bg-hilop-green/10 mb-4">
                <CheckCircle2 className="w-8 h-8 text-hilop-green" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Message Sent!</h3>
              <p className="text-gray-500 text-sm mb-6">
                Thanks for reaching out. We've sent a confirmation to your email and will get back to you within 24 hours.
              </p>
              <Button
                onClick={() => setSent(false)}
                className="bg-hilop-green text-black hover:bg-hilop-green/90 font-semibold"
              >
                Send Another Message
              </Button>
            </motion.div>
          ) : (
            <motion.form
              onSubmit={handleSubmit}
              className="space-y-5 bg-gray-50 rounded-2xl p-8 border border-gray-100"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">Full Name *</label>
                  <Input
                    placeholder="John Doe"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Email Address *</label>
                  <Input
                    type="email"
                    placeholder="your@email.com"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Subject</label>
                <Input
                  placeholder="e.g. Order enquiry, Warranty claim..."
                  value={form.subject}
                  onChange={(e) => setForm({ ...form, subject: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Message *</label>
                <textarea
                  rows={5}
                  placeholder="Tell us how we can help..."
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  required
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 resize-none"
                />
              </div>
              <Button
                type="submit"
                size="lg"
                className="w-full bg-hilop-green text-black hover:bg-hilop-green/90 font-semibold gap-2"
                disabled={isLoading}
              >
                <Send className="w-4 h-4" />
                {isLoading ? 'Sending...' : 'Send Message'}
              </Button>
            </motion.form>
          )}
        </div>
      </section>
    </div>
  )
}
