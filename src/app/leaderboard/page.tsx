'use client'

import { Trophy, TrendingUp, Users } from 'lucide-react'
import RadarChart from '@/components/charts/RadarChart'
import LeaderboardTable from '@/components/leaderboard/LeaderboardTable'
import { useGameStore } from '@/lib/store/gameStore'
import { GS_SUBJECTS } from '@/lib/data/subjects'

export default function LeaderboardPage() {
  const userStats   = useGameStore(s => s.userStats)
  const leaderboard = useGameStore(s => s.leaderboard)

  const subjects = GS_SUBJECTS

  const myActual = subjects.map(s => {
    const score = userStats.subjectScores[s.id]
    return score ? score.accuracyPct / 100 : 0
  })

  const top       = leaderboard[0]
  const topActual = top
    ? subjects.map(s => (top.subjectScores[s.id]?.accuracyPct ?? 0) / 100)
    : subjects.map(() => 0)

  const communityAvg = subjects.map(s => {
    const scores = leaderboard.map(e => e.subjectScores[s.id]?.accuracyPct ?? 0)
    return scores.reduce((a, b) => a + b, 0) / (scores.length || 1) / 100
  })

  const myAccuracy = userStats.totalQuestionsAttempted > 0
    ? Math.round((userStats.totalCorrect / userStats.totalQuestionsAttempted) * 100)
    : 0
  const myRank      = leaderboard.filter(e => e.accuracyPct > myAccuracy).length + 1
  const totalPlayers = leaderboard.length + 1

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">

      {/* ── Header ───────────────────────────────────────────────────────────── */}
      <div className="flex items-center gap-4 flex-wrap">
        <div className="w-11 h-11 rounded-xl bg-saffron-500/15 border border-saffron-500/25 flex items-center justify-center">
          <Trophy size={20} className="text-saffron-400" />
        </div>
        <div>
          <h1 className="text-2xl font-black text-white">Leaderboard</h1>
          <p className="text-white/40 text-sm">See where you stand among all aspirants</p>
        </div>
        <div className="ml-auto flex items-center gap-3">
          <div className="text-right">
            <p className="text-2xl font-black text-saffron-400">#{myRank}</p>
            <p className="text-xs text-white/30 flex items-center gap-1">
              <Users size={10} /> {totalPlayers} aspirants
            </p>
          </div>
        </div>
      </div>

      {/* ── Radar comparison ─────────────────────────────────────────────────── */}
      <div className="glass p-6 space-y-5">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-saffron-500/15 flex items-center justify-center">
              <TrendingUp size={13} className="text-saffron-400" />
            </div>
            <h2 className="text-sm font-bold text-white">Subject Coverage Comparison</h2>
          </div>
          <div className="flex items-center gap-4 text-xs text-white/45">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500 opacity-80" /> Target
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500" /> You
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-orange-400" /> Avg
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="space-y-2">
            <p className="text-xs text-center text-white/30 font-medium uppercase tracking-wider">
              Your Coverage
            </p>
            <RadarChart
              subjects={subjects.map(s => ({ id: s.id, name: s.name, icon: s.icon }))}
              targetData={subjects.map(() => 1.0)}
              actualData={myActual}
              compareData={communityAvg}
              size={380}
              animated
              showLegend={false}
            />
          </div>

          {top && (
            <div className="space-y-2">
              <p className="text-xs text-center text-white/30 font-medium uppercase tracking-wider">
                🥇 {top.displayName} · Rank #1
              </p>
              <RadarChart
                subjects={subjects.map(s => ({ id: s.id, name: s.name, icon: s.icon }))}
                targetData={subjects.map(() => 1.0)}
                actualData={topActual}
                compareData={communityAvg}
                size={380}
                animated
                showLegend={false}
              />
            </div>
          )}
        </div>
      </div>

      {/* ── Table ────────────────────────────────────────────────────────────── */}
      <LeaderboardTable />

      {/* ── Sticky rank card ─────────────────────────────────────────────────── */}
      <div className="glass p-4 flex items-center justify-between gap-4 sticky bottom-4
        border border-saffron-500/15 bg-saffron-500/5 shadow-2xl shadow-saffron-500/10">
        <div>
          <p className="text-[10px] text-white/35 uppercase tracking-wider mb-0.5">Your Rank</p>
          <p className="text-2xl font-black text-saffron-400">#{myRank}</p>
        </div>
        <div className="text-center">
          <p className="text-sm font-bold text-white">{userStats.displayName}</p>
          <p className="text-xs text-white/35">Level {userStats.level}</p>
        </div>
        <div className="text-right">
          <p className="text-sm font-semibold text-saffron-300">{userStats.totalXp.toLocaleString()} XP</p>
          <p className="text-[10px] text-white/25">{totalPlayers} total aspirants</p>
        </div>
      </div>
    </div>
  )
}
