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
    <nav className="sticky top-0 z-50 w-full border-b border-white/8 bg-[#03082e]/88 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 select-none group">
          <span className="text-xl font-extrabold tracking-tight text-saffron-500 group-hover:text-saffron-400 transition-colors">
            UPSCPATH
          </span>
          <span className="rounded-md bg-saffron-500/15 px-2 py-0.5 text-[10px] font-black
            uppercase tracking-widest text-saffron-400 border border-saffron-500/25">
            PRELIMS
          </span>
        </Link>

        {/* Nav links — pill group */}
        <div className="hidden md:flex items-center gap-0.5 p-1 bg-white/4 border border-white/7 rounded-xl">
          {NAV_LINKS.map(({ href, label, Icon }) => {
            const active = pathname === href || (href !== '/' && pathname.startsWith(href))
            return (
              <Link
                key={href}
                href={href}
                className={clsx(
                  'flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-sm font-semibold transition-all duration-150',
                  active
                    ? 'bg-white/12 text-white shadow-sm'
                    : 'text-white/45 hover:text-white/80 hover:bg-white/5'
                )}
              >
                <Icon size={13} />
                {label}
              </Link>
            )
          })}
        </div>

        {/* Right: XP + avatar */}
        <div className="flex items-center gap-2">
          {/* XP pill */}
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl
            bg-saffron-500/10 border border-saffron-500/20">
            <Zap size={12} className="text-saffron-400 fill-saffron-400" />
            <span className="text-xs font-bold text-saffron-300 tabular-nums">
              {totalXp.toLocaleString()} XP
            </span>
          </div>

          {/* Avatar + level */}
          <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-white/5 border border-white/8">
            <div className="relative shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`https://api.dicebear.com/7.x/initials/svg?seed=${avatarSeed}&backgroundColor=1a3de4&textColor=ffffff`}
                alt={displayName}
                width={28}
                height={28}
                className="rounded-full border border-white/15"
              />
              <span className="absolute -bottom-1 -right-1 text-[8px] font-black bg-saffron-500
                text-white rounded-full w-3.5 h-3.5 flex items-center justify-center
                border border-[#03082e] leading-none">
                {level}
              </span>
            </div>
            <div className="hidden sm:block leading-tight">
              <p className="text-xs font-bold text-white">{displayName.split(' ')[0]}</p>
              <p className="text-[9px] text-white/35">{levelTitle}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile bottom nav */}
      <div className="flex md:hidden border-t border-white/6">
        {NAV_LINKS.map(({ href, label, Icon }) => {
          const active = pathname === href || (href !== '/' && pathname.startsWith(href))
          return (
            <Link
              key={href}
              href={href}
              className={clsx(
                'flex-1 flex flex-col items-center gap-0.5 py-2.5 text-[10px] font-semibold transition-colors',
                active ? 'text-saffron-400' : 'text-white/35 hover:text-white/60'
              )}
            >
              <Icon size={16} />
              {label}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
