'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { CheckCircle2, XCircle, SkipForward, Zap, Trophy, RotateCcw, ArrowRight } from 'lucide-react'
import RadarChart from '@/components/charts/RadarChart'
import { useGameStore } from '@/lib/store/gameStore'
import { GS_SUBJECTS } from '@/lib/data/subjects'
import { getXpProgress, LEVEL_TITLES } from '@/lib/game/levels'

function CountUp({ target, duration = 1200 }: { target: number; duration?: number }) {
  const [val, setVal] = useState(0)
  useEffect(() => {
    const start = Date.now()
    const tick = () => {
      const elapsed = Date.now() - start
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setVal(Math.round(target * eased))
      if (progress < 1) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  }, [target, duration])
  return <>{val}</>
}

export default function ResultsPage() {
  const router    = useRouter()
  const session   = useGameStore(s => s.session)
  const userStats = useGameStore(s => s.userStats)
  const leaderboard = useGameStore(s => s.leaderboard)

  useEffect(() => {
    if (!session || session.status !== 'completed') {
      router.replace('/prelims')
    }
  }, [session, router])

  if (!session || session.status !== 'completed') return null

  const answers   = Object.values(session.answers)
  const correct   = answers.filter(a => a.isCorrect).length
  const wrong     = answers.filter(a => !a.isCorrect).length
  const skipped   = session.questions.length - answers.length
  const total     = session.questions.length
  const accuracy  = total > 0 ? Math.round((correct / total) * 100) : 0
  const avgTime   = answers.length > 0
    ? Math.round(answers.reduce((s, a) => s + a.timeTaken, 0) / answers.length)
    : 0

  const prog      = getXpProgress(userStats.totalXp)

  // Build session-level radar
  const subjectAccuracy: Record<string, { correct: number; total: number }> = {}
  for (const q of session.questions) {
    const ans = session.answers[q.id]
    if (!subjectAccuracy[q.subjectId]) subjectAccuracy[q.subjectId] = { correct: 0, total: 0 }
    subjectAccuracy[q.subjectId].total++
    if (ans?.isCorrect) subjectAccuracy[q.subjectId].correct++
  }

  const radarSubjects = GS_SUBJECTS.filter(s => session.subjectIds.includes(s.id))
  const radarTarget   = radarSubjects.map(() => 1.0)
  const radarActual   = radarSubjects.map(s => {
    const d = subjectAccuracy[s.id]
    return d ? d.correct / d.total : 0
  })

  // Leaderboard rank estimation
  const myRank = leaderboard.filter(e => e.accuracyPct > accuracy).length + 1

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">

      {/* Header */}
      <div className="text-center space-y-2">
        <div className="text-5xl">
          {accuracy >= 70 ? '🏆' : accuracy >= 50 ? '📚' : '💪'}
        </div>
        <h1 className="text-2xl font-black text-white">
          {accuracy >= 70 ? 'Brilliant Performance!' : accuracy >= 50 ? 'Good Effort!' : 'Keep Practising!'}
        </h1>
        <p className="text-white/40 text-sm">
          {session.durationMinutes}-minute session completed
        </p>
      </div>

      {/* Score card */}
      <div className="glass p-6 text-center space-y-4">
        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-1">
            <CheckCircle2 size={20} className="text-green-400 mx-auto" />
            <p className="text-2xl font-black text-green-400">
              <CountUp target={correct} />
            </p>
            <p className="text-[10px] text-white/40 uppercase font-bold">Correct</p>
          </div>
          <div className="space-y-1">
            <XCircle size={20} className="text-red-400 mx-auto" />
            <p className="text-2xl font-black text-red-400">
              <CountUp target={wrong} />
            </p>
            <p className="text-[10px] text-white/40 uppercase font-bold">Wrong</p>
          </div>
          <div className="space-y-1">
            <SkipForward size={20} className="text-white/30 mx-auto" />
            <p className="text-2xl font-black text-white/40">
              <CountUp target={skipped} />
            </p>
            <p className="text-[10px] text-white/40 uppercase font-bold">Skipped</p>
          </div>
        </div>

        <div className="h-px bg-white/8" />

        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-xl font-black text-[#ff7c00]">
              <CountUp target={session.score} />
            </p>
            <p className="text-[10px] text-white/40">Score</p>
          </div>
          <div>
            <p className="text-xl font-black text-blue-400">
              <CountUp target={accuracy} />%
            </p>
            <p className="text-[10px] text-white/40">Accuracy</p>
          </div>
          <div>
            <p className="text-xl font-black text-white/60">
              {avgTime}s
            </p>
            <p className="text-[10px] text-white/40">Avg. Time</p>
          </div>
        </div>
      </div>

      {/* XP earned */}
      <div className="glass p-4 flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-[#ff7c00]/20 flex items-center justify-center">
          <Zap size={22} className="text-[#ff7c00]" />
        </div>
        <div className="flex-1">
          <p className="font-bold text-white">+<CountUp target={session.xpEarned} /> XP Earned</p>
          <p className="text-xs text-white/40">
            Level {prog.level} · {LEVEL_TITLES[prog.level]} · {prog.pct}% to next level
          </p>
        </div>
        <div className="text-xs text-white/30 text-right">
          Rank #{myRank}<br />
          <span className="text-[10px]">est.</span>
        </div>
      </div>

      {/* Streak badge */}
      {session.maxStreak >= 3 && (
        <div className="glass p-3 flex items-center gap-2 text-sm">
          <span className="text-xl">🔥</span>
          <span className="text-orange-400 font-bold">Max streak: {session.maxStreak}!</span>
          <span className="text-white/40 text-xs ml-auto">
            {session.maxStreak >= 10 ? '3×' : session.maxStreak >= 5 ? '2×' : '1.5×'} multiplier active
          </span>
        </div>
      )}

      {/* Radar for this session */}
      {radarSubjects.length > 0 && (
        <div className="glass p-5 space-y-3">
          <div className="flex items-center gap-2">
            <Trophy size={14} className="text-[#ff7c00]" />
            <p className="text-sm font-bold text-white">Session Coverage</p>
          </div>
          <RadarChart
            subjects={radarSubjects.map(s => ({ id: s.id, name: s.name, icon: s.icon }))}
            targetData={radarTarget}
            actualData={radarActual}
            size={320}
            animated
          />
        </div>
      )}

      {/* CTA buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <Link href="/prelims"
          className="flex items-center justify-center gap-2 py-3 rounded-xl
            bg-[#ff7c00] text-white font-bold text-sm transition-all hover:bg-[#e05f00]">
          <RotateCcw size={15} /> Play Again
        </Link>
        <Link href="/prelims"
          className="flex items-center justify-center gap-2 py-3 rounded-xl
            glass glass-hover text-white/70 font-semibold text-sm">
          New Subject
        </Link>
        <Link href="/leaderboard"
          className="flex items-center justify-center gap-2 py-3 rounded-xl
            glass glass-hover text-white/70 font-semibold text-sm">
          Leaderboard <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  )
}
