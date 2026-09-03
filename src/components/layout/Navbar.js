"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/projects", label: "Projects" },
  { href: "/contact", label: "Contact" },
  { href: "/blog", label: "Blog" },
];

export default function Navbar() {
  const [activeLink, setActiveLink] = useState("/");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const menuRef = useRef(null);

  useEffect(() => {
    setActiveLink(pathname);
  }, [pathname]);

  // Close the dropdown when clicking outside of it
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLinkClick = (link) => {
    setActiveLink(link);
    setIsMenuOpen(false);
  };

  return (
    <nav
      style={{
        position: "fixed",
        top: "20px",
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 999,
      }}
      ref={menuRef}
    >
      {/* The Pill */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "16px",
          backgroundColor: "#BFDBFE",
          borderRadius: "50px",
          padding: "8px 8px 8px 20px",
          minWidth: "260px",
          boxShadow: "0 8px 24px rgba(30,58,138,0.18)",
        }}
      >
        {/* Left: Logo */}
        <Link
          href="/"
          style={{
            display: "flex",
            alignItems: "center",
            textDecoration: "none",
          }}
          onClick={() => handleLinkClick("/")}
        >
          <img
            src="https://res.cloudinary.com/dtsn7jlsf/image/upload/v1787637175/Black_and_Red_Clean_Bold_Signature_Typography_Logo__2___1___1_-removebg-preview_b2nevr.png"
            alt="Logo"
            style={{
              height: "30px",
              width: "auto",
              objectFit: "contain",
              filter: "brightness(0)", // renders the logo black/dark for contrast on the light blue pill
            }}
          />
        </Link>

        {/* Right: circular "..." toggle button */}
        <button
          onClick={() => setIsMenuOpen((prev) => !prev)}
          aria-label="Toggle menu"
          aria-expanded={isMenuOpen}
          style={{
            width: "34px",
            height: "34px",
            borderRadius: "50%",
            backgroundColor: "#1E3A8A",
            border: "none",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            transition: "transform 0.2s ease",
            transform: isMenuOpen ? "rotate(90deg)" : "rotate(0deg)",
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <circle cx="5" cy="12" r="2" fill="#fff" />
            <circle cx="12" cy="12" r="2" fill="#fff" />
            <circle cx="19" cy="12" r="2" fill="#fff" />
          </svg>
        </button>
      </div>

      {/* Dropdown menu */}
      <div
        style={{
          position: "absolute",
          top: "calc(100% + 10px)",
          right: 0,
          width: "220px",
          backgroundColor: "#BFDBFE",
          borderRadius: "20px",
          boxShadow: "0 12px 30px rgba(30,58,138,0.2)",
          padding: "14px",
          display: "flex",
          flexDirection: "column",
          gap: "4px",
          opacity: isMenuOpen ? 1 : 0,
          visibility: isMenuOpen ? "visible" : "hidden",
          transform: isMenuOpen ? "translateY(0)" : "translateY(-8px)",
          transition: "opacity 0.25s ease, transform 0.25s ease, visibility 0.25s ease",
        }}
      >
        {NAV_LINKS.map(({ href, label }) => (
          <Link
            key={href}
            href={href}
            onClick={() => handleLinkClick(href)}
            style={{
              textDecoration: "none",
              padding: "10px 12px",
              borderRadius: "10px",
              backgroundColor:
                activeLink === href ? "rgba(30,58,138,0.1)" : "transparent",
            }}
          >
            <p
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: "14px",
                fontWeight: "500",
                letterSpacing: "-0.02em",
                margin: 0,
                color: activeLink === href ? "#1D4ED8" : "rgba(15,23,42,0.75)",
                transition: "color 0.2s ease",
              }}
            >
              {label}
            </p>
          </Link>
        ))}

        {/* Book a call button */}
        <Link
          href="/contact"
          onClick={() => handleLinkClick("/contact")}
          style={{
            marginTop: "8px",
            textDecoration: "none",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "10px 16px",
            backgroundColor: "#1E3A8A",
            borderRadius: "50px",
          }}
        >
          <p
            style={{
              fontFamily: "Inter, sans-serif",
              fontSize: "14px",
              fontWeight: "600",
              margin: 0,
              color: "#ffffff",
            }}
          >
            Book a call
          </p>
        </Link>
      </div>
    </nav>
  );
}
