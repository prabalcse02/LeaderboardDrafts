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

// ─── Mini inline radar ────────────────────────────────────────────────────────
function MiniRadar({ scores }: { scores: Record<string, { accuracyPct: number }> }) {
  const subjectIds = SUBJECTS.filter(s => s.paper === 'GS-I').map(s => s.id)
  const size = 56
  const cx = size / 2, cy = size / 2, r = size / 2 - 5
  const axes = subjectIds.length

  const points = subjectIds.map((sid, i) => {
    const val   = (scores[sid]?.accuracyPct ?? 0) / 100
    const angle = (2 * Math.PI * i) / axes
    return `${cx + r * val * Math.sin(angle)},${cy - r * val * Math.cos(angle)}`
  }).join(' ')

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="shrink-0">
      <rect width={size} height={size} rx={8} fill="#080e2e" />
      {[0.4, 0.7, 1.0].map(lvl => (
        <circle key={lvl} cx={cx} cy={cy} r={r * lvl}
          fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth={0.7} />
      ))}
      {subjectIds.map((_, i) => {
        const angle = (2 * Math.PI * i) / axes
        return <line key={i} x1={cx} y1={cy}
          x2={cx + r * Math.sin(angle)} y2={cy - r * Math.cos(angle)}
          stroke="rgba(255,255,255,0.07)" strokeWidth={0.7} />
      })}
      {axes > 0 && (
        <polygon points={points}
          fill="rgba(244,63,94,0.28)" stroke="#f43f5e" strokeWidth={1.2} strokeLinejoin="round" />
      )}
    </svg>
  )
}

// ─── Rank badge ───────────────────────────────────────────────────────────────
function RankBadge({ rank }: { rank: number }) {
  if (rank === 1) return (
    <span className="flex items-center gap-0.5 text-amber-400 font-black text-sm">
      <Crown className="w-3.5 h-3.5 fill-amber-400" />1
    </span>
  )
  if (rank === 2) return (
    <span className="flex items-center gap-0.5 text-slate-300 font-black text-sm">
      <Medal className="w-3.5 h-3.5 fill-slate-300" />2
    </span>
  )
  if (rank === 3) return (
    <span className="flex items-center gap-0.5 text-amber-700 font-black text-sm">
      <Trophy className="w-3.5 h-3.5 fill-amber-700" />3
    </span>
  )
  return <span className="font-bold text-white/35 text-sm tabular-nums w-6 text-center">{rank}</span>
}

