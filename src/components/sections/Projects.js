"use client";

import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { getProjects } from "@/lib/data";

export default function Projects() {
  const trackRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    getProjects()
      .then((res) => { if (res?.data) setProjects(res.data) })
      .catch(() => {})
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const autoPlay = setInterval(() => {
      const maxScroll = track.scrollWidth - track.clientWidth;
      if (track.scrollLeft >= maxScroll - 10) {
        track.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        const firstCard = track.querySelector(".proj-card");
        if (firstCard) {
          const cardWidth = firstCard.getBoundingClientRect().width;
          const gap = 16;
          track.scrollBy({ left: cardWidth + gap, behavior: "smooth" });
        }
      }
    }, 4000);

    return () => clearInterval(autoPlay);
  }, [projects]);

  const checkScrollBounds = () => {
    const track = trackRef.current;
    if (!track) return;
    setCanScrollLeft(track.scrollLeft > 10);
    setCanScrollRight(track.scrollLeft < track.scrollWidth - track.clientWidth - 10);
  };

  const scrollSide = (direction) => {
    const track = trackRef.current;
    if (!track) return;
    const firstCard = track.querySelector(".proj-card");
    if (!firstCard) return;
    const cardWidth = firstCard.getBoundingClientRect().width;
    track.scrollBy({ left: direction === "left" ? -(cardWidth + 16) : cardWidth + 16, behavior: "smooth" });
  };

  return (
    <section className="proj-section">
      <style>{`
        .proj-section { width:100%; max-width:1200px; margin:0 auto; padding:40px 16px; position:relative; box-sizing:border-box; background:var(--bg-page); }
        .proj-header { padding:0 8px; margin-bottom:24px; }
        .proj-title { font-family:sans-serif; font-size:clamp(24px,4vw,32px); font-weight:700; color:var(--text-primary); margin:0; }
        .proj-slider-container { position:relative; width:100%; display:flex; align-items:center; }
        .proj-slider-mask { width:100%; overflow:hidden; }
        .proj-track { display:flex; gap:16px; overflow-x:auto; scroll-snap-type:x mandatory; -webkit-overflow-scrolling:touch; scrollbar-width:none; -ms-overflow-style:none; width:100%; padding:12px 0; margin-bottom:-30px; padding-bottom:42px; }
        .proj-track::-webkit-scrollbar { display:none !important; width:0 !important; height:0 !important; }
        .proj-track-pad { flex:0 0 8%; scroll-snap-align:none; }
        .proj-card { flex:0 0 76%; scroll-snap-align:center; border-radius:16px; background:var(--bg-elevated); border:1px solid var(--border-subtle); box-shadow:var(--shadow-sm); overflow:hidden; display:flex; flex-direction:column; box-sizing:border-box; transition: transform 0.3s ease, box-shadow 0.3s ease; }
        .proj-card:hover { transform: translateY(-6px); box-shadow: 0 20px 40px rgba(0,0,0,0.12); }
        @media (min-width:768px) { .proj-card { flex:0 0 calc((100% - 32px)/3); scroll-snap-align:start; } .proj-track-pad { display:none; } }
        .proj-img-wrapper { position:relative; width:100%; aspect-ratio:16/10; overflow:hidden; background:var(--bg-surface-alt); }
        .proj-card-img { width:100%; height:100%; object-fit:cover; transition: transform 0.6s ease; }
        .proj-card:hover .proj-card-img { transform: scale(1.06); }
        .proj-card-video { width:100%; height:100%; object-fit:cover; }
        .proj-card-body { padding:16px; display:flex; flex-direction:column; justify-content:space-between; flex-grow:1; }
        .proj-card-title { font-family:sans-serif; font-size:16px; font-weight:600; color:var(--text-primary); margin:0 0 4px 0; }
        .proj-card-desc { font-family:sans-serif; font-size:12px; color:var(--text-secondary); line-height:1.4; margin:0 0 12px 0; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden; }
        .proj-badge { position:absolute; top:10px; left:10px; background:rgba(255,255,255,0.95); backdrop-filter:blur(4px); font-size:9px; font-weight:700; padding:3px 8px; border-radius:12px; color:var(--text-primary); text-transform:uppercase; }
        .proj-tag { font-size:10px; background:var(--bg-surface); color:var(--text-secondary); padding:2px 6px; border-radius:4px; }
        .proj-btn { display:inline-flex; align-items:center; gap:4px; color:var(--brand-blue-primary); font-family:sans-serif; font-size:13px; font-weight:600; text-decoration:none; width:fit-content; margin-top:4px; }
        .proj-side-arrow { position:absolute; top:50%; transform:translateY(-50%); width:44px; height:44px; border-radius:50%; background:var(--bg-elevated); border:1px solid var(--border-light); box-shadow:var(--shadow-sm); display:flex; align-items:center; justify-content:center; cursor:pointer; z-index:20; color:var(--text-primary); transition:all 0.2s ease; font-weight:bold; }
        .proj-side-arrow:hover:not(:disabled) { background:var(--brand-blue-primary); color:var(--text-inverse); border-color:var(--brand-blue-primary); }
        .proj-side-arrow:disabled { opacity:0; pointer-events:none; }
        .arrow-left { left:-4px; }
        .arrow-right { right:-4px; }
        @media (min-width:768px) { .arrow-left { left:-16px; } .arrow-right { right:-16px; } }
        .proj-view-all { font-family:sans-serif; font-size:13px; font-weight:600; color:var(--brand-blue-primary); text-decoration:none; opacity:0.8; transition:opacity 0.2s; }
        .proj-view-all:hover { opacity:1; }
      `}</style>

      <div className="proj-header text-center">
        <h2
          className="md:pt-12"
          style={{
            color: "var(--text-primary)",
            fontFamily: "'Syne', sans-serif",
            fontWeight: 300,
          }}
        >
          Our Projects
        </h2>
        <div className="w-16 sm:w-20 h-0.5 bg-brand-blue mx-auto mt-4"></div>
        <div style={{ marginTop: '12px' }}>
          <Link href="/projects" className="proj-view-all">View all projects →</Link>
        </div>
      </div>

      <div className="proj-slider-container">
        <button
          className="proj-side-arrow arrow-left"
          onClick={() => scrollSide("left")}
          disabled={!canScrollLeft}
          aria-label="Scroll left"
        >
          &#10229;
        </button>

        <div className="proj-slider-mask">
          <div className="proj-track" ref={trackRef} onScroll={checkScrollBounds}>
            <div className="proj-track-pad" />

            {projects.map((p) => (
              <div key={p._id || p.id} className="proj-card">
                <div className="proj-img-wrapper">
                  {p.video ? (
                    <video
                      src={p.video}
                      className="proj-card-video"
                      muted
                      loop
                      playsInline
                      onMouseEnter={(e) => e.target.play()}
                      onMouseLeave={(e) => { e.target.pause(); e.target.currentTime = 0; }}
                    />
                  ) : p.img || p.image ? (
                    <img src={p.img || p.image} alt={p.title} className="proj-card-img" />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-4xl" style={{ color: 'var(--text-tertiary)' }}>
                      🎬
                    </div>
                  )}
                  <span className="proj-badge">{p.type}</span>
                </div>

                <div className="proj-card-body">
                  <div>
                    <h3 className="proj-card-title">{p.title}</h3>
                    <p className="proj-card-desc">{p.desc || p.description}</p>
                  </div>

                  <div>
                    <div style={{ display: "flex", gap: "4px", flexWrap: "wrap", marginBottom: "12px" }}>
                      {(p.tags || []).map((t) => (
                        <span key={t} className="proj-tag">{t}</span>
                      ))}
                    </div>
                    <Link href={`/projects/${p._id}`} className="proj-btn">
                      View Project <span>&rarr;</span>
                    </Link>
                  </div>
                </div>
              </div>
            ))}

            <div className="proj-track-pad" />
          </div>
        </div>

        <button
          className="proj-side-arrow arrow-right"
          onClick={() => scrollSide("right")}
          disabled={!canScrollRight}
          aria-label="Scroll right"
        >
          &#10230;
        </button>
      </div>
    </section>
  );
}