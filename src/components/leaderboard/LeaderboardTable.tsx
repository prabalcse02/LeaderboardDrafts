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

// ─── Mini radar ───────────────────────────────────────────────────────────────
function MiniRadar({ scores }: { scores: Record<string, { accuracyPct: number }> }) {
  const subjectIds = SUBJECTS.filter(s => s.paper === 'GS-I').map(s => s.id)
  const size = 56, cx = 28, cy = 28, r = 22, axes = subjectIds.length
  const points = subjectIds.map((sid, i) => {
    const val = (scores[sid]?.accuracyPct ?? 0) / 100
    const a   = (2 * Math.PI * i) / axes
    return `${cx + r * val * Math.sin(a)},${cy - r * val * Math.cos(a)}`
  }).join(' ')
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="shrink-0">
      <rect width={size} height={size} rx={8} fill="var(--surface)" />
      {[0.4, 0.7, 1.0].map(l => (
        <circle key={l} cx={cx} cy={cy} r={r * l} fill="none" stroke="var(--border)" strokeWidth={0.7} />
      ))}
      {subjectIds.map((_, i) => {
        const a = (2 * Math.PI * i) / axes
        return <line key={i} x1={cx} y1={cy} x2={cx + r * Math.sin(a)} y2={cy - r * Math.cos(a)}
          stroke="var(--border)" strokeWidth={0.7} />
      })}
      {axes > 0 && (
        <polygon points={points}
          fill="color-mix(in oklab, var(--accent) 25%, transparent)"
          stroke="var(--accent)" strokeWidth={1.2} strokeLinejoin="round" />
      )}
    </svg>
  )
}

