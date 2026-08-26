"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { getClients } from "@/lib/data";

const BUBBLE_GAP = 10;

function computeLayout(clientCount, vw, vh) {
  if (clientCount === 0) return { radius: 0, maxBubble: 0, minBubble: 0, stepAngle: 0, arcHeight: 0, sectionMinHeight: 200, isMobile: vw < 768 };
  const isMobile = vw < 768;
  const maxBubble = isMobile ? 82 : 108;
  const minBubble = Math.round(maxBubble * 0.88);
  const arcWidth = vw * 0.8;
  const radiusFromWidth = arcWidth / 2;
  const radiusFromSpacing =
    (clientCount * (maxBubble + BUBBLE_GAP)) / (2 * Math.PI);
  const radius = Math.max(radiusFromWidth, radiusFromSpacing);
  const stepAngle = ((maxBubble + BUBBLE_GAP) / radius) * (180 / Math.PI);
  const arcHeight = radius + maxBubble + 24;
  const textBlockSpace = isMobile ? Math.min(vh * 0.24, 260) : 0;
  const sectionMinHeight = Math.max(
    arcHeight + textBlockSpace,
    vh * (isMobile ? 0.75 : 0.8),
  );

  return {
    radius,
    maxBubble,
    minBubble,
    stepAngle,
    arcHeight,
    sectionMinHeight,
    isMobile,
  };
}

