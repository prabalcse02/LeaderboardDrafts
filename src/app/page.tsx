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

  const subjects   = GS_SUBJECTS
  const targetData = subjects.map(() => 1.0)
  const actualData = subjects.map(s => {
    const score = userStats.subjectScores[s.id]
    return score ? score.accuracyPct / 100 : 0
  })
  const communityAvg = subjects.map(s => {
    const scores = leaderboard.map(e => e.subjectScores[s.id]?.accuracyPct ?? 0)
    return scores.reduce((a, b) => a + b, 0) / (scores.length || 1) / 100
  })

  const totalAttempted = userStats.totalQuestionsAttempted
  const accuracy = totalAttempted > 0
    ? Math.round((userStats.totalCorrect / totalAttempted) * 100) : 0
  const isNewUser = totalAttempted === 0

  const STAT_CARDS = [
    { icon: Zap,      label: 'Total XP',  value: userStats.totalXp.toLocaleString(), colorClass: 'text-[var(--amber)]',   bgClass: 'bg-[var(--amber-tint)]',   borderClass: 'border-[var(--amber)]/20' },
    { icon: BookOpen, label: 'Questions', value: totalAttempted.toLocaleString(),     colorClass: 'text-[var(--accent)]',  bgClass: 'bg-[var(--accent-tint)]',  borderClass: 'border-[var(--accent)]/20' },
    { icon: Target,   label: 'Accuracy',  value: `${accuracy}%`,
      colorClass:  accuracy >= 70 ? 'text-[var(--success)]' : accuracy >= 50 ? 'text-[var(--warning)]' : 'text-[var(--error)]',
      bgClass:     accuracy >= 70 ? 'bg-[var(--success-tint)]' : accuracy >= 50 ? 'bg-[var(--warning-tint)]' : 'bg-[var(--error-tint)]',
      borderClass: accuracy >= 70 ? 'border-[var(--success)]/20' : accuracy >= 50 ? 'border-[var(--warning)]/20' : 'border-[var(--error)]/20',
    },
    { icon: Flame,    label: 'Day Streak', value: `${userStats.streakDays}d`,         colorClass: 'text-[var(--terra)]',   bgClass: 'bg-[var(--terra-tint)]',   borderClass: 'border-[var(--terra)]/20' },
  ]

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-10">

      {/* ── Hero ──────────────────────────────────────────────────────────────── */}
      <div className="relative overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-7 sm:p-9">
        <div className="pointer-events-none absolute -top-20 -right-20 w-72 h-72 rounded-full"
          style={{ background: 'radial-gradient(circle, color-mix(in oklab, var(--accent) 8%, transparent), transparent 70%)' }} />
        <div className="pointer-events-none absolute -bottom-16 -left-12 w-56 h-56 rounded-full"
          style={{ background: 'radial-gradient(circle, color-mix(in oklab, var(--amber) 6%, transparent), transparent 70%)' }} />

        <div className="relative flex items-center justify-between gap-6 flex-wrap">
          <div className="space-y-3">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest px-2.5 py-1 rounded-full border"
              style={{ color: 'var(--amber)', background: 'var(--amber-tint)', borderColor: 'color-mix(in oklab, var(--amber) 25%, transparent)' }}>
              UPSCPATH Prelims
            </span>
            <h1 className="font-heading text-3xl sm:text-4xl leading-tight" style={{ color: 'var(--text)' }}>
              {isNewUser ? 'Start Your' : 'Continue Your'}<br />
              <span className="gradient-text">IAS Journey</span>
            </h1>
            <p className="text-sm max-w-sm" style={{ color: 'var(--text-3)' }}>
              {isNewUser
                ? 'Practice UPSC Prelims MCQs, earn XP, and climb the national leaderboard.'
                : `Keep going, ${userStats.displayName.split(' ')[0]}. The IAS doesn't prepare itself.`}
            </p>
          </div>

          <Link href="/prelims"
            className="btn-primary group flex items-center gap-2.5 shrink-0 px-6 py-3.5 rounded-xl">
            <Zap size={15} />
            Start Playing
            <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>

      {/* ── XP Bar ────────────────────────────────────────────────────────────── */}
      <XPBar xp={userStats.totalXp} />

      {/* ── Stat Cards ────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {STAT_CARDS.map(({ icon: Icon, label, value, colorClass, bgClass, borderClass }) => (
          <div key={label} className={`card p-5 space-y-3 border ${borderClass}`}>
            <div className={`w-9 h-9 rounded-xl ${bgClass} border ${borderClass} flex items-center justify-center`}>
              <Icon size={16} className={colorClass} />
            </div>
            <div>
              <p className={`text-2xl font-black tabular-nums ${colorClass}`}>{value}</p>
              <p className="text-xs mt-0.5 font-medium" style={{ color: 'var(--text-3)' }}>{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Radar + Subject accuracy ───────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

        {/* Radar */}
        <div className="lg:col-span-3 card p-6 space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center"
              style={{ background: 'var(--amber-tint)', border: '1px solid color-mix(in oklab, var(--amber) 25%, transparent)' }}>
              <TrendingUp size={13} style={{ color: 'var(--amber)' }} />
            </div>
            <h2 className="text-sm font-bold" style={{ color: 'var(--text)' }}>Coverage Map</h2>
            <span className="ml-auto text-[10px] font-medium px-2 py-0.5 rounded-full"
              style={{ color: 'var(--text-3)', background: 'var(--surface)' }}>
              vs. Community Avg
            </span>
          </div>

          {isNewUser && (
            <div className="text-center py-3 px-4 rounded-xl" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
              <p className="text-xs" style={{ color: 'var(--text-3)' }}>
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

        {/* Subject accuracy list */}
        <div className="lg:col-span-2 card p-6 space-y-4 flex flex-col">
          <h2 className="text-sm font-bold" style={{ color: 'var(--text)' }}>Subject Accuracy</h2>

          <div className="space-y-3 flex-1">
            {subjects.map(s => {
              const score = userStats.subjectScores[s.id]
              const acc   = score?.accuracyPct ?? 0
              const tried = score?.totalAttempted ?? 0
              const barColor = !tried ? 'var(--border)'
                : acc >= 70 ? 'var(--success)'
                : acc >= 50 ? 'var(--warning)'
                : 'var(--error)'
              return (
                <div key={s.id} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="flex items-center gap-1.5" style={{ color: 'var(--text-2)' }}>
                      <span className="text-sm">{s.icon}</span>
                      <span className="font-medium">{s.name.split(' ')[0]}</span>
                    </span>
                    <span className="font-bold tabular-nums"
                      style={{ color: !tried ? 'var(--text-3)' : acc >= 70 ? 'var(--success)' : acc >= 50 ? 'var(--warning)' : 'var(--error)' }}>
                      {tried === 0 ? '—' : `${acc}%`}
                    </span>
                  </div>
                  <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--border)' }}>
                    <div className="h-full rounded-full transition-all duration-700"
                      style={{ width: `${acc}%`, background: barColor }} />
                  </div>
                </div>
              )
            })}
          </div>

          <Link href="/leaderboard"
            className="mt-auto flex items-center justify-center gap-1.5 w-full py-2.5 rounded-xl text-xs font-semibold transition-colors"
            style={{ color: 'var(--accent)', background: 'var(--accent-tint)', border: '1px solid color-mix(in oklab, var(--accent) 20%, transparent)' }}>
            View Full Leaderboard <ChevronRight size={12} />
          </Link>
        </div>
      </div>

      {/* ── All Subjects ──────────────────────────────────────────────────────── */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-heading text-xl" style={{ color: 'var(--text)' }}>All Subjects</h2>
          <Link href="/prelims" className="text-xs font-semibold flex items-center gap-1 transition-colors"
            style={{ color: 'var(--accent)' }}>
            Practice now <ChevronRight size={12} />
          </Link>
        </div>
        <SubjectGrid filter="all" />
      </div>
    </div>
  )
}