// ─── Rank badge ───────────────────────────────────────────────────────────────
function RankBadge({ rank }: { rank: number }) {
  if (rank === 1) return <span className="flex items-center gap-0.5 font-black text-sm" style={{ color: '#d97706' }}><Crown className="w-3.5 h-3.5 fill-amber-500" />1</span>
  if (rank === 2) return <span className="flex items-center gap-0.5 font-black text-sm" style={{ color: '#9ca3af' }}><Medal className="w-3.5 h-3.5" style={{ fill: '#9ca3af' }} />2</span>
  if (rank === 3) return <span className="flex items-center gap-0.5 font-black text-sm" style={{ color: '#cd7f32' }}><Trophy className="w-3.5 h-3.5" style={{ fill: '#cd7f32' }} />3</span>
  return <span className="font-bold text-sm tabular-nums w-6 text-center" style={{ color: 'var(--text-3)' }}>{rank}</span>
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
    activeTab === 'weekly'  ? [...data].sort((a, b) => b.totalSessions - a.totalSessions) :
    activeTab === 'subject' ? [...data].sort((a, b) =>
      (b.subjectScores[selectedSubject]?.accuracyPct ?? 0) - (a.subjectScores[selectedSubject]?.accuracyPct ?? 0)
    ) : data

  const gsSubjects = SUBJECTS.filter(s => s.paper === 'GS-I')

  return (
    <div className="space-y-4">

      {/* Tabs */}
      <div className="flex items-center gap-2 flex-wrap">
        <div className="flex gap-0.5 p-1 rounded-xl border" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
          {tabs.map(({ id, label }) => (
            <button key={id} onClick={() => setActiveTab(id)}
              className="px-4 py-1.5 rounded-lg text-sm font-semibold transition-all duration-150"
              style={{
                background: activeTab === id ? 'var(--elevated)' : 'transparent',
                color:      activeTab === id ? 'var(--text)'     : 'var(--text-3)',
                boxShadow:  activeTab === id ? '0 1px 3px color-mix(in oklab, var(--text) 10%, transparent)' : 'none',
              }}>
              {label}
            </button>
          ))}
        </div>

        {activeTab === 'subject' && (
          <div className="relative ml-1">
            <select value={selectedSubject} onChange={e => setSelectedSubject(e.target.value)}
              className="appearance-none text-sm rounded-xl pl-3 pr-8 py-2 focus:outline-none cursor-pointer"
              style={{ background: 'var(--elevated)', border: '1px solid var(--border)', color: 'var(--text)' }}>
              {gsSubjects.map(s => (
                <option key={s.id} value={s.id} style={{ background: 'var(--elevated)' }}>
                  {s.icon} {s.name}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 pointer-events-none"
              style={{ color: 'var(--text-3)' }} />
          </div>
        )}
      </div>

      {/* Table header */}
      <div className="grid grid-cols-[36px_1fr_80px_72px_56px_56px] gap-3 px-4 py-2 text-[10px] font-bold uppercase tracking-wider"
        style={{ color: 'var(--text-3)' }}>
        <span className="text-center">#</span>
        <span>Player</span>
        <span className="text-right">XP</span>
        <span className="text-right">Accuracy</span>
        <span className="text-right">Sess.</span>
        <span className="text-center">Cover</span>
      </div>

      {/* Rows */}
      <div className="space-y-2">
        <AnimatePresence>
          {displayData.map((entry, idx) => {
            const isCurrentUser = entry.userId === currentUser?.userId
            const levelTitle    = LEVEL_TITLES[entry.level] ?? 'Aspirant'
            const avatarSeed    = encodeURIComponent(entry.displayName)
            const isExpanded    = selectedPlayer?.userId === entry.userId

            const rowBg = idx === 0 ? 'color-mix(in oklab, #d97706 5%, var(--elevated))'
              : idx === 1 ? 'color-mix(in oklab, #9ca3af 4%, var(--elevated))'
              : idx === 2 ? 'color-mix(in oklab, #cd7f32 5%, var(--elevated))'
              : isCurrentUser ? 'color-mix(in oklab, var(--accent) 5%, var(--elevated))'
              : 'var(--elevated)'

            const rowBorder = idx === 0 ? 'color-mix(in oklab, #d97706 20%, var(--border))'
              : idx === 1 ? 'color-mix(in oklab, #9ca3af 15%, var(--border))'
              : idx === 2 ? 'color-mix(in oklab, #cd7f32 18%, var(--border))'
              : isCurrentUser ? 'color-mix(in oklab, var(--accent) 25%, var(--border))'
              : 'var(--border)'

            return (
              <motion.div key={entry.userId} layout initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.035 }}>
                <div
                  onClick={() => setSelectedPlayer(isExpanded ? null : entry)}
                  className="grid grid-cols-[36px_1fr_80px_72px_56px_56px] gap-3 items-center px-4 py-3.5 rounded-xl border cursor-pointer transition-all duration-150"
                  style={{ background: rowBg, borderColor: isExpanded ? 'var(--accent)' : rowBorder }}
                  onMouseEnter={e => !isExpanded && ((e.currentTarget as HTMLDivElement).style.borderColor = 'color-mix(in oklab, var(--accent) 30%, var(--border))')}
                  onMouseLeave={e => !isExpanded && ((e.currentTarget as HTMLDivElement).style.borderColor = rowBorder)}
                >
                  <div className="flex items-center justify-center">
                    <RankBadge rank={idx + 1} />
                  </div>

                  <div className="flex items-center gap-2.5 min-w-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={`https://api.dicebear.com/7.x/initials/svg?seed=${avatarSeed}&backgroundColor=3c5d4d&textColor=ffffff`}
                      alt={entry.displayName} width={34} height={34}
                      className="rounded-full shrink-0" style={{ border: '1.5px solid var(--border)' }}
                    />
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className={clsx('font-semibold text-sm truncate', isCurrentUser ? '' : '')}
                          style={{ color: isCurrentUser ? 'var(--accent)' : 'var(--text)' }}>
                          {entry.displayName}
                        </span>
                        {isCurrentUser && (
                          <span className="shrink-0 text-[9px] px-1.5 py-0.5 rounded font-black"
                            style={{ background: 'var(--accent-tint)', color: 'var(--accent)', border: '1px solid color-mix(in oklab, var(--accent) 25%, transparent)' }}>
                            YOU
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1.5 text-[10px] mt-0.5" style={{ color: 'var(--text-3)' }}>
                        <span className="px-1.5 py-0.5 rounded font-mono font-bold"
                          style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
                          Lv.{entry.level}
                        </span>
                        <span className="truncate">{levelTitle}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 justify-end">
                    <Zap className="w-3 h-3 shrink-0" style={{ color: 'var(--amber)', fill: 'var(--amber)' }} />
                    <span className="font-bold text-sm tabular-nums" style={{ color: 'var(--amber)' }}>
                      {entry.totalXp.toLocaleString()}
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="font-bold text-sm tabular-nums" style={{
                      color: entry.accuracyPct >= 70 ? 'var(--success)' : entry.accuracyPct >= 50 ? 'var(--warning)' : 'var(--error)'
                    }}>
                      {entry.accuracyPct}%
                    </span>
                  </div>

                  <div className="text-right text-sm font-medium tabular-nums" style={{ color: 'var(--text-2)' }}>
                    {entry.totalSessions}
                  </div>

                  <div className="flex justify-center">
                    <MiniRadar scores={entry.subjectScores} />
                  </div>
                </div>

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
