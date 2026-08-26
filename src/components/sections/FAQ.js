'use client'
import { useEffect, useRef, useState } from 'react'
import { getFAQs } from '@/lib/data'

export default function FAQ() {
  const [faqs, setFaqs] = useState([])
  const [openIndex, setOpenIndex] = useState(null)
  const [loading, setLoading] = useState(true)
  const ref = useRef(null)

  useEffect(() => {
    const loadFaqs = async () => {
      try {
        const res = await getFAQs()
        if (res?.data && res.data.length > 0) {
          setFaqs(res.data)
        }
      } catch {
        // no hardcoded fallback
      } finally {
        setLoading(false)
      }
    }
    loadFaqs()
  }, [])

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.querySelector('.faq-content')?.classList.add('visible')
          observer.disconnect()
        }
      },
      { threshold: 0.2 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <section
      id="faq"
      ref={ref}
      className="py-24"
      style={{ backgroundColor: 'var(--bg-surface)' }}
    >
      <div className="max-w-4xl mx-auto px-6 lg:px-10">
        {/* Header */}
        <div className="faq-content reveal text-center mb-14">
          <h2
            className="text-3xl lg:text-4xl font-bold mb-4"
            style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, color: 'var(--text-primary)' }}
          >
            Frequently Asked Questions
          </h2>
          <p
            className="text-lg"
            style={{ fontFamily: 'DM Sans, sans-serif', color: 'var(--text-secondary)' }}
          >
            Everything you need to know before working with us
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <>
            {faqs.length > 0 ? (
              <div className="space-y-4">
                {faqs.map((faq, index) => (
                  <div
                    key={faq._id || index}
                    className="rounded-2xl shadow-sm border overflow-hidden transition-all duration-300 hover:shadow-md"
                    style={{ backgroundColor: 'var(--bg-elevated)', borderColor: 'var(--border-light)' }}
                  >
                    <button
                      onClick={() => toggleFAQ(index)}
                      className="w-full px-6 py-5 text-left flex justify-between items-center transition-colors duration-200"
                      style={{ backgroundColor: openIndex === index ? 'var(--bg-surface)' : 'transparent' }}
                    >
                      <span
                        className="font-semibold text-lg"
                        style={{ fontFamily: 'DM Sans, sans-serif', fontWeight: 600, color: 'var(--text-primary)' }}
                      >
                        {faq.question}
                      </span>
                      <svg
                        className={`w-5 h-5 transition-transform duration-300 flex-shrink-0 ml-4 ${
                          openIndex === index ? 'rotate-180' : ''
                        }`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        style={{ color: 'var(--text-tertiary)' }}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    
                    <div
                      className={`transition-all duration-300 ease-in-out ${
                        openIndex === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                      } overflow-hidden`}
                    >
                      <div className="px-6 pb-5 pt-0">
                        <p
                          className="leading-relaxed"
                          style={{ fontFamily: 'DM Sans, sans-serif', color: 'var(--text-secondary)' }}
                        >
                          {faq.answer}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16 rounded-2xl border-2 border-dashed" style={{ borderColor: 'var(--border-light)' }}>
                <p style={{ color: 'var(--text-secondary)', fontFamily: 'DM Sans, sans-serif' }}>
                  No frequently asked questions yet. Add them from the admin panel.
                </p>
              </div>
            )}

            {/* Bottom CTA */}
            <div className="text-center mt-12">
              <p
                className="mb-4"
                style={{ fontFamily: 'DM Sans, sans-serif', color: 'var(--text-secondary)' }}
              >
                Still have questions?
              </p>
              <a
                href="/contact"
                className="inline-flex items-center gap-2 font-semibold px-8 py-3 rounded-full transition-all duration-300 hover:-translate-y-1"
                style={{ fontFamily: 'DM Sans, sans-serif', backgroundColor: 'var(--brand-black)', color: 'var(--text-inverse)' }}
              >
                Ask Us Anything
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </a>
            </div>
          </>
        )}
      </div>
    </section>
  )
}
