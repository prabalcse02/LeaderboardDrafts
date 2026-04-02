'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Zap, Crown, Medal, Trophy, ChevronDown } from 'lucide-react'
import { useGameStore } from '@/lib/store/gameStore'
import { LEVEL_TITLES } from '@/lib/game/levels'
import { SUBJECTS } from '@/lib/data/subjects'
import type { LeaderboardEntry } from '@/types'
import PlayerCard from './PlayerCard'
import clsx from 'clsx'

type Tab = 'overall' | 'weekly' | 'subject'

// Tiny inline radar — pure SVG, no dependencies
function MiniRadar({ scores }: { scores: Record<string, { accuracyPct: number }> }) {
  const subjectIds = SUBJECTS.filter((s) => s.paper === 'GS-I').map((s) => s.id)
  const size = 60
  const cx = size / 2
  const cy = size / 2
  const r = size / 2 - 6
  const axes = subjectIds.length

  const points = subjectIds
    .map((sid, i) => {
      const val = (scores[sid]?.accuracyPct ?? 0) / 100
      const angle = (2 * Math.PI * i) / axes
      const px = cx + r * val * Math.sin(angle)
      const py = cy - r * val * Math.cos(angle)
      return `${px},${py}`
    })
    .join(' ')

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="shrink-0">
      <rect width={size} height={size} rx={6} fill="#0d1133" />
      {[0.4, 0.7, 1.0].map((lvl) => (
        <circle key={lvl} cx={cx} cy={cy} r={r * lvl} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={0.8} />
      ))}
      {subjectIds.map((_, i) => {
        const angle = (2 * Math.PI * i) / axes
        const ex = cx + r * Math.sin(angle)
        const ey = cy - r * Math.cos(angle)
        return <line key={i} x1={cx} y1={cy} x2={ex} y2={ey} stroke="rgba(255,255,255,0.06)" strokeWidth={0.8} />
      })}
      {axes > 0 && (
        <polygon points={points} fill="rgba(244,63,94,0.3)" stroke="#f43f5e" strokeWidth={1} strokeLinejoin="round" />
      )}
    </svg>
  )
}

function RankBadge({ rank }: { rank: number }) {
  if (rank === 1)
    return (
      <span className="flex items-center gap-1 text-yellow-400 font-bold">
        <Crown className="w-4 h-4 fill-yellow-400" />1
      </span>
    )
  if (rank === 2)
    return (
      <span className="flex items-center gap-1 text-slate-300 font-bold">
        <Medal className="w-4 h-4 fill-slate-300" />2
      </span>
    )
  if (rank === 3)
    return (
      <span className="flex items-center gap-1 text-amber-600 font-bold">
        <Trophy className="w-4 h-4 fill-amber-600" />3
      </span>
    )
  return <span className="font-bold text-white/50 text-sm w-6 text-center">{rank}</span>
}

interface LeaderboardTableProps {
  entries?: LeaderboardEntry[]
}

