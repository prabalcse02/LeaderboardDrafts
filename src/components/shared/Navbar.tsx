'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Zap } from 'lucide-react'
import { useGameStore } from '@/lib/store/gameStore'
import { LEVEL_TITLES } from '@/lib/game/levels'
import clsx from 'clsx'

const NAV_LINKS = [
  { href: '/', label: 'Dashboard' },
  { href: '/prelims', label: 'Play' },
  { href: '/leaderboard', label: 'Leaderboard' },
]

export default function Navbar() {
  const pathname = usePathname()
  const userStats = useGameStore((s) => s.userStats)

  const level = userStats?.level ?? 1
  const totalXp = userStats?.totalXp ?? 0
  const displayName = userStats?.displayName ?? 'Aspirant'
  const levelTitle = LEVEL_TITLES[level] ?? 'Aspirant'
  const avatarSeed = encodeURIComponent(displayName)

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-white/10 bg-navy-950/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 select-none">
          <span className="text-xl font-extrabold tracking-tight text-saffron-500">
            UPSCPATH
          </span>
          <span className="rounded-md bg-saffron-500/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-saffron-400 border border-saffron-500/30">
            PRELIMS
          </span>
        </Link>

        {/* Nav links — center */}
        <div className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map(({ href, label }) => {
            const active = pathname === href || (href !== '/' && pathname.startsWith(href))
            return (
              <Link
                key={href}
                href={href}
                className={clsx(
                  'px-4 py-1.5 rounded-lg text-sm font-medium transition-colors duration-150',
                  active
                    ? 'bg-white/10 text-white'
                    : 'text-white/50 hover:text-white hover:bg-white/5'
                )}
              >
                {label}
              </Link>
            )
          })}
        </div>

        {/* Right: XP + level + avatar */}
        <div className="flex items-center gap-3">
          {/* XP pill */}
          <div className="hidden sm:flex items-center gap-1.5 rounded-full bg-saffron-500/10 border border-saffron-500/20 px-3 py-1">
            <Zap className="w-3.5 h-3.5 text-saffron-400 fill-saffron-400" />
            <span className="text-sm font-bold text-saffron-300">
              {totalXp.toLocaleString()}
            </span>
            <span className="text-xs text-white/40">XP</span>
          </div>

          {/* Level badge */}
          <div className="hidden sm:flex items-center gap-1.5 rounded-full bg-navy-800/60 border border-white/10 px-3 py-1">
            <span className="text-xs font-bold text-white/80">Lv.{level}</span>
            <span className="text-xs text-white/40">{levelTitle}</span>
          </div>

          {/* Avatar */}
          <div className="relative">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`https://api.dicebear.com/7.x/initials/svg?seed=${avatarSeed}&backgroundColor=1a3de4&textColor=ffffff`}
              alt={displayName}
              width={36}
              height={36}
              className="rounded-full border-2 border-white/20 hover:border-saffron-400 transition-colors"
            />
            <span className="absolute -bottom-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-navy-700 border border-white/20 text-[9px] font-bold text-saffron-400">
              {level}
            </span>
          </div>
        </div>
      </div>

      {/* Mobile nav */}
      <div className="flex md:hidden border-t border-white/5 px-4 pb-2 pt-1 gap-1">
        {NAV_LINKS.map(({ href, label }) => {
          const active = pathname === href || (href !== '/' && pathname.startsWith(href))
          return (
            <Link
              key={href}
              href={href}
              className={clsx(
                'flex-1 text-center px-2 py-1.5 rounded-lg text-xs font-medium transition-colors',
                active ? 'bg-white/10 text-white' : 'text-white/50 hover:text-white hover:bg-white/5'
              )}
            >
              {label}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
