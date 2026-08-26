"use client";

import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { API_URL } from "@/lib/apiConfig";

const slugify = (text) =>
  text
    .toString()
    .trim()
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/^-+|-+$/g, "");

function ServiceCard({ service, index }) {
  const slug = slugify(service.title);
  const hasMedia = service.video || service.image;
  const cardRef = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setVisible(true), index * 80);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    if (cardRef.current) observer.observe(cardRef.current);
    return () => observer.disconnect();
  }, [index]);

  return (
    <Link
      ref={cardRef}
      href={`/services/${slug}`}
      className="sp-card group block"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(40px)",
        transition: `opacity 0.6s ease ${index * 0.08}s, transform 0.6s ease ${index * 0.08}s`,
        textDecoration: "none",
      }}
    >
      <article
        className="sp-card-inner"
        style={{
          backgroundColor: "var(--bg-elevated)",
          border: "1px solid var(--border-subtle)",
        }}
      >
        {hasMedia && (
          <div className="sp-card-media" style={{ backgroundColor: "var(--bg-surface-alt)" }}>
            {service.video ? (
              <video
                src={service.video}
                className="sp-card-media-asset"
                muted
                loop
                playsInline
                onMouseEnter={(e) => e.target.play()}
                onMouseLeave={(e) => {
                  e.target.pause();
                  e.target.currentTime = 0;
                }}
              />
            ) : (
              <img
                src={service.image}
                alt={service.imageAlt || service.title}
                className="sp-card-media-asset"
              />
            )}
            <div className="sp-card-media-overlay" />
          </div>
        )}

        <div className={`sp-card-body ${!hasMedia ? "sp-card-body--top" : ""}`}>
          <div className="sp-card-accent" style={{ backgroundColor: "var(--brand-blue-primary)" }} />
          <h3 className="sp-card-title" style={{ fontFamily: "'Syne', sans-serif", color: "var(--text-primary)" }}>
            {service.title}
          </h3>
          {service.features && service.features.length > 0 && (
            <p className="sp-card-desc" style={{ fontFamily: "'DM Sans', sans-serif", color: "var(--text-secondary)" }}>
              {service.features.slice(0, 3).join("  ·  ")}
            </p>
          )}
          {service.buttonText && (
            <div className="sp-card-cta" style={{ fontFamily: "'DM Sans', sans-serif", color: "var(--brand-blue-primary)" }}>
              <span>{service.buttonText}</span>
              <svg className="sp-card-cta-arrow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </div>
          )}
        </div>
      </article>
    </Link>
  );
}

