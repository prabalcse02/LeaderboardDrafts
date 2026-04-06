'use client'

import { Trophy, TrendingUp, Users } from 'lucide-react'
import RadarChart from '@/components/charts/RadarChart'
import LeaderboardTable from '@/components/leaderboard/LeaderboardTable'
import { useGameStore } from '@/lib/store/gameStore'
import { GS_SUBJECTS } from '@/lib/data/subjects'

export default function LeaderboardPage() {
  const userStats   = useGameStore(s => s.userStats)
  const leaderboard = useGameStore(s => s.leaderboard)
  const subjects    = GS_SUBJECTS

  const myActual = subjects.map(s => (userStats.subjectScores[s.id]?.accuracyPct ?? 0) / 100)
  const top      = leaderboard[0]
  const topActual = top
    ? subjects.map(s => (top.subjectScores[s.id]?.accuracyPct ?? 0) / 100)
    : subjects.map(() => 0)
  const communityAvg = subjects.map(s => {
    const scores = leaderboard.map(e => e.subjectScores[s.id]?.accuracyPct ?? 0)
    return scores.reduce((a, b) => a + b, 0) / (scores.length || 1) / 100
  })

  const myAccuracy   = userStats.totalQuestionsAttempted > 0
    ? Math.round((userStats.totalCorrect / userStats.totalQuestionsAttempted) * 100) : 0
  const myRank       = leaderboard.filter(e => e.accuracyPct > myAccuracy).length + 1
  const totalPlayers = leaderboard.length + 1

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">

      {/* ── Header ─────────────────────────────────────────────────────────────── */}
      <div className="flex items-center gap-4 flex-wrap">
        <div className="w-11 h-11 rounded-xl flex items-center justify-center"
          style={{ background: 'var(--amber-tint)', border: '1px solid color-mix(in oklab, var(--amber) 25%, transparent)' }}>
          <Trophy size={20} style={{ color: 'var(--amber)' }} />
        </div>
        <div>
          <h1 className="font-heading text-2xl" style={{ color: 'var(--text)' }}>Leaderboard</h1>
          <p className="text-sm" style={{ color: 'var(--text-3)' }}>See where you stand among all aspirants</p>
        </div>
        <div className="ml-auto text-right">
          <p className="text-2xl font-black tabular-nums" style={{ color: 'var(--amber)' }}>#{myRank}</p>
          <p className="text-xs flex items-center gap-1 justify-end" style={{ color: 'var(--text-3)' }}>
            <Users size={10} /> {totalPlayers} aspirants
          </p>
        </div>
      </div>

      {/* ── Radar comparison ───────────────────────────────────────────────────── */}
      <div className="card p-6 space-y-5">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center"
              style={{ background: 'var(--accent-tint)', border: '1px solid color-mix(in oklab, var(--accent) 20%, transparent)' }}>
              <TrendingUp size={13} style={{ color: 'var(--accent)' }} />
            </div>
            <h2 className="text-sm font-bold" style={{ color: 'var(--text)' }}>Subject Coverage Comparison</h2>
          </div>
          <div className="flex items-center gap-4 text-xs" style={{ color: 'var(--text-3)' }}>
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
            <p className="text-xs text-center font-medium uppercase tracking-wider" style={{ color: 'var(--text-3)' }}>
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
              <p className="text-xs text-center font-medium uppercase tracking-wider" style={{ color: 'var(--text-3)' }}>
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

      {/* ── Table ──────────────────────────────────────────────────────────────── */}
      <LeaderboardTable />

      {/* ── Sticky rank footer ─────────────────────────────────────────────────── */}
      <div className="card p-4 flex items-center justify-between gap-4 sticky bottom-4"
        style={{ border: '1px solid color-mix(in oklab, var(--amber) 20%, var(--border))', background: 'var(--elevated)' }}>
        <div>
          <p className="text-[10px] uppercase tracking-wider mb-0.5" style={{ color: 'var(--text-3)' }}>Your Rank</p>
          <p className="text-2xl font-black tabular-nums" style={{ color: 'var(--amber)' }}>#{myRank}</p>
        </div>
        <div className="text-center">
          <p className="text-sm font-bold" style={{ color: 'var(--text)' }}>{userStats.displayName}</p>
          <p className="text-xs" style={{ color: 'var(--text-3)' }}>Level {userStats.level}</p>
        </div>
        <div className="text-right">
          <p className="text-sm font-semibold" style={{ color: 'var(--amber)' }}>{userStats.totalXp.toLocaleString()} XP</p>
          <p className="text-[10px]" style={{ color: 'var(--text-3)' }}>{totalPlayers} total aspirants</p>
        </div>
      </div>
    </div>
  )
}
