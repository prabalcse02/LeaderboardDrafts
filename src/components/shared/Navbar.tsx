'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { BookOpen, ChevronDown } from 'lucide-react'
import { useGameStore } from '@/lib/store/gameStore'
import { LEVEL_TITLES } from '@/lib/game/levels'
import { ROUTES, BASE } from '@/lib/config'

const NAV_ITEMS = [
  { label: 'Dashboard', href: ROUTES.dashboard },
  { label: 'Play',      href: ROUTES.prelims },
  { label: 'Ranks',     href: ROUTES.leaderboard },
]

export default function Navbar() {
  const pathname    = usePathname()
  const userStats   = useGameStore(s => s.userStats)

  const level       = userStats?.level ?? 1
  const totalXp     = userStats?.totalXp ?? 0
  const displayName = userStats?.displayName ?? 'Aspirant'
  const avatarSeed  = encodeURIComponent(displayName)

  function isActive(href: string) {
    const rel = href.replace(BASE, '') || '/'
    const cur = pathname.replace(BASE, '') || '/'
    return rel === '/' ? cur === '/' : cur.startsWith(rel)
  }

  return (
    <nav
      className="sticky top-0 z-50 w-full"
      style={{ background: 'var(--elevated)', borderBottom: '1px solid var(--border)' }}
    >
      <div className="mx-auto flex max-w-screen-lg items-center justify-between px-5 h-12">

        {/* ── Logo ─────────────────────────────────────────────────── */}
        <Link href={ROUTES.dashboard} className="flex items-center gap-2 select-none shrink-0">
          <BookOpen size={16} style={{ color: 'var(--text-2)' }} />
          <span className="text-sm font-semibold tracking-tight" style={{ color: 'var(--text)' }}>
            UPSC Path
          </span>
          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded"
            style={{ background: 'var(--amber-tint)', color: 'var(--amber)' }}>
            PRELIMS
          </span>
        </Link>

        {/* ── Nav links ────────────────────────────────────────────── */}
        <div className="hidden md:flex items-center gap-1">
          {NAV_ITEMS.map(({ label, href }) => {
            const active = isActive(href)
            return (
              <Link key={href} href={href}
                className="flex items-center gap-0.5 px-3 py-1.5 rounded-md text-sm transition-colors"
                style={{
                  color:      active ? 'var(--text)' : 'var(--text-3)',
                  fontWeight: active ? 600 : 400,
                  background: active ? 'var(--surface)' : 'transparent',
                }}>
                {label}
                {href === ROUTES.prelims && <ChevronDown size={12} className="ml-0.5 opacity-50" />}
              </Link>
            )
          })}
        </div>

        {/* ── Right side ───────────────────────────────────────────── */}
        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-1 px-3 py-1 rounded-full text-xs border"
            style={{ color: 'var(--text-2)', borderColor: 'var(--border)', background: 'var(--elevated)' }}>
            <span className="font-semibold tabular-nums">{totalXp.toLocaleString()}</span>
            <span style={{ color: 'var(--text-3)' }}>XP</span>
          </div>

          <button className="flex items-center gap-2 px-2.5 py-1 rounded-full text-sm border transition-colors"
            style={{ background: 'var(--elevated)', borderColor: 'var(--border)', color: 'var(--text)' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`https://api.dicebear.com/7.x/initials/svg?seed=${avatarSeed}&backgroundColor=3c5d4d&textColor=ffffff`}
              alt={displayName} width={20} height={20} className="rounded-full shrink-0"
            />
            <span className="hidden sm:inline font-medium text-xs">{displayName.split(' ')[0]}</span>
            <ChevronDown size={11} className="opacity-40" />
          </button>
        </div>
      </div>

      {/* ── Mobile bottom nav ─────────────────────────────────────── */}
      <div className="flex md:hidden border-t" style={{ borderColor: 'var(--border)' }}>
        {NAV_ITEMS.map(({ label, href }) => {
          const active = isActive(href)
          return (
            <Link key={href} href={href}
              className="flex-1 flex flex-col items-center gap-0.5 py-2 text-[10px] font-semibold transition-colors"
              style={{ color: active ? 'var(--amber)' : 'var(--text-3)' }}>
              {label}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
