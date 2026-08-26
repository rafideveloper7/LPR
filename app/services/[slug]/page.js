"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { getServiceBySlug, getServices } from "@/lib/data";

/* ── Lightbox ──────────────────────────────────────── */
function Lightbox({ src, type, onClose }) {
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
    <div className="sdlb-overlay" onClick={onClose}>
      <div className="sdlb-box" onClick={(e) => e.stopPropagation()}>
        <button className="sdlb-close" onClick={onClose} title="Close (Esc)">✕</button>
        {type === "video" ? (
          <video src={src} controls autoPlay className="sdlb-media" />
        ) : (
          <img src={src} alt="Preview" className="sdlb-media" />
        )}
      </div>
    </div>
  );
}

/* ── MediaSection in Content Body (NOT Hero) ── */
function ServiceMediaSection({ service, onPreview }) {
  const hasImage = !!(service.image || service.img);
  const hasVideo = !!service.video;
  const hasBoth = hasImage && hasVideo;
  const [activeTab, setActiveTab] = useState(hasVideo ? "video" : "image");

  if (!hasImage && !hasVideo) return null;

  return (
    <div className="sd-media-card">
      {hasBoth && (
        <div className="sd-media-tabs">
          <button
            className={`sd-media-tab ${activeTab === "image" ? "active" : ""}`}
            onClick={() => setActiveTab("image")}
          >
            📷 Image
          </button>
          <button
            className={`sd-media-tab ${activeTab === "video" ? "active" : ""}`}
            onClick={() => setActiveTab("video")}
          >
            🎬 Video
          </button>
        </div>
      )}

      <div className="sd-media-frame">
        {activeTab === "video" && hasVideo && (
          <video
            src={service.video}
            controls
            playsInline
            className="sd-media-el"
            poster={service.image || undefined}
          />
        )}
        {activeTab === "image" && hasImage && (
          <img
            src={service.image || service.img}
            alt={service.imageAlt || service.title}
            className="sd-media-el"
          />
        )}
        <button
          className="sd-media-expand"
          onClick={() =>
            onPreview(
              activeTab === "video" ? service.video : (service.image || service.img),
              activeTab
            )
          }
          title="Expand Preview"
        >
          ⛶ Expand Preview
        </button>
      </div>

      {hasBoth && (
        <div className="sd-media-thumbs">
          <div
            className={`sd-thumb-item ${activeTab === "image" ? "active" : ""}`}
            onClick={() => setActiveTab("image")}
          >
            <img src={service.image || service.img} alt="Image" className="sd-thumb-img" />
            <span className="sd-thumb-label">Image</span>
          </div>
          <div
            className={`sd-thumb-item ${activeTab === "video" ? "active" : ""}`}
            onClick={() => setActiveTab("video")}
          >
            <div className="sd-thumb-vid">▶</div>
            <span className="sd-thumb-label">Video</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ServiceDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug;
  const [service, setService] = useState(null);
  const [otherServices, setOtherServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [visible, setVisible] = useState(false);
  const [lightbox, setLightbox] = useState(null); // { src, type }

  useEffect(() => {
    const fetchService = async () => {
      if (!slug) return;
      setLoading(true);
      setVisible(false);
      try {
        const data = await getServiceBySlug(slug);
        if (data?.success && data.data) {
          setService(data.data);
          // fetch other services
          getServices().then((res) => {
            if (res?.data) {
              setOtherServices(res.data.filter((s) => s._id !== data.data._id).slice(0, 3));
            }
          }).catch(() => {});
        } else {
          setError("Service not found");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
        setTimeout(() => setVisible(true), 80);
      }
    };
    fetchService();
  }, [slug]);

  const openPreview = (src, type) => setLightbox({ src, type });

  if (loading) {
    return (
      <main className="sd-fullscreen" style={{ backgroundColor: "var(--bg-page)" }}>
        <div className="sd-center">
          <div className="sd-spinner" style={{ borderColor: "var(--border-subtle)", borderTopColor: "var(--brand-blue-primary)" }} />
          <p className="sd-loading-text" style={{ fontFamily: "'DM Sans', sans-serif", color: "var(--text-tertiary)" }}>
            Loading service…
          </p>
        </div>
        <style jsx global>{SD_STYLES}</style>
      </main>
    );
  }

  if (error || !service) {
    return (
      <main className="sd-fullscreen" style={{ backgroundColor: "var(--bg-page)" }}>
        <div className="sd-center">
          <div className="sd-error-icon" style={{ color: "var(--accent-error)" }}>
            <svg width="48" height="48" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
            </svg>
          </div>
          <p style={{ fontFamily: "'DM Sans', sans-serif", color: "var(--accent-error)", marginBottom: "20px", fontSize: 15 }}>
            {error || "Service not found"}
          </p>
          <button onClick={() => router.push("/services")} className="sd-btn-primary">
            ← Back to Services
          </button>
        </div>
        <style jsx global>{SD_STYLES}</style>
      </main>
    );
  }

  return (
    <main className="sd-root" style={{ opacity: visible ? 1 : 0, transition: "opacity 0.4s ease" }}>
      <style jsx global>{SD_STYLES}</style>

      {/* ─── Hero Header (Clean typography, media NOT at top) ─── */}
      <section className="sd-hero">
        <div className="sd-hero-inner">
          <Link href="/services" className="sd-back-link">
            ← Back to Services
          </Link>

          <div className="sd-hero-meta">
            <span className="sd-type-badge">
              Service
            </span>
            {service.order !== undefined && (
              <span className="sd-status-badge">
                Tier #{service.order + 1}
              </span>
            )}
          </div>

          <h1 className="sd-hero-title">{service.title}</h1>

          <div className="sd-divider" />
        </div>
      </section>

      {/* ─── Two-Column Content Layout ─── */}
      <div className="sd-layout">
        {/* Left Column: Media + Features */}
        <div className="sd-main-col">
          {/* Media Section (Image / Video + Lightbox) */}
          <ServiceMediaSection service={service} onPreview={openPreview} />

          {/* Features list */}
          {service.features && service.features.length > 0 && (
            <div className="sd-features-box">
              <h2 className="sd-features-heading">
                What's Included
              </h2>
              <ul className="sd-features-list">
                {service.features.map((feature, idx) => (
                  <li
                    key={idx}
                    className="sd-feature-item"
                    style={{ borderBottom: idx !== service.features.length - 1 ? "1px solid var(--border-subtle)" : "none" }}
                  >
                    <span className="sd-feature-check">
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <circle cx="10" cy="10" r="10" fill="var(--brand-blue-soft)" />
                        <path d="M6 10l3 3 5-6" stroke="var(--brand-blue-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                    <span className="sd-feature-text">
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Right Sidebar */}
        <aside className="sd-sidebar">
          {/* Service Details Card */}
          <div className="sd-sidebar-card">
            <p className="sd-sidebar-title">Service Details</p>
            <div className="sd-detail-row">
              <span className="sd-detail-label">Service</span>
              <span className="sd-detail-value">{service.title}</span>
            </div>
            {service.features?.length > 0 && (
              <div className="sd-detail-row">
                <span className="sd-detail-label">Features</span>
                <span className="sd-detail-value">{service.features.length} included</span>
              </div>
            )}
            <div className="sd-detail-row">
              <span className="sd-detail-label">Media</span>
              <span className="sd-detail-value">
                {[service.image ? "Image" : null, service.video ? "Video" : null].filter(Boolean).join(" + ") || "Included"}
              </span>
            </div>
          </div>

          {/* CTA Card */}
          <div className="sd-sidebar-card">
            <p className="sd-sidebar-title">Ready to Start?</p>
            <Link href="/contact" className="sd-cta-btn">
              {service.buttonText || "Get in Touch"} →
            </Link>
            <Link href="/services" className="sd-cta-outline">
              ← All Services
            </Link>
          </div>

          {/* Quick Media Preview in Sidebar */}
          {(service.image || service.video) && (
            <div className="sd-sidebar-card">
              <p className="sd-sidebar-title">Media Preview</p>
              {service.image && (
                <button
                  className="sd-cta-outline"
                  style={{ marginTop: 0, marginBottom: "8px" }}
                  onClick={() => openPreview(service.image, "image")}
                >
                  📷 View Full Image
                </button>
              )}
              {service.video && (
                <button
                  className="sd-cta-outline"
                  style={{ marginTop: 0 }}
                  onClick={() => openPreview(service.video, "video")}
                >
                  🎬 Watch Full Video
                </button>
              )}
            </div>
          )}

          {/* Included Features Badge */}
          {service.features && service.features.length > 0 && (
            <div className="sd-badge">
              <span className="sd-badge-num">
                {service.features.length}
              </span>
              <span className="sd-badge-label">
                {service.features.length === 1 ? "deliverable included" : "deliverables included"}
              </span>
            </div>
          )}
        </aside>
      </div>

      {/* ─── Other Services ─── */}
      {otherServices.length > 0 && (
        <div className="sd-related">
          <h2 className="sd-related-title">Explore More Services</h2>
          <div className="sd-related-grid">
            {otherServices.map((s) => {
              const sSlug = s.title.toLowerCase().replace(/[^\w\s-]/g, "").replace(/[\s_]+/g, "-");
              return (
                <Link key={s._id} href={`/services/${sSlug}`} className="sd-related-card">
                  {s.image ? (
                    <img src={s.image} alt={s.title} className="sd-related-thumb" />
                  ) : s.video ? (
                    <video src={s.video} muted className="sd-related-thumb" style={{ objectFit: "cover" }} />
                  ) : (
                    <div className="sd-related-thumb" style={{ background: "var(--bg-surface)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "32px", opacity: 0.3 }}>💼</div>
                  )}
                  <div className="sd-related-body">
                    <p className="sd-related-name">{s.title}</p>
                    <p className="sd-related-tag">{s.features?.length || 0} features included</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* Lightbox Modal */}
      {lightbox && (
        <Lightbox src={lightbox.src} type={lightbox.type} onClose={() => setLightbox(null)} />
      )}
    </main>
  );
}

const SD_STYLES = `
  .sd-root { min-height: 100vh; background: var(--bg-page); padding-bottom: 80px; }

  /* ── Loading / Error ── */
  .sd-fullscreen { min-height: 100vh; display: flex; align-items: center; justify-content: center; }
  .sd-center { text-align: center; }
  .sd-spinner { width: 44px; height: 44px; border: 3px solid; border-radius: 50%; animation: sd-spin 0.85s linear infinite; margin: 0 auto 14px; }
  @keyframes sd-spin { to { transform: rotate(360deg); } }
  .sd-loading-text { font-size: 14px; letter-spacing: 0.02em; }
  .sd-error-icon { margin: 0 auto 16px; display: flex; justify-content: center; opacity: 0.8; }

  /* ── Hero Section (Media NOT here) ── */
  .sd-hero {
    padding: 100px 24px 44px;
    position: relative;
    overflow: hidden;
  }
  .sd-hero-inner {
    max-width: 1100px;
    margin: 0 auto;
    position: relative;
    z-index: 1;
  }
  .sd-back-link {
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
  .sd-back-link:hover { color: var(--brand-blue-primary); }

  .sd-hero-meta {
    display: flex;
    align-items: center;
    gap: 10px;
    flex-wrap: wrap;
    margin-bottom: 16px;
  }
  .sd-type-badge {
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
  .sd-status-badge {
    font-size: 11px;
    padding: 4px 12px;
    border-radius: 99px;
    font-weight: 600;
    background: rgba(79, 111, 253, 0.1);
    color: var(--brand-blue-primary);
    font-family: 'DM Sans', sans-serif;
  }

  .sd-hero-title {
    font-family: 'Syne', sans-serif;
    font-size: clamp(32px, 5.5vw, 64px);
    font-weight: 300;
    color: var(--text-primary);
    margin: 0 0 20px;
    line-height: 1.1;
  }
  .sd-divider {
    width: 60px;
    height: 2px;
    background: var(--brand-blue-primary);
    border-radius: 2px;
  }

  /* ── Content Layout (2-columns) ── */
  .sd-layout {
    max-width: 1100px;
    margin: 0 auto;
    padding: 0 24px;
    display: grid;
    grid-template-columns: 1fr;
    gap: 32px;
  }
  @media (min-width: 900px) {
    .sd-layout { grid-template-columns: 1fr 340px; }
  }

  .sd-main-col {
    display: flex;
    flex-direction: column;
    gap: 28px;
  }

  /* ── Media Card in Content Body ── */
  .sd-media-card {
    border-radius: 16px;
    background: var(--bg-elevated);
    border: 1px solid var(--border-subtle);
    overflow: hidden;
  }
  .sd-media-tabs {
    display: flex;
    border-bottom: 1px solid var(--border-subtle);
  }
  .sd-media-tab {
    flex: 1;
    padding: 12px;
    font-size: 13px;
    font-weight: 600;
    color: var(--text-secondary);
    background: transparent;
    border: none;
    cursor: pointer;
    transition: all 0.2s;
  }
  .sd-media-tab.active {
    background: var(--bg-page);
    color: var(--text-primary);
    border-bottom: 2px solid var(--brand-blue-primary);
    margin-bottom: -1px;
  }
  .sd-media-frame {
    position: relative;
    background: #000;
  }
  .sd-media-el {
    width: 100%;
    max-height: 480px;
    object-fit: cover;
    display: block;
  }
  .sd-media-expand {
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
  .sd-media-expand:hover { background: rgba(0, 0, 0, 0.85); }
  .sd-media-thumbs {
    display: flex;
    gap: 10px;
    padding: 12px;
  }
  .sd-thumb-item {
    flex: 1;
    border-radius: 8px;
    overflow: hidden;
    cursor: pointer;
    border: 2px solid transparent;
    transition: border-color 0.2s;
  }
  .sd-thumb-item.active { border-color: var(--brand-blue-primary); }
  .sd-thumb-img {
    width: 100%;
    height: 60px;
    object-fit: cover;
    display: block;
  }
  .sd-thumb-vid {
    width: 100%;
    height: 60px;
    background: var(--bg-surface);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 22px;
    color: var(--brand-blue-primary);
  }
  .sd-thumb-label {
    font-size: 10px;
    font-weight: 600;
    color: var(--text-secondary);
    text-align: center;
    padding: 4px 0;
    display: block;
  }

  /* ── Features Box ── */
  .sd-features-box {
    border-radius: 16px;
    background: var(--bg-elevated);
    border: 1px solid var(--border-subtle);
    padding: clamp(24px, 3.5vw, 36px);
  }
  .sd-features-heading {
    font-family: 'Syne', sans-serif;
    font-size: clamp(20px, 2.5vw, 24px);
    font-weight: 600;
    color: var(--text-primary);
    margin: 0 0 20px;
  }
  .sd-features-list {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
  }
  .sd-feature-item {
    display: flex;
    align-items: flex-start;
    gap: 14px;
    padding: clamp(14px, 2vw, 18px) 0;
  }
  .sd-feature-check {
    flex-shrink: 0;
    margin-top: 2px;
  }
  .sd-feature-text {
    font-family: 'DM Sans', sans-serif;
    font-size: clamp(14px, 1.6vw, 16px);
    line-height: 1.65;
    color: var(--text-secondary);
    white-space: pre-line;
  }

  /* ── Sidebar ── */
  .sd-sidebar {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }
  @media (min-width: 900px) {
    .sd-sidebar { position: sticky; top: 90px; }
  }
  .sd-sidebar-card {
    background: var(--bg-elevated);
    border: 1px solid var(--border-subtle);
    border-radius: 16px;
    padding: 20px;
  }
  .sd-sidebar-title {
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--text-tertiary);
    margin: 0 0 14px;
  }
  .sd-detail-row {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    padding: 8px 0;
    border-bottom: 1px solid var(--border-subtle);
    font-size: 13px;
  }
  .sd-detail-row:last-child { border: none; }
  .sd-detail-label { color: var(--text-secondary); font-weight: 500; }
  .sd-detail-value { color: var(--text-primary); font-weight: 600; text-align: right; max-width: 60%; }

  .sd-cta-btn {
    width: 100%;
    padding: 13px;
    border-radius: 12px;
    background: var(--brand-blue-primary);
    color: #fff;
    font-size: 15px;
    font-weight: 700;
    border: none;
    cursor: pointer;
    text-decoration: none;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    transition: opacity 0.2s, transform 0.15s;
  }
  .sd-cta-btn:hover { opacity: 0.9; transform: translateY(-1px); }

  .sd-cta-outline {
    width: 100%;
    padding: 11px;
    border-radius: 12px;
    background: transparent;
    color: var(--text-primary);
    font-size: 14px;
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
  }
  .sd-cta-outline:hover { background: var(--bg-surface); }

  .sd-badge {
    background: var(--bg-elevated);
    border: 1px solid var(--border-subtle);
    border-radius: 14px;
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 16px 20px;
  }
  .sd-badge-num {
    font-size: clamp(28px, 3.5vw, 36px);
    font-weight: 700;
    line-height: 1;
    letter-spacing: -0.02em;
    color: var(--brand-blue-primary);
  }
  .sd-badge-label {
    font-size: 13px;
    line-height: 1.4;
    color: var(--text-secondary);
  }

  /* ── Related Services ── */
  .sd-related {
    max-width: 1100px;
    margin: 48px auto 0;
    padding: 0 24px;
  }
  .sd-related-title {
    font-family: 'Syne', sans-serif;
    font-size: 22px;
    font-weight: 300;
    color: var(--text-primary);
    margin: 0 0 20px;
  }
  .sd-related-grid {
    display: grid;
    gap: 20px;
    grid-template-columns: 1fr;
  }
  @media (min-width: 640px) {
    .sd-related-grid { grid-template-columns: repeat(3, 1fr); }
  }
  .sd-related-card {
    border-radius: 14px;
    background: var(--bg-elevated);
    border: 1px solid var(--border-subtle);
    overflow: hidden;
    text-decoration: none;
    display: flex;
    flex-direction: column;
    transition: transform 0.25s, box-shadow 0.25s;
  }
  .sd-related-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 32px rgba(0, 0, 0, 0.12);
  }
  .sd-related-thumb {
    width: 100%;
    aspect-ratio: 16/10;
    object-fit: cover;
  }
  .sd-related-body { padding: 14px; }
  .sd-related-name { font-size: 15px; font-weight: 600; color: var(--text-primary); margin: 0 0 4px; }
  .sd-related-tag { font-size: 12px; color: var(--text-tertiary); margin: 0; }

  /* ── Lightbox ── */
  .sdlb-overlay {
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
  .sdlb-box {
    position: relative;
    width: 100%;
    max-width: 960px;
    animation: lb-in 0.2s ease;
  }
  @keyframes lb-in {
    from { opacity: 0; transform: scale(0.95); }
    to { opacity: 1; transform: scale(1); }
  }
  .sdlb-close {
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
  .sdlb-close:hover { background: rgba(255, 0, 0, 0.7); }
  .sdlb-media {
    width: 100%;
    max-height: 85vh;
    object-fit: contain;
    border-radius: 14px;
    display: block;
  }
`;
