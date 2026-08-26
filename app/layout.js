import '../src/styles/globals.css'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'

export const metadata = {
  title: 'LPR Agency — Turning Ideas Into Masterpieces',
  description: 'We combine story design along with next-world assessment, many ideas shaped to deliver purpose into structure. Brand strategy, graphic design, web development & creative consulting.',
  keywords: 'design agency, brand strategy, web development, creative consulting, graphic design',
  openGraph: {
    title: 'LPR Agency — Turning Ideas Into Masterpieces',
    description: 'Expert creative agency blending creativity with technical precision.',
    type: 'website',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  )
}
