"use client";

import { useEffect, useRef, useState } from "react";
import { getGallery } from "@/lib/data";

export default function Gallery() {
  const sectionRef = useRef(null);
  const [gallery, setGallery] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadGallery = async () => {
      try {
        const res = await getGallery();
        if (res?.data) setGallery(res.data);
      } catch {
        setGallery({ title: "Gallery", items: [] });
      } finally {
        setLoading(false);
      }
    };
    loadGallery();
  }, []);

  if (loading) {
    return (
      <section
        ref={sectionRef}
        className="py-24"
        style={{ backgroundColor: "var(--bg-surface)" }}
      >
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </section>
    );
  }

  if (!gallery) return null;

  return (
    <section
      ref={sectionRef}
      id="gallery"
      className="py-24"
      style={{ backgroundColor: "var(--bg-surface)" }}
    >
      <div className="max-w-6xl mx-auto px-6 lg:px-10">
        <div className="text-center mb-14 reveal">
          <h2
            className="text-3xl lg:text-4xl font-bold mb-4"
            style={{ fontFamily: "Syne, sans-serif", fontWeight: 700, color: "var(--text-primary)" }}
          >
            {gallery.title || "Gallery"}
          </h2>
          <p
            className="text-lg"
            style={{ fontFamily: "DM Sans, sans-serif", color: "var(--text-secondary)" }}
          >
            A showcase of our work and moments
          </p>
        </div>

        {gallery.items?.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {gallery.items.map((item, index) => {
              const isVideo = item.type === "video" || item.url?.match(/\.(mp4|webm|ogg|mov)/i);
              const isGif = item.type === "gif" || item.url?.match(/\.(gif)/i);

              return (
                <div
                  key={index}
                  className="relative rounded-2xl overflow-hidden shadow-md group"
                  style={{ aspectRatio: "4/3" }}
                >
                  {isVideo ? (
                    <video
                      src={item.url}
                      controls
                      className="w-full h-full object-cover"
                      style={{ objectFit: "cover" }}
                    />
                  ) : (
                    <img
                      src={item.url}
                      alt={item.caption || `Gallery item ${index + 1}`}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      style={{ objectFit: "cover" }}
                    />
                  )}
                  {item.caption && (
                    <div
                      className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent"
                      style={{ color: "white" }}
                    >
                      <p
                        className="text-sm font-medium"
                        style={{ fontFamily: "DM Sans, sans-serif" }}
                      >
                        {item.caption}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div
            className="text-center py-16 rounded-2xl border-2 border-dashed"
            style={{ borderColor: "var(--border-light)" }}
          >
            <p style={{ color: "var(--text-secondary)", fontFamily: "DM Sans, sans-serif" }}>
              No gallery items yet. Add some from the admin panel.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
