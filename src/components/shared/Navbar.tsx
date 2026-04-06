'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Zap, BookOpen, LayoutDashboard, BarChart3 } from 'lucide-react'
import { useGameStore } from '@/lib/store/gameStore'
import { LEVEL_TITLES } from '@/lib/game/levels'
import clsx from 'clsx'

const NAV_LINKS = [
  { href: '/',            label: 'Dashboard', Icon: LayoutDashboard },
  { href: '/prelims',     label: 'Play',      Icon: BookOpen },
  { href: '/leaderboard', label: 'Ranks',     Icon: BarChart3 },
]

export default function Navbar() {
  const pathname    = usePathname()
  const userStats   = useGameStore(s => s.userStats)

  const level       = userStats?.level ?? 1
  const totalXp     = userStats?.totalXp ?? 0
  const displayName = userStats?.displayName ?? 'Aspirant'
  const levelTitle  = LEVEL_TITLES[level] ?? 'Aspirant'
  const avatarSeed  = encodeURIComponent(displayName)

  return (
    <nav className="sticky top-0 z-50 w-full backdrop-blur-xl"
      style={{ background: 'color-mix(in oklab, var(--bg) 90%, transparent)', borderBottom: '1px solid var(--border)' }}>
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 select-none group">
          <span className="font-heading text-xl font-normal group-hover:opacity-80 transition-opacity"
            style={{ color: 'var(--text)' }}>
            UPSCPATH
          </span>
          <span className="rounded-md px-2 py-0.5 text-[9px] font-black uppercase tracking-widest border"
            style={{ color: 'var(--amber)', background: 'var(--amber-tint)', borderColor: 'color-mix(in oklab, var(--amber) 25%, transparent)' }}>
            PRELIMS
          </span>
        </Link>

        {/* Nav pill group */}
        <div className="hidden md:flex items-center gap-0.5 p-1 rounded-xl border"
          style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
          {NAV_LINKS.map(({ href, label, Icon }) => {
            const active = pathname === href || (href !== '/' && pathname.startsWith(href))
            return (
              <Link key={href} href={href}
                className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-sm font-semibold transition-all duration-150"
                style={{
                  background:   active ? 'var(--elevated)' : 'transparent',
                  color:        active ? 'var(--text)'     : 'var(--text-3)',
                  boxShadow:    active ? '0 1px 3px color-mix(in oklab, var(--text) 10%, transparent)' : 'none',
                }}>
                <Icon size={13} />
                {label}
              </Link>
            )
          })}
        </div>

        {/* Right: XP + avatar */}
        <div className="flex items-center gap-2">
          {/* XP pill */}
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl border"
            style={{ background: 'var(--amber-tint)', borderColor: 'color-mix(in oklab, var(--amber) 25%, transparent)' }}>
            <Zap size={12} style={{ color: 'var(--amber)', fill: 'var(--amber)' }} />
            <span className="text-xs font-bold tabular-nums" style={{ color: 'var(--amber)' }}>
              {totalXp.toLocaleString()} XP
            </span>
          </div>

          {/* Avatar + level */}
          <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl border"
            style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
            <div className="relative shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`https://api.dicebear.com/7.x/initials/svg?seed=${avatarSeed}&backgroundColor=3c5d4d&textColor=ffffff`}
                alt={displayName}
                width={28}
                height={28}
                className="rounded-full"
                style={{ border: '1.5px solid var(--border)' }}
              />
              <span className="absolute -bottom-1 -right-1 text-[8px] font-black rounded-full w-3.5 h-3.5 flex items-center justify-center leading-none"
                style={{ background: 'var(--amber)', color: 'var(--amber-on)', border: '1.5px solid var(--bg)' }}>
                {level}
              </span>
            </div>
            <div className="hidden sm:block leading-tight">
              <p className="text-xs font-bold" style={{ color: 'var(--text)' }}>{displayName.split(' ')[0]}</p>
              <p className="text-[9px]" style={{ color: 'var(--text-3)' }}>{levelTitle}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile bottom nav */}
      <div className="flex md:hidden border-t" style={{ borderColor: 'var(--border)' }}>
        {NAV_LINKS.map(({ href, label, Icon }) => {
          const active = pathname === href || (href !== '/' && pathname.startsWith(href))
          return (
            <Link key={href} href={href}
              className="flex-1 flex flex-col items-center gap-0.5 py-2.5 text-[10px] font-semibold transition-colors"
              style={{ color: active ? 'var(--accent)' : 'var(--text-3)' }}>
              <Icon size={16} />
              {label}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
