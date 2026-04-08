'use client'

import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { ROUTES } from '@/lib/config'
import RadarChart from '@/components/charts/RadarChart'
import SubjectGrid from '@/components/dashboard/SubjectGrid'
import { useGameStore } from '@/lib/store/gameStore'
import { GS_SUBJECTS } from '@/lib/data/subjects'
import { getXpProgress } from '@/lib/game/levels'

/* ── Tiny reusable section-label ─────────────────────────────────────────── */
function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[10px] font-semibold uppercase tracking-[0.18em]"
      style={{ color: 'var(--amber)' }}>
      {children}
    </p>
  )
}

/* ── Mini stat card (no icon — matches upscpath.com Daily Pulse grid) ─────── */
function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl p-4 space-y-2" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
      <p className="text-[9px] font-semibold uppercase tracking-[0.14em]" style={{ color: 'var(--text-3)' }}>
        {label}
      </p>
      <p className="text-2xl font-bold tabular-nums leading-none" style={{ color: 'var(--text)' }}>
        {value}
      </p>
    </div>
  )
}

/* ── Simple activity heatmap ─────────────────────────────────────────────── */
function ActivityHeatmap({ sessionsMap }: { sessionsMap: Record<string, number> }) {
  // Build last 52 weeks × 7 days = 364 cells
  const today   = new Date()
  const cells: { date: string; count: number }[] = []
  for (let i = 363; i >= 0; i--) {
    const d = new Date(today)
    d.setDate(today.getDate() - i)
    const key = d.toISOString().slice(0, 10)
    cells.push({ date: key, count: sessionsMap[key] ?? 0 })
  }

  // Group into weeks (columns)
  const weeks: typeof cells[] = []
  for (let w = 0; w < 52; w++) weeks.push(cells.slice(w * 7, w * 7 + 7))

  const maxCount = Math.max(1, ...cells.map(c => c.count))

  function cellColor(count: number) {
    if (count === 0) return 'var(--surface)'
    const intensity = Math.min(count / maxCount, 1)
    if (intensity < 0.25) return 'color-mix(in oklab, var(--accent) 25%, var(--surface))'
    if (intensity < 0.5)  return 'color-mix(in oklab, var(--accent) 45%, var(--surface))'
    if (intensity < 0.75) return 'color-mix(in oklab, var(--accent) 65%, var(--surface))'
    return 'var(--accent)'
  }

  // Month labels — sample from first day of each visible month
  const monthLabels: { label: string; col: number }[] = []
  let lastMonth = -1
  weeks.forEach((week, wi) => {
    const firstDay = week[0]
    if (!firstDay) return
    const m = new Date(firstDay.date).getMonth()
    if (m !== lastMonth) {
      monthLabels.push({ label: new Date(firstDay.date).toLocaleString('default', { month: 'short' }), col: wi })
      lastMonth = m
    }
  })

  return (
    <div className="overflow-x-auto">
      {/* Month labels */}
      <div className="flex gap-[3px] mb-1 ml-0">
        {weeks.map((_, wi) => {
          const lbl = monthLabels.find(m => m.col === wi)
          return (
            <div key={wi} className="w-[10px] shrink-0 text-[8px]" style={{ color: 'var(--text-3)' }}>
              {lbl?.label ?? ''}
            </div>
          )
        })}
      </div>
      {/* Grid */}
      <div className="flex gap-[3px]">
        {weeks.map((week, wi) => (
          <div key={wi} className="flex flex-col gap-[3px]">
            {week.map((cell) => (
              <div
                key={cell.date}
                title={`${cell.date}: ${cell.count} session${cell.count !== 1 ? 's' : ''}`}
                className="w-[10px] h-[10px] rounded-[2px] transition-colors"
                style={{
                  background: cellColor(cell.count),
                  border: '1px solid color-mix(in oklab, var(--border) 60%, transparent)',
                }}
              />
            ))}
          </div>
        ))}
      </div>
      {/* Legend */}
      <div className="flex items-center gap-1.5 mt-2">
        <span className="text-[9px]" style={{ color: 'var(--text-3)' }}>Less</span>
        {[0, 0.25, 0.5, 0.75, 1].map(v => (
          <div key={v} className="w-[10px] h-[10px] rounded-[2px]"
            style={{ background: v === 0 ? 'var(--surface)' : `color-mix(in oklab, var(--accent) ${Math.round(v * 65 + 25)}%, var(--surface))`, border: '1px solid color-mix(in oklab, var(--border) 60%, transparent)' }} />
        ))}
        <span className="text-[9px]" style={{ color: 'var(--text-3)' }}>More</span>
      </div>
    </div>
  )
}

