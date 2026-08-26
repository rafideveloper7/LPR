"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { getBlogs } from "@/lib/data";

const ALL = "All";

function formatDate(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function BlogPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState(ALL);
  const [search, setSearch] = useState("");
  const cardsRef = useRef([]);

  useEffect(() => {
    getBlogs()
      .then((res) => {
        if (res?.data) setPosts(res.data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  // Extract unique categories
  const categories = [ALL, ...Array.from(new Set(posts.map((p) => p.category).filter(Boolean)))];

  // Filter
  const filtered = posts.filter((p) => {
    const matchCat = category === ALL || p.category === category;
    const matchSearch =
      !search ||
      p.title?.toLowerCase().includes(search.toLowerCase()) ||
      p.excerpt?.toLowerCase().includes(search.toLowerCase()) ||
      p.category?.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  // Staggered scroll-reveal
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("bp-card-visible");
            obs.unobserve(e.target);
          }
        }),
      { threshold: 0.08 }
    );
    cardsRef.current.forEach((el) => el && obs.observe(el));
    return () => obs.disconnect();
  }, [filtered]);

  return (
    <main className="bp-root">
      <style jsx global>{BP_STYLES}</style>

      {/* ─── HERO HEADER ─── */}
      <section className="bp-hero">
        <div className="bp-container">
          <Link href="/" className="bp-back-link">
            ← Back to Home
          </Link>
          <div style={{ marginTop: "28px" }} />
          <p className="bp-hero-eyebrow">Journal & Insights</p>
          <h1 className="bp-hero-title">Our Latest Articles</h1>
          <p className="bp-hero-sub">
            Thoughts, frameworks, and stories on branding, design systems, modern web engineering, and digital growth.
          </p>
          <div className="bp-divider" />
        </div>
      </section>

      {/* ─── CONTROLS (Filters + Search) ─── */}
      <div className="bp-controls-wrap">
        <div className="bp-container bp-controls">
          <div className="bp-categories">
            {categories.map((cat) => (
              <button
                key={cat}
                className={`bp-cat-btn ${category === cat ? "active" : ""}`}
                onClick={() => setCategory(cat)}
              >
                {category === cat && <span className="bp-cat-dot" />}
                {cat}
              </button>
            ))}
          </div>

          <div className="bp-search-group">
            <input
              type="search"
              placeholder="Search articles…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bp-search-input"
            />
            <span className="bp-count">
              {filtered.length} {filtered.length === 1 ? "article" : "articles"}
            </span>
          </div>
        </div>
      </div>

      {/* ─── GRID ─── */}
      <div className="bp-container">
        {loading ? (
          <div className="bp-loading">
            <div className="bp-spinner" />
            <p className="bp-loading-text">Loading articles…</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="bp-empty">
            <div className="bp-empty-icon">📰</div>
            <h3 className="bp-empty-title">No articles found</h3>
            <p className="bp-empty-sub">Try searching with different keywords or choosing another category.</p>
            {(category !== ALL || search) && (
              <button
                onClick={() => {
                  setCategory(ALL);
                  setSearch("");
                }}
                className="bp-btn-reset"
              >
                Clear Filters
              </button>
            )}
          </div>
        ) : (
          <div className="bp-grid">
            {filtered.map((post, idx) => (
              <article
                key={post._id || post.id}
                ref={(el) => (cardsRef.current[idx] = el)}
                className="bp-card"
                style={{ transitionDelay: `${(idx % 6) * 60}ms` }}
              >
                <Link href={`/blog/${post._id || post.id}`} className="bp-card-link">
                  <div className="bp-card-thumb-wrap">
                    {post.image ? (
                      <img src={post.image} alt={post.title} className="bp-card-img" />
                    ) : (
                      <div className="bp-card-img-placeholder">
                        <span>📰</span>
                      </div>
                    )}
                    {post.category && <span className="bp-card-badge">{post.category}</span>}
                  </div>

                  <div className="bp-card-body">
                    <div className="bp-card-meta">
                      {post.date && <span>{formatDate(post.date)}</span>}
                      {post.date && post.readTime && <span className="bp-meta-sep">•</span>}
                      {post.readTime && <span>{post.readTime}</span>}
                    </div>

                    <h2 className="bp-card-title">{post.title}</h2>

                    {post.excerpt && <p className="bp-card-excerpt">{post.excerpt}</p>}

                    <div className="bp-card-footer">
                      <span className="bp-read-more">
                        Read Article <span className="bp-arrow">→</span>
                      </span>
                    </div>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        )}

        {/* ─── BOTTOM NEWSLETTER / CTA ─── */}
        <div className="bp-cta-card">
          <div className="bp-cta-accent" />
          <div className="bp-cta-inner">
            <span className="bp-cta-tag">Stay in the Loop</span>
            <h2 className="bp-cta-title">Have a project or story to share?</h2>
            <p className="bp-cta-desc">
              We collaborate with forward-thinking brands worldwide to create unforgettable digital experiences.
            </p>
            <div className="bp-cta-actions">
              <Link href="/contact" className="bp-cta-primary">
                Let's Talk About Your Project →
              </Link>
              <Link href="/services" className="bp-cta-secondary">
                Explore Services
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

const BP_STYLES = `
  .bp-root {
    min-height: 100vh;
    background: var(--bg-page);
    padding-bottom: 96px;
  }

  .bp-container {
    width: 100%;
    max-width: 1200px;
    margin-left: auto;
    margin-right: auto;
    padding-left: clamp(20px, 4vw, 56px);
    padding-right: clamp(20px, 4vw, 56px);
  }

  /* ── Hero Header ── */
  .bp-hero {
    padding-top: clamp(100px, 12vw, 148px);
    padding-bottom: clamp(32px, 5vw, 60px);
    text-align: center;
    position: relative;
    overflow: hidden;
  }
  .bp-back-link {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: 13px;
    font-weight: 600;
    color: var(--text-tertiary);
    text-decoration: none;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    transition: color 0.2s ease;
    font-family: 'DM Sans', sans-serif;
  }
  .bp-back-link:hover { color: var(--brand-blue-primary); }

  .bp-hero-eyebrow {
    font-family: 'DM Sans', sans-serif;
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    color: var(--brand-blue-primary);
    margin-bottom: 12px;
  }
  .bp-hero-title {
    font-family: 'Syne', sans-serif;
    font-size: clamp(36px, 6vw, 72px);
    font-weight: 300;
    color: var(--text-primary);
    line-height: 1.1;
    margin: 0 0 16px;
  }
  .bp-hero-sub {
    font-family: 'DM Sans', sans-serif;
    font-size: clamp(15px, 2vw, 18px);
    color: var(--text-secondary);
    max-width: 600px;
    margin: 0 auto 36px;
    line-height: 1.6;
  }
  .bp-divider {
    width: 60px;
    height: 2px;
    background: var(--brand-blue-primary);
    margin: 0 auto;
    border-radius: 2px;
  }

  /* ── Controls ── */
  .bp-controls-wrap {
    margin-bottom: 36px;
  }
  .bp-controls {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
  }
  .bp-categories {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }
  .bp-cat-btn {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 8px 18px;
    border-radius: 999px;
    font-size: 13px;
    font-weight: 600;
    font-family: 'DM Sans', sans-serif;
    border: 1.5px solid var(--border-light);
    background: transparent;
    color: var(--text-secondary);
    cursor: pointer;
    transition: all 0.2s ease;
  }
  .bp-cat-btn:hover {
    border-color: var(--brand-blue-primary);
    color: var(--brand-blue-primary);
  }
  .bp-cat-btn.active {
    background: var(--brand-blue-primary);
    border-color: var(--brand-blue-primary);
    color: #fff;
  }
  .bp-cat-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #fff;
  }

  .bp-search-group {
    display: flex;
    align-items: center;
    gap: 12px;
  }
  .bp-search-input {
    height: 40px;
    padding: 0 16px;
    border-radius: 999px;
    border: 1.5px solid var(--border-light);
    background: var(--bg-surface);
    color: var(--text-primary);
    font-size: 13px;
    font-family: 'DM Sans', sans-serif;
    min-width: 210px;
    outline: none;
    transition: border-color 0.2s ease;
  }
  .bp-search-input:focus {
    border-color: var(--brand-blue-primary);
  }
  .bp-count {
    font-size: 13px;
    font-family: 'DM Sans', sans-serif;
    color: var(--text-tertiary);
    white-space: nowrap;
  }

  /* ── Grid ── */
  .bp-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 28px;
    margin-bottom: 64px;
  }
  @media (min-width: 640px) {
    .bp-grid { grid-template-columns: repeat(2, 1fr); }
  }
  @media (min-width: 1024px) {
    .bp-grid { grid-template-columns: repeat(3, 1fr); }
  }

  /* ── Card ── */
  .bp-card {
    border-radius: 18px;
    background: var(--bg-elevated);
    border: 1px solid var(--border-subtle);
    overflow: hidden;
    display: flex;
    flex-direction: column;
    opacity: 0;
    transform: translateY(28px);
    transition: opacity 0.5s ease, transform 0.5s ease, box-shadow 0.3s ease, border-color 0.3s ease;
  }
  .bp-card-visible {
    opacity: 1;
    transform: translateY(0);
  }
  .bp-card:hover {
    box-shadow: 0 20px 48px rgba(0, 0, 0, 0.12);
    border-color: var(--border-medium);
  }
  .bp-card-link {
    text-decoration: none;
    display: flex;
    flex-direction: column;
    height: 100%;
    color: inherit;
  }

  .bp-card-thumb-wrap {
    position: relative;
    width: 100%;
    aspect-ratio: 16 / 10;
    overflow: hidden;
    background: var(--bg-surface-alt);
  }
  .bp-card-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    transition: transform 0.6s cubic-bezier(0.2, 0, 0.2, 1);
  }
  .bp-card:hover .bp-card-img {
    transform: scale(1.06);
  }
  .bp-card-img-placeholder {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 40px;
    opacity: 0.3;
  }

  .bp-card-badge {
    position: absolute;
    top: 12px;
    left: 12px;
    background: rgba(255, 255, 255, 0.92);
    backdrop-filter: blur(6px);
    color: var(--text-primary);
    font-size: 10px;
    font-weight: 700;
    padding: 4px 10px;
    border-radius: 99px;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    font-family: 'DM Sans', sans-serif;
  }

  .bp-card-body {
    padding: 22px;
    display: flex;
    flex-direction: column;
    flex-grow: 1;
  }
  .bp-card-meta {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 12px;
    color: var(--text-tertiary);
    font-family: 'DM Sans', sans-serif;
    margin-bottom: 10px;
  }
  .bp-meta-sep {
    color: var(--border-bold);
  }

  .bp-card-title {
    font-family: 'Syne', sans-serif;
    font-size: 18px;
    font-weight: 600;
    color: var(--text-primary);
    line-height: 1.35;
    margin: 0 0 10px;
    transition: color 0.2s ease;
  }
  .bp-card:hover .bp-card-title {
    color: var(--brand-blue-primary);
  }

  .bp-card-excerpt {
    font-family: 'DM Sans', sans-serif;
    font-size: 13px;
    color: var(--text-secondary);
    line-height: 1.6;
    margin: 0 0 16px;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    flex-grow: 1;
  }

  .bp-card-footer {
    display: flex;
    align-items: center;
    padding-top: 14px;
    border-top: 1px solid var(--border-subtle);
  }
  .bp-read-more {
    font-family: 'DM Sans', sans-serif;
    font-size: 13px;
    font-weight: 700;
    color: var(--brand-blue-primary);
    display: inline-flex;
    align-items: center;
    gap: 4px;
    transition: gap 0.2s ease;
  }
  .bp-card:hover .bp-read-more {
    gap: 8px;
  }
  .bp-arrow {
    transition: transform 0.2s ease;
  }
  .bp-card:hover .bp-arrow {
    transform: translateX(2px);
  }

  /* ── Loading / Empty ── */
  .bp-loading {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 45vh;
  }
  .bp-spinner {
    width: 44px;
    height: 44px;
    border: 3px solid var(--border-subtle);
    border-top-color: var(--brand-blue-primary);
    border-radius: 50%;
    animation: bp-spin 0.8s linear infinite;
    margin-bottom: 12px;
  }
  @keyframes bp-spin { to { transform: rotate(360deg); } }
  .bp-loading-text {
    font-size: 14px;
    color: var(--text-tertiary);
    font-family: 'DM Sans', sans-serif;
  }

  .bp-empty {
    text-align: center;
    padding: 80px 24px;
  }
  .bp-empty-icon { font-size: 52px; margin-bottom: 14px; opacity: 0.4; }
  .bp-empty-title { font-family: 'Syne', sans-serif; font-size: 22px; color: var(--text-primary); margin-bottom: 6px; }
  .bp-empty-sub { font-family: 'DM Sans', sans-serif; font-size: 14px; color: var(--text-secondary); margin-bottom: 20px; }
  .bp-btn-reset {
    padding: 10px 22px;
    border-radius: 99px;
    background: var(--brand-blue-primary);
    color: #fff;
    font-size: 13px;
    font-weight: 600;
    border: none;
    cursor: pointer;
  }

  /* ── CTA Card ── */
  .bp-cta-card {
    position: relative;
    border-radius: 20px;
    background: var(--bg-elevated);
    border: 1px solid var(--border-subtle);
    overflow: hidden;
    margin-top: 32px;
  }
  .bp-cta-accent {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, var(--brand-blue-primary), var(--brand-blue-dark));
  }
  .bp-cta-inner {
    padding: clamp(32px, 5vw, 48px);
    text-align: center;
    max-width: 680px;
    margin: 0 auto;
  }
  .bp-cta-tag {
    display: inline-block;
    font-family: 'DM Sans', sans-serif;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: var(--brand-blue-primary);
    margin-bottom: 12px;
  }
  .bp-cta-title {
    font-family: 'Syne', sans-serif;
    font-size: clamp(24px, 4vw, 36px);
    font-weight: 600;
    color: var(--text-primary);
    margin: 0 0 14px;
    line-height: 1.25;
  }
  .bp-cta-desc {
    font-family: 'DM Sans', sans-serif;
    font-size: 14px;
    color: var(--text-secondary);
    line-height: 1.6;
    margin: 0 0 28px;
  }
  .bp-cta-actions {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 12px;
  }
  .bp-cta-primary {
    padding: 13px 26px;
    border-radius: 99px;
    background: var(--brand-blue-primary);
    color: #fff;
    font-size: 14px;
    font-weight: 700;
    text-decoration: none;
    transition: background 0.2s, transform 0.15s;
    font-family: 'DM Sans', sans-serif;
  }
  .bp-cta-primary:hover {
    background: var(--brand-blue-dark);
    transform: translateY(-1px);
  }
  .bp-cta-secondary {
    padding: 12px 24px;
    border-radius: 99px;
    background: transparent;
    border: 1.5px solid var(--border-light);
    color: var(--text-primary);
    font-size: 14px;
    font-weight: 600;
    text-decoration: none;
    transition: background 0.2s;
    font-family: 'DM Sans', sans-serif;
  }
  .bp-cta-secondary:hover {
    background: var(--bg-surface);
  }
`;