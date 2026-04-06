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
    const tick = () => {
      const elapsed  = Date.now() - start
      const progress = Math.min(elapsed / duration, 1)
      const eased    = 1 - Math.pow(1 - progress, 3)
      setVal(Math.round(target * eased))
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
    if (!session || session.status !== 'completed') {
      router.replace('/prelims')
    }
  }, [session, router])

  if (!session || session.status !== 'completed') return null

  const answers  = Object.values(session.answers)
  const correct  = answers.filter(a => a.isCorrect).length
  const wrong    = answers.filter(a => !a.isCorrect).length
  const skipped  = session.questions.length - answers.length
  const total    = session.questions.length
  const accuracy = total > 0 ? Math.round((correct / total) * 100) : 0
  const avgTime  = answers.length > 0
    ? Math.round(answers.reduce((s, a) => s + a.timeTaken, 0) / answers.length)
    : 0

  const prog    = getXpProgress(userStats.totalXp)
  const myRank  = leaderboard.filter(e => e.accuracyPct > accuracy).length + 1

  // Radar for this session
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

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">

      {/* ── Hero result card ──────────────────────────────────────────────────── */}
      <div className={`relative overflow-hidden rounded-2xl border p-7 text-center space-y-3
        ${isGreat
          ? 'bg-gradient-to-br from-saffron-500/10 to-amber-500/5 border-saffron-500/25'
          : isGood
          ? 'bg-gradient-to-br from-blue-500/10 to-navy-900/80 border-blue-500/20'
          : 'bg-gradient-to-br from-navy-900/80 to-navy-950 border-white/8'}`}
      >
        <div className="pointer-events-none absolute inset-0 opacity-30"
          style={{ background: 'radial-gradient(circle at 50% 0%, rgba(255,124,0,0.15) 0%, transparent 70%)' }} />
        <div className="text-5xl mb-1">
          {isGreat ? '🏆' : isGood ? '📚' : '💪'}
        </div>
        <h1 className="text-2xl font-black text-white">
          {isGreat ? 'Brilliant Performance!' : isGood ? 'Good Effort!' : 'Keep Practising!'}
        </h1>
        <p className="text-white/40 text-sm">
          {session.durationMinutes}-minute session · {total} questions
        </p>
      </div>

      {/* ── Score breakdown card ──────────────────────────────────────────────── */}
      <div className="glass p-6 space-y-5">
        {/* Correct / Wrong / Skipped */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { icon: CheckCircle2, label: 'Correct',  value: correct, color: 'text-green-400', bg: 'bg-green-500/10', border: 'border-green-500/20' },
            { icon: XCircle,      label: 'Wrong',    value: wrong,   color: 'text-rose-400',  bg: 'bg-rose-500/10',  border: 'border-rose-500/20' },
            { icon: SkipForward,  label: 'Skipped',  value: skipped, color: 'text-white/40',  bg: 'bg-white/5',      border: 'border-white/8' },
          ].map(({ icon: Icon, label, value, color, bg, border }) => (
            <div key={label} className={`flex flex-col items-center gap-2 rounded-xl ${bg} border ${border} py-4`}>
              <Icon size={18} className={color} />
              <p className={`text-2xl font-black ${color} tabular-nums`}>
                <CountUp target={value} />
              </p>
              <p className="text-[10px] text-white/35 uppercase font-bold tracking-wide">{label}</p>
            </div>
          ))}
        </div>

        <div className="section-divider" />

        {/* Score / Accuracy / Avg Time */}
        <div className="grid grid-cols-3 gap-3 text-center">
          <div>
            <p className="text-2xl font-black text-saffron-400 tabular-nums">
              <CountUp target={session.score} />
            </p>
            <p className="text-[10px] text-white/35 mt-1">Score</p>
          </div>
          <div>
            <p className="text-2xl font-black text-blue-400 tabular-nums">
              <CountUp target={accuracy} />%
            </p>
            <p className="text-[10px] text-white/35 mt-1">Accuracy</p>
          </div>
          <div>
            <p className="text-2xl font-black text-white/55 tabular-nums">{avgTime}s</p>
            <p className="text-[10px] text-white/35 mt-1">Avg. Time</p>
          </div>
        </div>
      </div>

      {/* ── XP earned ────────────────────────────────────────────────────────── */}
      <div className="glass p-5 flex items-center gap-4 border border-saffron-500/15 bg-saffron-500/5">
        <div className="w-12 h-12 rounded-xl bg-saffron-500/20 border border-saffron-500/30 flex items-center justify-center shrink-0">
          <Zap size={22} className="text-saffron-400 fill-saffron-400" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-black text-white text-lg">
            +<CountUp target={session.xpEarned} /> XP Earned
          </p>
          <p className="text-xs text-white/40 mt-0.5">
            Lv.{prog.level} {LEVEL_TITLES[prog.level]} · {prog.pct}% to next level
          </p>
        </div>
        <div className="text-right shrink-0">
          <p className="text-saffron-400 font-black text-lg">#{myRank}</p>
          <p className="text-[10px] text-white/30">est. rank</p>
        </div>
      </div>

      {/* ── Streak badge ─────────────────────────────────────────────────────── */}
      {session.maxStreak >= 3 && (
        <div className="glass flex items-center gap-3 px-4 py-3 border border-orange-500/20 bg-orange-500/5">
          <Flame size={20} className="text-orange-400 shrink-0" />
          <div className="flex-1">
            <span className="text-orange-300 font-bold">Max Streak: {session.maxStreak}!</span>
            <p className="text-[11px] text-white/40 mt-0.5">
              {session.maxStreak >= 10 ? '3× multiplier' : session.maxStreak >= 5 ? '2× multiplier' : '1.5× multiplier'} was active
            </p>
          </div>
          <Trophy size={16} className="text-orange-400/50 shrink-0" />
        </div>
      )}

      {/* ── Session radar ─────────────────────────────────────────────────────── */}
      {radarSubjects.length > 0 && (
        <div className="glass p-5 space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-saffron-500/15 flex items-center justify-center">
              <TrendingUp size={13} className="text-saffron-400" />
            </div>
            <p className="text-sm font-bold text-white">Session Coverage</p>
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
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <button
          onClick={() => router.push('/prelims')}
          className="flex items-center justify-center gap-2 py-3.5 rounded-xl
            bg-gradient-to-r from-saffron-500 to-saffron-400
            hover:from-saffron-600 hover:to-saffron-500
            text-white font-bold text-sm shadow-lg shadow-saffron-500/25
            transition-all hover:scale-[1.02]"
        >
          <RotateCcw size={14} /> Play Again
        </button>
        <Link
          href="/prelims"
          className="flex items-center justify-center gap-2 py-3.5 rounded-xl
            glass glass-hover text-white/65 font-semibold text-sm border border-white/8"
        >
          New Subject
        </Link>
        <Link
          href="/leaderboard"
          className="flex items-center justify-center gap-2 py-3.5 rounded-xl
            glass glass-hover text-white/65 font-semibold text-sm border border-white/8"
        >
          Leaderboard <ArrowRight size={13} />
        </Link>
      </div>
    </div>
  )
}