export default function OurClients() {
  const sectionRef = useRef(null);
  const [clients, setClients] = useState([]);
  const [layout, setLayout] = useState(() =>
    computeLayout(0, typeof window !== "undefined" ? window.innerWidth : 1200, 800),
  );
  const [scrollRotation, setScrollRotation] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadClients = async () => {
      try {
        const res = await getClients();
        if (res?.data) setClients(res.data);
      } catch {
        // no hardcoded fallback
      } finally {
        setLoading(false);
      }
    };
    loadClients();
  }, []);

  useEffect(() => {
    const updateLayout = () => {
      setLayout(
        computeLayout(clients.length, window.innerWidth, window.innerHeight),
      );
    };

    updateLayout();
    window.addEventListener("resize", updateLayout);
    return () => window.removeEventListener("resize", updateLayout);
  }, [clients]);

  // Handle tight rolling wheel rotation on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      const totalArea = rect.height + windowHeight;
      const currentProgress = (rect.top + rect.height) / totalArea; 
      const boundedProgress = Math.max(0, Math.min(1, currentProgress));

      const maxRotation = 8; 
      const rotationAngle = (boundedProgress - 0.5) * 2 * maxRotation;
      setScrollRotation(rotationAngle);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const { radius, maxBubble, minBubble, stepAngle, arcHeight, sectionMinHeight, isMobile } = layout;

  const ctaAvatar = clients[0]?.logo || "";
  const textTop = radius > 0 ? radius * 0.42 + maxBubble * 0.08 : 0;
  const borderWidth = isMobile ? 4 : 5;

  if (loading) {
    return (
      <section
        ref={sectionRef}
        className="overflow-hidden flex flex-col items-center justify-center"
        style={{ background: "var(--bg-page)", minHeight: 300 }}
      >
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </section>
    );
  }

  if (clients.length === 0) {
    return (
      <section
        ref={sectionRef}
        className="py-24 overflow-hidden"
        style={{ backgroundColor: "var(--bg-page)" }}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-10 text-center">
          <p style={{ color: 'var(--text-secondary)', fontFamily: 'DM Sans, sans-serif' }}>
            No clients added yet. Add them from the admin panel.
          </p>
        </div>
      </section>
    );
  }

  const headlineBlock = (
    <>
      <h2
        style={{
          fontFamily: "Syne, sans-serif",
          fontWeight: 700,
          fontSize: isMobile
            ? "clamp(1.75rem, 7.5vw, 2.35rem)"
            : "clamp(2rem, 3.6vw, 3rem)",
          lineHeight: 1.12,
          letterSpacing: "-0.03em",
          color: "var(--text-primary)",
          width: isMobile ? "18ch" : "20ch",
          margin: "0 auto",
          marginTop: isMobile ? "20px" : "0px",
        }}
      >
        {clients.length}+ clients getting{" "}
        <em
          style={{
            fontFamily: "Georgia, 'Times New Roman', serif",
            fontStyle: "italic",
            fontWeight: 700,
          }}
        >
          better
        </em>{" "}
        design, faster.
      </h2>

      <Link
        href="/contact"
        className="inline-flex items-center gap-3 sm:gap-4 hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5"
        style={{
          borderRadius: "999px",
          padding: isMobile ? "10px 18px 10px 10px" : "12px 24px 12px 12px",
          boxShadow: "var(--shadow-md)",
          marginTop: isMobile ? "32px" : "30px",
          backgroundColor: 'var(--bg-elevated)',
        }}
      >
        {ctaAvatar ? (
          <img
            src="https://res.cloudinary.com/dlimo8re6/image/upload/v1780739211/lpr-agency/ezwm4tt4jbftds5ccub9.png"
            alt="Book a call"
            style={{
              width: isMobile ? 40 : 48,
              height: isMobile ? 40 : 48,
              borderRadius: "50%",
              objectFit: "cover",
              flexShrink: 0,
            }}
          />
        ) : (
          <div
            style={{
              width: isMobile ? 40 : 48,
              height: isMobile ? 40 : 48,
              borderRadius: "50%",
              background: "#4f6ffd",
              flexShrink: 0,
            }}
          />
        )}
        <div style={{ textAlign: "left", minWidth: 0 }}>
          <p
            style={{
              fontFamily: "DM Sans, sans-serif",
              fontWeight: 600,
              fontSize: isMobile ? "0.875rem" : "0.95rem",
              color: "var(--text-primary)",
              lineHeight: 1.3,
              whiteSpace: "nowrap",
            }}
          >
            Book a 15-min intro call
          </p>
          <p
            className="flex items-center gap-1.5"
            style={{
              fontFamily: "DM Sans, sans-serif",
              fontSize: isMobile ? "0.75rem" : "0.8rem",
              color: "var(--text-secondary)",
              marginTop: 2,
            }}
          >
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: "var(--accent-success)",
                flexShrink: 0,
              }}
            />
            Available now
          </p>
        </div>
      </Link>
    </>
  );

  return (
    <section
      ref={sectionRef}
      className="overflow-hidden select-none flex flex-col items-center justify-center"
      style={{
        background: "var(--bg-page)",
        minHeight: sectionMinHeight,
        padding: isMobile ? "32px 0 40px" : "40px 0",
        width: "100%",
      }}
    >
      <div className="relative border-none" style={{ width: "95vw" }}>
        <div className="relative w-full">
          <div
            className="clients-arc-layer relative mx-auto"
            style={{
              width: "100%",
              height: arcHeight,
              overflow: "hidden",
              maskImage: "linear-gradient(to bottom, black 0%, black 70%, transparent 100%)",
              WebkitMaskImage: "linear-gradient(to bottom, black 0%, black 70%, transparent 100%)",
            }}
          >
            <div
              style={{
                position: "absolute",
                left: "50%",
                bottom: 0,
                transform: `translate(-50%, 50%) rotate(${scrollRotation}deg)`,
                transformOrigin: "center center",
                transition: "transform 0.2s ease-out",
                width: 0,
                height: 0,
                zIndex: 10,
              }}
            >
              <div
                className="clients-circle"
                style={{
                  position: "absolute",
                  width: 0,
                  height: 0,
                  transformOrigin: "center center",
                }}
              >
                 {clients.map((c, i) => {
                  const angle = i * stepAngle;
                  const rad = (angle * Math.PI) / 180;
                  const x = radius * Math.cos(rad);
                  const y = -radius * Math.sin(rad);
                  
                  const t = Math.sin((angle * Math.PI) / 180);
                  const size = minBubble + (maxBubble - minBubble) * Math.max(0, Math.min(1, t));
                  
                  return (
                    <div
                      key={`${c.id}-${i}`}
                      data-angle={angle}
                      className="client-position"
                      style={{
                        position: "absolute",
                        left: x - maxBubble / 2,
                        top: y - maxBubble / 2,
                        width: maxBubble,
                        height: maxBubble,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        transform: `rotate(${-scrollRotation}deg)`,
                        transition: "transform 0.2s ease-out",
                      }}
                    >
                      <div
                        className="client-bubble"
                        style={{
                          width: size,
                          height: size,
                          transformOrigin: "50% 50%",
                        }}
                      >
                         {c.logo ? (
                          <img
                            src={c.logo}
                            alt={c.name}
                            draggable={false}
                            style={{
                              width: size,
                              height: size,
                              borderRadius: "50%",
                              objectFit: "cover",
                              border: `${borderWidth}px solid #fff`,
                              boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
                              display: "block",
                            }}
                          />
                        ) : (
                          <div
                            className="client-fallback"
                            style={{
                              width: size,
                              height: size,
                              borderRadius: "50%",
                              background: "#4f6ffd",
                              border: `${borderWidth}px solid #fff`,
                              boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              color: "#fff",
                              fontWeight: 700,
                              fontSize: Math.round(size * 0.34),
                            }}
                          >
                            {c.name.charAt(0).toUpperCase()}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Smooth gradient overlay at bottom */}
            <div
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                height: "100px",
                background: "linear-gradient(to top, var(--bg-page), transparent)",
                pointerEvents: "none",
                zIndex: 20,
              }}
            />

            {!isMobile && (
              <div
                style={{
                  position: "absolute",
                  left: "50%",
                  top: textTop,
                  transform: "translateX(-50%)",
                  zIndex: 40,
                  textAlign: "center",
                  width: "50%",
                  pointerEvents: "none",
                  margin: "140px auto 0 auto",
                  lineBreak: "auto"
                }}
              >
                <div style={{ pointerEvents: "auto" }}>{headlineBlock}</div>
              </div>
            )}
          </div>

          {isMobile && (
            <div className="text-center w-full" style={{ marginTop: "-49px" }}>
              {headlineBlock}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}