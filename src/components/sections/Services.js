"use client";
import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { getServices } from "@/lib/data";

const slugify = (text) =>
  text
    .toString()
    .trim()
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/^-+|-+$/g, "");

export default function Services() {
  const sectionRef = useRef(null);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isInView, setIsInView] = useState(false);
  const [hoveredIdx, setHoveredIdx] = useState(null);

  useEffect(() => {
    const loadServices = async () => {
      try {
        const res = await getServices();
        if (res?.data && res.data.length > 0) {
          setServices(res.data);
        }
      } catch {
        // no hardcoded fallback
      } finally {
        setLoading(false);
      }
    };
    loadServices();
  }, []);

  // Reveal the section with a fade/slide-up animation once it scrolls into view
  useEffect(() => {
    const node = sectionRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [loading]);

  if (loading) {
    return (
      <section
        ref={sectionRef}
        className="w-full"
        style={{ backgroundColor: "var(--bg-page)" }}
      >
        <div className="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl py-20 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-blue"></div>
        </div>
      </section>
    );
  }

  return (
    <section
      ref={sectionRef}
      className="w-full relative overflow-hidden"
      style={{ backgroundColor: "var(--bg-page)" }}
    >
      <div className="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl py-16 sm:py-20 lg:py-28">
        {/* Eyebrow */}
        <div
          className="flex items-center justify-center gap-3 mb-4"
          style={{
            opacity: isInView ? 1 : 0,
            transform: isInView ? "translateY(0)" : "translateY(14px)",
            transition: "opacity 0.7s ease, transform 0.7s ease",
          }}
        >
          <span
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: "#4f6ffd" }}
          />
          <span
            className="uppercase text-xs sm:text-sm tracking-[0.25em]"
            style={{ color: "rgba(15,23,42,0.5)", fontFamily: "Inter, sans-serif" }}
          >
            What we do
          </span>
        </div>

        {/* Heading */}
        <div className="text-center mb-14 sm:mb-20">
          <h2
            className="text-4xl sm:text-5xl md:text-6xl mb-5"
            style={{
              color: "var(--text-primary)",
              fontFamily: "'Syne', sans-serif",
              fontWeight: 700,
              letterSpacing: "-0.02em",
              opacity: isInView ? 1 : 0,
              transform: isInView ? "translateY(0)" : "translateY(18px)",
              transition: "opacity 0.8s ease 0.05s, transform 0.8s ease 0.05s",
            }}
          >
            Our{" "}
            <span
              style={{
                fontFamily: "'Instrument Serif', 'Syne', serif",
                fontStyle: "italic",
                fontWeight: 400,
                color: "#4f6ffd",
              }}
            >
              Services
            </span>
          </h2>
          <div
            className="w-16 sm:w-20 h-[3px] mx-auto rounded-full"
            style={{
              backgroundColor: "#4f6ffd",
              opacity: isInView ? 1 : 0,
              transform: isInView ? "scaleX(1)" : "scaleX(0)",
              transformOrigin: "center",
              transition: "opacity 0.6s ease 0.25s, transform 0.6s ease 0.25s",
            }}
          ></div>
        </div>

        {/* Service list */}
        <div className="flex flex-col">
          {services.map((service, idx) => {
            const slug = slugify(service.title);
            const isHovered = hoveredIdx === idx;
            return (
              <Link
                key={service._id || service.id}
                href={`/services/${slug}`}
                className="group"
                onMouseEnter={() => setHoveredIdx(idx)}
                onMouseLeave={() => setHoveredIdx(null)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "24px",
                  padding: "clamp(20px, 4vw, 36px) clamp(4px, 2vw, 12px)",
                  borderTop: idx === 0 ? "1px solid rgba(15,23,42,0.08)" : "none",
                  borderBottom: "1px solid rgba(15,23,42,0.08)",
                  textDecoration: "none",
                  color: "var(--text-primary)",
                  opacity: isInView ? 1 : 0,
                  transform: isInView ? "translateY(0)" : "translateY(24px)",
                  transition: `opacity 0.6s ease ${0.1 + idx * 0.08}s, transform 0.6s ease ${
                    0.1 + idx * 0.08
                  }s, background-color 0.3s ease`,
                  backgroundColor: isHovered ? "rgba(79,111,253,0.04)" : "transparent",
                }}
              >
                {/* Index number */}
                <span
                  className="hidden sm:block flex-shrink-0"
                  style={{
                    fontFamily: "'Syne', sans-serif",
                    fontSize: "14px",
                    fontWeight: 600,
                    color: isHovered ? "#4f6ffd" : "rgba(15,23,42,0.35)",
                    width: "36px",
                    transition: "color 0.3s ease",
                  }}
                >
                  {String(idx + 1).padStart(2, "0")}
                </span>

                {/* Title */}
                <h3
                  className="flex-1 text-2xl sm:text-3xl md:text-5xl lg:text-6xl tracking-tight"
                  style={{
                    fontFamily: "'Syne', sans-serif",
                    fontWeight: 700,
                    lineHeight: 1.15,
                    color: isHovered ? "#4f6ffd" : "var(--text-primary)",
                    transition: "color 0.3s ease, transform 0.3s ease",
                    transform: isHovered ? "translateX(8px)" : "translateX(0)",
                  }}
                >
                  {service.title}
                </h3>

                {/* Arrow */}
                <span
                  className="flex-shrink-0 hidden sm:flex items-center justify-center rounded-full"
                  style={{
                    width: "52px",
                    height: "52px",
                    border: "1px solid rgba(15,23,42,0.12)",
                    backgroundColor: isHovered ? "#4f6ffd" : "transparent",
                    transition: "background-color 0.3s ease, transform 0.3s ease, border-color 0.3s ease",
                    transform: isHovered ? "scale(1.05) rotate(45deg)" : "scale(1) rotate(0deg)",
                  }}
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke={isHovered ? "#ffffff" : "#0f172a"}
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    style={{ transition: "stroke 0.3s ease" }}
                  >
                    <path d="M7 17L17 7" />
                    <path d="M7 7h10v10" />
                  </svg>
                </span>
              </Link>
            );
          })}
        </div>

        {/* CTA */}
        <div
          className="text-center mt-14 sm:mt-16"
          style={{
            opacity: isInView ? 1 : 0,
            transform: isInView ? "translateY(0)" : "translateY(14px)",
            transition: `opacity 0.6s ease ${0.15 + services.length * 0.08}s, transform 0.6s ease ${
              0.15 + services.length * 0.08
            }s`,
          }}
        >
          <Link
            href="/services"
            className="inline-flex items-center gap-2 bg-brand-blue text-white px-8 py-3.5 rounded-full font-semibold text-base hover:bg-brand-blue/90 transition-all hover:gap-3"
            style={{ boxShadow: "var(--shadow-md)" }}
          >
            View All Services
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
