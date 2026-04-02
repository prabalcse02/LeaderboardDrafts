import type { Metadata } from 'next'
import './globals.css'
import Navbar from '@/components/shared/Navbar'

export const metadata: Metadata = {
  title: 'UPSCPATH Prelims — Gamified UPSC Practice',
  description: 'Master the UPSC Civil Services Preliminary Exam through gamified MCQ sessions, live leaderboards, and visual progress tracking.',
  openGraph: {
    title: 'UPSCPATH Prelims',
    description: 'Gamified UPSC Prelims practice with leaderboards',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen">
        <Navbar />
        <main className="pt-16 min-h-screen">{children}</main>
      </body>
    </html>
  )
}
