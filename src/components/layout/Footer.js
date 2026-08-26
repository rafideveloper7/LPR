import Link from 'next/link'

const footerLinks = {
  Company: [
    { label: 'Home', href: '/' },
    { label: 'About Us', href: '/about' },
    { label: 'Services', href: '/services' },
    { label: 'Case Studies', href: '/case-studies' },
  ],
  Resources: [
    { label: 'Blog', href: '/blog' },
    { label: 'Articles', href: '/blog' },
    { label: 'Documentation', href: '/docs' },
    { label: 'Support', href: '/support' },
  ],
  Legal: [
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms of Service', href: '/terms' },
    { label: 'Cookie Policy', href: '/cookies' },
    { label: 'GDPR', href: '/gdpr' },
  ],
}

const socials = [
  {
    label: 'LinkedIn',
    href: '#',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z" />
        <circle cx="4" cy="4" r="2" />
      </svg>
    ),
  },
  {
    label: 'Twitter',
    href: '#',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" />
      </svg>
    ),
  },
  {
    label: 'GitHub',
    href: '#',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 00-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0020 4.77 5.07 5.07 0 0019.91 1S18.73.65 16 2.48a13.38 13.38 0 00-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 005 4.77a5.44 5.44 0 00-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 009 18.13V22" />
      </svg>
    ),
  },
]

export default function Footer() {
  return (
    <footer style={{ backgroundColor: 'var(--bg-surface-alt)', borderTop: `1px solid var(--border-light)` }}>
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-16">
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-5 gap-x-8 gap-y-10">
          
          {/* Brand Column */}
          <div className="col-span-2 md:col-span-2 lg:col-span-2">
            <Link href="/" className="flex items-center gap-3 mb-5">
              
              <span
                className="font-bold text-2xl"
                style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, color: 'var(--text-primary)' }}
              >
                LUUPULSE
              </span>
            </Link>
            <p
              className="text-sm leading-relaxed mb-6 max-w-sm"
              style={{ fontFamily: 'DM Sans, sans-serif', color: 'var(--text-secondary)' }}
            >
              Building exceptional digital experiences for forward-thinking companies worldwide.
            </p>
            
            {/* Social Links */}
            {/* <div className="flex gap-2">
              {socials.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="w-9 h-9 rounded-lg border flex items-center justify-center transition-all duration-200"
                  style={{ borderColor: 'var(--border-light)', color: 'var(--text-secondary)' }}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {social.icon}
                </a>
              ))}
            </div> */}
          </div>

          {/* Link Columns */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4
                className="font-semibold text-sm mb-4 tracking-wide"
                style={{ fontFamily: 'Syne, sans-serif', fontWeight: 600, color: 'var(--text-primary)' }}
              >
                {title}
              </h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm transition-colors duration-200"
                      style={{ fontFamily: 'DM Sans, sans-serif', color: 'var(--text-secondary)' }}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Bar */}
      <div style={{ borderTop: `1px solid var(--border-light)` }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-6 text-center">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p
              className="text-xs"
              style={{ fontFamily: 'DM Sans, sans-serif', color: 'var(--text-disabled)' }}
            >
              © {new Date().getFullYear()} LPR Agency. All rights reserved.
            </p>
            <div className="flex gap-6">
              <Link href="/privacy" className="text-xs transition-colors" style={{ color: 'var(--text-disabled)' }}>
                Privacy
              </Link>
              <Link href="/terms" className="text-xs transition-colors" style={{ color: 'var(--text-disabled)' }}>
                Terms
              </Link>
              <Link href="/sitemap" className="text-xs transition-colors" style={{ color: 'var(--text-disabled)' }}>
                Sitemap
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}