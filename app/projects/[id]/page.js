"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { getProject, getProjects } from "@/lib/data";

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
    <div className="pdlb-overlay" onClick={onClose}>
      <div className="pdlb-box" onClick={(e) => e.stopPropagation()}>
        <button className="pdlb-close" onClick={onClose}>✕</button>
        {type === "video" ? (
          <video src={src} controls autoPlay className="pdlb-media" />
        ) : (
          <img src={src} alt="Preview" className="pdlb-media" />
        )}
      </div>
    </div>
  );
}

/* ── MediaSection — placed in content body, NOT hero ── */
function MediaSection({ project, onPreview }) {
  const hasImage = !!(project.img || project.image);
  const hasVideo = !!project.video;
  const hasBoth = hasImage && hasVideo;
  const [activeTab, setActiveTab] = useState(hasVideo ? "video" : "image");

  if (!hasImage && !hasVideo) return null;

  return (
    <div className="pd-media-section">
      {hasBoth && (
        <div className="pd-media-tabs">
          <button
            className={`pd-media-tab ${activeTab === "image" ? "active" : ""}`}
            onClick={() => setActiveTab("image")}
          >
            📷 Image
          </button>
          <button
            className={`pd-media-tab ${activeTab === "video" ? "active" : ""}`}
            onClick={() => setActiveTab("video")}
          >
            🎬 Video
          </button>
        </div>
      )}

      <div className="pd-media-frame">
        {activeTab === "video" && hasVideo && (
          <video
            src={project.video}
            controls
            className="pd-media-el"
            poster={project.img || project.image || undefined}
          />
        )}
        {activeTab === "image" && hasImage && (
          <img
            src={project.img || project.image}
            alt={project.title}
            className="pd-media-el"
          />
        )}
        <button
          className="pd-media-expand"
          onClick={() => onPreview(
            activeTab === "video" ? project.video : (project.img || project.image),
            activeTab
          )}
          title="Expand to fullscreen"
        >
          ⛶ Expand
        </button>
      </div>

      {/* Thumbnails row when both exist */}
      {hasBoth && (
        <div className="pd-media-thumbs">
          <div
            className={`pd-thumb-item ${activeTab === "image" ? "active" : ""}`}
            onClick={() => setActiveTab("image")}
          >
            <img src={project.img || project.image} alt="Image preview" className="pd-thumb-img" />
            <span className="pd-thumb-label">Image</span>
          </div>
          <div
            className={`pd-thumb-item ${activeTab === "video" ? "active" : ""}`}
            onClick={() => setActiveTab("video")}
          >
            <div className="pd-thumb-vid-placeholder">▶</div>
            <span className="pd-thumb-label">Video</span>
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Main Page ──────────────────────────────────────── */
export default function ProjectDetailPage() {
  const params = useParams();
  const id = params.id;

  const [project, setProject] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [visible, setVisible] = useState(false);
  const [lightbox, setLightbox] = useState(null); // { src, type }

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setVisible(false);
    getProject(id)
      .then((res) => {
        if (res?.success && res.data) {
          setProject(res.data);
          // fetch related same type
          return getProjects().then((all) => {
            if (all?.data) {
              setRelated(
                all.data.filter((p) => p._id !== res.data._id && p.type === res.data.type).slice(0, 3)
              );
            }
          });
        } else {
          setError("Project not found");
        }
      })
      .catch((err) => setError(err.message))
      .finally(() => {
        setLoading(false);
        setTimeout(() => setVisible(true), 80);
      });
  }, [id]);

  const openPreview = (src, type) => setLightbox({ src, type });

  if (loading) {
    return (
      <main style={{ minHeight: "100vh", background: "var(--bg-page)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div className="pd-spinner" />
      </main>
    );
  }

  if (error || !project) {
    return (
      <main style={{ minHeight: "100vh", background: "var(--bg-page)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "16px" }}>
        <div style={{ fontSize: "56px", opacity: .3 }}>🔍</div>
        <h1 style={{ color: "var(--text-primary)", fontFamily: "'Syne',sans-serif" }}>Project not found</h1>
        <Link href="/projects" style={{ color: "var(--brand-blue-primary)", fontWeight: 600 }}>← Back to Projects</Link>
      </main>
    );
  }

  const accentColor = project.accent || "var(--brand-blue-primary)";

  return (
    <main className="pd-root" style={{ opacity: visible ? 1 : 0, transition: "opacity .5s ease" }}>
      <style>{`
        .pd-root { min-height:100vh; background:var(--bg-page); padding-bottom:80px; }

        /* ── Hero ── */
        .pd-hero { padding:80px 24px 52px; position:relative; overflow:hidden; }
        .pd-hero::before { content:''; position:absolute; inset:0; background:linear-gradient(135deg,var(--bg-elevated) 0%,transparent 60%); pointer-events:none; opacity:.5; }
        .pd-hero-accent { position:absolute; top:-60px; right:-80px; width:320px; height:320px; border-radius:50%; opacity:.06; pointer-events:none; }
        .pd-hero-inner { max-width:900px; margin:0 auto; position:relative; z-index:1; }
        .pd-back-link { display:inline-flex; align-items:center; gap:6px; font-size:14px; font-weight:600; color:var(--text-secondary); text-decoration:none; margin-bottom:28px; transition:color .2s; }
        .pd-back-link:hover { color:var(--text-primary); }
        .pd-hero-meta { display:flex; align-items:center; gap:10px; flex-wrap:wrap; margin-bottom:18px; }
        .pd-type-badge { font-size:11px; font-weight:700; padding:4px 12px; border-radius:99px; text-transform:uppercase; letter-spacing:.07em; color:#fff; }
        .pd-status-badge { font-size:11px; padding:4px 12px; border-radius:99px; font-weight:600; }
        .pd-status-badge.pub { background:rgba(16,185,129,.12); color:#10b981; }
        .pd-status-badge.draft { background:var(--bg-surface); color:var(--text-secondary); }
        .pd-hero-title { font-family:'Syne',sans-serif; font-size:clamp(28px,5vw,56px); font-weight:300; color:var(--text-primary); margin:0 0 16px; line-height:1.1; }
        .pd-hero-desc { font-size:clamp(15px,2vw,17px); color:var(--text-secondary); line-height:1.7; margin:0 0 24px; max-width:640px; }
        .pd-tags { display:flex; flex-wrap:wrap; gap:6px; }
        .pd-tag { font-size:11px; background:var(--bg-surface); color:var(--text-secondary); padding:4px 10px; border-radius:6px; border:1px solid var(--border-subtle); }

        /* ── Content layout ── */
        .pd-layout { max-width:1100px; margin:0 auto; padding:0 24px; display:grid; grid-template-columns:1fr; gap:32px; }
        @media(min-width:900px){ .pd-layout { grid-template-columns:1fr 340px; } }

        /* ── Media section ── */
        .pd-media-section { border-radius:16px; background:var(--bg-elevated); border:1px solid var(--border-subtle); overflow:hidden; }
        .pd-media-tabs { display:flex; gap:0; border-bottom:1px solid var(--border-subtle); }
        .pd-media-tab { flex:1; padding:12px; font-size:13px; font-weight:600; color:var(--text-secondary); background:transparent; border:none; cursor:pointer; transition:all .2s; }
        .pd-media-tab.active { background:var(--bg-page); color:var(--text-primary); border-bottom:2px solid var(--brand-blue-primary); margin-bottom:-1px; }
        .pd-media-frame { position:relative; background:#000; }
        .pd-media-el { width:100%; max-height:480px; object-fit:contain; display:block; }
        .pd-media-expand { position:absolute; bottom:12px; right:12px; background:rgba(0,0,0,.5); backdrop-filter:blur(6px); color:#fff; border:none; border-radius:8px; padding:6px 12px; font-size:12px; font-weight:600; cursor:pointer; transition:background .2s; }
        .pd-media-expand:hover { background:rgba(0,0,0,.75); }
        .pd-media-thumbs { display:flex; gap:10px; padding:12px; }
        .pd-thumb-item { flex:1; border-radius:8px; overflow:hidden; cursor:pointer; border:2px solid transparent; transition:border-color .2s; }
        .pd-thumb-item.active { border-color:var(--brand-blue-primary); }
        .pd-thumb-img { width:100%; height:60px; object-fit:cover; display:block; }
        .pd-thumb-vid-placeholder { width:100%; height:60px; background:var(--bg-surface); display:flex; align-items:center; justify-content:center; font-size:22px; color:var(--brand-blue-primary); }
        .pd-thumb-label { font-size:10px; font-weight:600; color:var(--text-secondary); text-align:center; padding:4px 0; display:block; }

        /* ── Sidebar ── */
        .pd-sidebar { display:flex; flex-direction:column; gap:20px; }
        .pd-sidebar-card { background:var(--bg-elevated); border:1px solid var(--border-subtle); border-radius:16px; padding:20px; }
        .pd-sidebar-title { font-size:12px; font-weight:700; letter-spacing:.08em; text-transform:uppercase; color:var(--text-tertiary); margin:0 0 14px; }
        .pd-detail-row { display:flex; justify-content:space-between; align-items:flex-start; padding:8px 0; border-bottom:1px solid var(--border-subtle); font-size:13px; }
        .pd-detail-row:last-child { border:none; }
        .pd-detail-label { color:var(--text-secondary); font-weight:500; }
        .pd-detail-value { color:var(--text-primary); font-weight:600; text-align:right; max-width:60%; }
        .pd-cta-btn { width:100%; padding:13px; border-radius:12px; background:var(--brand-blue-primary); color:#fff; font-size:15px; font-weight:700; border:none; cursor:pointer; text-decoration:none; display:flex; align-items:center; justify-content:center; gap:8px; transition:opacity .2s,transform .15s; }
        .pd-cta-btn:hover { opacity:.9; transform:translateY(-1px); }
        .pd-cta-outline { width:100%; padding:11px; border-radius:12px; background:transparent; color:var(--text-primary); font-size:14px; font-weight:600; border:1.5px solid var(--border-light); cursor:pointer; text-decoration:none; display:flex; align-items:center; justify-content:center; gap:6px; transition:background .2s; margin-top:8px; }
        .pd-cta-outline:hover { background:var(--bg-surface); }
        .pd-accent-dot { width:10px; height:10px; border-radius:50%; display:inline-block; }

        /* ── Related ── */
        .pd-related { max-width:1100px; margin:40px auto 0; padding:0 24px; }
        .pd-related-title { font-family:'Syne',sans-serif; font-size:22px; font-weight:300; color:var(--text-primary); margin:0 0 20px; }
        .pd-related-grid { display:grid; gap:20px; grid-template-columns:1fr; }
        @media(min-width:640px){ .pd-related-grid { grid-template-columns:repeat(3,1fr); } }
        .pd-related-card { border-radius:14px; background:var(--bg-elevated); border:1px solid var(--border-subtle); overflow:hidden; text-decoration:none; display:flex; flex-direction:column; transition:transform .25s,box-shadow .25s; }
        .pd-related-card:hover { transform:translateY(-4px); box-shadow:0 12px 32px rgba(0,0,0,.12); }
        .pd-related-thumb { width:100%; aspect-ratio:16/10; object-fit:cover; }
        .pd-related-body { padding:14px; }
        .pd-related-tag { font-size:10px; color:var(--text-tertiary); font-weight:600; text-transform:uppercase; letter-spacing:.06em; margin-bottom:4px; }
        .pd-related-name { font-size:14px; font-weight:600; color:var(--text-primary); }

        /* ── Loading / Lightbox ── */
        .pd-spinner { width:44px; height:44px; border:3px solid var(--border-subtle); border-top-color:var(--brand-blue-primary); border-radius:50%; animation:pd-spin .8s linear infinite; }
        @keyframes pd-spin { to { transform:rotate(360deg); } }
        .pdlb-overlay { position:fixed; inset:0; background:rgba(0,0,0,.85); backdrop-filter:blur(8px); z-index:9999; display:flex; align-items:center; justify-content:center; padding:20px; }
        .pdlb-box { position:relative; width:100%; max-width:960px; animation:lb-in .2s ease; }
        @keyframes lb-in { from { opacity:0; transform:scale(.95); } to { opacity:1; transform:scale(1); } }
        .pdlb-close { position:absolute; top:-14px; right:-14px; width:36px; height:36px; border-radius:50%; border:none; background:rgba(255,255,255,.15); backdrop-filter:blur(6px); color:#fff; font-size:16px; cursor:pointer; display:flex; align-items:center; justify-content:center; z-index:10; transition:background .2s; }
        .pdlb-close:hover { background:rgba(255,0,0,.6); }
        .pdlb-media { width:100%; max-height:85vh; object-fit:contain; border-radius:14px; display:block; }
      `}</style>

      {/* Hero — NO media here */}
      <section className="pd-hero">
        <div className="pd-hero-inner">
          <Link href="/projects" className="pd-back-link">← Back to Projects</Link>

          <div className="pd-hero-meta">
            {project.type && (
              <span
                className="pd-type-badge"
                style={{ background: accentColor }}
              >
                {project.type}
              </span>
            )}
            <span className={`pd-status-badge ${project.published ? "pub" : "draft"}`}>
              {project.published ? "Published" : "Draft"}
            </span>
          </div>

          <h1 className="pd-hero-title">{project.title}</h1>

          {project.desc && (
            <p className="pd-hero-desc">{project.desc}</p>
          )}

          {project.tags?.length > 0 && (
            <div className="pd-tags">
              {project.tags.map((t) => (
                <span key={t} className="pd-tag">{t}</span>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Main two-col layout */}
      <div className="pd-layout">
        {/* Left — media + description */}
        <div>
          {/* ✅ Media is here — in content area, NOT the hero */}
          <MediaSection project={project} onPreview={openPreview} />
        </div>

        {/* Sidebar */}
        <aside className="pd-sidebar">
          {/* Project details card */}
          <div className="pd-sidebar-card">
            <p className="pd-sidebar-title">Project Details</p>
            {project.type && (
              <div className="pd-detail-row">
                <span className="pd-detail-label">Type</span>
                <span className="pd-detail-value">{project.type}</span>
              </div>
            )}
            {project.tags?.length > 0 && (
              <div className="pd-detail-row">
                <span className="pd-detail-label">Tech Stack</span>
                <span className="pd-detail-value">{project.tags.join(", ")}</span>
              </div>
            )}
            {project.accent && (
              <div className="pd-detail-row">
                <span className="pd-detail-label">Brand Color</span>
                <span className="pd-detail-value" style={{ display: "flex", alignItems: "center", gap: "6px", justifyContent: "flex-end" }}>
                  <span className="pd-accent-dot" style={{ background: project.accent }} />
                  {project.accent}
                </span>
              </div>
            )}
            <div className="pd-detail-row">
              <span className="pd-detail-label">Media</span>
              <span className="pd-detail-value">
                {[project.img || project.image ? "Image" : null, project.video ? "Video" : null].filter(Boolean).join(" + ") || "—"}
              </span>
            </div>
          </div>

          {/* CTA */}
          <div className="pd-sidebar-card">
            <p className="pd-sidebar-title">Interested?</p>
            <Link href="/contact" className="pd-cta-btn">
              Start a Project →
            </Link>
            <Link href="/projects" className="pd-cta-outline">
              ← All Projects
            </Link>
          </div>

          {/* Quick media preview buttons */}
          {(project.img || project.image || project.video) && (
            <div className="pd-sidebar-card">
              <p className="pd-sidebar-title">Quick Preview</p>
              {(project.img || project.image) && (
                <button
                  className="pd-cta-outline"
                  style={{ marginTop: 0, marginBottom: "8px" }}
                  onClick={() => openPreview(project.img || project.image, "image")}
                >
                  📷 View Full Image
                </button>
              )}
              {project.video && (
                <button
                  className="pd-cta-outline"
                  style={{ marginTop: 0 }}
                  onClick={() => openPreview(project.video, "video")}
                >
                  🎬 Watch Video
                </button>
              )}
            </div>
          )}
        </aside>
      </div>

      {/* Related Projects */}
      {related.length > 0 && (
        <div className="pd-related">
          <h2 className="pd-related-title">More {project.type} Projects</h2>
          <div className="pd-related-grid">
            {related.map((r) => (
              <Link key={r._id} href={`/projects/${r._id}`} className="pd-related-card">
                {(r.img || r.image) ? (
                  <img src={r.img || r.image} alt={r.title} className="pd-related-thumb" />
                ) : r.video ? (
                  <video src={r.video} muted className="pd-related-thumb" style={{ objectFit: "cover" }} />
                ) : (
                  <div className="pd-related-thumb" style={{ background: "var(--bg-surface)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "32px", opacity: .3 }}>🎬</div>
                )}
                <div className="pd-related-body">
                  <p className="pd-related-tag">{r.type}</p>
                  <p className="pd-related-name">{r.title}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Lightbox */}
      {lightbox && (
        <Lightbox src={lightbox.src} type={lightbox.type} onClose={() => setLightbox(null)} />
      )}
    </main>
  );
}
