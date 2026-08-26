'use client'
import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { getAbout } from '@/lib/data'

export default function About() {
  const ref = useRef(null)
  const [about, setAbout] = useState(null)

  useEffect(() => {
    getAbout()
      .then((res) => {
        if (res?.data) setAbout(res.data)
      })
      .catch(() => {})
  }, [])

  useEffect(() => {
    const els = ref.current?.querySelectorAll('.reveal, .reveal-left, .reveal-right')
    if (els && els.length > 0) {

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('visible')
              observer.unobserve(entry.target)
            }
          })
        },
        { threshold: 0.1 }
      )

      els.forEach((el) => observer.observe(el))
      return () => observer.disconnect()
    }
  }, [about])

  const title = about?.title || ''
  const titleHighlight = about?.titleHighlight || ''
  const paragraphs = about?.content
    ? about.content.split(/\n\s*\n/).filter(Boolean)
    : []
  const statLine = about?.stats

  if (!about) {
    return (
      <section id="about" ref={ref} className="py-24 overflow-hidden" style={{ backgroundColor: 'var(--bg-page)' }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <p style={{ fontFamily: 'DM Sans, sans-serif', color: 'var(--text-secondary)' }}>
            About content not configured yet.
          </p>
        </div>
      </section>
    )
  }

  return (
    <section id="about" ref={ref} className="py-24 overflow-hidden" style={{ backgroundColor: 'var(--bg-page)' }}>
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="reveal-left relative">
            <div className="relative w-full max-w-md mx-auto lg:mx-0">
              <div className="w-full aspect-[4/3] sm:aspect-video rounded-2xl overflow-hidden relative" style={{ backgroundColor: 'var(--bg-surface-alt)' }}>
                {about?.video ? (
                  <video
                    src={about.video}
                    className="w-full h-full object-cover"
                    controls
                    playsInline
                  />
                ) : about?.image ? (
                  <img
                    src={about.image}
                    alt="About"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-end justify-center" style={{ background: 'var(--gradient-surface)' }}>
                    <svg viewBox="0 0 200 280" className="w-36 h-52 opacity-20">
                      <ellipse cx="100" cy="55" rx="35" ry="40" fill="#333" />
                      <path d="M35 280 Q45 160 100 150 Q155 160 165 280z" fill="#333" />
                    </svg>
                  </div>
                )}
              </div>

              <div className="absolute -bottom-4 -left-4">
                <svg width="120" height="40" viewBox="0 0 120 40" fill="none">
                  <path d="M0 20 Q30 5 60 20 Q90 35 120 20" stroke="#4f6ffd" strokeWidth="2.5" fill="none" opacity="0.6" />
                </svg>
              </div>

              <div className="absolute -top-3 -right-3 w-14 h-14 grid grid-cols-2 gap-1.5">
                {[1, 0, 0, 1].map((a, i) => (
                  <div key={i} className="rounded-sm" style={{ background: '#4f6ffd', opacity: a ? 0.8 : 0 }} />
                ))}
              </div>
            </div>
          </div>

          <div className="reveal-right">
            <h2
              className="text-3xl lg:text-4xl font-bold leading-tight"
              style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, color: 'var(--text-primary)' }}
            >
              {title}{' '}
              <span className="text-brand-blue">{titleHighlight}</span>
            </h2>

            <div className="mt-6 space-y-4">
              {paragraphs.map((paragraph, index) => (
                <p
                  key={index}
                  className="leading-relaxed"
                  style={{ fontFamily: 'DM Sans, sans-serif', color: 'var(--text-secondary)' }}
                >
                  {paragraph}
                </p>
              ))}
            </div>

            {statLine && (
              <p
                className="mt-6 text-sm font-semibold uppercase tracking-wider text-brand-blue"
                style={{ fontFamily: 'DM Sans, sans-serif' }}
              >
                {statLine}
              </p>
            )}

            <div className="mt-8 flex items-center gap-4">
              <div>
                <svg width="100" height="40" viewBox="0 0 100 40" fill="none">
                  <path d="M10 30 Q20 10 35 20 Q45 28 55 15 Q65 5 80 18 Q88 24 95 20" stroke="#4f6ffd" strokeWidth="2" fill="none" strokeLinecap="round" />
                </svg>
              </div>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 text-sm font-medium text-brand-blue hover:gap-3 transition-all"
                style={{ fontFamily: 'DM Sans, sans-serif' }}
              >
                Explore More
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}