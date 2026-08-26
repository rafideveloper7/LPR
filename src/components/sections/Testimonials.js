"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { getTestimonials } from "@/lib/data";

function StarRating({ count = 5 }) {
  return (
    <div className="flex gap-1">
      {Array.from({ length: count }).map((_, i) => (
        <svg key={i} width="15" height="15" viewBox="0 0 24 24" fill="#ffb400">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </div>
  );
}

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [cardsPerPage, setCardsPerPage] = useState(3);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);

  const containerRef = useRef(null);
  const dragStartX = useRef(0);
  const isPointerDown = useRef(false);
  const autoPlayTimer = useRef(null);

  // Responsive cards per view
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setCardsPerPage(1);
      } else if (window.innerWidth < 1024) {
        setCardsPerPage(2);
      } else {
        setCardsPerPage(3);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Fetch data
  useEffect(() => {
    getTestimonials()
      .then((res) => {
        if (res?.data && res.data.length > 0) {
          setTestimonials(res.data);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const totalSlides = Math.max(1, testimonials.length - cardsPerPage + 1);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1 >= totalSlides ? 0 : prev + 1));
  }, [totalSlides]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 < 0 ? totalSlides - 1 : prev - 1));
  }, [totalSlides]);

  const goToSlide = (idx) => {
    setCurrentIndex(Math.max(0, Math.min(idx, totalSlides - 1)));
  };

  // Autoplay
  useEffect(() => {
    if (loading || testimonials.length <= cardsPerPage) return;
    autoPlayTimer.current = setInterval(() => {
      if (!isPointerDown.current) {
        nextSlide();
      }
    }, 6000);
    return () => clearInterval(autoPlayTimer.current);
  }, [loading, testimonials.length, cardsPerPage, nextSlide]);

  // Touch & Mouse Drag Handlers
  const handleDragStart = (clientX) => {
    isPointerDown.current = true;
    dragStartX.current = clientX;
    setIsDragging(true);
    setDragOffset(0);
  };

  const handleDragMove = (clientX) => {
    if (!isPointerDown.current) return;
    const diff = clientX - dragStartX.current;
    setDragOffset(diff);
  };

  const handleDragEnd = () => {
    if (!isPointerDown.current) return;
    isPointerDown.current = false;
    setIsDragging(false);

    const threshold = 50; // pixels to trigger slide
    if (dragOffset < -threshold) {
      nextSlide();
    } else if (dragOffset > threshold) {
      prevSlide();
    }
    setDragOffset(0);
  };

  // Mouse Events
  const onMouseDown = (e) => {
    e.preventDefault();
    handleDragStart(e.clientX);
  };

  const onMouseMove = (e) => {
    if (!isPointerDown.current) return;
    handleDragMove(e.clientX);
  };

  const onMouseUp = () => handleDragEnd();
  const onMouseLeave = () => handleDragEnd();

  // Touch Events
  const onTouchStart = (e) => {
    handleDragStart(e.touches[0].clientX);
  };

  const onTouchMove = (e) => {
    handleDragMove(e.touches[0].clientX);
  };

  const onTouchEnd = () => handleDragEnd();

  if (loading) {
    return (
      <section className="py-24" style={{ backgroundColor: "var(--bg-page)" }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-10 text-center">
          <div className="w-10 h-10 border-3 border-t-transparent rounded-full animate-spin mx-auto mb-4" style={{ borderColor: "var(--brand-blue-primary)", borderTopColor: "transparent" }} />
          <p className="text-sm" style={{ color: "var(--text-tertiary)", fontFamily: "DM Sans, sans-serif" }}>Loading testimonials…</p>
        </div>
      </section>
    );
  }

  if (testimonials.length === 0) return null;

  const cardWidthPercent = 100 / cardsPerPage;
  const translateX = -(currentIndex * cardWidthPercent);

  return (
    <section id="testimonials" className="py-24 overflow-hidden select-none" style={{ backgroundColor: "var(--bg-page)" }}>
      <div className="max-w-7xl mx-auto px-6 lg:px-10">

        {/* ─── Header ─── */}
        <div className="text-center mb-16">
          <p
            className="text-xs font-bold uppercase tracking-widest mb-3"
            style={{ color: "var(--brand-blue-primary)", fontFamily: "DM Sans, sans-serif" }}
          >
            What Clients Say
          </p>
          <h2
            className="text-3xl lg:text-5xl font-light"
            style={{ fontFamily: "Syne, sans-serif", color: "var(--text-primary)" }}
          >
            Trusted by Leaders Worldwide
          </h2>
          <div className="w-16 h-0.5 bg-brand-blue mx-auto mt-4" />
        </div>

        {/* ─── Carousel with Gesture & Arrows ─── */}
        <div className="relative">

          {/* Left Arrow */}
          <button
            onClick={prevSlide}
            aria-label="Previous Testimonial"
            className="hidden sm:flex absolute -left-4 lg:-left-6 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full items-center justify-center shadow-lg transition-all duration-300 hover:scale-110 active:scale-95 cursor-pointer"
            style={{
              backgroundColor: "var(--bg-elevated)",
              border: "1px solid var(--border-light)",
              color: "var(--text-primary)",
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>

          {/* Slider Viewport (Supports Mouse Drag & Touch Swipe) */}
          <div
            ref={containerRef}
            className="overflow-hidden cursor-grab active:cursor-grabbing touch-pan-y"
            onMouseDown={onMouseDown}
            onMouseMove={onMouseMove}
            onMouseUp={onMouseUp}
            onMouseLeave={onMouseLeave}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
          >
            <div
              className="flex gap-6 transition-transform ease-out"
              style={{
                transform: `translateX(calc(${translateX}% + ${dragOffset}px))`,
                transitionDuration: isDragging ? "0ms" : "450ms",
              }}
            >
              {testimonials.map((t, idx) => (
                <div
                  key={t._id || t.id || idx}
                  className="flex-shrink-0"
                  style={{
                    width: `calc(${100 / cardsPerPage}% - ${(24 * (cardsPerPage - 1)) / cardsPerPage}px)`,
                  }}
                >
                  <div
                    className="h-full rounded-2xl p-8 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 hover:shadow-xl relative border"
                    style={{
                      backgroundColor: "var(--bg-elevated)",
                      borderColor: "var(--border-subtle)",
                    }}
                  >
                    {/* Top: Star rating & Quotes Icon */}
                    <div>
                      <div className="flex items-center justify-between mb-5">
                        <StarRating count={t.stars || 5} />
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="var(--brand-blue-primary)" opacity="0.25">
                          <path d="M6 17h3l2-4V7H5v6h3zm8 0h3l2-4V7h-6v6h3z" />
                        </svg>
                      </div>

                      {/* Quote Text */}
                      <p
                        className="text-sm leading-relaxed mb-6 italic"
                        style={{
                          fontFamily: "DM Sans, sans-serif",
                          color: "var(--text-secondary)",
                          fontSize: "0.95rem",
                          lineHeight: 1.7,
                        }}
                      >
                        "{t.text}"
                      </p>
                    </div>

                    {/* Bottom: Client Profile */}
                    <div className="flex items-center gap-3.5 pt-5 border-t" style={{ borderColor: "var(--border-subtle)" }}>
                      {t.avatar ? (
                        <img
                          src={t.avatar}
                          alt={t.name}
                          className="w-12 h-12 rounded-full object-cover border"
                          style={{ borderColor: "var(--border-light)" }}
                          draggable={false}
                        />
                      ) : (
                        <div
                          className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-sm"
                          style={{
                            backgroundColor: "var(--brand-blue-soft)",
                            color: "var(--brand-blue-primary)",
                          }}
                        >
                          {t.name ? t.name.charAt(0).toUpperCase() : "★"}
                        </div>
                      )}
                      <div>
                        <h3
                          className="text-sm font-semibold leading-snug"
                          style={{ fontFamily: "Syne, sans-serif", color: "var(--text-primary)" }}
                        >
                          {t.name}
                        </h3>
                        <p
                          className="text-xs mt-0.5"
                          style={{ fontFamily: "DM Sans, sans-serif", color: "var(--text-tertiary)" }}
                        >
                          {t.role || "Verified Client"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Arrow */}
          <button
            onClick={nextSlide}
            aria-label="Next Testimonial"
            className="hidden sm:flex absolute -right-4 lg:-right-6 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full items-center justify-center shadow-lg transition-all duration-300 hover:scale-110 active:scale-95 cursor-pointer"
            style={{
              backgroundColor: "var(--bg-elevated)",
              border: "1px solid var(--border-light)",
              color: "var(--text-primary)",
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>
        </div>

        {/* ─── Interactive Dots Navigation & Swipe Hint ─── */}
        <div className="flex flex-col items-center gap-3 mt-12">
          <div className="flex items-center gap-2">
            {Array.from({ length: totalSlides }).map((_, idx) => (
              <button
                key={idx}
                onClick={() => goToSlide(idx)}
                aria-label={`Go to slide ${idx + 1}`}
                className="rounded-full transition-all duration-300 cursor-pointer"
                style={{
                  width: currentIndex === idx ? 28 : 8,
                  height: 8,
                  backgroundColor: currentIndex === idx ? "var(--brand-blue-primary)" : "var(--border-light)",
                }}
              />
            ))}
          </div>
          <span className="text-[11px] font-medium tracking-wide sm:hidden opacity-60" style={{ color: "var(--text-tertiary)", fontFamily: "DM Sans, sans-serif" }}>
            ← Drag or swipe to explore →
          </span>
        </div>

      </div>
    </section>
  );
}