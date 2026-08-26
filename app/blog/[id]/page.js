"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { getBlog, getBlogs } from "@/lib/data";

/* ── Lightbox ──────────────────────────────────────── */
function Lightbox({ src, title, onClose }) {
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div className="bdlb-overlay" onClick={onClose}>
      <div className="bdlb-box" onClick={(e) => e.stopPropagation()}>
        <button className="bdlb-close" onClick={onClose} title="Close (Esc)">✕</button>
        <img src={src} alt={title || "Preview"} className="bdlb-media" />
      </div>
    </div>
  );
}

function formatDate(dateStr) {
  if (!dateStr) return "";
  const parsed = new Date(dateStr);
  if (Number.isNaN(parsed.getTime())) return dateStr;
  return parsed.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function BlogDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [blog, setBlog] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visible, setVisible] = useState(false);
  const [lightbox, setLightbox] = useState(null); // image src
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setVisible(false);

    getBlog(id)
      .then((json) => {
        if (json?.data) {
          setBlog(json.data);
          // fetch related posts
          getBlogs().then((all) => {
            if (all?.data) {
              const others = all.data.filter((p) => p._id !== json.data._id);
              // prefer same category, otherwise any other post
              const sameCategory = others.filter((p) => p.category === json.data.category);
              setRelated((sameCategory.length >= 2 ? sameCategory : others).slice(0, 3));
            }
          }).catch(() => {});
        } else {
          router.replace("/blog");
        }
      })
      .catch(() => {
        router.replace("/blog");
      })
      .finally(() => {
        setLoading(false);
        setTimeout(() => setVisible(true), 80);
      });
  }, [id, router]);

  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading) {
    return (
      <main className="bd-fullscreen">
        <div className="bd-center">
          <div className="bd-spinner" />
          <p className="bd-loading-text">Loading article…</p>
        </div>
        <style jsx global>{BD_STYLES}</style>
      </main>
    );
  }

  if (!blog) {
    return (
      <main className="bd-fullscreen">
        <div className="bd-center">
          <div className="bd-error-icon">📰</div>
          <h1 className="bd-error-title">Article not found</h1>
          <p className="bd-error-sub">This article may have been moved or removed.</p>
          <Link href="/blog" className="bd-btn-primary">
            ← Back to All Articles
          </Link>
        </div>
        <style jsx global>{BD_STYLES}</style>
      </main>
    );
  }

  return (
    <main className="bd-root" style={{ opacity: visible ? 1 : 0, transition: "opacity 0.4s ease" }}>
      <style jsx global>{BD_STYLES}</style>

      {/* ─── HERO HEADER (Clean typography, media NOT at top) ─── */}
      <section className="bd-hero">
        <div className="bd-hero-inner">
          <Link href="/blog" className="bd-back-link">
            ← Back to Blog
          </Link>

          <div className="bd-hero-meta">
            {blog.category && <span className="bd-category-badge">{blog.category}</span>}
            {blog.date && <span className="bd-meta-text">{formatDate(blog.date)}</span>}
            {blog.date && blog.readTime && <span className="bd-meta-dot">•</span>}
            {blog.readTime && <span className="bd-meta-text">{blog.readTime}</span>}
          </div>

          <h1 className="bd-hero-title">{blog.title}</h1>

          <div className="bd-divider" />
        </div>
      </section>

      {/* ─── TWO-COLUMN CONTENT LAYOUT ─── */}
      <div className="bd-layout">
        {/* Left Column: Media + Excerpt + Full Prose Content */}
        <article className="bd-main-col">
          {/* Cover Media Card with Lightbox Zoom */}
          {blog.image && (
            <div className="bd-media-card">
              <div className="bd-media-frame">
                <img
                  src={blog.image}
                  alt={blog.title}
                  className="bd-media-img"
                />
                <button
                  className="bd-media-expand"
                  onClick={() => setLightbox(blog.image)}
                  title="Expand to Fullscreen"
                >
                  ⛶ Expand Preview
                </button>
              </div>
            </div>
          )}

          {/* Lead Excerpt Callout */}
          {blog.excerpt && (
            <div className="bd-excerpt-box">
              <p className="bd-excerpt-text">{blog.excerpt}</p>
            </div>
          )}

          {/* Body Prose Content */}
          {blog.content && (
            <div
              className="bd-prose"
              dangerouslySetInnerHTML={{
                __html: blog.content
                  .split(/\n\s*\n/)
                  .map((p) => `<p>${p.replace(/\n/g, "<br />")}</p>`)
                  .join(""),
              }}
            />
          )}

          {/* Share & Actions Bar */}
          <div className="bd-share-bar">
            <span className="bd-share-label">Share this article:</span>
            <div className="bd-share-btns">
              <button
                onClick={handleCopyLink}
                className="bd-share-btn"
                title="Copy Link"
              >
                {copied ? "✓ Copied!" : "🔗 Copy Link"}
              </button>
              <a
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(blog.title)}&url=${typeof window !== "undefined" ? encodeURIComponent(window.location.href) : ""}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bd-share-btn"
              >
                𝕏 Share
              </a>
              <a
                href={`https://www.linkedin.com/sharing/share-offsite/?url=${typeof window !== "undefined" ? encodeURIComponent(window.location.href) : ""}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bd-share-btn"
              >
                LinkedIn
              </a>
            </div>
          </div>
        </article>

        {/* Right Sticky Sidebar */}
        <aside className="bd-sidebar">
          {/* Article Info Card */}
          <div className="bd-sidebar-card">
            <p className="bd-sidebar-title">Article Details</p>
            {blog.category && (
              <div className="bd-detail-row">
                <span className="bd-detail-label">Category</span>
                <span className="bd-detail-value">{blog.category}</span>
              </div>
            )}
            {blog.date && (
              <div className="bd-detail-row">
                <span className="bd-detail-label">Published</span>
                <span className="bd-detail-value">{formatDate(blog.date)}</span>
              </div>
            )}
            {blog.readTime && (
              <div className="bd-detail-row">
                <span className="bd-detail-label">Read Time</span>
                <span className="bd-detail-value">{blog.readTime}</span>
              </div>
            )}
            <div className="bd-detail-row">
              <span className="bd-detail-label">Publication</span>
              <span className="bd-detail-value">LPR Journal</span>
            </div>
          </div>

          {/* Quick Media Preview */}
          {blog.image && (
            <div className="bd-sidebar-card">
              <p className="bd-sidebar-title">Cover Preview</p>
              <button
                className="bd-cta-outline"
                style={{ marginTop: 0 }}
                onClick={() => setLightbox(blog.image)}
              >
                📷 View Full Image
              </button>
            </div>
          )}

          {/* Project CTA Card */}
          <div className="bd-sidebar-card">
            <p className="bd-sidebar-title">Have a Project?</p>
            <p className="bd-cta-subtext">
              Transform your ideas into impactful digital products with our design & engineering team.
            </p>
            <Link href="/contact" className="bd-cta-btn">
              Start a Project →
            </Link>
            <Link href="/blog" className="bd-cta-outline">
              ← All Articles
            </Link>
          </div>
        </aside>
      </div>

      {/* ─── RELATED ARTICLES SECTION ─── */}
      {related.length > 0 && (
        <div className="bd-related">
          <h2 className="bd-related-title">More from our Journal</h2>
          <div className="bd-related-grid">
            {related.map((r) => (
              <Link key={r._id || r.id} href={`/blog/${r._id || r.id}`} className="bd-related-card">
                {r.image ? (
                  <img src={r.image} alt={r.title} className="bd-related-thumb" />
                ) : (
                  <div className="bd-related-placeholder">📰</div>
                )}
                <div className="bd-related-body">
                  {r.category && <p className="bd-related-cat">{r.category}</p>}
                  <h3 className="bd-related-name">{r.title}</h3>
                  <p className="bd-related-time">{r.readTime || "5 min read"}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Lightbox Modal */}
      {lightbox && (
        <Lightbox src={lightbox} title={blog.title} onClose={() => setLightbox(null)} />
      )}
    </main>
  );
}

const BD_STYLES = `
  .bd-root {
    min-height: 100vh;
    background: var(--bg-page);
    padding-bottom: 96px;
  }

  /* ── Loading / Error ── */
  .bd-fullscreen {
    min-height: 100vh;
    background: var(--bg-page);
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .bd-center { text-align: center; padding: 24px; }
  .bd-spinner {
    width: 44px;
    height: 44px;
    border: 3px solid var(--border-subtle);
    border-top-color: var(--brand-blue-primary);
    border-radius: 50%;
    animation: bd-spin 0.8s linear infinite;
    margin: 0 auto 14px;
  }
  @keyframes bd-spin { to { transform: rotate(360deg); } }
  .bd-loading-text {
    font-size: 14px;
    color: var(--text-tertiary);
    font-family: 'DM Sans', sans-serif;
  }
  .bd-error-icon { font-size: 52px; margin-bottom: 12px; opacity: 0.5; }
  .bd-error-title {
    font-family: 'Syne', sans-serif;
    font-size: 24px;
    color: var(--text-primary);
    margin-bottom: 6px;
  }
  .bd-error-sub {
    font-family: 'DM Sans', sans-serif;
    font-size: 14px;
    color: var(--text-secondary);
    margin-bottom: 20px;
  }
  .bd-btn-primary {
    display: inline-flex;
    padding: 10px 22px;
    border-radius: 99px;
    background: var(--brand-blue-primary);
    color: #fff;
    font-size: 13px;
    font-weight: 600;
    text-decoration: none;
    font-family: 'DM Sans', sans-serif;
  }

  /* ── Hero Header ── */
  .bd-hero {
    padding: 100px 24px 44px;
    position: relative;
    overflow: hidden;
  }
  .bd-hero-inner {
    max-width: 1100px;
    margin: 0 auto;
    position: relative;
    z-index: 1;
  }
  .bd-back-link {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: 14px;
    font-weight: 600;
    color: var(--text-secondary);
    text-decoration: none;
    margin-bottom: 24px;
    transition: color 0.2s ease;
    font-family: 'DM Sans', sans-serif;
  }
  .bd-back-link:hover { color: var(--brand-blue-primary); }

  .bd-hero-meta {
    display: flex;
    align-items: center;
    gap: 10px;
    flex-wrap: wrap;
    margin-bottom: 16px;
  }
  .bd-category-badge {
    font-size: 11px;
    font-weight: 700;
    padding: 4px 12px;
    border-radius: 99px;
    text-transform: uppercase;
    letter-spacing: 0.07em;
    background: var(--brand-blue-primary);
    color: #fff;
    font-family: 'DM Sans', sans-serif;
  }
  .bd-meta-text {
    font-size: 13px;
    font-weight: 500;
    color: var(--text-secondary);
    font-family: 'DM Sans', sans-serif;
  }
  .bd-meta-dot {
    color: var(--border-bold);
    font-size: 12px;
  }

  .bd-hero-title {
    font-family: 'Syne', sans-serif;
    font-size: clamp(30px, 5.5vw, 56px);
    font-weight: 300;
    color: var(--text-primary);
    margin: 0 0 20px;
    line-height: 1.15;
  }
  .bd-divider {
    width: 60px;
    height: 2px;
    background: var(--brand-blue-primary);
    border-radius: 2px;
  }

  /* ── Content Layout (2-columns) ── */
  .bd-layout {
    max-width: 1100px;
    margin: 0 auto;
    padding: 0 24px;
    display: grid;
    grid-template-columns: 1fr;
    gap: 36px;
  }
  @media (min-width: 900px) {
    .bd-layout { grid-template-columns: 1fr 340px; }
  }

  .bd-main-col {
    display: flex;
    flex-direction: column;
    gap: 28px;
  }

  /* ── Media Card in Content Body ── */
  .bd-media-card {
    border-radius: 16px;
    background: var(--bg-elevated);
    border: 1px solid var(--border-subtle);
    overflow: hidden;
  }
  .bd-media-frame {
    position: relative;
    width: 100%;
    aspect-ratio: 16 / 9;
    background: var(--bg-surface-alt);
    overflow: hidden;
  }
  .bd-media-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    transition: transform 0.6s ease;
  }
  .bd-media-card:hover .bd-media-img {
    transform: scale(1.03);
  }
  .bd-media-expand {
    position: absolute;
    bottom: 12px;
    right: 12px;
    background: rgba(0, 0, 0, 0.6);
    backdrop-filter: blur(6px);
    color: #fff;
    border: none;
    border-radius: 8px;
    padding: 6px 12px;
    font-size: 12px;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.2s;
  }
  .bd-media-expand:hover { background: rgba(0, 0, 0, 0.85); }

  /* ── Excerpt Box ── */
  .bd-excerpt-box {
    border-left: 3px solid var(--brand-blue-primary);
    background: var(--bg-elevated);
    border-radius: 0 12px 12px 0;
    padding: 18px 24px;
    border-top: 1px solid var(--border-subtle);
    border-right: 1px solid var(--border-subtle);
    border-bottom: 1px solid var(--border-subtle);
  }
  .bd-excerpt-text {
    font-family: 'DM Sans', sans-serif;
    font-size: clamp(15px, 1.8vw, 17px);
    font-style: italic;
    line-height: 1.7;
    color: var(--text-secondary);
    margin: 0;
  }

  /* ── Prose Content ── */
  .bd-prose {
    font-family: 'DM Sans', sans-serif;
    font-size: clamp(15px, 1.8vw, 17px);
    line-height: 1.85;
    color: var(--text-secondary);
  }
  .bd-prose p {
    margin-bottom: 24px;
  }
  .bd-prose p:last-child {
    margin-bottom: 0;
  }

  /* ── Share Bar ── */
  .bd-share-bar {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: 14px;
    padding: 20px 0;
    border-top: 1px solid var(--border-subtle);
    border-bottom: 1px solid var(--border-subtle);
    margin-top: 12px;
  }
  .bd-share-label {
    font-family: 'DM Sans', sans-serif;
    font-size: 13px;
    font-weight: 600;
    color: var(--text-tertiary);
  }
  .bd-share-btns {
    display: flex;
    gap: 8px;
  }
  .bd-share-btn {
    padding: 7px 14px;
    border-radius: 99px;
    background: var(--bg-elevated);
    border: 1px solid var(--border-light);
    color: var(--text-primary);
    font-size: 12px;
    font-weight: 600;
    font-family: 'DM Sans', sans-serif;
    cursor: pointer;
    text-decoration: none;
    transition: all 0.2s ease;
  }
  .bd-share-btn:hover {
    border-color: var(--brand-blue-primary);
    color: var(--brand-blue-primary);
    background: var(--bg-surface);
  }

  /* ── Sidebar ── */
  .bd-sidebar {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }
  @media (min-width: 900px) {
    .bd-sidebar { position: sticky; top: 90px; }
  }
  .bd-sidebar-card {
    background: var(--bg-elevated);
    border: 1px solid var(--border-subtle);
    border-radius: 16px;
    padding: 20px;
  }
  .bd-sidebar-title {
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--text-tertiary);
    margin: 0 0 14px;
    font-family: 'DM Sans', sans-serif;
  }
  .bd-detail-row {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    padding: 8px 0;
    border-bottom: 1px solid var(--border-subtle);
    font-size: 13px;
    font-family: 'DM Sans', sans-serif;
  }
  .bd-detail-row:last-child { border: none; }
  .bd-detail-label { color: var(--text-secondary); font-weight: 500; }
  .bd-detail-value { color: var(--text-primary); font-weight: 600; text-align: right; max-width: 60%; }

  .bd-cta-subtext {
    font-family: 'DM Sans', sans-serif;
    font-size: 13px;
    color: var(--text-secondary);
    line-height: 1.5;
    margin: 0 0 16px;
  }
  .bd-cta-btn {
    width: 100%;
    padding: 13px;
    border-radius: 12px;
    background: var(--brand-blue-primary);
    color: #fff;
    font-size: 14px;
    font-weight: 700;
    border: none;
    cursor: pointer;
    text-decoration: none;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    transition: opacity 0.2s, transform 0.15s;
    font-family: 'DM Sans', sans-serif;
  }
  .bd-cta-btn:hover { opacity: 0.9; transform: translateY(-1px); }

  .bd-cta-outline {
    width: 100%;
    padding: 11px;
    border-radius: 12px;
    background: transparent;
    color: var(--text-primary);
    font-size: 13px;
    font-weight: 600;
    border: 1.5px solid var(--border-light);
    cursor: pointer;
    text-decoration: none;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    transition: background 0.2s;
    margin-top: 8px;
    font-family: 'DM Sans', sans-serif;
  }
  .bd-cta-outline:hover { background: var(--bg-surface); }

  /* ── Related Articles ── */
  .bd-related {
    max-width: 1100px;
    margin: 48px auto 0;
    padding: 0 24px;
  }
  .bd-related-title {
    font-family: 'Syne', sans-serif;
    font-size: 22px;
    font-weight: 300;
    color: var(--text-primary);
    margin: 0 0 20px;
  }
  .bd-related-grid {
    display: grid;
    gap: 20px;
    grid-template-columns: 1fr;
  }
  @media (min-width: 640px) {
    .bd-related-grid { grid-template-columns: repeat(3, 1fr); }
  }
  .bd-related-card {
    border-radius: 14px;
    background: var(--bg-elevated);
    border: 1px solid var(--border-subtle);
    overflow: hidden;
    text-decoration: none;
    display: flex;
    flex-direction: column;
    transition: transform 0.25s, box-shadow 0.25s;
  }
  .bd-related-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 32px rgba(0, 0, 0, 0.12);
  }
  .bd-related-thumb {
    width: 100%;
    aspect-ratio: 16 / 10;
    object-fit: cover;
  }
  .bd-related-placeholder {
    width: 100%;
    aspect-ratio: 16 / 10;
    background: var(--bg-surface);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 32px;
    opacity: 0.3;
  }
  .bd-related-body { padding: 16px; display: flex; flex-direction: column; flex-grow: 1; }
  .bd-related-cat {
    font-size: 10px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: var(--brand-blue-primary);
    margin-bottom: 6px;
    font-family: 'DM Sans', sans-serif;
  }
  .bd-related-name {
    font-family: 'Syne', sans-serif;
    font-size: 15px;
    font-weight: 600;
    color: var(--text-primary);
    line-height: 1.35;
    margin: 0 0 10px;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  .bd-related-time {
    font-size: 12px;
    color: var(--text-tertiary);
    margin-top: auto;
    font-family: 'DM Sans', sans-serif;
  }

  /* ── Lightbox ── */
  .bdlb-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.85);
    backdrop-filter: blur(8px);
    z-index: 9999;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
  }
  .bdlb-box {
    position: relative;
    width: 100%;
    max-width: 960px;
    animation: lb-in 0.2s ease;
  }
  @keyframes lb-in {
    from { opacity: 0; transform: scale(0.95); }
    to { opacity: 1; transform: scale(1); }
  }
  .bdlb-close {
    position: absolute;
    top: -14px;
    right: -14px;
    width: 36px;
    height: 36px;
    border-radius: 50%;
    border: none;
    background: rgba(255, 255, 255, 0.2);
    backdrop-filter: blur(6px);
    color: #fff;
    font-size: 16px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10;
    transition: background 0.2s;
  }
  .bdlb-close:hover { background: rgba(255, 0, 0, 0.7); }
  .bdlb-media {
    width: 100%;
    max-height: 85vh;
    object-fit: contain;
    border-radius: 14px;
    display: block;
  }
`;