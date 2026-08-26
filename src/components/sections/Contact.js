"use client";
import { useState, useEffect } from "react";
import { submitContact, getSiteSettings } from "@/lib/data";

const SOCIALS = [
  { key: "linkedin",  label: "LinkedIn" },
  { key: "twitter",   label: "Twitter" },
  { key: "instagram", label: "Instagram" },
  { key: "facebook",  label: "Facebook" },
  { key: "tiktok",    label: "TikTok" },
  { key: "pinterest", label: "Pinterest" },
  { key: "threads",   label: "Threads" },
  { key: "youtube",   label: "YouTube" },
];

export default function Contact() {
  const [formState, setFormState] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState("");
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    getSiteSettings()
      .then((json) => {
        if (json?.data) setSettings(json.data);
      })
      .catch(() => {});
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("sending");
    const result = await submitContact(formState);
    if (result.success) {
      setStatus("success");
      setFormState({ name: "", email: "", message: "" });
    } else {
      setStatus("error");
    }
  };

  const handleChange = (e) => setFormState({ ...formState, [e.target.name]: e.target.value });

  const activeSocials = settings
    ? SOCIALS.filter((s) => settings[s.key])
    : [];

  return (
    <section id="contact" className="py-24 overflow-hidden" style={{ backgroundColor: 'var(--bg-page)' }}>
      <div className="max-w-7xl mx-auto px-6 lg:px-10">

        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4" style={{ color: 'var(--text-primary)', fontFamily: "Syne, sans-serif" }}>
            Let&apos;s start a project together.
          </h2>
          <p className="max-w-md mx-auto" style={{ color: 'var(--text-secondary)', fontFamily: "DM Sans, sans-serif" }}>
            Have an idea or a question? Drop us a line and we&apos;ll get back to you within 24 hours.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-start">

          {/* Left: Contact Info */}
          <div className="lg:col-span-5 space-y-8" style={{ fontFamily: "DM Sans, sans-serif" }}>
            <div>
              <h3 className="text-xl font-bold mb-6" style={{ fontFamily: "Syne, sans-serif", color: 'var(--text-primary)' }}>
                Contact Info
              </h3>
<div className="space-y-6">
                {/* WhatsApp */}
                {settings?.whatsapp && (
                  <a
                    href={`https://wa.me/${settings.whatsapp.replace(/\D/g, "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 group"
                  >
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center group-hover:transition-colors" style={{ backgroundColor: 'var(--accent-success-light)', color: 'var(--accent-success)' }}>
                      <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.713-1.455L0 24zm6.59-4.846c1.66.986 3.296 1.489 4.93 1.49 5.275 0 9.56-4.283 9.564-9.56.002-2.556-.994-4.959-2.806-6.772C16.47 2.499 14.074 1.5 11.517 1.5c-5.277 0-9.562 4.287-9.565 9.564-.002 1.711.47 3.381 1.42 4.881l-.994 3.63 3.681-.965zm11.233-6.57c-.11-.183-.4-.293-.84-.513s-2.597-1.281-3.001-1.427c-.404-.146-.7-.219-.993.22-.293.438-1.135 1.427-1.391 1.72-.257.293-.514.329-.954.11-.44-.22-1.859-.685-3.54-2.186-1.309-1.168-2.193-2.611-2.45-3.05-.257-.44-.027-.677.192-.896.198-.197.44-.513.66-.77.22-.256.293-.44.44-.732.146-.293.073-.549l-.037-.769-.11-.22-.073-.256.111c5.275 0 9.56-4.283 9.564-9.56.002-2.556-.994-4.959-2.806-6.772C16.47 2.499 14.074 1.5 11.517 1.5c-5.277 0-9.562 4.287-9.565 9.564-.002 1.711.47 3.381 1.42 4.881l-.994 3.63-3.681-.965z"/>
                      </svg>
                    </div>
                    <div>
                      <div className="text-xs uppercase tracking-wider font-semibold" style={{ color: 'var(--text-tertiary)' }}>WhatsApp</div>
                      <div className="font-medium group-hover:text-brand-blue transition-colors" style={{ color: 'var(--text-primary)' }}>{settings.whatsapp}</div>
                    </div>
                  </a>
                )}

                {/* Phone */}
                {settings?.phone && (
                  <a href={`tel:${settings.phone}`} className="flex items-center gap-4 group">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center group-hover:transition-colors" style={{ backgroundColor: 'var(--accent-warning)', color: 'var(--text-inverse)', opacity: 0.9 }}>
                      <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                      </svg>
                    </div>
                    <div>
                      <div className="text-xs uppercase tracking-wider font-semibold" style={{ color: 'var(--text-tertiary)' }}>Phone</div>
                      <div className="font-medium group-hover:text-brand-blue transition-colors" style={{ color: 'var(--text-primary)' }}>{settings.phone}</div>
                    </div>
                  </a>
                )}

                {/* Email */}
                {settings?.email && (
                  <a href={`mailto:${settings.email}`} className="flex items-center gap-4 group">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center group-hover:transition-colors" style={{ backgroundColor: 'var(--brand-blue-soft)', color: 'var(--brand-blue-primary)' }}>
                      <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                      </svg>
                    </div>
                    <div>
                      <div className="text-xs uppercase tracking-wider font-semibold" style={{ color: 'var(--text-tertiary)' }}>Email</div>
                      <div className="font-medium group-hover:text-brand-blue transition-colors" style={{ color: 'var(--text-primary)' }}>{settings.email}</div>
                    </div>
                  </a>
                )}

                {/* Address */}
{settings?.address && (
                   <div className="flex items-center gap-4">
                     <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'var(--accent-warning)', opacity: 0.9, color: 'var(--text-inverse)' }}>
                       <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                         <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                         <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                       </svg>
                     </div>
                     <div>
                       <div className="text-xs uppercase tracking-wider font-semibold" style={{ color: 'var(--text-tertiary)' }}>Address</div>
                       <div className="font-medium" style={{ color: 'var(--text-primary)' }}>{settings.address}</div>
                     </div>
                   </div>
                 )}
               </div>
             </div>

             {/* Social Links — only show ones that have a URL */}
             {activeSocials.length > 0 && (
               <div>
                 <h4 className="text-sm font-semibold uppercase tracking-wider mb-4" style={{ color: 'var(--text-tertiary)' }}>Follow Us</h4>
                 <div className="flex flex-wrap gap-3">
                   {activeSocials.map((s) => (
                     <a
                       key={s.key}
                       href={settings[s.key]}
                       target="_blank"
                       rel="noopener noreferrer"
                       className="px-4 py-2 text-sm font-medium rounded-xl transition-all"
                       style={{ color: 'var(--text-secondary)', borderColor: 'var(--border-light)' }}
                     >
                       {s.label}
                     </a>
                   ))}
                 </div>
               </div>
             )}
           </div>

           {/* Right: Form */}
           <div className="lg:col-span-7 rounded-3xl p-8 lg:p-10 border" style={{ backgroundColor: 'var(--bg-elevated)', borderColor: 'var(--border-light)' }}>
             <form onSubmit={handleSubmit} className="space-y-6">
               <div>
                 <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>Your Name</label>
                 <input
                   type="text" name="name" required value={formState.name} onChange={handleChange}
                   className="w-full px-5 py-3 bg-white border rounded-xl focus:outline-none focus:ring-1 transition-all"
                   style={{ borderColor: 'var(--border-light)', color: 'var(--text-primary)' }}
                   placeholder="John Doe"
                 />
               </div>
               <div>
                 <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>Email Address</label>
                 <input
                   type="email" name="email" required value={formState.email} onChange={handleChange}
                   className="w-full px-5 py-3 bg-white border rounded-xl focus:outline-none focus:ring-1 transition-all"
                   style={{ borderColor: 'var(--border-light)', color: 'var(--text-primary)' }}
                   placeholder="john@example.com"
                 />
               </div>
               <div>
                 <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>Your Message</label>
                 <textarea
                   name="message" required rows="5" value={formState.message} onChange={handleChange}
                   className="w-full px-5 py-3 bg-white border rounded-xl focus:outline-none focus:ring-1 transition-all resize-none"
                   style={{ borderColor: 'var(--border-light)', color: 'var(--text-primary)' }}
                   placeholder="Tell us details about your project timeline and vision..."
                 />
               </div>
               <button
                 type="submit" disabled={status === "sending"}
                 className="w-full py-4 px-6 rounded-xl font-semibold transition-all"
                 style={{ backgroundColor: 'var(--brand-black)', color: 'var(--text-inverse)' }}
               >
                 {status === "sending" ? "Processing..." : status === "success" ? "Message Sent! ✓" : "Send Message"}
               </button>
               {status === "success" && (
                 <p className="text-sm text-center font-medium" style={{ color: 'var(--accent-success)' }}>Thank you! Your message has safely made it to our inbox.</p>
               )}
               {status === "error" && (
                 <p className="text-sm text-center font-medium" style={{ color: 'var(--accent-error)' }}>Something went wrong. Please try again.</p>
               )}
             </form>
           </div>

        </div>
      </div>
    </section>
  );
}
