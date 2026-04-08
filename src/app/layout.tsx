import type { Metadata } from 'next'
import './globals.css'
import Navbar from '@/components/shared/Navbar'
import AuthBridge from '@/components/shared/AuthBridge'

export const metadata: Metadata = {
  title: 'UPSCPATH Prelims — Gamified UPSC Practice',
  description: 'Master the UPSC Civil Services Preliminary Exam through gamified MCQ sessions, live leaderboards, and visual progress tracking.',
  openGraph: {
    title: 'UPSCPATH Prelims',
    description: 'Gamified UPSC Prelims practice with leaderboards',
    type: 'website',
  },
}

/**
 * Standalone root layout — used when running this app independently.
 *
 * When embedding into upscpath.com:
 *   1. Delete this file entirely.
 *   2. Place src/app as a route group under upscpath.com's app directory,
 *      e.g. app/(prelims)/layout.tsx — that layout becomes PrelimsSegmentLayout below.
 *   3. Remove <html>/<head>/<body> (parent owns those).
 *   4. Remove Google Fonts links (parent already loads them).
 *   5. Remove <Navbar /> if parent provides its own navigation.
 *
 * The .prelims-root wrapper and AuthBridge should be kept in all modes.
 */
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Fonts — remove these when embedding; parent app loads them */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=Inter:wght@400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        {/* .prelims-root scopes all CSS tokens — keep this in both standalone and embedded modes */}
        <div className="prelims-root min-h-screen">
          {/* Navbar — swap for parent's <NavBar /> when embedding */}
          <Navbar />
          {/* AuthBridge seeds the game store from Supabase auth — always keep */}
          <AuthBridge />
          <main className="pt-12 min-h-screen">{children}</main>
        </div>
      </body>
    </html>
  )
}

/**
 * EMBEDDED SEGMENT LAYOUT (copy-paste into upscpath.com)
 * -------------------------------------------------------
 * Place this as app/(prelims)/layout.tsx inside upscpath.com.
 * Import globals.css from this package (or merge into parent's globals).
 *
 * export default function PrelimsSegmentLayout({ children }: { children: React.ReactNode }) {
 *   return (
 *     <div className="prelims-root">
 *       <AuthBridge />
 *       <main>{children}</main>
 *     </div>
 *   )
 * }
 */
