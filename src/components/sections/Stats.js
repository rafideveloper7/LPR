'use client'
import { useEffect, useRef, useState } from 'react'
import { getStats } from '@/lib/data'

function CountUp({ end, suffix, started }) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!started) return
    let start = 0
    const duration = 1800
    const step = 16
    const increment = end / (duration / step)

    const timer = setInterval(() => {
      start += increment
      if (start >= end) {
        setCount(end)
        clearInterval(timer)
      } else {
        setCount(Math.floor(start))
      }
    }, step)

    return () => clearInterval(timer)
  }, [started, end])

  return (
    <span>
      {count}
      {suffix}
    </span>
  )
}

export default function Stats() {
  const ref = useRef(null)
  const [started, setStarted] = useState(false)
  const [stats, setStats] = useState([])

  useEffect(() => {
    getStats()
      .then((res) => { if (res?.data) setStats(res.data) })
      .catch(() => {})
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStarted(true)
          observer.disconnect()
        }
      },
      { threshold: 0.3 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section ref={ref} className="py-12 border-y" style={{ backgroundColor: 'var(--bg-page)', borderColor: 'var(--border-light)' }}>
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <div key={i} className="text-center">
              <div
                className="text-4xl lg:text-5xl font-extrabold"
                style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, color: 'var(--brand-blue-primary)' }}
              >
                <CountUp end={Number(stat.value)} suffix={stat.suffix} started={started} />
              </div>
              <p
                className="mt-1.5 text-sm"
                style={{ fontFamily: 'DM Sans, sans-serif', color: 'var(--text-secondary)' }}
              >
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
