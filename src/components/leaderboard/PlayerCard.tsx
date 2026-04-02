'use client'

import { motion } from 'framer-motion'
import { X, Swords, Target, CheckCircle2, BookOpen } from 'lucide-react'
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

  // Build radar data
  const targetData = gsSubjects.map(() => 1.0)
  const actualData = gsSubjects.map((s) => (entry.subjectScores[s.id]?.accuracyPct ?? 0) / 100)

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      transition={{ duration: 0.3 }}
      className="glass rounded-2xl p-6 border border-white/15 space-y-6"
    >
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`https://api.dicebear.com/7.x/initials/svg?seed=${avatarSeed}&backgroundColor=1a3de4&textColor=ffffff`}
            alt={entry.displayName}
            width={64}
            height={64}
            className="rounded-2xl border-2 border-white/20"
          />
          <div>
            <h3 className="text-xl font-bold text-white">{entry.displayName}</h3>
            <div className="flex items-center gap-2 mt-1">
              <span className="px-2 py-0.5 rounded-md bg-saffron-500/20 text-saffron-400 text-xs font-bold border border-saffron-500/30">
                Level {entry.level}
              </span>
              <span className="text-white/50 text-sm">{levelTitle}</span>
            </div>
            <div className="flex items-center gap-4 mt-2 text-xs text-white/40">
              <span>{entry.totalXp.toLocaleString()} XP</span>
              <span>{entry.accuracyPct}% accuracy</span>
              <span>{entry.totalSessions} sessions</span>
            </div>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-2 rounded-lg hover:bg-white/10 text-white/40 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Radar + table layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Radar chart */}
        <div>
          <h4 className="text-sm font-semibold text-white/60 mb-3 flex items-center gap-2">
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
          <h4 className="text-sm font-semibold text-white/60 mb-3 flex items-center gap-2">
            <BookOpen className="w-4 h-4" />
            Subject Breakdown
          </h4>
          <div className="space-y-3">
            {gsSubjects.map((subject) => {
              const score = entry.subjectScores[subject.id]
              const accuracy = score?.accuracyPct ?? 0
              const attempted = score?.totalAttempted ?? 0
              const correct = score?.totalCorrect ?? 0

              return (
                <div key={subject.id} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-white/70 flex items-center gap-1.5">
                      <span>{subject.icon}</span>
                      <span className="truncate max-w-[120px]">{subject.name.split('&')[0].trim()}</span>
                    </span>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-white/40">{correct}/{attempted}</span>
                      <span
                        className={
                          accuracy >= 70
                            ? 'text-jade-400 font-bold'
                            : accuracy >= 50
                            ? 'text-amber-400 font-semibold'
                            : 'text-rose-400 font-semibold'
                        }
                      >
                        {accuracy}%
                      </span>
                    </div>
                  </div>
                  <div className="h-1.5 bg-white/8 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        accuracy >= 70
                          ? 'bg-jade-500'
                          : accuracy >= 50
                          ? 'bg-amber-500'
                          : attempted === 0
                          ? 'bg-white/20'
                          : 'bg-rose-500'
                      }`}
                      style={{ width: `${accuracy}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Challenge button */}
      <div className="flex justify-end pt-2 border-t border-white/8">
        <button
          disabled
          title="Coming soon!"
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white/30 text-sm font-medium cursor-not-allowed select-none"
        >
          <Swords className="w-4 h-4" />
          Challenge Player
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/8 ml-1">Soon</span>
        </button>
      </div>
    </motion.div>
  )
}
