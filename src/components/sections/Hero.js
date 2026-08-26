"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { API_URL } from "@/lib/apiConfig";
import { clamp } from "framer-motion";

const Marquee = dynamic(() => import("react-fast-marquee"), { ssr: false });

// ============================================
// FONT CONFIGURATION - FIXED FOR MOBILE BOLD
// ============================================
const FONT_CONFIG = {
  // Using web-safe bold fonts that work on ALL devices
  headerFont: "'Montserrat', 'Impact', 'Arial Black', 'Helvetica Neue', sans-serif",
  bodyFont: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  textTransform: "uppercase",
  letterSpacing: "1px",
  headerWeight: "900", // Changed from 800 to 900 for extra bold
  bodyWeight: "400",
};

export default function Hero() {
  const sectionRef = useRef(null);
  const [hero, setHero] = useState(null);
  const [siteSettings, setSiteSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const videoRef = useRef(null);

  // Story Viewer State
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  const [storyProgress, setStoryProgress] = useState(0);
  const [videoDuration, setVideoDuration] = useState(null);
  const [muted, setMuted] = useState(true);
  const [touchStartX, setTouchStartX] = useState(null);
  const [touchDeltaX, setTouchDeltaX] = useState(0);

  const stories = hero?.stories || [];

  const getStoryDuration = () => {
    const currentStory = stories[currentStoryIndex];
    if (!currentStory) return 5000;

    const isGif = currentStory.url?.match(/\.(gif)/i);
    const isVideo =
      currentStory.type === "video" ||
      currentStory.url?.match(/\.(mp4|webm|ogg|mov)/i);
    const isImage = currentStory.type === "image" || (!isVideo && !isGif);

    if (isImage) {
      return 3000;
    }

    if (isGif) {
      return null;
    }

    if (isVideo && videoDuration) {
      return videoDuration * 1000;
    }

    return 5000;
  };

  // Handle video metadata load
  const handleVideoMetadata = (event) => {
    const duration = event.target.duration;
    if (duration && isFinite(duration)) {
      setVideoDuration(duration);
    }
  };

  const goToNextStory = () => {
    setCurrentStoryIndex((prev) => (prev + 1) % stories.length);
    setVideoDuration(null);
  };

  const goToPrevStory = () => {
    setCurrentStoryIndex((prev) => (prev - 1 + stories.length) % stories.length);
    setVideoDuration(null);
  };

  const handleTouchStart = (e) => {
    setTouchStartX(e.touches[0].clientX);
    setTouchDeltaX(0);
  };

  const handleTouchMove = (e) => {
    if (touchStartX === null) return;
    setTouchDeltaX(e.touches[0].clientX - touchStartX);
  };

  const handleTouchEnd = () => {
    if (touchStartX === null) return;
    const threshold = 60;
    if (touchDeltaX > threshold) {
      goToPrevStory();
    } else if (touchDeltaX < -threshold) {
      goToNextStory();
    }
    setTouchStartX(null);
    setTouchDeltaX(0);
  };

  // Story Auto-slide & Progress logic
  useEffect(() => {
    if (!hero) return;

    const currentStory = stories[currentStoryIndex];
    const isGif = currentStory?.url?.match(/\.(gif)/i);
    const duration = getStoryDuration();

    if (isGif) {
      setStoryProgress(0);
      return;
    }

    if (duration) {
      setStoryProgress(0);
      const startTime = Date.now();

      const progressInterval = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const percentage = Math.min((elapsed / duration) * 100, 100);
        setStoryProgress(percentage);
      }, 30);

      const slideTimeout = setTimeout(() => {
        goToNextStory();
        setVideoDuration(null);
      }, duration);

      return () => {
        clearInterval(progressInterval);
        clearTimeout(slideTimeout);
      };
    }
  }, [currentStoryIndex, hero, stories.length, videoDuration]);

  useEffect(() => {
    if (!hero) return;
    const els = sectionRef.current?.querySelectorAll(".hero-reveal");
    if (els && els.length > 0) {
      els.forEach((el, i) => {
        setTimeout(
          () => {
            el.style.opacity = "1";
            el.style.transform = "translateY(0)";
          },
          200 + i * 120,
        );
      });
    }
  }, [hero]);

  useEffect(() => {
    if (!hero) return;
    const currentStory = stories[currentStoryIndex];
    const defaultMute = currentStory?.allowAudio !== undefined
      ? !currentStory.allowAudio
      : (hero.videoMute ?? true);
    setMuted(defaultMute);
  }, [currentStoryIndex, hero, stories]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [heroResponse, settingsResponse] = await Promise.all([
          fetch(`${API_URL}/hero`).catch(() => ({
            ok: false,
            json: () => ({}),
          })),
          fetch(`${API_URL}/site-settings`).catch(() => ({
            ok: false,
            json: () => ({}),
          })),
        ]);

        let heroJson = null;
        let settingsJson = null;

        if (heroResponse.ok) {
          heroJson = await heroResponse.json();
        }

        if (settingsResponse.ok) {
          settingsJson = await settingsResponse.json();
        }

        if (heroJson?.data) {
          setHero(heroJson.data);
        }

        if (settingsJson?.data) {
          setSiteSettings(settingsJson.data);
        }
      } catch (error) {
        console.error("Error fetching hero data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Dynamic Media Renderer
  const renderMedia = (story) => {
    if (!story) return null;
    const isVideo =
      story.type === "video" || story.url?.match(/\.(mp4|webm|ogg|mov)/i);
    const isGif = story.url?.match(/\.(gif)/i);

    if (isVideo) {
      return (
        <div style={{ position: "relative", width: "100%", height: "100%" }}>
          <video
            ref={videoRef}
            src={story.url}
            autoPlay
            muted={muted}
            playsInline
            onLoadedMetadata={handleVideoMetadata}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
          <button
            onClick={() => setMuted(!muted)}
            style={{
              position: "absolute",
              bottom: "12px",
              right: "12px",
              zIndex: 35,
              background: "rgba(0,0,0,0.5)",
              border: "none",
              borderRadius: "50%",
              width: "32px",
              height: "32px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              color: "white",
              fontSize: "12px",
              fontWeight: "bold",
            }}
            title={muted ? "Unmute" : "Mute"}
          >
            {muted ? "🔇" : "🔊"}
          </button>
        </div>
      );
    }

    if (isGif) {
      return (
        <img
          src={story.url}
          alt="Story Content - GIF"
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      );
    }

    return (
      <img
        src={story.url}
        alt="Story Content"
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      />
    );
  };

  // Show loading spinner
  if (loading) {
    return (
      <section
        style={{
          minHeight: "85vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            width: 48,
            height: 48,
            border: "4px solid #f3f3f3",
            borderTop: "4px solid #4f6ffd",
            borderRadius: "50%",
            animation: "spin 0.7s linear infinite",
          }}
        />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </section>
    );
  }

  if (!hero) {
    return null;
  }

  // Helper function to split text into pairs of words (always 2 words per line)
  const splitIntoTwoWords = (text) => {
    if (!text) return [];
    const words = text.trim().split(/\s+/);
    const lines = [];
    for (let i = 0; i < words.length; i += 2) {
      const pair = words.slice(i, i + 2).join(' ');
      lines.push(pair);
    }
    return lines;
  };

  // Get the title lines (2 words each)
  const titleLines = splitIntoTwoWords(hero.title || "HEADING NOW");
  const highlightLines = splitIntoTwoWords(hero.titleHighlight || "TRIAL 36");

  return (
    <section
      ref={sectionRef}
      style={{
        zIndex: 1,
        display: "flex",
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "center",
        alignItems: "center",
        gap: "clamp(24px, 5vw, 64px)",
        width: "100%",
        maxWidth: "1400px",
        minHeight: "85vh",
        padding: "clamp(60px, 10vw, 120px) clamp(16px, 5vw, 64px)",
        margin: "0 auto",
        position: "relative",
      }}
    >
      <style>
        {`
          @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(30px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes fadeInLeft {
            from { opacity: 0; transform: translateX(-30px); }
            to { opacity: 1; transform: translateX(0); }
          }
          @keyframes scaleIn {
            from { opacity: 0; transform: scale(0.9); }
            to { opacity: 1; transform: scale(1); }
          }
          @keyframes textReveal {
            from { opacity: 0; clip-path: polygon(0 0, 0 0, 0 100%, 0 100%); }
            to { opacity: 1; clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%); }
          }
          
          /* Google Fonts - Montserrat Bold for headers */
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Montserrat:wght@400;500;600;700;800;900&display=swap');
          
          .animate-fadeInUp { animation: fadeInUp 0.8s ease forwards; }
          .animate-fadeInLeft { animation: fadeInLeft 0.8s ease forwards; }
          .animate-scaleIn { animation: scaleIn 0.6s ease forwards; }
          .animate-textReveal { animation: textReveal 1s ease forwards; }
          .social-icon { transition: all 0.3s ease; cursor: pointer; flex-shrink: 0; margin: 0 4px; display: inline-flex; align-items: center; justify-content: center; }
          .social-icon:hover { transform: translateY(-3px) scale(1.1); }
          .hero-marquee { width: 100%; min-height: 34px; display: flex; align-items: center; }
          .hero-marquee .rfm-marquee, .hero-marquee .rfm-initial-child-container { display: flex; align-items: center; min-height: 34px; }
          .cta-button { transition: all 0.3s ease; }
          .cta-button:hover { transform: translateY(-2px); box-shadow: 0 10px 25px -5px rgba(79, 111, 253, 0.3); }
          .hero-left { flex: 1; min-width: clamp(250px, 60%, 500px); }
          .hero-right { width: clamp(260px, 35%, 400px); }
          
          /* Responsive styles */
          .headline-container {
            width: 100%;
          }
          .title-line {
            display: block;
            white-space: normal;
            width: 100%;
            font-weight: 900 !important; /* Force bold on all devices */
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
          }
          
          @media (min-width: 969px) {
            .hero-left { align-items: flex-start !important; text-align: left !important; }
            .hero-left .description-text { margin: 0 !important; text-align: left !important; }
            .hero-left .cta-button { justify-content: flex-start !important; }
            .marquee-wrapper { display: flex; justify-content: flex-start !important; }
            .marquee-inner { width: auto !important; min-width: auto !important; }
          }
          @media (max-width: 1400px) { .headline-text { line-height: 1.2 !important; } }
          @media (min-width: 1400px) { .headline-text { line-height: 1.1 !important; } }
          @media (max-width: 968px) {
            .hero-left { min-width: 100%; text-align: center; align-items: center !important; }
            .hero-left .cta-button { display: flex; justify-content: center; width: 100%; }
            .hero-left .description-text { text-align: center !important; margin: 0 auto !important; }
            .hero-right { width: 80%; max-width: 350px; }
            .marquee-wrapper { width: 100%; max-width: 100%; }
            .marquee-inner { width: 100% !important; }
            .title-line {
              text-align: center;
            }
          }
          @media (max-width: 480px) { 
            .hero-right { width: 90%; max-width: 300px; }
            .title-line {
              text-align: center;
            }
          }
          .description-text { 
            display: -webkit-box; 
            -webkit-line-clamp: 5; 
            line-clamp: 5; 
            -webkit-box-orient: vertical; 
            overflow: hidden; 
            text-overflow: ellipsis; 
            line-height: 1.4;
          }
        `}
      </style>

      {/* LEFT SECTION */}
      <div
        className="hero-left -mt-[11px]"
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          gap: "clamp(24px, 4vw, 30px)",
          // backgroundColor: "yellow"
        }}
      >
        {/* Social Icons Marquee */}
        <div className="mt-8">
          <Marquee
            className="hero-marquee"
            gradient={false}
            speed={30}
            pauseOnHover
            autoFill
            style={{
              width: "180px",
              height: "auto",
              overflow: "hidden",
              backgroundColor: "rgba(0, 0, 0, 0.1)",
              borderRadius: "10px",
            }}
          >
            {(() => {
              const ALL_SOCIALS = [
                {
                  name: "LINKEDIN",
                  // href: "https://linkedin.com/in/yourprofile",
                  iconPath:
                    "https://cdn-icons-png.flaticon.com/512/174/174857.png",
                },
                {
                  name: "FACEBOOK",
                  // href: "https://facebook.com/yourpage",
                  iconPath:
                    "https://cdn-icons-png.flaticon.com/512/145/145802.png",
                },
                {
                  name: "TIKTOK",
                  // href: "https://tiktok.com/@yourhandle",
                  iconPath:
                    "https://cdn-icons-png.flaticon.com/512/3046/3046126.png",
                },
                {
                  name: "INSTAGRAM",
                  // href: "https://instagram.com/yourhandle",
                  iconPath:
                    "https://cdn-icons-png.flaticon.com/512/2111/2111463.png",
                },
                {
                  name: "PINTEREST",
                  // href: "https://pinterest.com/yourhandle",
                  iconPath:
                    "https://cdn-icons-png.flaticon.com/512/145/145808.png",
                },
                {
                  name: "YOUTUBE",
                  // href: "https://youtube.com/@yourchannel",
                  iconPath:
                    "https://cdn-icons-png.flaticon.com/512/1384/1384060.png",
                },
                {
                  name: "TWITTER",
                  // href: "https://x.com/yourprofile",
                  iconPath:
                    "https://cdn-icons-png.flaticon.com/512/733/733579.png",
                },
              ];

              return ALL_SOCIALS.map((s) => (
                <a
                  key={s.name}
                  // href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-icon-anchor"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "18px",
                    height: "18px",
                    margin: "4px 5px",
                    opacity: 1,
                    transition: "all 0.2s ease-in-out",
                  }}
                >
                  <img
                    src={s.iconPath}
                    alt={s.name}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "contain",
                    }}
                  />
                </a>
              ));
            })()}
          </Marquee>
        </div>
        
        {/* HEADLINE - FIXED BOLD FOR MOBILE */}
        <div
          className="animate-textReveal headline-container"
          style={{
            animationFillMode: "forwards",
            width: "100%",
          }}
        >
          <h1
            className="headline-text"
            style={{
              fontFamily: FONT_CONFIG.headerFont,
              fontWeight: 900,
              color: "#000",
              height: "auto",
              margin: 0,
              padding: 0,
              marginBottom: "10px",
              letterSpacing: FONT_CONFIG.letterSpacing,
              textTransform: FONT_CONFIG.textTransform,
              width: "100%",
              WebkitFontSmoothing: "antialiased",
              MozOsxFontSmoothing: "grayscale",
            }}
          >
            {/* Title lines - FORCED BOLD for mobile */}
            {titleLines.map((line, index) => (
              <span
                key={`title-${index}`}
                className="title-line"
                style={{
                  fontSize: "clamp(36px, 8vw, 64px)",
                  display: "block",
                  lineHeight: 1.1,
                  color: "#000",
                  fontWeight: 900,
                  fontFamily: FONT_CONFIG.headerFont,
                  textTransform: FONT_CONFIG.textTransform,
                  marginBottom: index === titleLines.length - 1 ? "16px" : "0",
                  width: "100%",
                  whiteSpace: "normal",
                  letterSpacing: FONT_CONFIG.letterSpacing,
                }}
              >
                {line}
              </span>
            ))}
            
            {/* Highlight lines - FORCED BOLD for mobile */}
            {highlightLines.map((line, index) => (
              <span
                key={`highlight-${index}`}
                className="title-line"
                style={{
                  fontSize: "clamp(36px, 8vw, 64px)",
                  display: "block",
                  lineHeight: 1.1,
                  color: "#4f6ffd",
                  fontWeight: 900,
                  fontFamily: FONT_CONFIG.headerFont,
                  letterSpacing: FONT_CONFIG.letterSpacing,
                  textTransform: FONT_CONFIG.textTransform,
                  width: "100%",
                  whiteSpace: "normal",
                }}
              >
                {line}
              </span>
            ))}
          </h1>
        </div>
        
        {/* DESCRIPTION - Regular body font */}
        <div
          className="animate-fadeInUp"
          style={{
            width: "100%",
            maxWidth: "clamp(280px, 85vw, 550px)",
            animationDelay: "0.2s",
            opacity: 0,
            animationFillMode: "forwards",
          }}
        >
          <p
            className="description-text"
            style={{
              fontFamily: FONT_CONFIG.bodyFont,
              fontSize: "clamp(16px, 4.5vw, 20px)",
              fontWeight: FONT_CONFIG.bodyWeight,
              letterSpacing: "-0.01em",
              lineHeight: "1.4",
              color: "rgba(0,0,0,0.7)",
              margin: 0,
            }}
          >
            {hero.description || ""}
          </p>
        </div>

        {/* CTA Buttons - Regular body font */}
        <div
          className="animate-scaleIn flex flex-wrap items-center justify-center gap-4"
          style={{
            animationFillMode: "forwards",
          }}
        >
          <Link
            href="/contact"
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "clamp(12px, 2vw, 15px)",
              textDecoration: "none",
              backgroundColor: "#4f6ffd",
              borderRadius: "50px",
              color: "#fff",
              fontFamily: FONT_CONFIG.bodyFont,
              fontSize: "clamp(14px, 3vw, 16px)",
              fontWeight: "600",
              transition: "all 0.3s ease",
              border: "none",
              cursor: "pointer",
              overflow: "hidden",
            }}
          >
            <span
              style={{
                display: "inline-block",
                transition: "transform 0.7s ease",
                transform: "translateY(0px)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-13px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0px)";
              }}
            >
              GET IN TOUCH →
            </span>
          </Link>

          {/* Book a Call Button */}
          <Link href="/contact">
            <div
              className="flex items-center gap-2 bg-white rounded-full shadow-md border border-gray-200 hover:shadow-lg transition-all duration-200 p-2 pr-4"
              style={{
                flexShrink: 0,
                maxWidth: "100%",
                height: "clamp(50px, 55px, 70px)",
                cursor: "pointer",
              }}
            >
              <img
                src="https://res.cloudinary.com/dtsn7jlsf/image/upload/v1787635204/IMG-20260513-WA0000.jpg__1_-removebg-preview_pbxe37.png"
                alt="call icon"
                style={{
                  width: "clamp(36px, 5vw, 48px)",
                  height: "clamp(36px, 5vw, 48px)",
                  borderRadius: "50%",
                  objectFit: "cover",
                  flexShrink: 0,
                }}
              />

              <div className="px-2">
                <span
                  style={{
                    fontFamily: FONT_CONFIG.bodyFont,
                    fontSize: "11px",
                    fontWeight: "600",
                    color: "#374151",
                    whiteSpace: "nowrap",
                  }}
                >
                  BOOK A FREE INTRO CALL
                </span>

                <div className="flex items-center gap-1 bg-gray-100 px-2 py-0.5 rounded-full mt-1">
                  <span
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      backgroundColor: "rgb(93, 139, 58)",
                      flexShrink: 0,
                    }}
                  />
                  <span
                    style={{
                      fontFamily: FONT_CONFIG.bodyFont,
                      fontSize: "9px",
                      fontWeight: "500",
                      color: "#6B7280",
                      whiteSpace: "nowrap",
                    }}
                  >
                    AVAILABLE NOW
                  </span>
                </div>
              </div>
            </div>
          </Link>
        </div>
      </div>

      {/* RIGHT SECTION - Story Viewer (unchanged) */}
      <div
        className="animate-fadeInUp hero-right"
        style={{
          backgroundColor: "#eee9e943",
          borderRadius: "clamp(24px, 4vw, 36px)",
          padding: "10px",
          boxShadow: "0px 20px 20px 15px rgb(222, 216, 216)",
          animationDelay: "0.1s",
          opacity: 0,
          animationFillMode: "forwards",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "relative",
            width: "100%",
            height: "100%",
            borderRadius: "clamp(20px, 3vw, 26px)",
            overflow: "hidden",
            aspectRatio: "0.68",
            background: "black",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            touchAction: "pan-y",
          }}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* Progress Indicators */}
          <div
            style={{
              position: "absolute",
              top: "14px",
              left: "12px",
              right: "12px",
              display: "flex",
              gap: "4px",
              zIndex: 30,
            }}
          >
            {stories.map((story, index) => {
              const isGif = story.url?.match(/\.(gif)/i);
              return (
                <div
                  key={index}
                  style={{
                    flex: 1,
                    height: "2.5px",
                    backgroundColor: "rgba(255, 255, 255, 0.4)",
                    borderRadius: "2px",
                    overflow: "hidden",
                  }}
                >
                  {!isGif && (
                    <div
                      style={{
                        height: "100%",
                        backgroundColor: "#4f6ffd",
                        width:
                          index === currentStoryIndex
                            ? `${storyProgress}%`
                            : index < currentStoryIndex
                              ? "100%"
                              : "0%",
                        transition:
                          index === currentStoryIndex
                            ? "none"
                            : "width 0.1s linear",
                      }}
                    />
                  )}
                </div>
              );
            })}
          </div>

          {/* Navigation Arrows */}
          {stories.length > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); goToPrevStory(); }}
                style={{
                  position: "absolute",
                  left: "8px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  zIndex: 30,
                  width: "36px",
                  height: "36px",
                  borderRadius: "50%",
                  border: "none",
                  background: "rgba(0,0,0,0.35)",
                  color: "white",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  backdropFilter: "blur(4px)",
                }}
                aria-label="Previous story"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="15 18 9 12 15 6" />
                </svg>
              </button>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); goToNextStory(); }}
                style={{
                  position: "absolute",
                  right: "8px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  zIndex: 30,
                  width: "36px",
                  height: "36px",
                  borderRadius: "50%",
                  border: "none",
                  background: "rgba(0,0,0,0.35)",
                  color: "white",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  backdropFilter: "blur(4px)",
                }}
                aria-label="Next story"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </button>
            </>
          )}

          {/* User Profile Header */}
          <div
            style={{
              position: "absolute",
              top: "28px",
              width: "90%",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              zIndex: 30,
              background: "rgba(0,0,0,0.3)",
              borderRadius: "20px",
              padding: "4px 12px",
            }}
          >
            <img
              src={
                
                "https://res.cloudinary.com/dtsn7jlsf/image/upload/v1787635204/IMG-20260513-WA0000.jpg__1_-removebg-preview_pbxe37.png"
              }
              alt="Avatar"
              style={{
                width: "32px",
                height: "32px",
                borderRadius: "50%",
                objectFit: "cover",
                border: "2px solid white"
              }}
            />
            <div
              style={{ display: "flex", alignItems: "baseline", gap: "6px" }}
            >
              <span
                style={{
                  color: "#FFFFFF",
                  fontFamily: FONT_CONFIG.bodyFont,
                  fontSize: "12px",
                  fontWeight: "600",
                  letterSpacing: "-0.01em",
                  textShadow: "0 1px 2px rgba(0,0,0,0.3)",
                }}
              >
                LUUPULSE
              </span>
              <span
                style={{
                  color: "rgba(255, 255, 255, 0.8)",
                  fontFamily: FONT_CONFIG.bodyFont,
                  fontSize: "10px",
                  textShadow: "0 1px 2px rgba(0,0,0,0.3)",
                }}
              >
                {hero.storyTimeOffset || "3h"}
              </span>
            </div>
          </div>

          {/* Active Story Media */}
          <div
            style={{
              width: "100%",
              height: "100%",
              position: "relative",
              zIndex: 10,
              transform: touchDeltaX !== 0 ? `translateX(${touchDeltaX * 0.3}px)` : "translateX(0)",
              transition: touchStartX === null ? "transform 0.3s ease" : "none",
            }}
          >
            {renderMedia(stories[currentStoryIndex])}
          </div>

          {/* Bottom Gradient */}
          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: "120px",
              background:
                "linear-gradient(to top, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0) 100%)",
              zIndex: 15,
              pointerEvents: "none",
            }}
          />
        </div>

        {/* Bottom Brand Logo */}
        <div
          style={{
            position: "absolute",
            bottom: "-4px",
            left: "50%",
            transform: "translateX(-50%)",
            width: "88px",
            height: "53px",
            backgroundColor: "white",
            borderRadius: "50px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
            marginBottom: "-30px",
            boxShadow: "0 8px 20px rgba(0,0,0,0.2)",
          }}
        >
          <div>
            <img
              src="https://res.cloudinary.com/dtsn7jlsf/image/upload/v1787636409/Black_and_Red_Clean_Bold_Signature_Typography_Logo_2_1_1_uvlnwk.jpg"
              alt="Logo Icon"
              style={{ width: "fit-content", height: "fit-content", objectFit: "contain", borderRadius: "50px", }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}