export default function LeaderboardTable({ entries }: { entries?: LeaderboardEntry[] }) {
  const storeLeaderboard = useGameStore(s => s.leaderboard)
  const currentUser      = useGameStore(s => s.userStats)
  const data             = entries ?? storeLeaderboard

  const [activeTab,       setActiveTab]       = useState<Tab>('overall')
  const [selectedSubject, setSelectedSubject] = useState('history')
  const [selectedPlayer,  setSelectedPlayer]  = useState<LeaderboardEntry | null>(null)

  const tabs: { id: Tab; label: string }[] = [
    { id: 'overall', label: 'Overall' },
    { id: 'weekly',  label: 'This Week' },
    { id: 'subject', label: 'By Subject' },
  ]

  const displayData =
    activeTab === 'weekly'
      ? [...data].sort((a, b) => b.totalSessions - a.totalSessions)
      : activeTab === 'subject'
      ? [...data].sort((a, b) =>
          (b.subjectScores[selectedSubject]?.accuracyPct ?? 0) -
          (a.subjectScores[selectedSubject]?.accuracyPct ?? 0)
        )
      : data

  const gsSubjects = SUBJECTS.filter(s => s.paper === 'GS-I')

  return (
    <div className="space-y-4">

      {/* ── Tabs ─────────────────────────────────────────────────────────────── */}
      <div className="flex items-center gap-2 flex-wrap">
        <div className="flex gap-1 p-1 bg-white/4 border border-white/8 rounded-xl">
          {tabs.map(({ id, label }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={clsx(
                'px-4 py-1.5 rounded-lg text-sm font-semibold transition-all duration-150',
                activeTab === id
                  ? 'bg-saffron-500/20 text-saffron-300 border border-saffron-500/30'
                  : 'text-white/45 hover:text-white/70'
              )}
            >
              {label}
            </button>
          ))}
        </div>

        {activeTab === 'subject' && (
          <div className="relative ml-1">
            <select
              value={selectedSubject}
              onChange={e => setSelectedSubject(e.target.value)}
              className="appearance-none bg-white/6 border border-white/12 text-white text-sm
                rounded-xl pl-3 pr-8 py-2 focus:outline-none focus:border-saffron-400/50 cursor-pointer"
            >
              {gsSubjects.map(s => (
                <option key={s.id} value={s.id} className="bg-[#080e2e]">
                  {s.icon} {s.name}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/35 pointer-events-none" />
          </div>
        )}
      </div>

      {/* ── Table header ─────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-[36px_1fr_80px_72px_60px_56px] gap-3 px-4 py-2
        text-[10px] text-white/30 font-bold uppercase tracking-wider">
        <span className="text-center">#</span>
        <span>Player</span>
        <span className="text-right">XP</span>
        <span className="text-right">Accuracy</span>
        <span className="text-right">Sess.</span>
        <span className="text-center">Cover</span>
      </div>

      {/* ── Rows ─────────────────────────────────────────────────────────────── */}
      <div className="space-y-2">
        <AnimatePresence>
          {displayData.map((entry, idx) => {
            const isCurrentUser = entry.userId === currentUser?.userId
            const levelTitle    = LEVEL_TITLES[entry.level] ?? 'Aspirant'
            const avatarSeed    = encodeURIComponent(entry.displayName)
            const isExpanded    = selectedPlayer?.userId === entry.userId

            // Top 3 row tints
            const rowTint =
              idx === 0 ? 'bg-amber-500/5 border-amber-500/20' :
              idx === 1 ? 'bg-slate-400/5 border-slate-400/15' :
              idx === 2 ? 'bg-amber-700/5 border-amber-700/15' :
              isCurrentUser ? 'bg-saffron-500/7 border-saffron-500/20' :
              'bg-white/2 border-white/7 hover:bg-white/5 hover:border-white/13'

            return (
              <motion.div
                key={entry.userId}
                layout
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.035 }}
              >
                <div
                  onClick={() => setSelectedPlayer(isExpanded ? null : entry)}
                  className={clsx(
                    'grid grid-cols-[36px_1fr_80px_72px_60px_56px] gap-3 items-center',
                    'px-4 py-3.5 rounded-xl border cursor-pointer transition-all duration-150',
                    rowTint,
                    isExpanded && 'ring-1 ring-saffron-400/30'
                  )}
                >
                  {/* Rank */}
                  <div className="flex items-center justify-center">
                    <RankBadge rank={idx + 1} />
                  </div>

                  {/* Player info */}
                  <div className="flex items-center gap-2.5 min-w-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={`https://api.dicebear.com/7.x/initials/svg?seed=${avatarSeed}&backgroundColor=1a3de4&textColor=ffffff`}
                      alt={entry.displayName}
                      width={34}
                      height={34}
                      className="rounded-full border border-white/15 shrink-0"
                    />
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className={clsx(
                          'font-semibold text-sm truncate',
                          isCurrentUser ? 'text-saffron-300' : 'text-white'
                        )}>
                          {entry.displayName}
                        </span>
                        {isCurrentUser && (
                          <span className="shrink-0 text-[9px] px-1.5 py-0.5 rounded
                            bg-saffron-500/20 text-saffron-400 font-black border border-saffron-500/25">
                            YOU
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1.5 text-[10px] text-white/35 mt-0.5">
                        <span className="px-1.5 py-0.5 rounded bg-white/6 font-mono font-bold">
                          Lv.{entry.level}
                        </span>
                        <span className="truncate">{levelTitle}</span>
                      </div>
                    </div>
                  </div>

                  {/* XP */}
                  <div className="flex items-center gap-1 justify-end">
                    <Zap className="w-3 h-3 text-saffron-400 fill-saffron-400 shrink-0" />
                    <span className="font-bold text-saffron-300 text-sm tabular-nums">
                      {entry.totalXp.toLocaleString()}
                    </span>
                  </div>

                  {/* Accuracy */}
                  <div className="text-right">
                    <span className={clsx(
                      'font-bold text-sm tabular-nums',
                      entry.accuracyPct >= 70 ? 'text-jade-400' :
                      entry.accuracyPct >= 50 ? 'text-amber-400' : 'text-rose-400'
                    )}>
                      {entry.accuracyPct}%
                    </span>
                  </div>

                  {/* Sessions */}
                  <div className="text-right text-sm text-white/50 font-medium tabular-nums">
                    {entry.totalSessions}
                  </div>

                  {/* Mini radar */}
                  <div className="flex justify-center">
                    <MiniRadar scores={entry.subjectScores} />
                  </div>
                </div>

                {/* Expanded card */}
                <AnimatePresence>
                  {isExpanded && (
                    <div className="mt-2">
                      <PlayerCard entry={entry} onClose={() => setSelectedPlayer(null)} />
                    </div>
                  )}
                </AnimatePresence>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>
    </div>
  )
}
