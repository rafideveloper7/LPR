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
      className="w-full"
      style={{ backgroundColor: "var(--bg-page)" }}
    >
      <div className="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl py-16 sm:py-20 lg:py-24">
        <div className="text-center mb-12 sm:mb-16">
          <h2
            className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4"
            style={{
              color: "var(--text-primary)",
              fontFamily: "'Syne', sans-serif",
              fontWeight: 300,
            }}
          >
            Our Services
          </h2>
          <div className="w-16 sm:w-20 h-1 bg-brand-blue mx-auto"></div>
        </div>

        <div className="flex flex-col items-center gap-4 sm:gap-6">
          {services.map((service, idx) => {
            const slug = slugify(service.title);

            return (
              <Link
                key={service._id || service.id}
                href={`/services/${slug}`}
                className="group text-center transition-all duration-300"
                style={{
                  color: "var(--text-primary)",
                }}
              >
                <h3
                  className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-bold tracking-tight transition-all duration-300 group-hover:text-brand-blue"
                  style={{
                    fontFamily: "'Syne', sans-serif",
                    lineHeight: 1.2,
                  }}
                >
                  {service.title}
                </h3>
              </Link>
            );
          })}
        </div>

        <div className="text-center mt-12 sm:mt-16">
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