export default function LeaderboardTable({ entries }: LeaderboardTableProps) {
  const storeLeaderboard = useGameStore((s) => s.leaderboard)
  const currentUser = useGameStore((s) => s.userStats)
  const data = entries ?? storeLeaderboard

  const [activeTab, setActiveTab] = useState<Tab>('overall')
  const [selectedSubject, setSelectedSubject] = useState('history')
  const [selectedPlayer, setSelectedPlayer] = useState<LeaderboardEntry | null>(null)

  const tabs: { id: Tab; label: string }[] = [
    { id: 'overall', label: 'Overall' },
    { id: 'weekly', label: 'This Week' },
    { id: 'subject', label: 'By Subject' },
  ]

  // For weekly tab: sort by sessions (mock — in real app would use weekly data)
  const displayData =
    activeTab === 'weekly'
      ? [...data].sort((a, b) => b.totalSessions - a.totalSessions)
      : activeTab === 'subject'
      ? [...data].sort(
          (a, b) =>
            (b.subjectScores[selectedSubject]?.accuracyPct ?? 0) -
            (a.subjectScores[selectedSubject]?.accuracyPct ?? 0)
        )
      : data

  const gsSubjects = SUBJECTS.filter((s) => s.paper === 'GS-I')

  return (
    <div className="space-y-4">
      {/* Tabs */}
      <div className="flex items-center gap-2 flex-wrap">
        {tabs.map(({ id, label }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={clsx(
              'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
              activeTab === id
                ? 'bg-saffron-500/20 text-saffron-300 border border-saffron-500/30'
                : 'text-white/50 hover:text-white hover:bg-white/5 border border-transparent'
            )}
          >
            {label}
          </button>
        ))}

        {/* Subject dropdown */}
        {activeTab === 'subject' && (
          <div className="relative ml-2">
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="appearance-none bg-white/8 border border-white/15 text-white text-sm rounded-lg pl-3 pr-8 py-2 focus:outline-none focus:border-saffron-400 cursor-pointer"
            >
              {gsSubjects.map((s) => (
                <option key={s.id} value={s.id} className="bg-navy-950">
                  {s.icon} {s.name}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 pointer-events-none" />
          </div>
        )}
      </div>

      {/* Table header */}
      <div className="grid grid-cols-[40px_1fr_auto_auto_auto_60px] gap-3 px-4 py-2 text-xs text-white/40 font-semibold uppercase tracking-wider">
        <span>#</span>
        <span>Player</span>
        <span className="text-right">XP</span>
        <span className="text-right">Accuracy</span>
        <span className="text-right">Sessions</span>
        <span className="text-center">Cover</span>
      </div>

      {/* Table rows */}
      <div className="space-y-2">
        <AnimatePresence>
          {displayData.map((entry, idx) => {
            const isCurrentUser = entry.userId === currentUser?.userId
            const levelTitle = LEVEL_TITLES[entry.level] ?? 'Aspirant'
            const avatarSeed = encodeURIComponent(entry.displayName)

            return (
              <motion.div
                key={entry.userId}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.04 }}
                onClick={() => setSelectedPlayer(selectedPlayer?.userId === entry.userId ? null : entry)}
                className={clsx(
                  'grid grid-cols-[40px_1fr_auto_auto_auto_60px] gap-3 items-center px-4 py-3.5 rounded-xl border cursor-pointer',
                  'transition-all duration-200',
                  isCurrentUser
                    ? 'bg-saffron-500/8 border-saffron-500/25 shadow-[0_0_20px_rgba(255,124,0,0.08)]'
                    : 'bg-white/3 border-white/8 hover:bg-white/6 hover:border-white/15',
                  selectedPlayer?.userId === entry.userId && 'ring-1 ring-saffron-400/40'
                )}
              >
                {/* Rank */}
                <div className="flex items-center justify-center">
                  <RankBadge rank={idx + 1} />
                </div>

                {/* Player info */}
                <div className="flex items-center gap-3 min-w-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`https://api.dicebear.com/7.x/initials/svg?seed=${avatarSeed}&backgroundColor=1a3de4&textColor=ffffff`}
                    alt={entry.displayName}
                    width={36}
                    height={36}
                    className="rounded-full border border-white/20 shrink-0"
                  />
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className={clsx('font-semibold text-sm truncate', isCurrentUser ? 'text-saffron-300' : 'text-white')}>
                        {entry.displayName}
                      </span>
                      {isCurrentUser && (
                        <span className="shrink-0 text-[10px] px-1.5 py-0.5 rounded bg-saffron-500/20 text-saffron-400 font-bold">YOU</span>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-white/40">
                      <span className="px-1.5 py-0.5 rounded bg-white/8 font-mono">Lv.{entry.level}</span>
                      <span>{levelTitle}</span>
                    </div>
                  </div>
                </div>

                {/* XP */}
                <div className="flex items-center gap-1 justify-end">
                  <Zap className="w-3.5 h-3.5 text-saffron-400 fill-saffron-400 shrink-0" />
                  <span className="font-bold text-saffron-300 text-sm tabular-nums">
                    {entry.totalXp.toLocaleString()}
                  </span>
                </div>

                {/* Accuracy */}
                <div className="text-right">
                  <span className={clsx('font-bold text-sm', entry.accuracyPct >= 70 ? 'text-jade-400' : entry.accuracyPct >= 50 ? 'text-amber-400' : 'text-rose-400')}>
                    {entry.accuracyPct}%
                  </span>
                </div>

                {/* Sessions */}
                <div className="text-right text-sm text-white/60 font-medium">
                  {entry.totalSessions}
                </div>

                {/* Mini radar */}
                <div className="flex justify-center">
                  <MiniRadar scores={entry.subjectScores} />
                </div>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>

      {/* Expanded player card */}
      <AnimatePresence>
        {selectedPlayer && (
          <PlayerCard
            entry={selectedPlayer}
            onClose={() => setSelectedPlayer(null)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
