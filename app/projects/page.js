"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { getProjects } from "@/lib/data";

/* ── helpers ───────────────────────────────────── */
const ALL = "All";

function MediaThumb({ project, onClick }) {
  if (project.video) {
    return (
      <div className="pp-thumb" onClick={onClick} style={{ cursor: "pointer" }}>
        <video
          src={project.video}
          className="pp-thumb-media"
          muted
          loop
          playsInline
          onMouseEnter={(e) => e.target.play()}
          onMouseLeave={(e) => { e.target.pause(); e.target.currentTime = 0; }}
        />
        <div className="pp-play-icon">▶</div>
      </div>
    );
  }
  if (project.img || project.image) {
    return (
      <div className="pp-thumb" onClick={onClick} style={{ cursor: "pointer" }}>
        <img src={project.img || project.image} alt={project.title} className="pp-thumb-media" />
      </div>
    );
  }
  return (
    <div className="pp-thumb pp-thumb-empty" onClick={onClick} style={{ cursor: "pointer" }}>
      <span className="pp-thumb-icon">🎬</span>
    </div>
  );
}

/* ── Lightbox ───────────────────────────────────── */
function Lightbox({ project, onClose }) {
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const hasBoth = project.img && project.video;
  const [tab, setTab] = useState(project.video ? "video" : "image");

  return (
    <div className="lb-overlay" onClick={onClose}>
      <div className="lb-box" onClick={(e) => e.stopPropagation()}>
        <button className="lb-close" onClick={onClose} title="Close (Esc)">✕</button>

        {hasBoth && (
          <div className="lb-tabs">
            <button className={`lb-tab ${tab === "image" ? "active" : ""}`} onClick={() => setTab("image")}>
              📷 Image
            </button>
            <button className={`lb-tab ${tab === "video" ? "active" : ""}`} onClick={() => setTab("video")}>
              🎬 Video
            </button>
          </div>
        )}

        <div className="lb-media-area">
          {tab === "video" && project.video && (
            <video src={project.video} controls autoPlay className="lb-video" />
          )}
          {tab === "image" && (project.img || project.image) && (
            <img src={project.img || project.image} alt={project.title} className="lb-image" />
          )}
        </div>

        <div className="lb-info">
          <h3 className="lb-title">{project.title}</h3>
          {project.type && <span className="lb-badge">{project.type}</span>}
        </div>
      </div>
    </div>
  );
}