/* ── Subject progress card (GS-1/2/3 style) ─────────────────────────────── */
function SubjectProgressCard({
  label, pct, completed, total, href,
}: { label: string; pct: number; completed: number; total: number; href: string }) {
  return (
    <div className="card p-5 flex flex-col gap-4 hover:shadow-sm transition-shadow">
      <div className="flex items-start justify-between gap-2">
        <span className="text-base font-bold" style={{ color: 'var(--text)' }}>{label}</span>
        <span className="shrink-0 text-xs font-semibold px-2 py-0.5 rounded-full"
          style={{ background: 'color-mix(in oklab, var(--amber) 12%, var(--surface))', color: 'var(--amber)' }}>
          {pct.toFixed(2)}%
        </span>
      </div>
      <p className="text-xs -mt-2" style={{ color: 'var(--text-3)' }}>
        {completed} of {total} questions completed
      </p>
      <div className="h-1 rounded-full overflow-hidden" style={{ background: 'var(--border)' }}>
        <div className="h-full rounded-full transition-all duration-700"
          style={{ width: `${pct}%`, background: 'var(--amber)' }} />
      </div>
      <Link href={href} className="text-xs font-semibold flex items-center gap-0.5 transition-colors"
        style={{ color: 'var(--amber)' }}>
        Jump to {label} <ChevronRight size={12} />
      </Link>
    </div>
  )
}

