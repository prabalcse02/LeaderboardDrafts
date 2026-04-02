'use client'

import Link from 'next/link'
import { Zap, Target, BookOpen, Flame, ArrowRight, TrendingUp } from 'lucide-react'
import RadarChart from '@/components/charts/RadarChart'
import XPBar from '@/components/shared/XPBar'
import SubjectGrid from '@/components/dashboard/SubjectGrid'
import { useGameStore } from '@/lib/store/gameStore'
import { GS_SUBJECTS } from '@/lib/data/subjects'

export default function DashboardPage() {
  const userStats = useGameStore(s => s.userStats)
  const leaderboard = useGameStore(s => s.leaderboard)

  const subjects = GS_SUBJECTS
  const targetData = subjects.map(() => 1.0)
  const actualData = subjects.map(s => {
    const score = userStats.subjectScores[s.id]
    return score ? score.accuracyPct / 100 : 0
  })

  // Community average from leaderboard
  const communityAvg = subjects.map(s => {
    const scores = leaderboard
      .map(e => e.subjectScores[s.id]?.accuracyPct ?? 0)
    const avg = scores.reduce((a, b) => a + b, 0) / (scores.length || 1)
    return avg / 100
  })

  const totalAttempted = userStats.totalQuestionsAttempted
  const accuracy = totalAttempted > 0
    ? Math.round((userStats.totalCorrect / totalAttempted) * 100)
    : 0

  const isNewUser = totalAttempted === 0

  const STAT_CARDS = [
    { icon: Zap, label: 'Total XP', value: userStats.totalXp.toLocaleString(), color: 'text-[#ff7c00]', bg: 'bg-[#ff7c00]/15' },
    { icon: BookOpen, label: 'Questions', value: totalAttempted.toLocaleString(), color: 'text-blue-400', bg: 'bg-blue-400/15' },
    { icon: Target, label: 'Accuracy', value: `${accuracy}%`, color: accuracy >= 70 ? 'text-green-400' : accuracy >= 50 ? 'text-amber-400' : 'text-red-400', bg: 'bg-white/8' },
    { icon: Flame, label: 'Streak', value: `${userStats.streakDays}d`, color: 'text-orange-400', bg: 'bg-orange-400/15' },
  ]

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">

      {/* Hero */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-black text-white">
            Your <span className="text-[#ff7c00]">UPSCPATH</span> Journey
          </h1>
          <p className="text-white/50 text-sm">
            {isNewUser
              ? 'Welcome! Start your first session to track your progress.'
              : `Keep going, ${userStats.displayName.split(' ')[0]}. The IAS doesn't prepare itself.`}
          </p>
        </div>
        <Link href="/prelims"
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl
            bg-[#ff7c00] hover:bg-[#e05f00] text-white font-bold text-sm
            transition-colors shadow-lg shadow-[#ff7c00]/20">
          Start Playing <ArrowRight size={16} />
        </Link>
      </div>

      {/* XP Bar */}
      <XPBar xp={userStats.totalXp} />

      {/* Stat cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {STAT_CARDS.map(({ icon: Icon, label, value, color, bg }) => (
          <div key={label} className="glass p-4 space-y-2">
            <div className={`w-8 h-8 rounded-lg ${bg} flex items-center justify-center`}>
              <Icon size={16} className={color} />
            </div>
            <p className={`text-xl font-black ${color}`}>{value}</p>
            <p className="text-xs text-white/40">{label}</p>
          </div>
        ))}
      </div>

      {/* Radar + Subject breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Radar chart */}
        <div className="glass p-6 space-y-3">
          <div className="flex items-center gap-2">
            <TrendingUp size={16} className="text-[#ff7c00]" />
            <h2 className="text-sm font-bold text-white">Coverage Map</h2>
            <span className="ml-auto text-[10px] text-white/30">vs. Community Average</span>
          </div>

          {isNewUser && (
            <div className="text-center py-4">
              <p className="text-white/30 text-xs mb-2">
                Your radar will fill up as you practice each subject.
              </p>
            </div>
          )}

          <RadarChart
            subjects={subjects.map(s => ({ id: s.id, name: s.name, icon: s.icon }))}
            targetData={targetData}
            actualData={actualData}
            compareData={communityAvg}
            size={380}
            animated
            showLegend
          />
        </div>

        {/* Per-subject accuracy list */}
        <div className="glass p-6 space-y-4">
          <h2 className="text-sm font-bold text-white">Subject Accuracy</h2>
          <div className="space-y-3">
            {subjects.map(s => {
              const score  = userStats.subjectScores[s.id]
              const acc    = score?.accuracyPct ?? 0
              const tried  = score?.totalAttempted ?? 0
              return (
                <div key={s.id} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="flex items-center gap-1.5 text-white/70">
                      {s.icon} {s.name.split(' ')[0]}
                    </span>
                    <span className={`font-bold
                      ${tried === 0 ? 'text-white/20' :
                        acc >= 70 ? 'text-green-400' :
                        acc >= 50 ? 'text-amber-400' : 'text-red-400'}`}>
                      {tried === 0 ? '—' : `${acc}%`}
                    </span>
                  </div>
                  <div className="h-1.5 bg-white/8 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-700
                        ${acc >= 70 ? 'bg-green-500' : acc >= 50 ? 'bg-amber-500' : tried === 0 ? 'bg-white/10' : 'bg-red-500'}`}
                      style={{ width: `${acc}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>

          <Link href="/leaderboard"
            className="mt-2 flex items-center justify-center gap-2
              w-full py-2 rounded-xl text-xs font-semibold
              text-white/50 hover:text-white border border-white/8
              hover:border-white/20 transition-all">
            View Full Leaderboard <ArrowRight size={12} />
          </Link>
        </div>
      </div>

      {/* Subject grid */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-white">All Subjects</h2>
        <SubjectGrid filter="all" />
      </div>
    </div>
  )
}
