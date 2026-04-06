'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { CheckCircle2, XCircle, SkipForward, Zap, Trophy, RotateCcw, ArrowRight, Flame, TrendingUp } from 'lucide-react'
import RadarChart from '@/components/charts/RadarChart'
import { useGameStore } from '@/lib/store/gameStore'
import { GS_SUBJECTS } from '@/lib/data/subjects'
import { getXpProgress, LEVEL_TITLES } from '@/lib/game/levels'

function CountUp({ target, duration = 1000 }: { target: number; duration?: number }) {
  const [val, setVal] = useState(0)
  useEffect(() => {
    const start = Date.now()
    const tick  = () => {
      const elapsed  = Date.now() - start
      const progress = Math.min(elapsed / duration, 1)
      setVal(Math.round(target * (1 - Math.pow(1 - progress, 3))))
      if (progress < 1) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  }, [target, duration])
  return <>{val}</>
}

export default function ResultsPage() {
  const router      = useRouter()
  const session     = useGameStore(s => s.session)
  const userStats   = useGameStore(s => s.userStats)
  const leaderboard = useGameStore(s => s.leaderboard)

  useEffect(() => {
    if (!session || session.status !== 'completed') router.replace('/prelims')
  }, [session, router])

  if (!session || session.status !== 'completed') return null

  const answers  = Object.values(session.answers)
  const correct  = answers.filter(a => a.isCorrect).length
  const wrong    = answers.filter(a => !a.isCorrect).length
  const skipped  = session.questions.length - answers.length
  const total    = session.questions.length
  const accuracy = total > 0 ? Math.round((correct / total) * 100) : 0
  const avgTime  = answers.length > 0
    ? Math.round(answers.reduce((s, a) => s + a.timeTaken, 0) / answers.length) : 0

  const prog   = getXpProgress(userStats.totalXp)
  const myRank = leaderboard.filter(e => e.accuracyPct > accuracy).length + 1

  // Session radar
  const subjectAcc: Record<string, { correct: number; total: number }> = {}
  for (const q of session.questions) {
    const ans = session.answers[q.id]
    if (!subjectAcc[q.subjectId]) subjectAcc[q.subjectId] = { correct: 0, total: 0 }
    subjectAcc[q.subjectId].total++
    if (ans?.isCorrect) subjectAcc[q.subjectId].correct++
  }
  const radarSubjects = GS_SUBJECTS.filter(s => session.subjectIds.includes(s.id))
  const radarActual   = radarSubjects.map(s => {
    const d = subjectAcc[s.id]
    return d ? d.correct / d.total : 0
  })

  const isGreat = accuracy >= 70
  const isGood  = accuracy >= 50

  const heroBg = isGreat
    ? 'color-mix(in oklab, var(--amber) 8%, var(--surface))'
    : isGood
    ? 'color-mix(in oklab, var(--accent) 8%, var(--surface))'
    : 'var(--surface)'
  const heroBorder = isGreat
    ? 'color-mix(in oklab, var(--amber) 25%, var(--border))'
    : isGood
    ? 'color-mix(in oklab, var(--accent) 25%, var(--border))'
    : 'var(--border)'

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">

      {/* ── Hero ─────────────────────────────────────────────────────────────── */}
      <div className="relative overflow-hidden rounded-2xl border p-7 text-center space-y-3"
        style={{ background: heroBg, borderColor: heroBorder }}>
        <div className="text-5xl mb-1">{isGreat ? '🏆' : isGood ? '📚' : '💪'}</div>
        <h1 className="font-heading text-2xl" style={{ color: 'var(--text)' }}>
          {isGreat ? 'Brilliant Performance!' : isGood ? 'Good Effort!' : 'Keep Practising!'}
        </h1>
        <p className="text-sm" style={{ color: 'var(--text-3)' }}>
          {session.durationMinutes}-minute session · {total} questions
        </p>
      </div>

      {/* ── Score breakdown ───────────────────────────────────────────────────── */}
      <div className="card p-6 space-y-5">
        <div className="grid grid-cols-3 gap-3">
          {[
            { icon: CheckCircle2, label: 'Correct', value: correct,  color: 'var(--success)', tint: 'var(--success-tint)' },
            { icon: XCircle,      label: 'Wrong',   value: wrong,    color: 'var(--error)',   tint: 'var(--error-tint)' },
            { icon: SkipForward,  label: 'Skipped', value: skipped,  color: 'var(--text-3)',  tint: 'var(--surface)' },
          ].map(({ icon: Icon, label, value, color, tint }) => (
            <div key={label} className="flex flex-col items-center gap-2 rounded-xl py-4"
              style={{ background: tint, border: `1px solid color-mix(in oklab, ${color} 20%, var(--border))` }}>
              <Icon size={18} style={{ color }} />
              <p className="text-2xl font-black tabular-nums" style={{ color }}>
                <CountUp target={value} />
              </p>
              <p className="text-[10px] font-bold uppercase tracking-wide" style={{ color: 'var(--text-3)' }}>{label}</p>
            </div>
          ))}
        </div>

        <div className="section-divider" />

        <div className="grid grid-cols-3 gap-3 text-center">
          <div>
            <p className="text-2xl font-black tabular-nums" style={{ color: 'var(--amber)' }}>
              <CountUp target={session.score} />
            </p>
            <p className="text-[10px] mt-1" style={{ color: 'var(--text-3)' }}>Score</p>
          </div>
          <div>
            <p className="text-2xl font-black tabular-nums" style={{ color: 'var(--accent)' }}>
              <CountUp target={accuracy} />%
            </p>
            <p className="text-[10px] mt-1" style={{ color: 'var(--text-3)' }}>Accuracy</p>
          </div>
          <div>
            <p className="text-2xl font-black tabular-nums" style={{ color: 'var(--text-2)' }}>{avgTime}s</p>
            <p className="text-[10px] mt-1" style={{ color: 'var(--text-3)' }}>Avg. Time</p>
          </div>
        </div>
      </div>

      {/* ── XP earned ────────────────────────────────────────────────────────── */}
      <div className="card p-5 flex items-center gap-4"
        style={{ border: '1px solid color-mix(in oklab, var(--amber) 20%, var(--border))', background: 'var(--amber-tint)' }}>
        <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
          style={{ background: 'color-mix(in oklab, var(--amber) 15%, var(--elevated))', border: '1px solid color-mix(in oklab, var(--amber) 30%, transparent)' }}>
          <Zap size={22} style={{ color: 'var(--amber)', fill: 'var(--amber)' }} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-black text-lg" style={{ color: 'var(--text)' }}>
            +<CountUp target={session.xpEarned} /> XP Earned
          </p>
          <p className="text-xs mt-0.5" style={{ color: 'var(--text-2)' }}>
            Lv.{prog.level} {LEVEL_TITLES[prog.level]} · {prog.pct}% to next level
          </p>
        </div>
        <div className="text-right shrink-0">
          <p className="text-lg font-black tabular-nums" style={{ color: 'var(--amber)' }}>#{myRank}</p>
          <p className="text-[10px]" style={{ color: 'var(--text-3)' }}>est. rank</p>
        </div>
      </div>

      {/* ── Streak ───────────────────────────────────────────────────────────── */}
      {session.maxStreak >= 3 && (
        <div className="card flex items-center gap-3 px-4 py-3"
          style={{ border: '1px solid color-mix(in oklab, var(--terra) 20%, var(--border))', background: 'var(--terra-tint)' }}>
          <Flame size={20} style={{ color: 'var(--terra)' }} className="shrink-0" />
          <div className="flex-1">
            <span className="font-bold" style={{ color: 'var(--terra)' }}>Max Streak: {session.maxStreak}!</span>
            <p className="text-[11px] mt-0.5" style={{ color: 'var(--text-3)' }}>
              {session.maxStreak >= 10 ? '3× multiplier' : session.maxStreak >= 5 ? '2× multiplier' : '1.5× multiplier'} was active
            </p>
          </div>
          <Trophy size={16} style={{ color: 'var(--terra)', opacity: 0.5 }} className="shrink-0" />
        </div>
      )}

      {/* ── Session radar ─────────────────────────────────────────────────────── */}
      {radarSubjects.length > 0 && (
        <div className="card p-5 space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center"
              style={{ background: 'var(--accent-tint)', border: '1px solid color-mix(in oklab, var(--accent) 20%, transparent)' }}>
              <TrendingUp size={13} style={{ color: 'var(--accent)' }} />
            </div>
            <p className="text-sm font-bold" style={{ color: 'var(--text)' }}>Session Coverage</p>
          </div>
          <RadarChart
            subjects={radarSubjects.map(s => ({ id: s.id, name: s.name, icon: s.icon }))}
            targetData={radarSubjects.map(() => 1.0)}
            actualData={radarActual}
            size={320}
            animated
          />
        </div>
      )}

      {/* ── CTAs ─────────────────────────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center justify-center gap-3">
        <button onClick={() => router.push('/prelims')}
          className="btn-amber flex items-center gap-2 py-2.5 px-6">
          <RotateCcw size={14} /> Play Again
        </button>
        <Link href="/prelims" className="btn-ghost flex items-center gap-2 py-2.5 px-6">
          New Subject
        </Link>
        <Link href="/leaderboard" className="btn-ghost flex items-center gap-2 py-2.5 px-6"
          style={{ color: 'var(--text-2)' }}>
          Leaderboard <ArrowRight size={13} />
        </Link>
      </div>
    </div>
  )
}