/* ── Page ────────────────────────────────────────────────────────────────── */
export default function DashboardPage() {
  const userStats   = useGameStore(s => s.userStats)
  const leaderboard = useGameStore(s => s.leaderboard)
  const sessions: { completedAt?: string }[] = []

  const subjects   = GS_SUBJECTS
  const progress   = getXpProgress(userStats.totalXp)

  const totalAttempted = userStats.totalQuestionsAttempted
  const accuracy = totalAttempted > 0
    ? Math.round((userStats.totalCorrect / totalAttempted) * 100) : 0
  const firstName = userStats.displayName.split(' ')[0]

  // Radar data
  const targetData   = subjects.map(() => 1.0)
  const actualData   = subjects.map(s => (userStats.subjectScores[s.id]?.accuracyPct ?? 0) / 100)
  const communityAvg = subjects.map(s => {
    const scores = leaderboard.map(e => e.subjectScores[s.id]?.accuracyPct ?? 0)
    return scores.reduce((a, b) => a + b, 0) / (scores.length || 1) / 100
  })

  // Activity heatmap — count sessions per date
  const sessionsMap: Record<string, number> = {}
  sessions.forEach((s: { completedAt?: string }) => {
    if (!s.completedAt) return
    const day = s.completedAt.slice(0, 10)
    sessionsMap[day] = (sessionsMap[day] ?? 0) + 1
  })

  // Streak
  const longestStreak = userStats.streakDays ?? 0
  const currentStreak = userStats.streakDays ?? 0

  return (
    <div className="max-w-screen-lg mx-auto px-5 py-8 space-y-6">

      {/* ── Daily Pulse card ─────────────────────────────────────────────── */}
      <div className="card p-7">
        <div className="flex flex-col lg:flex-row gap-6">

          {/* Left: greeting + CTA */}
          <div className="flex-1 space-y-4">
            <SectionLabel>Daily Pulse</SectionLabel>
            <h1 className="font-heading text-3xl sm:text-4xl leading-tight" style={{ color: 'var(--text)' }}>
              Hello {firstName}, you&rsquo;re{' '}
              <span style={{ color: 'var(--amber)' }}>{totalAttempted.toLocaleString()}</span>{' '}
              questions in.
            </h1>
            <p className="text-sm leading-relaxed max-w-md" style={{ color: 'var(--text-2)' }}>
              {totalAttempted === 0
                ? <>Welcome! Start your first practice session to build a <span style={{ textDecoration: 'underline dotted', textUnderlineOffset: '3px' }}>consistent</span> study habit and unlock your <span style={{ textDecoration: 'underline dotted', textUnderlineOffset: '3px' }}>potential</span>.</>
                : <>Keep going — {accuracy}% accuracy so far. <span style={{ textDecoration: 'underline dotted', textUnderlineOffset: '3px' }}>Consistent</span> daily practice is how toppers build their edge.</>
              }
            </p>
            <div className="flex items-center gap-3 flex-wrap pt-1">
              <Link href={ROUTES.prelims} className="btn-amber">
                Start Practising
              </Link>
              <Link href={ROUTES.leaderboard} className="btn-ghost">
                View Ranks
              </Link>
            </div>
          </div>

          {/* Right: 2×2 stat mini-cards */}
          <div className="grid grid-cols-2 gap-3 lg:w-72 shrink-0">
            <StatCard label="Total Questions" value={totalAttempted.toLocaleString()} />
            <StatCard label={`${userStats.streakDays}-Day Streak`} value={`${userStats.streakDays}d`} />
            <StatCard label="Accuracy" value={totalAttempted > 0 ? `${accuracy}%` : '—'} />
            <StatCard label={`Level ${progress.level}`} value={`${userStats.totalXp.toLocaleString()} XP`} />
          </div>
        </div>
      </div>

      {/* ── XP / level progress (slim inline bar) ────────────────────────── */}
      <div className="card px-6 py-4">
        <div className="flex items-center gap-4">
          <div className="shrink-0 w-10 h-10 rounded-xl flex items-center justify-center font-heading text-lg font-bold"
            style={{ background: 'var(--amber-tint)', color: 'var(--amber)', border: '1.5px solid color-mix(in oklab, var(--amber) 28%, transparent)' }}>
            {progress.level}
          </div>
          <div className="flex-1 space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="font-semibold" style={{ color: 'var(--text)' }}>{progress.title}</span>
              {progress.level < 20
                ? <span style={{ color: 'var(--text-3)' }}>{progress.current.toLocaleString()} / {progress.required.toLocaleString()} XP</span>
                : <span style={{ color: 'var(--amber)' }} className="font-bold">MAX LEVEL</span>
              }
            </div>
            <div className="h-2 rounded-full overflow-hidden" style={{ background: 'var(--border)' }}>
              <div className="h-full rounded-full transition-all duration-1000"
                style={{ width: `${progress.pct}%`, background: 'linear-gradient(90deg, var(--amber), var(--terra))' }} />
            </div>
          </div>
        </div>
      </div>

      {/* ── Reading / Practice activity heatmap ──────────────────────────── */}
      <div className="card p-6 space-y-4">
        <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
          <span className="text-sm font-bold" style={{ color: 'var(--text)' }}>Practice activity</span>
          <span className="text-xs" style={{ color: 'var(--text-3)' }}>·</span>
          <span className="text-xs" style={{ color: 'var(--text-3)' }}>Longest streak: {longestStreak} days</span>
          <span className="text-xs" style={{ color: 'var(--text-3)' }}>·</span>
          <span className="text-xs" style={{ color: 'var(--text-3)' }}>Current streak: {currentStreak} days</span>
        </div>
        <ActivityHeatmap sessionsMap={sessionsMap} />
      </div>

      {/* ── Section Insights — subject progress ──────────────────────────── */}
      <div className="space-y-4">
        <div className="flex items-end justify-between">
          <div className="space-y-1">
            <SectionLabel>Section Insights</SectionLabel>
            <h2 className="font-heading text-2xl" style={{ color: 'var(--text)' }}>
              Progress across subjects
            </h2>
          </div>
          <Link href={ROUTES.prelims}
            className="text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-0.5 shrink-0"
            style={{ color: 'var(--amber)', background: 'var(--amber-tint)' }}>
            Next up: GS 1 <ChevronRight size={11} />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {subjects.slice(0, 3).map((s, i) => {
            const score     = userStats.subjectScores[s.id]
            const attempted = score?.totalAttempted ?? 0
            const correct   = score?.totalCorrect ?? 0
            const total     = 100 // approximation — replace with real total if available
            const pct       = attempted > 0 ? Math.min((attempted / total) * 100, 100) : 0
            return (
              <SubjectProgressCard
                key={s.id}
                label={`GS ${i + 1}`}
                pct={pct}
                completed={correct}
                total={total}
                href={ROUTES.prelims}
              />
            )
          })}
        </div>
      </div>

      {/* ── Coverage radar + Subject accuracy ────────────────────────────── */}
      <div className="space-y-4">
        <div className="space-y-1">
          <SectionLabel>Performance Radar</SectionLabel>
          <h2 className="font-heading text-2xl" style={{ color: 'var(--text)' }}>
            Subject coverage map
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
          {/* Radar */}
          <div className="lg:col-span-3 card p-6 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium" style={{ color: 'var(--text-3)' }}>
                Your coverage vs Community average
              </span>
            </div>
            {totalAttempted === 0 && (
              <p className="text-xs text-center py-2" style={{ color: 'var(--text-3)' }}>
                Complete a session to see your radar.
              </p>
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

          {/* Subject accuracy list */}
          <div className="lg:col-span-2 card p-6 space-y-4 flex flex-col">
            <h3 className="text-sm font-bold" style={{ color: 'var(--text)' }}>Subject Accuracy</h3>
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
                        <span>{s.icon}</span>
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
            <Link href={ROUTES.leaderboard}
              className="mt-auto flex items-center justify-center gap-1 w-full py-2 rounded-full text-xs font-semibold border transition-colors"
              style={{ color: 'var(--accent)', borderColor: 'color-mix(in oklab, var(--accent) 25%, transparent)', background: 'var(--accent-tint)' }}>
              Full Leaderboard <ChevronRight size={11} />
            </Link>
          </div>
        </div>
      </div>

      {/* ── All Subjects ──────────────────────────────────────────────────── */}
      <div className="space-y-4">
        <div className="flex items-end justify-between">
          <div className="space-y-1">
            <SectionLabel>Browse</SectionLabel>
            <h2 className="font-heading text-2xl" style={{ color: 'var(--text)' }}>All Subjects</h2>
          </div>
          <Link href={ROUTES.prelims} className="text-xs font-semibold flex items-center gap-0.5"
            style={{ color: 'var(--accent)' }}>
            Practice now <ChevronRight size={11} />
          </Link>
        </div>
        <SubjectGrid filter="all" />
      </div>

    </div>
  )
}