export default function ServicesPage() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("ALL");
  const [heroVisible, setHeroVisible] = useState(false);

  useEffect(() => {
    fetchServices();
    const t = setTimeout(() => setHeroVisible(true), 100);
    return () => clearTimeout(t);
  }, []);

  const fetchServices = async () => {
    try {
      const response = await fetch(`${API_URL}/services`);
      const data = await response.json();
      if (data.success) {
        setServices(data.data);
      } else {
        setError("Failed to fetch services");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const serviceNames = ["ALL", ...new Set(services.map((s) => s.title))];
  const filteredServices =
    filter === "ALL" ? services : services.filter((service) => service.title === filter);

  if (loading) {
    return (
      <main className="sp-fullscreen" style={{ backgroundColor: "var(--bg-page)" }}>
        <div className="sp-center">
          <div className="sp-spinner" style={{ borderColor: "var(--border-subtle)", borderTopColor: "var(--brand-blue-primary)" }} />
          <p className="sp-loading-text" style={{ fontFamily: "'DM Sans', sans-serif", color: "var(--text-tertiary)" }}>
            Loading services…
          </p>
        </div>
        <style jsx global>{SP_STYLES}</style>
      </main>
    );
  }

  if (error) {
    return (
      <main className="sp-fullscreen" style={{ backgroundColor: "var(--bg-page)" }}>
        <div className="sp-center">
          <p style={{ fontFamily: "'DM Sans', sans-serif", color: "var(--accent-error)", marginBottom: "16px" }}>{error}</p>
          <button onClick={fetchServices} className="sp-btn-primary">Try Again</button>
        </div>
        <style jsx global>{SP_STYLES}</style>
      </main>
    );
  }

  return (
    <main>
      <style jsx global>{SP_STYLES}</style>

      {/* ─── HERO ─── */}
      <section className="sp-hero" style={{ backgroundColor: "var(--bg-page)" }}>
        <div className="sp-hero-bg" aria-hidden="true">
          {Array.from({ length: 16 }).map((_, i) => (
            <div key={i} className="sp-hero-cell" style={{ animationDelay: `${i * 0.12}s` }} />
          ))}
        </div>

        <div className="sp-container">
          <div
            className="sp-back-wrap"
            style={{ opacity: heroVisible ? 1 : 0, transform: heroVisible ? "translateY(0)" : "translateY(-12px)", transition: "opacity 0.5s ease 0.1s, transform 0.5s ease 0.1s" }}
          >
            <Link href="/" className="sp-back-link" style={{ fontFamily: "'DM Sans', sans-serif", color: "var(--text-tertiary)" }}>
              <svg className="sp-back-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Home
            </Link>
          </div>

          <div
            className="sp-hero-text"
            style={{
              opacity: heroVisible ? 1 : 0,
              transform: heroVisible ? "translateY(0)" : "translateY(32px)",
              transition: "opacity 0.7s ease 0.25s, transform 0.7s ease 0.25s",
            }}
          >
            <span className="sp-eyebrow" style={{ fontFamily: "'DM Sans', sans-serif", color: "var(--brand-blue-primary)" }}>
              What we do
            </span>
            <h1 className="sp-title" style={{ fontFamily: "'Syne', sans-serif", color: "var(--text-primary)" }}>
              All <em className="sp-title-em">Services</em>
            </h1>
            <div className="sp-divider" style={{ background: "var(--brand-blue-primary)" }} />
            <p className="sp-subtitle" style={{ fontFamily: "'DM Sans', sans-serif", color: "var(--text-secondary)" }}>
              Comprehensive creative solutions to elevate your brand and drive real results.
            </p>
          </div>

          {services.length > 0 && (
            <div
              className="sp-stats"
              style={{
                opacity: heroVisible ? 1 : 0,
                transform: heroVisible ? "translateY(0)" : "translateY(24px)",
                transition: "opacity 0.7s ease 0.4s, transform 0.7s ease 0.4s",
              }}
            >
              <div className="sp-stat">
                <span className="sp-stat-num" style={{ fontFamily: "'Syne', sans-serif", color: "var(--text-primary)" }}>{services.length}</span>
                <span className="sp-stat-lbl" style={{ fontFamily: "'DM Sans', sans-serif", color: "var(--text-tertiary)" }}>Services</span>
              </div>
              <div className="sp-stat-sep" style={{ background: "var(--border-subtle)" }} />
              <div className="sp-stat">
                <span className="sp-stat-num" style={{ fontFamily: "'Syne', sans-serif", color: "var(--text-primary)" }}>{serviceNames.length - 1}</span>
                <span className="sp-stat-lbl" style={{ fontFamily: "'DM Sans', sans-serif", color: "var(--text-tertiary)" }}>Categories</span>
              </div>
              <div className="sp-stat-sep" style={{ background: "var(--border-subtle)" }} />
              <div className="sp-stat">
                <span className="sp-stat-num" style={{ fontFamily: "'Syne', sans-serif", color: "var(--text-primary)" }}>∞</span>
                <span className="sp-stat-lbl" style={{ fontFamily: "'DM Sans', sans-serif", color: "var(--text-tertiary)" }}>Possibilities</span>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ─── FILTER BAR ─── */}
      {services.length > 0 && (
        <div className="sp-filter-bar" style={{ backgroundColor: "var(--bg-page)", borderBottom: "1px solid var(--border-subtle)" }}>
          <div className="sp-container">
            <div className="sp-filter-row">
              {serviceNames.map((category) => (
                <button
                  key={category}
                  onClick={() => setFilter(category)}
                  className="sp-pill"
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    backgroundColor: filter === category ? "var(--brand-blue-primary)" : "var(--bg-surface)",
                    color: filter === category ? "var(--text-inverse)" : "var(--text-secondary)",
                    border: filter === category ? "none" : "1px solid var(--border-light)",
                  }}
                >
                  {filter === category && <span className="sp-pill-dot" />}
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ─── GRID ─── */}
      <section className="sp-grid-wrap" style={{ backgroundColor: "var(--bg-page)" }}>
        <div className="sp-container">
          {filteredServices.length === 0 ? (
            <div className="sp-empty" style={{ color: "var(--text-tertiary)", fontFamily: "'DM Sans', sans-serif" }}>
              <svg style={{ width: 48, height: 48, opacity: 0.4 }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p>No services found in this category.</p>
            </div>
          ) : (
            <div className="sp-grid">
              {filteredServices.map((service, index) => (
                <ServiceCard key={service._id} service={service} index={index} />
              ))}
            </div>
          )}

          {/* CTA */}
          <div className="sp-cta-row" style={{ borderTop: "1px solid var(--border-subtle)" }}>
            <div>
              <p className="sp-cta-sub" style={{ fontFamily: "'DM Sans', sans-serif", color: "var(--text-tertiary)" }}>Don't see what you need?</p>
              <p className="sp-cta-head" style={{ fontFamily: "'Syne', sans-serif", color: "var(--text-primary)" }}>We build custom solutions</p>
            </div>
            <Link href="/contact" className="sp-btn-primary" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              Get in Touch
              <svg style={{ width: 16, height: 16 }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

const SP_STYLES = `
  /* ── Container: balanced, centered ── */
  .sp-container {
    width: 100%;
    max-width: 1200px;
    margin-left: auto;
    margin-right: auto;
    padding-left: clamp(20px, 4vw, 56px);
    padding-right: clamp(20px, 4vw, 56px);
  }

  /* ── Loading ── */
  .sp-fullscreen { min-height: 100vh; display: flex; align-items: center; justify-content: center; }
  .sp-center { text-align: center; }
  .sp-spinner { width: 44px; height: 44px; border: 3px solid; border-radius: 50%; animation: sp-spin 0.85s linear infinite; margin: 0 auto 14px; }
  @keyframes sp-spin { to { transform: rotate(360deg); } }
  .sp-loading-text { font-size: 14px; letter-spacing: 0.02em; }

  /* ── Hero: centered content ── */
  .sp-hero {
    position: relative;
    overflow: hidden;
    padding-top: clamp(100px, 12vw, 148px);
    padding-bottom: clamp(40px, 6vw, 80px);
    text-align: center;
  }
  .sp-hero-bg {
    position: absolute;
    inset: 0;
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    grid-template-rows: repeat(4, 1fr);
    pointer-events: none;
  }
  .sp-hero-cell {
    border-right: 1px solid var(--border-subtle);
    border-bottom: 1px solid var(--border-subtle);
    opacity: 0;
    animation: sp-grid-in 1.2s ease forwards;
  }
  @keyframes sp-grid-in { to { opacity: 1; } }

  /* Back link — always left-aligned */
  .sp-back-wrap { margin-bottom: clamp(20px, 3vw, 40px); position: relative; z-index: 1; text-align: left; }
  .sp-back-link { display: inline-flex; align-items: center; gap: 8px; font-size: 13px; font-weight: 500; letter-spacing: 0.04em; text-transform: uppercase; text-decoration: none; transition: gap 0.3s ease, color 0.2s ease; }
  .sp-back-link:hover { gap: 12px; color: var(--brand-blue-primary) !important; }
  .sp-back-icon { width: 15px; height: 15px; transition: transform 0.3s ease; }
  .sp-back-link:hover .sp-back-icon { transform: translateX(-4px); }

  /* Hero text block — centered */
  .sp-hero-text {
    position: relative;
    z-index: 1;
    margin-bottom: clamp(28px, 4vw, 56px);
  }
  .sp-eyebrow { display: block; font-size: 12px; font-weight: 600; letter-spacing: 0.18em; text-transform: uppercase; margin-bottom: 14px; }
  .sp-title { font-size: clamp(44px, 8vw, 96px); font-weight: 300; line-height: 1.05; letter-spacing: -0.02em; margin-bottom: 20px; }
  .sp-title-em { font-style: italic; color: var(--brand-blue-primary); }
  .sp-divider { width: 48px; height: 2px; margin: 0 auto 18px; border-radius: 2px; }
  .sp-subtitle { font-size: clamp(15px, 1.6vw, 17px); line-height: 1.7; max-width: 480px; margin: 0 auto; }

  /* Stats row — centered */
  .sp-stats { display: flex; align-items: center; justify-content: center; flex-wrap: wrap; row-gap: 16px; position: relative; z-index: 1; }
  .sp-stat { display: flex; flex-direction: column; align-items: center; gap: 3px; padding: 0 clamp(16px, 3vw, 40px); }
  .sp-stat-num { font-size: clamp(24px, 3vw, 38px); font-weight: 700; line-height: 1; letter-spacing: -0.02em; }
  .sp-stat-lbl { font-size: 11px; letter-spacing: 0.1em; text-transform: uppercase; }
  .sp-stat-sep { width: 1px; height: 36px; flex-shrink: 0; }

  /* ── Filter bar ── */
  .sp-filter-bar {
    position: sticky;
    top: 0;
    z-index: 40;
    padding: 12px 0;
    backdrop-filter: blur(14px);
    -webkit-backdrop-filter: blur(14px);
  }
  .sp-filter-row {
    display: flex;
    justify-content: center;
    gap: 8px;
    overflow-x: auto;
    padding-bottom: 2px;
    scrollbar-width: none;
    -ms-overflow-style: none;
  }
  .sp-filter-row::-webkit-scrollbar { display: none; }
  .sp-pill {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 8px 20px;
    border-radius: 100px;
    font-size: 13px;
    font-weight: 500;
    letter-spacing: 0.02em;
    white-space: nowrap;
    flex-shrink: 0;
    cursor: pointer;
    transition: all 0.25s ease;
  }
  .sp-pill:hover { transform: scale(1.05); }
  .sp-pill-dot { width: 5px; height: 5px; border-radius: 50%; background: rgba(255,255,255,0.65); flex-shrink: 0; }

  /* Filter scroll on small screens */
  @media (max-width: 640px) {
    .sp-filter-row { justify-content: flex-start; }
  }

  /* ── Grid ── */
  .sp-grid-wrap { padding: clamp(32px, 5vw, 64px) 0 clamp(56px, 8vw, 104px); }
  .sp-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: clamp(16px, 2vw, 24px);
  }
  @media (min-width: 600px) { .sp-grid { grid-template-columns: repeat(2, 1fr); } }
  @media (min-width: 960px) { .sp-grid { grid-template-columns: repeat(3, 1fr); } }

  /* ── Card ── */
  .sp-card { text-decoration: none; display: block; }
  .sp-card-inner { position: relative; overflow: hidden; transition: transform 0.4s cubic-bezier(.22,.68,0,1.2), box-shadow 0.4s ease; height: 100%; }
  .sp-card:hover .sp-card-inner { transform: translateY(-5px); box-shadow: 0 20px 48px rgba(0,0,0,0.11); }

  .sp-card-media { position: relative; width: 100%; aspect-ratio: 16/10; overflow: hidden; }
  .sp-card-media-asset { width: 100%; height: 100%; object-fit: cover; display: block; transition: transform 0.7s ease; }
  .sp-card:hover .sp-card-media-asset { transform: scale(1.06); }
  .sp-card-media-overlay { position: absolute; inset: 0; background: linear-gradient(to top, rgba(0,0,0,0.2) 0%, transparent 50%); opacity: 0; transition: opacity 0.4s ease; }
  .sp-card:hover .sp-card-media-overlay { opacity: 1; }

  .sp-card-body { padding: clamp(18px, 2.5vw, 28px); padding-top: clamp(20px, 2.5vw, 28px); }
  .sp-card-body--top { padding-top: clamp(32px, 4vw, 44px); }

  .sp-card-accent { width: 30px; height: 2px; margin-bottom: 14px; transition: width 0.35s ease; border-radius: 2px; }
  .sp-card:hover .sp-card-accent { width: 48px; }

  .sp-card-title { font-size: clamp(17px, 2vw, 22px); font-weight: 600; line-height: 1.25; letter-spacing: -0.01em; margin-bottom: 8px; transition: color 0.25s ease; }
  .sp-card:hover .sp-card-title { color: var(--brand-blue-primary) !important; }

  .sp-card-desc { font-size: 13px; line-height: 1.65; margin-bottom: 16px; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }

  .sp-card-cta { display: inline-flex; align-items: center; gap: 6px; font-size: 13px; font-weight: 600; letter-spacing: 0.02em; transition: gap 0.3s ease; }
  .sp-card:hover .sp-card-cta { gap: 10px; }
  .sp-card-cta-arrow { width: 14px; height: 14px; transition: transform 0.3s ease; }
  .sp-card:hover .sp-card-cta-arrow { transform: translateX(4px); }

  /* ── Empty ── */
  .sp-empty { text-align: center; padding: 80px 24px; display: flex; flex-direction: column; align-items: center; gap: 16px; }
  .sp-empty p { font-size: 15px; }

  /* ── Footer CTA ── */
  .sp-cta-row {
    margin-top: clamp(40px, 6vw, 80px);
    padding-top: clamp(24px, 3.5vw, 48px);
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 20px;
  }
  .sp-cta-sub { font-size: 12px; letter-spacing: 0.06em; text-transform: uppercase; margin-bottom: 4px; }
  .sp-cta-head { font-size: clamp(18px, 2.5vw, 30px); font-weight: 600; letter-spacing: -0.01em; line-height: 1.2; }

  /* ── Button ── */
  .sp-btn-primary {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: var(--brand-blue-primary);
    color: #fff;
    padding: 12px 24px;
    border-radius: 50px;
    font-weight: 600;
    font-size: 14px;
    letter-spacing: 0.02em;
    text-decoration: none;
    border: none;
    cursor: pointer;
    transition: background 0.25s ease, transform 0.25s ease, box-shadow 0.25s ease;
    white-space: nowrap;
  }
  .sp-btn-primary:hover { background: var(--brand-blue-dark); transform: translateY(-2px); box-shadow: 0 8px 24px rgba(79,111,253,0.3); }

  /* ── Mobile touch ── */
  @media (max-width: 640px) {
    .sp-card:active .sp-card-inner { transform: scale(0.98); transition-duration: 0.1s; }
    .sp-pill:active { transform: scale(0.96) !important; }
    .sp-cta-row { flex-direction: column; align-items: flex-start; }
  }

  * { -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; }
`;
