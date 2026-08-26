export default function PrivacyPage() {
  return (
    <main className="pt-20 min-h-screen" style={{ backgroundColor: 'var(--bg-page)' }}>
      <div className="max-w-3xl mx-auto px-6 py-16">
        <h1
          className="text-3xl lg:text-4xl font-bold mb-6"
          style={{ fontFamily: 'Syne, sans-serif', color: 'var(--text-primary)' }}
        >
          Privacy Policy
        </h1>
        <div className="space-y-4 leading-relaxed" style={{ fontFamily: 'DM Sans, sans-serif', color: 'var(--text-secondary)' }}>
          <p>
            LPR Agency respects your privacy. This page explains how we collect, use, and protect
            information when you visit our website or contact us.
          </p>
          <p>
            We may collect contact details you submit through our forms, such as your name, email
            address, and message content. We use this information only to respond to inquiries
            and improve our services.
          </p>
          <p>
            We do not sell personal information. If you have questions about this policy, please
            contact us through our contact page.
          </p>
        </div>
      </div>
    </main>
  )
}