/* ── Main Page ───────────────────────────────────── */
export default function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState(ALL);
  const [search, setSearch] = useState("");
  const [preview, setPreview] = useState(null); // project being previewed in lightbox
  const cardsRef = useRef([]);

  // Gather unique filter types
  const types = [ALL, ...Array.from(new Set(projects.map((p) => p.type).filter(Boolean)))];

  useEffect(() => {
    getProjects()
      .then((res) => { if (res?.data) setProjects(res.data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  // Intersection Observer for scroll-reveal
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add("pp-card-visible"); obs.unobserve(e.target); }
      }),
      { threshold: 0.08 }
    );
    cardsRef.current.forEach((el) => el && obs.observe(el));
    return () => obs.disconnect();
  }, [projects, filter]);

  const filtered = projects.filter((p) => {
    const matchFilter = filter === ALL || p.type === filter;
    const matchSearch = !search || p.title?.toLowerCase().includes(search.toLowerCase()) ||
      p.desc?.toLowerCase().includes(search.toLowerCase()) ||
      (p.tags || []).some((t) => t.toLowerCase().includes(search.toLowerCase()));
    return matchFilter && matchSearch;
  });

  return (
    <main className="pp-root">
      <style>{`
        .pp-root { min-height:100vh; background:var(--bg-page); padding-bottom:80px; }

        /* ── Hero ── */
        .pp-hero { padding:100px 24px 60px; text-align:center; }
        .pp-hero-label { font-size:12px; font-weight:700; letter-spacing:.12em; text-transform:uppercase; color:var(--brand-blue-primary); opacity:.7; margin-bottom:12px; }
        .pp-hero-title { font-family:'Syne',sans-serif; font-size:clamp(36px,6vw,72px); font-weight:300; color:var(--text-primary); margin:0 0 16px; line-height:1.1; }
        .pp-hero-sub { font-size:clamp(15px,2vw,18px); color:var(--text-secondary); max-width:560px; margin:0 auto 36px; line-height:1.6; }
        .pp-divider { width:60px; height:2px; background:var(--brand-blue-primary); margin:0 auto 40px; border-radius:2px; }

        /* ── Controls ── */
        .pp-controls { max-width:1160px; margin:0 auto; padding:0 24px 32px; display:flex; flex-wrap:wrap; gap:12px; align-items:center; justify-content:space-between; }
        .pp-filters { display:flex; gap:8px; flex-wrap:wrap; }
        .pp-filter-btn { font-size:13px; font-weight:600; padding:6px 16px; border-radius:999px; border:1.5px solid var(--border-light); background:transparent; color:var(--text-secondary); cursor:pointer; transition:all .2s; }
        .pp-filter-btn.active, .pp-filter-btn:hover { background:var(--brand-blue-primary); border-color:var(--brand-blue-primary); color:#fff; }
        .pp-search { height:38px; padding:0 14px; border:1.5px solid var(--border-light); border-radius:999px; background:var(--bg-surface); color:var(--text-primary); font-size:13px; min-width:200px; outline:none; transition:border-color .2s; }
        .pp-search:focus { border-color:var(--brand-blue-primary); }
        .pp-count { font-size:13px; color:var(--text-secondary); }

        /* ── Grid ── */
        .pp-grid { max-width:1160px; margin:0 auto; padding:0 24px; display:grid; gap:28px; grid-template-columns:1fr; }
        @media(min-width:640px){ .pp-grid{ grid-template-columns:repeat(2,1fr); } }
        @media(min-width:1024px){ .pp-grid{ grid-template-columns:repeat(3,1fr); } }

        /* ── Card ── */
        .pp-card { border-radius:18px; background:var(--bg-elevated); border:1px solid var(--border-subtle); overflow:hidden; display:flex; flex-direction:column; opacity:0; transform:translateY(28px); transition:opacity .5s ease, transform .5s ease, box-shadow .3s ease; }
        .pp-card-visible { opacity:1; transform:translateY(0); }
        .pp-card:hover { box-shadow:0 20px 50px rgba(0,0,0,.13); }

        /* ── Thumb ── */
        .pp-thumb { position:relative; width:100%; aspect-ratio:16/10; overflow:hidden; background:var(--bg-surface-alt); }
        .pp-thumb-media { width:100%; height:100%; object-fit:cover; transition:transform .5s ease; }
        .pp-card:hover .pp-thumb-media { transform:scale(1.05); }
        .pp-thumb-empty { display:flex; align-items:center; justify-content:center; }
        .pp-thumb-icon { font-size:48px; opacity:.3; }
        .pp-play-icon { position:absolute; inset:0; display:flex; align-items:center; justify-content:center; font-size:28px; color:#fff; opacity:0; transition:opacity .2s; pointer-events:none; }
        .pp-thumb:hover .pp-play-icon { opacity:1; }
        .pp-preview-btn { position:absolute; top:10px; right:10px; background:rgba(0,0,0,.55); backdrop-filter:blur(6px); color:#fff; border:none; border-radius:8px; padding:5px 10px; font-size:11px; font-weight:700; cursor:pointer; opacity:0; transition:opacity .2s; letter-spacing:.04em; z-index:5; }
        .pp-thumb:hover .pp-preview-btn { opacity:1; }

        /* ── Badge ── */
        .pp-type-badge { position:absolute; top:10px; left:10px; background:rgba(255,255,255,.92); backdrop-filter:blur(4px); font-size:9px; font-weight:700; padding:3px 9px; border-radius:12px; color:var(--text-primary); text-transform:uppercase; letter-spacing:.06em; }
        .pp-media-badges { position:absolute; bottom:10px; left:10px; display:flex; gap:6px; }
        .pp-media-badge { padding:3px 8px; border-radius:6px; font-size:9px; font-weight:700; letter-spacing:.04em; color:#fff; }
        .pp-media-badge.img { background:rgba(0,0,0,.45); }
        .pp-media-badge.vid { background:rgba(79,111,253,.8); }

        /* ── Body ── */
        .pp-body { padding:20px; display:flex; flex-direction:column; flex-grow:1; }
        .pp-card-title { font-family:'Syne',sans-serif; font-size:17px; font-weight:600; color:var(--text-primary); margin:0 0 6px; }
        .pp-card-desc { font-size:13px; color:var(--text-secondary); line-height:1.6; margin:0 0 14px; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden; flex-grow:1; }
        .pp-tags { display:flex; flex-wrap:wrap; gap:5px; margin-bottom:14px; }
        .pp-tag { font-size:10px; background:var(--bg-surface); color:var(--text-secondary); padding:3px 8px; border-radius:5px; }
        .pp-actions { display:flex; gap:10px; align-items:center; }
        .pp-detail-link { display:inline-flex; align-items:center; gap:5px; font-size:13px; font-weight:700; color:var(--brand-blue-primary); text-decoration:none; transition:gap .2s; }
        .pp-detail-link:hover { gap:8px; }
        .pp-lightbox-btn { font-size:12px; font-weight:600; color:var(--text-secondary); background:var(--bg-surface); border:none; border-radius:6px; padding:5px 10px; cursor:pointer; transition:background .2s; }
        .pp-lightbox-btn:hover { background:var(--border-light); }

        /* ── Empty ── */
        .pp-empty { text-align:center; padding:80px 24px; color:var(--text-secondary); }
        .pp-empty-icon { font-size:56px; margin-bottom:16px; opacity:.4; }
        .pp-empty h3 { font-size:20px; color:var(--text-primary); margin-bottom:8px; }

        /* ── Loading ── */
        .pp-loading { display:flex; align-items:center; justify-content:center; min-height:50vh; }
        .pp-spinner { width:44px; height:44px; border:3px solid var(--border-subtle); border-top-color:var(--brand-blue-primary); border-radius:50%; animation:spin .8s linear infinite; }
        @keyframes spin { to { transform:rotate(360deg); } }

        /* ── Lightbox ── */
        .lb-overlay { position:fixed; inset:0; background:rgba(0,0,0,.82); backdrop-filter:blur(6px); z-index:9999; display:flex; align-items:center; justify-content:center; padding:20px; animation:lb-in .2s ease; }
        @keyframes lb-in { from { opacity:0; } to { opacity:1; } }
        .lb-box { position:relative; background:var(--bg-elevated); border-radius:20px; width:100%; max-width:900px; max-height:90vh; overflow:auto; border:1px solid var(--border-subtle); box-shadow:0 40px 100px rgba(0,0,0,.4); animation:lb-slide .25s ease; }
        @keyframes lb-slide { from { transform:scale(.94) translateY(20px); } to { transform:scale(1) translateY(0); } }
        .lb-close { position:absolute; top:14px; right:14px; z-index:10; width:34px; height:34px; border-radius:50%; border:none; background:rgba(0,0,0,.35); color:#fff; font-size:16px; cursor:pointer; display:flex; align-items:center; justify-content:center; transition:background .2s; }
        .lb-close:hover { background:rgba(255,0,0,.6); }
        .lb-tabs { display:flex; gap:8px; padding:16px 20px 0; }
        .lb-tab { padding:7px 18px; border-radius:8px; border:1.5px solid var(--border-light); background:transparent; color:var(--text-secondary); font-size:13px; font-weight:600; cursor:pointer; transition:all .2s; }
        .lb-tab.active { background:var(--brand-blue-primary); border-color:var(--brand-blue-primary); color:#fff; }
        .lb-media-area { padding:20px; }
        .lb-video { width:100%; max-height:60vh; border-radius:12px; background:#000; display:block; }
        .lb-image { width:100%; max-height:65vh; border-radius:12px; object-fit:contain; display:block; }
        .lb-info { padding:0 20px 20px; }
        .lb-title { font-family:'Syne',sans-serif; font-size:20px; font-weight:600; color:var(--text-primary); margin:0 0 8px; }
        .lb-badge { font-size:10px; font-weight:700; padding:3px 10px; border-radius:99px; background:var(--bg-surface); color:var(--text-secondary); text-transform:uppercase; letter-spacing:.06em; }

        /* ── Back link ── */
        .pp-back { max-width:1160px; margin:0 auto; padding:80px 24px 0; }
        .pp-back-link { display:inline-flex; align-items:center; gap:6px; font-size:14px; font-weight:600; color:var(--text-secondary); text-decoration:none; transition:color .2s; }
        .pp-back-link:hover { color:var(--text-primary); }
      `}</style>

      {/* Hero */}
      <section className="pp-hero">
        <Link href="/" className="pp-back-link" style={{ justifyContent: 'center', marginBottom: '0' }}>
          ← Back to home
        </Link>
        <div style={{ marginTop: '32px' }} />
        <p className="pp-hero-label">Portfolio</p>
        <h1 className="pp-hero-title">Our Projects</h1>
        <p className="pp-hero-sub">
          A curated showcase of our work — from web apps and branding to full-scale digital experiences.
        </p>
        <div className="pp-divider" />
      </section>

      {/* Controls */}
      <div className="pp-controls">
        <div className="pp-filters">
          {types.map((t) => (
            <button
              key={t}
              className={`pp-filter-btn ${filter === t ? "active" : ""}`}
              onClick={() => setFilter(t)}
            >
              {t}
            </button>
          ))}
        </div>
        <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
          <input
            className="pp-search"
            type="search"
            placeholder="Search projects…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <span className="pp-count">{filtered.length} project{filtered.length !== 1 ? "s" : ""}</span>
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="pp-loading">
          <div className="pp-spinner" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="pp-empty">
          <div className="pp-empty-icon">🔍</div>
          <h3>No projects found</h3>
          <p>Try adjusting your filter or search term.</p>
        </div>
      ) : (
        <div className="pp-grid">
          {filtered.map((p, i) => (
            <div
              key={p._id}
              className="pp-card"
              ref={(el) => (cardsRef.current[i] = el)}
              style={{ transitionDelay: `${(i % 6) * 60}ms` }}
            >
              {/* Thumbnail with preview button overlay */}
              <div className="pp-thumb">
                <MediaThumb project={p} onClick={() => (p.img || p.image || p.video) && setPreview(p)} />
                {(p.img || p.image || p.video) && (
                  <button className="pp-preview-btn" onClick={() => setPreview(p)}>
                    👁 Preview
                  </button>
                )}
                {p.type && <span className="pp-type-badge">{p.type}</span>}
                <div className="pp-media-badges">
                  {(p.img || p.image) && <span className="pp-media-badge img">IMG</span>}
                  {p.video && <span className="pp-media-badge vid">VIDEO</span>}
                </div>
              </div>

              <div className="pp-body">
                <h2 className="pp-card-title">{p.title}</h2>
                <p className="pp-card-desc">{p.desc}</p>

                {p.tags?.length > 0 && (
                  <div className="pp-tags">
                    {p.tags.map((t) => (
                      <span key={t} className="pp-tag">{t}</span>
                    ))}
                  </div>
                )}

                <div className="pp-actions">
                  <Link href={`/projects/${p._id}`} className="pp-detail-link">
                    View Details →
                  </Link>
                  {(p.img || p.image || p.video) && (
                    <button className="pp-lightbox-btn" onClick={() => setPreview(p)}>
                      🔍 Quick View
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Lightbox */}
      {preview && <Lightbox project={preview} onClose={() => setPreview(null)} />}
    </main>
  );
}
