"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeLink, setActiveLink] = useState("/");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setActiveLink(pathname);
  }, [pathname]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu when clicking a link
  const handleLinkClick = (link) => {
    setActiveLink(link);
    setIsMobileMenuOpen(false);
  };

  return (
    <nav
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 999,
        width: "100%",
        backgroundColor: isScrolled
          ? "rgba(242, 242, 237, 0.88)"
          : pathname === "/"
          ? "transparent"
          : "rgba(242, 242, 237, 0.75)",
        backdropFilter: isScrolled || pathname !== "/" ? "blur(14px)" : "none",
        WebkitBackdropFilter: isScrolled || pathname !== "/" ? "blur(14px)" : "none",
        borderBottom: isScrolled || pathname !== "/" ? "1px solid var(--border-subtle)" : "1px solid transparent",
        transition: "background-color 0.3s ease, border-color 0.3s ease, backdrop-filter 0.3s ease",
      }}
    >
      {/* Main Navbar Container */}
      <div
        style={{
          position: "relative",
          width: "100%",
          maxWidth: "1400px",
          margin: "0 auto",
          padding: "clamp(12px, 2.5vw, 18px) clamp(16px, 5vw, 64px)",
        }}
      >

        {/* Flex Container */}
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            position: "relative",
            zIndex: 1,
            gap: "clamp(10px, 3vw, 24px)",
          }}
        >
          {/* Left Side - Logo Section */}
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              flexShrink: 0,
              gap: "clamp(8px, 2vw, 16px)",
            }}
          >
            <Link
              href="/"
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                gap: "clamp(4px, 1.5vw, 8px)",
                textDecoration: "none",
              }}
              onClick={() => handleLinkClick("/")}
            >
              {/* Logo Icon */}
              <img
                src="https://res.cloudinary.com/dtsn7jlsf/image/upload/v1787637175/Black_and_Red_Clean_Bold_Signature_Typography_Logo__2___1___1_-removebg-preview_b2nevr.png"
                alt="Logo"
                style={{
                  width: "100%",
                  height: "clamp(32px, 8vw, 48px)",
                  objectFit: "cover",
                }}
              />

              {/* Logo Text */}
              {/* <h1
                style={{
                  fontFamily: "cursive, sans-serif",
                  fontSize: "clamp(18px, 5vw, 24px)",
                  fontWeight: "600",
                  letterSpacing: "0.3em",
                  lineHeight: "110%",
                  color: "#000000",
                  margin: 0,
                }}
              >
                LPR
              </h1> */}
            </Link>
          </div>

          {/* Right Side - Hamburger Menu Button (Mobile only) */}
          <div style={{ display: "flex", alignItems: "center" }}>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: "8px",
                zIndex: 20,
                position: "relative",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                width: "40px",
                height: "40px",
              }}
              className="mobile-menu-button"
            >
              {/* Two horizontal lines */}
              <div
                style={{
                  width: "24px",
                  height: "2px",
                  backgroundColor: "#000000",
                  margin: "4px 0",
                  transition: "all 0.3s ease",
                  transform: isMobileMenuOpen ? "rotate(45deg) translate(4px, 4px)" : "none",
                }}
              />
              <div
                style={{
                  width: "17px",
                  height: "2px",
                  backgroundColor: "#000000",
                  margin: "4px 0",
                  transition: "all 0.3s ease",
                  transform: isMobileMenuOpen ? "rotate(-45deg) translate(4px, -4px)" : "none",
                }}
              />
            </button>
          </div>

          {/* Desktop Navigation - Centered (Hidden on mobile) */}
          <div
            className="desktop-nav-container"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "end",
              gap: "clamp(16px, 4vw, 32px)",
              flex: 1,
            }}
          >
            {/* Desktop Navigation Links */}
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "clamp(16px, 4vw, 32px)",
              }}
            >
              <Link
                href="/"
                style={{
                  textDecoration: "none",
                  display: "inline-block",
                }}
                onClick={() => handleLinkClick("/")}
              >
                <p
                  style={{
                    fontFamily: "Inter, sans-serif",
                    fontSize: "clamp(12px, 3vw, 14px)",
                    fontWeight: "500",
                    letterSpacing: "-0.04em",
                    lineHeight: "150%",
                    color: activeLink === "/" ? "#4f6ffd" : "rgba(0,0,0,0.7)",
                    margin: 0,
                    transition: "color 0.2s ease",
                    whiteSpace: "nowrap",
                  }}
                >
                  Home
                </p>
              </Link>

              <Link
                href="/about"
                style={{
                  textDecoration: "none",
                  display: "inline-block",
                }}
                onClick={() => handleLinkClick("/about")}
              >
                <p
                  style={{
                    fontFamily: "Inter, sans-serif",
                    fontSize: "clamp(12px, 3vw, 14px)",
                    fontWeight: "500",
                    letterSpacing: "-0.04em",
                    lineHeight: "150%",
                    color: activeLink === "/about" ? "#4f6ffd" : "rgba(0,0,0,0.7)",
                    margin: 0,
                    transition: "color 0.2s ease",
                    whiteSpace: "nowrap",
                  }}
                >
                  About
                </p>
              </Link>

              {/* NEW SERVICES LINK */}
              <Link
                href="/services"
                style={{
                  textDecoration: "none",
                  display: "inline-block",
                }}
                onClick={() => handleLinkClick("/services")}
              >
                <p
                  style={{
                    fontFamily: "Inter, sans-serif",
                    fontSize: "clamp(12px, 3vw, 14px)",
                    fontWeight: "500",
                    letterSpacing: "-0.04em",
                    lineHeight: "150%",
                    color: activeLink === "/services" ? "#4f6ffd" : "rgba(0,0,0,0.7)",
                    margin: 0,
                    transition: "color 0.2s ease",
                    whiteSpace: "nowrap",
                  }}
                >
                  Services
                </p>
              </Link>

              <Link
                href="/projects"
                style={{ textDecoration: "none", display: "inline-block" }}
                onClick={() => handleLinkClick("/projects")}
              >
                <p
                  style={{
                    fontFamily: "Inter, sans-serif",
                    fontSize: "clamp(12px, 3vw, 14px)",
                    fontWeight: "500",
                    letterSpacing: "-0.04em",
                    lineHeight: "150%",
                    color: activeLink === "/projects" ? "#4f6ffd" : "rgba(0,0,0,0.7)",
                    margin: 0,
                    transition: "color 0.2s ease",
                    whiteSpace: "nowrap",
                  }}
                >
                  Projects
                </p>
              </Link>

              <Link
                href="/contact"
                style={{
                  textDecoration: "none",
                  display: "inline-block",
                }}
                onClick={() => handleLinkClick("/contact")}
              >
                <p
                  style={{
                    fontFamily: "Inter, sans-serif",
                    fontSize: "clamp(12px, 3vw, 14px)",
                    fontWeight: "500",
                    letterSpacing: "-0.04em",
                    lineHeight: "150%",
                    color: activeLink === "/contact" ? "#4f6ffd" : "rgba(0,0,0,0.7)",
                    margin: 0,
                    transition: "color 0.2s ease",
                    whiteSpace: "nowrap",
                  }}
                >
                  Contact 
                </p>
              </Link>

              <Link
                href="/blog"
                style={{
                  textDecoration: "none",
                  display: "inline-block",
                }}
                onClick={() => handleLinkClick("/blog")}
              >
                <p
                  style={{
                    fontFamily: "Inter, sans-serif",
                    fontSize: "clamp(12px, 3vw, 14px)",
                    fontWeight: "500",
                    letterSpacing: "-0.04em",
                    lineHeight: "150%",
                    color: activeLink === "/blog" ? "#4f6ffd" : "rgba(0,0,0,0.7)",
                    margin: 0,
                    transition: "color 0.2s ease",
                    whiteSpace: "nowrap",
                  }}
                >
                  Blog
                </p>
              </Link>
            </div>
            {/* Desktop Book a Call Button */}
            <div className="desktop-nav-container">
              <Link
                href="/contact"
                style={{
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "clamp(6px, 2vw, 8px) clamp(12px, 4vw, 20px)",
                  textDecoration: "none",
                  backgroundColor: "#000000",
                  borderRadius: "50px",
                  position: "relative",
                  overflow: "hidden",
                  transition: "all 0.3s ease",
                  flexShrink: 0,
                }}
                onMouseEnter={(e) => {
                  const blurText = e.currentTarget.querySelector(".blur-text");
                  const normalText = e.currentTarget.querySelector(".normal-text");
                  if (blurText && normalText) {
                    blurText.style.opacity = "1";
                    blurText.style.filter = "blur(0px)";
                    normalText.style.opacity = "0";
                    normalText.style.filter = "blur(5px)";
                  }
                }}
                onMouseLeave={(e) => {
                  const blurText = e.currentTarget.querySelector(".blur-text");
                  const normalText = e.currentTarget.querySelector(".normal-text");
                  if (blurText && normalText) {
                    blurText.style.opacity = "0";
                    blurText.style.filter = "blur(5px)";
                    normalText.style.opacity = "1";
                    normalText.style.filter = "blur(0px)";
                  }
                }}
              >
                <div
                  className="blur-text"
                  style={{
                    whiteSpace: "nowrap",
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    opacity: 0,
                    filter: "blur(5px)",
                    transition: "all 0.3s ease",
                    zIndex: 1,
                  }}
                >
                  <p
                    style={{
                      fontFamily: "Inter, sans-serif",
                      fontSize: "clamp(11px, 3vw, 14px)",
                      fontWeight: "500",
                      letterSpacing: "-0.04em",
                      lineHeight: "150%",
                      color: "#fff",
                      margin: 0,
                      whiteSpace: "nowrap",
                    }}
                  >
                    Book a call
                  </p>
                </div>
                <div
                  className="normal-text"
                  style={{
                    whiteSpace: "nowrap",
                    position: "relative",
                    opacity: 1,
                    filter: "blur(0px)",
                    transition: "all 0.3s ease",
                  }}
                >
                  <p
                    style={{
                      fontFamily: "Inter, sans-serif",
                      fontSize: "clamp(11px, 3vw, 14px)",
                      fontWeight: "500",
                      letterSpacing: "-0.04em",
                      lineHeight: "150%",
                      color: "#fff",
                      margin: 0,
                      whiteSpace: "nowrap",
                    }}
                  >
                    Book a call
                  </p>
                </div>
              </Link>
            </div>
          </div>
        </div>

        {/* Mobile Menu Overlay - Semi-transparent */}
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "transparent",
            zIndex: 40,
            opacity: isMobileMenuOpen ? 1 : 0,
            visibility: isMobileMenuOpen ? "visible" : "hidden",
            transition: "all 1s ease",
          }}
          onClick={() => setIsMobileMenuOpen(false)}
        />

        {/* Mobile Menu - Opens and closes from top-right with a 0.5 sec duration */}
        <div
          style={{
            position: "fixed",
            top: 0,
            right: 0,
            width: "100%",
            height: "fit-content",
            backgroundColor: "var(--bg-elevated)",
            borderRadius: "0 0 0 20px",
            boxShadow: "0 10px 30px rgba(0, 0, 0, 0.2)",
            transformOrigin: "top right",
            transform: isMobileMenuOpen ? "scale(1)" : "scale(0)",
            opacity: isMobileMenuOpen ? 1 : 0,
            visibility: isMobileMenuOpen ? "visible" : "hidden",
            transition: "transform 0.8s cubic-bezier(.2,.1,.92,.22), opacity 1s ease, visibility 1s ease",
            zIndex: 45,
            padding: "clamp(50px, 10vh, 70px) 20px 20px 20px",
            display: "flex",
            flexDirection: "column",
            gap: "10px",
          }}
        >
          {/* Close button inside menu */}
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            style={{
              position: "absolute",
              top: "12px",
              right: "12px",
              background: "none",
              border: "none",
              fontSize: "24px",
              cursor: "pointer",
              color: "#000000",
              padding: "4px 8px",
            }}
          >
            ✕
          </button>


          {/* Mobile Menu Links */}
          <Link
            href="/"
            style={{
              textDecoration: "none",
              padding: "10px 0",
              textAlign: "left",
            }}
            onClick={() => handleLinkClick("/")}
          >
            <p
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: "16px",
                fontWeight: "500",
                color: activeLink === "/" ? "#4f6ffd" : "rgba(0,0,0,0.7)",
                margin: 0,
                transition: "color 0.5s ease",
              }}
            >
              Home
            </p>
          </Link>

          <Link
            href="/about"
            style={{
              textDecoration: "none",
              padding: "10px 0",
              textAlign: "left",
            }}
            onClick={() => handleLinkClick("/about")}
          >
            <p
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: "16px",
                fontWeight: "500",
                color: activeLink === "/about" ? "#4f6ffd" : "rgba(0,0,0,0.7)",
                margin: 0,
                transition: "color 0.2s ease",
              }}
            >
              About
            </p>
          </Link>

          {/* NEW SERVICES LINK IN MOBILE MENU */}
          <Link
            href="/services"
            style={{
              textDecoration: "none",
              padding: "10px 0",
              textAlign: "left",
            }}
            onClick={() => handleLinkClick("/services")}
          >
            <p
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: "16px",
                fontWeight: "500",
                color: activeLink === "/services" ? "#4f6ffd" : "rgba(0,0,0,0.7)",
                margin: 0,
                transition: "color 0.2s ease",
              }}
            >
              Services
            </p>
          </Link>

          <Link
            href="/projects"
            style={{
              textDecoration: "none",
              padding: "10px 0",
              textAlign: "left",
            }}
            onClick={() => handleLinkClick("/projects")}
          >
            <p
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: "16px",
                fontWeight: "500",
                color: activeLink === "/projects" ? "#4f6ffd" : "rgba(0,0,0,0.7)",
                margin: 0,
                transition: "color 0.2s ease",
              }}
            >
              Projects
            </p>
          </Link>

          <Link
            href="/contact"
            style={{
              textDecoration: "none",
              padding: "10px 0",
              textAlign: "left",
            }}
            onClick={() => handleLinkClick("/contact")}
          >
            <p
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: "16px",
                fontWeight: "500",
                color: activeLink === "/contact" ? "#4f6ffd" : "rgba(0,0,0,0.7)",
                margin: 0,
                transition: "color 0.2s ease",
              }}
            >
              Contact
            </p>
          </Link>

          <Link
            href="/blog"
            style={{
              textDecoration: "none",
              padding: "10px 0",
              textAlign: "left",
            }}
            onClick={() => handleLinkClick("/blog")}
          >
            <p
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: "16px",
                fontWeight: "500",
                color: activeLink === "/blog" ? "#4f6ffd" : "rgba(0,0,0,0.7)",
                margin: 0,
                transition: "color 0.2s ease",
              }}
            >
              Blog
            </p>
          </Link>

          {/* Mobile Book a Call Button */}
          <Link
            href="/contact"
            style={{
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "10px 20px",
              textDecoration: "none",
              backgroundColor: "#000000",
              borderRadius: "50px",
              transition: "all 0.3s ease",
              marginTop: "8px",
              width: "100%",
            }}
            onClick={() => handleLinkClick("/contact")}
          >
            <p
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: "14px",
                fontWeight: "600",
                color: "#fff",
                margin: 0,
              }}
            >
              Book a call
            </p>
          </Link>
        </div>
      </div>

      {/* CSS for responsive hide/show */}
      <style>{`
        @media (max-width: 768px) {
          .desktop-nav-container {
            display: none !important;
          }
        }
        
        @media (min-width: 769px) {
          .desktop-nav-container {
            display: flex !important;
          }
        }
        
        /* Ensure proper button visibility */
        .mobile-menu-button {
          display: flex !important;
        }
        
        @media (min-width: 769px) {
          .mobile-menu-button {
            display: none !important;
          }
        }
      `}</style>
    </nav>
  );
}