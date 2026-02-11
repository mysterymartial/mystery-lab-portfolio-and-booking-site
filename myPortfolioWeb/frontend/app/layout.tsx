import type { Metadata } from 'next'
import './globals.css'
import Providers from '@/components/Providers'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import FloatingChatButton from '@/components/FloatingChatButton'
import Analytics from '@/components/Analytics'

export const metadata: Metadata = {
  title: 'Agbaosi Bolarinwa Minasu (Mystery) - Portfolio & Gig Booking',
  description: 'CEO of Mystery Lab & CTO of ALO LABS - Fullstack Software Engineer, Embedded Systems Engineer, Fintech & Blockchain Expert. Available for employer contracts & full-time roles. Cybersecurity, DevOps, ML | Musician | Martial Artist',
  keywords: 'Fullstack Developer, Embedded Systems Engineer, Fintech, Blockchain, Web3, Cybersecurity, DevOps, Machine Learning, Musician, Martial Artist, Portfolio, Gig Booking, Hire, Contract',
  authors: [{ name: 'Agbaosi Bolarinwa Minasu (Mystery)' }],
  openGraph: {
    title: 'Agbaosi Bolarinwa Minasu (Mystery) - Portfolio & Gig Booking',
    description: 'CEO of Mystery Lab & CTO of ALO LABS - Fullstack Software Engineer, Embedded Systems Engineer',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <head>
        <meta name="format-detection" content="telephone=no, date=no, email=no, address=no" />
      </head>
      <body className="min-h-screen overflow-x-hidden antialiased" style={{ backgroundColor: '#0a0e27' }} suppressHydrationWarning>
        <Analytics />
        <Providers>
          <Header />
          <main className="pt-16 sm:pt-20 md:pt-20">{children}</main>
          <Footer />
          <FloatingChatButton />
        </Providers>
      </body>
    </html>
  )
}
