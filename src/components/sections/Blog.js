'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { getBlogs } from '@/lib/data';

function formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function BlogCard({ post, index }) {
  return (
    <article
      className="reveal group cursor-pointer"
      style={{ transitionDelay: `${index * 0.1}s` }}
    >
      <Link href={`/blog/${post._id || post.id}`} className="block h-full text-inherit no-underline">
        <div
          className="rounded-2xl overflow-hidden h-full flex flex-col transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl"
          style={{
            backgroundColor: 'var(--bg-elevated)',
            border: '1px solid var(--border-subtle)',
          }}
        >
          <div className="relative overflow-hidden aspect-[16/10] bg-gray-100">
            {post.image ? (
              <img
                src={post.image}
                alt={post.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-4xl opacity-30">
                📰
              </div>
            )}
            {post.category && (
              <div className="absolute top-3.5 left-3.5">
                <span
                  className="bg-white/95 backdrop-blur-md text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm"
                  style={{ fontFamily: 'DM Sans, sans-serif', color: 'var(--text-primary)' }}
                >
                  {post.category}
                </span>
              </div>
            )}
          </div>

          <div className="p-6 flex flex-col flex-grow">
            <div
              className="flex items-center gap-2 text-xs mb-2.5"
              style={{ color: 'var(--text-tertiary)', fontFamily: 'DM Sans, sans-serif' }}
            >
              {post.date && <span>{formatDate(post.date)}</span>}
              {post.date && post.readTime && <span>•</span>}
              {post.readTime && <span>{post.readTime}</span>}
            </div>

            <h3
              className="text-lg font-semibold leading-snug mb-2.5 transition-colors group-hover:text-brand-blue"
              style={{ fontFamily: 'Syne, sans-serif', color: 'var(--text-primary)' }}
            >
              {post.title}
            </h3>

            {post.excerpt && (
              <p
                className="text-xs leading-relaxed line-clamp-2 mb-4 flex-grow"
                style={{ fontFamily: 'DM Sans, sans-serif', color: 'var(--text-secondary)' }}
              >
                {post.excerpt}
              </p>
            )}

            <div className="pt-3 border-t flex items-center justify-between" style={{ borderColor: 'var(--border-subtle)' }}>
              <span
                className="text-xs font-bold inline-flex items-center gap-1 group-hover:gap-2 transition-all"
                style={{ color: 'var(--brand-blue-primary)', fontFamily: 'DM Sans, sans-serif' }}
              >
                Read Article <span>→</span>
              </span>
            </div>
          </div>
        </div>
      </Link>
    </article>
  );
}

export default function Blog() {
  const ref = useRef(null);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    getBlogs()
      .then((res) => {
        if (res?.data) setPosts(res.data.slice(0, 3));
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const els = ref.current?.querySelectorAll('.reveal');
    if (!els) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [posts]);

  if (posts.length === 0) return null;

  return (
    <section id="blog" ref={ref} className="py-24" style={{ backgroundColor: 'var(--bg-page)' }}>
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        {/* Header */}
        <div className="reveal text-center mb-16">
          <p
            className="text-xs font-bold uppercase tracking-widest mb-3"
            style={{ color: 'var(--brand-blue-primary)', fontFamily: 'DM Sans, sans-serif' }}
          >
            Insights & Perspectives
          </p>
          <h2
            className="text-3xl lg:text-5xl font-light"
            style={{ fontFamily: 'Syne, sans-serif', color: 'var(--text-primary)' }}
          >
            Latest from our Journal
          </h2>
          <div className="w-16 h-0.5 bg-brand-blue mx-auto mt-4" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post, i) => (
            <BlogCard key={post._id || post.id} post={post} index={i} />
          ))}
        </div>

        {/* View all */}
        <div className="mt-14 text-center">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full text-sm font-semibold transition-all hover:scale-105"
            style={{
              backgroundColor: 'var(--bg-elevated)',
              border: '1.5px solid var(--border-light)',
              color: 'var(--text-primary)',
              fontFamily: 'DM Sans, sans-serif',
            }}
          >
            Explore All Articles <span>→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
