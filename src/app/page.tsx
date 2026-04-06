'use client'

import Link from 'next/link'
import { Zap, Target, BookOpen, Flame, ArrowRight, TrendingUp, ChevronRight } from 'lucide-react'
import RadarChart from '@/components/charts/RadarChart'
import XPBar from '@/components/shared/XPBar'
import SubjectGrid from '@/components/dashboard/SubjectGrid'
import { useGameStore } from '@/lib/store/gameStore'
import { GS_SUBJECTS } from '@/lib/data/subjects'

export default function DashboardPage() {
  const userStats   = useGameStore(s => s.userStats)
  const leaderboard = useGameStore(s => s.leaderboard)

  const subjects    = GS_SUBJECTS
  const targetData  = subjects.map(() => 1.0)
  const actualData  = subjects.map(s => {
    const score = userStats.subjectScores[s.id]
    return score ? score.accuracyPct / 100 : 0
  })

  const communityAvg = subjects.map(s => {
    const scores = leaderboard.map(e => e.subjectScores[s.id]?.accuracyPct ?? 0)
    return scores.reduce((a, b) => a + b, 0) / (scores.length || 1) / 100
  })

  const totalAttempted = userStats.totalQuestionsAttempted
  const accuracy = totalAttempted > 0
    ? Math.round((userStats.totalCorrect / totalAttempted) * 100)
    : 0
  const isNewUser = totalAttempted === 0

  const STAT_CARDS = [
    {
      icon: Zap,
      label: 'Total XP',
      value: userStats.totalXp.toLocaleString(),
      color: 'text-saffron-400',
      bg: 'bg-saffron-500/10',
      border: 'border-saffron-500/20',
      glow: 'shadow-saffron-500/10',
    },
    {
      icon: BookOpen,
      label: 'Questions',
      value: totalAttempted.toLocaleString(),
      color: 'text-blue-400',
      bg: 'bg-blue-500/10',
      border: 'border-blue-500/20',
      glow: 'shadow-blue-500/10',
    },
    {
      icon: Target,
      label: 'Accuracy',
      value: `${accuracy}%`,
      color: accuracy >= 70 ? 'text-green-400' : accuracy >= 50 ? 'text-amber-400' : 'text-rose-400',
      bg: accuracy >= 70 ? 'bg-green-500/10' : accuracy >= 50 ? 'bg-amber-500/10' : 'bg-rose-500/10',
      border: accuracy >= 70 ? 'border-green-500/20' : accuracy >= 50 ? 'border-amber-500/20' : 'border-rose-500/20',
      glow: 'shadow-white/5',
    },
    {
      icon: Flame,
      label: 'Day Streak',
      value: `${userStats.streakDays}d`,
      color: 'text-orange-400',
      bg: 'bg-orange-500/10',
      border: 'border-orange-500/20',
      glow: 'shadow-orange-500/10',
    },
  ]

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-10">

      {/* ── Hero ──────────────────────────────────────────────────────────────── */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-navy-900/80 via-navy-950 to-[#03082e] border border-white/8 p-7 sm:p-9">
        {/* Background glow orbs */}
        <div className="pointer-events-none absolute -top-16 -right-16 w-64 h-64 rounded-full bg-saffron-500/8 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-12 -left-8 w-48 h-48 rounded-full bg-blue-600/8 blur-3xl" />

        <div className="relative flex items-center justify-between gap-6 flex-wrap">
          <div className="space-y-2">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs font-bold uppercase tracking-widest text-saffron-500 bg-saffron-500/10 border border-saffron-500/20 px-2.5 py-1 rounded-full">
                UPSCPATH Prelims
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-white leading-tight">
              {isNewUser ? 'Start Your' : 'Continue Your'}<br />
              <span className="gradient-text">IAS Journey</span>
            </h1>
            <p className="text-white/50 text-sm max-w-sm">
              {isNewUser
                ? 'Practice UPSC Prelims MCQs, earn XP, and climb the leaderboard.'
                : `Keep going, ${userStats.displayName.split(' ')[0]}. The IAS doesn't prepare itself.`}
            </p>
          </div>

          <Link
            href="/prelims"
            className="group flex items-center gap-2.5 px-6 py-3.5 rounded-2xl
              bg-gradient-to-r from-saffron-500 to-saffron-400
              hover:from-saffron-600 hover:to-saffron-500
              text-white font-bold text-sm shadow-xl shadow-saffron-500/25
              transition-all hover:scale-105 active:scale-100 shrink-0"
          >
            <Zap size={16} className="fill-white" />
            Start Playing
            <ArrowRight size={15} className="transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>

      {/* ── XP Bar ────────────────────────────────────────────────────────────── */}
      <XPBar xp={userStats.totalXp} />

      {/* ── Stat Cards ────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {STAT_CARDS.map(({ icon: Icon, label, value, color, bg, border }) => (
          <div
            key={label}
            className={`glass border ${border} p-5 space-y-3 shadow-lg hover:shadow-xl transition-shadow`}
          >
            <div className={`w-9 h-9 rounded-xl ${bg} border ${border} flex items-center justify-center`}>
              <Icon size={17} className={color} />
            </div>
            <div>
              <p className={`text-2xl font-black ${color} tabular-nums`}>{value}</p>
              <p className="text-xs text-white/40 mt-0.5 font-medium">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Radar + Subject Accuracy ───────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

        {/* Radar Chart — wider */}
        <div className="lg:col-span-3 glass p-6 space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-saffron-500/15 flex items-center justify-center">
              <TrendingUp size={14} className="text-saffron-400" />
            </div>
            <h2 className="text-sm font-bold text-white">Coverage Map</h2>
            <span className="ml-auto text-[10px] font-medium text-white/30 bg-white/5 px-2 py-0.5 rounded-full">
              vs. Community Avg
            </span>
          </div>

          {isNewUser && (
            <div className="text-center py-3 px-4 rounded-xl bg-white/3 border border-white/6">
              <p className="text-white/30 text-xs">
                Complete a session to see your subject coverage radar.
              </p>
            </div>
          )}

          <RadarChart
            subjects={subjects.map(s => ({ id: s.id, name: s.name, icon: s.icon }))}
            targetData={targetData}
            actualData={actualData}
            compareData={communityAvg}
            size={400}
            animated
            showLegend
          />
        </div>

        {/* Per-subject accuracy list */}
        <div className="lg:col-span-2 glass p-6 space-y-4 flex flex-col">
          <h2 className="text-sm font-bold text-white">Subject Accuracy</h2>

          <div className="space-y-3 flex-1">
            {subjects.map(s => {
              const score = userStats.subjectScores[s.id]
              const acc   = score?.accuracyPct ?? 0
              const tried = score?.totalAttempted ?? 0
              return (
                <div key={s.id} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="flex items-center gap-1.5 text-white/65">
                      <span className="text-sm">{s.icon}</span>
                      <span className="font-medium">{s.name.split(' ')[0]}</span>
                    </span>
                    <span className={`font-bold tabular-nums
                      ${tried === 0 ? 'text-white/20' :
                        acc >= 70 ? 'text-green-400' :
                        acc >= 50 ? 'text-amber-400' : 'text-rose-400'}`}>
                      {tried === 0 ? '—' : `${acc}%`}
                    </span>
                  </div>
                  <div className="h-1.5 bg-white/6 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-700
                        ${acc >= 70 ? 'bg-gradient-to-r from-green-600 to-green-400'
                          : acc >= 50 ? 'bg-gradient-to-r from-amber-600 to-amber-400'
                          : tried === 0 ? 'bg-white/8'
                          : 'bg-gradient-to-r from-rose-700 to-rose-500'}`}
                      style={{ width: `${acc}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>

          <Link
            href="/leaderboard"
            className="mt-auto flex items-center justify-center gap-1.5 w-full py-2.5 rounded-xl
              text-xs font-semibold text-saffron-400 hover:text-saffron-300
              bg-saffron-500/5 hover:bg-saffron-500/10
              border border-saffron-500/15 hover:border-saffron-500/30
              transition-all"
          >
            View Full Leaderboard <ChevronRight size={12} />
          </Link>
        </div>
      </div>

      {/* ── All Subjects ──────────────────────────────────────────────────────── */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white">All Subjects</h2>
          <Link href="/prelims" className="text-xs text-saffron-400 hover:text-saffron-300 flex items-center gap-1">
            Practice now <ChevronRight size={12} />
          </Link>
        </div>
        <SubjectGrid filter="all" />
      </div>
    </div>
  )
}
