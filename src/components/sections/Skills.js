'use client'
import { useEffect, useRef, useState } from 'react'
import { getSkills } from '@/lib/data'

function SkillCard({ skill, index }) {
  return (
    <div
      className="reveal group p-6 rounded-2xl border hover:border-brand-blue hover:shadow-lg transition-all duration-300"
      style={{ transitionDelay: `${index * 0.1}s`, backgroundColor: 'var(--bg-elevated)', borderColor: 'var(--border-light)' }}
    >
      <div
        className="w-14 h-14 rounded-xl flex items-center justify-center mb-5 transition-all duration-300 group-hover:scale-110 text-3xl"
        style={{ background: 'var(--brand-blue-soft)' }}
      >
        {skill.icon}
      </div>
      <h3
        className="font-semibold mb-2 text-lg"
        style={{ fontFamily: 'Syne, sans-serif', fontWeight: 600, color: 'var(--text-primary)' }}
      >
        {skill.title}
      </h3>
      <p
        className="text-sm leading-relaxed"
        style={{ fontFamily: 'DM Sans, sans-serif', color: 'var(--text-secondary)' }}
      >
        {skill.description}
      </p>
    </div>
  )
}

export default function Skills() {
  const ref = useRef(null)
  const [skills, setSkills] = useState([])

  useEffect(() => {
    getSkills()
      .then((res) => { if (res?.data) setSkills(res.data) })
      .catch(() => {})
  }, [])

  useEffect(() => {
    const els = ref.current?.querySelectorAll('.reveal')
    if (!els) return
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
  }, [skills])

  return (
    <section id="skills" ref={ref} className="py-24" style={{ backgroundColor: 'var(--bg-surface)' }}>
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="reveal text-center mb-16">
          <h2
            className="text-3xl lg:text-4xl font-bold"
            style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, color: 'var(--text-primary)' }}
          >
            Mastering skills for exceptional outcomes.
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {skills.map((skill, i) => (
            <SkillCard key={skill._id || i} skill={skill} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
