'use client'

import { motion } from 'framer-motion'
import { X, Swords, Target, BookOpen } from 'lucide-react'
import { LEVEL_TITLES } from '@/lib/game/levels'
import { SUBJECTS } from '@/lib/data/subjects'
import type { LeaderboardEntry } from '@/types'
import RadarChart from '@/components/charts/RadarChart'

interface PlayerCardProps {
  entry: LeaderboardEntry
  onClose: () => void
}

export default function PlayerCard({ entry, onClose }: PlayerCardProps) {
  const levelTitle = LEVEL_TITLES[entry.level] ?? 'Aspirant'
  const avatarSeed = encodeURIComponent(entry.displayName)
  const gsSubjects = SUBJECTS.filter((s) => s.paper === 'GS-I')

  const targetData = gsSubjects.map(() => 1.0)
  const actualData = gsSubjects.map((s) => (entry.subjectScores[s.id]?.accuracyPct ?? 0) / 100)

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      transition={{ duration: 0.3 }}
      className="card rounded-2xl p-6 space-y-6"
      style={{ border: '1px solid var(--border)' }}
    >
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`https://api.dicebear.com/7.x/initials/svg?seed=${avatarSeed}&backgroundColor=3c5d4d&textColor=ffffff`}
            alt={entry.displayName}
            width={64} height={64}
            className="rounded-2xl"
            style={{ border: '2px solid var(--border)' }}
          />
          <div>
            <h3 className="text-xl font-bold" style={{ color: 'var(--text)' }}>{entry.displayName}</h3>
            <div className="flex items-center gap-2 mt-1">
              <span className="px-2 py-0.5 rounded-md text-xs font-bold border"
                style={{ background: 'var(--amber-tint)', color: 'var(--amber)', borderColor: 'color-mix(in oklab, var(--amber) 30%, transparent)' }}>
                Level {entry.level}
              </span>
              <span className="text-sm" style={{ color: 'var(--text-3)' }}>{levelTitle}</span>
            </div>
            <div className="flex items-center gap-4 mt-2 text-xs" style={{ color: 'var(--text-3)' }}>
              <span>{entry.totalXp.toLocaleString()} XP</span>
              <span>{entry.accuracyPct}% accuracy</span>
              <span>{entry.totalSessions} sessions</span>
            </div>
          </div>
        </div>

        <button onClick={onClose}
          className="p-2 rounded-lg transition-colors"
          style={{ color: 'var(--text-3)' }}
          onMouseEnter={e => (e.currentTarget.style.background = 'var(--surface)')}
          onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Radar + table layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Radar chart */}
        <div>
          <h4 className="text-sm font-semibold mb-3 flex items-center gap-2" style={{ color: 'var(--text-2)' }}>
            <Target className="w-4 h-4" />
            Subject Coverage
          </h4>
          <RadarChart
            subjects={gsSubjects.map((s) => ({ id: s.id, name: s.name, icon: s.icon }))}
            targetData={targetData}
            actualData={actualData}
            size={280}
            animated={true}
          />
        </div>

        {/* Subject breakdown */}
        <div>
          <h4 className="text-sm font-semibold mb-3 flex items-center gap-2" style={{ color: 'var(--text-2)' }}>
            <BookOpen className="w-4 h-4" />
            Subject Breakdown
          </h4>
          <div className="space-y-3">
            {gsSubjects.map((subject) => {
              const score    = entry.subjectScores[subject.id]
              const accuracy = score?.accuracyPct ?? 0
              const attempted = score?.totalAttempted ?? 0
              const correct   = score?.totalCorrect ?? 0
              const accColor  = accuracy >= 70 ? 'var(--success)' : accuracy >= 50 ? 'var(--warning)' : attempted === 0 ? 'var(--text-3)' : 'var(--error)'
              const barColor  = accuracy >= 70 ? 'var(--success)' : accuracy >= 50 ? 'var(--warning)' : attempted === 0 ? 'var(--border)' : 'var(--error)'

              return (
                <div key={subject.id} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="flex items-center gap-1.5" style={{ color: 'var(--text-2)' }}>
                      <span>{subject.icon}</span>
                      <span className="truncate max-w-[120px]">{subject.name.split('&')[0].trim()}</span>
                    </span>
                    <div className="flex items-center gap-2 shrink-0">
                      <span style={{ color: 'var(--text-3)' }}>{correct}/{attempted}</span>
                      <span className="font-bold" style={{ color: accColor }}>{accuracy}%</span>
                    </div>
                  </div>
                  <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--surface)' }}>
                    <div className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${accuracy}%`, background: barColor }} />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Challenge button */}
      <div className="flex justify-end pt-2" style={{ borderTop: '1px solid var(--border)' }}>
        <button
          disabled title="Coming soon!"
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium cursor-not-allowed select-none"
          style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text-3)' }}>
          <Swords className="w-4 h-4" />
          Challenge Player
          <span className="text-[10px] px-1.5 py-0.5 rounded ml-1"
            style={{ background: 'var(--elevated)', border: '1px solid var(--border)' }}>
            Soon
          </span>
        </button>
      </div>
    </motion.div>
  )
}
