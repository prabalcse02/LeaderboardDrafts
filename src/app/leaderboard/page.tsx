'use client'

import { Trophy } from 'lucide-react'
import RadarChart from '@/components/charts/RadarChart'
import LeaderboardTable from '@/components/leaderboard/LeaderboardTable'
import { useGameStore } from '@/lib/store/gameStore'
import { GS_SUBJECTS } from '@/lib/data/subjects'

export default function LeaderboardPage() {
  const userStats   = useGameStore(s => s.userStats)
  const leaderboard = useGameStore(s => s.leaderboard)

  const subjects = GS_SUBJECTS

  // User's actual
  const myActual = subjects.map(s => {
    const score = userStats.subjectScores[s.id]
    return score ? score.accuracyPct / 100 : 0
  })

  // Top player
  const top = leaderboard[0]
  const topActual = top
    ? subjects.map(s => (top.subjectScores[s.id]?.accuracyPct ?? 0) / 100)
    : subjects.map(() => 0)

  // Community average
  const communityAvg = subjects.map(s => {
    const scores = leaderboard.map(e => e.subjectScores[s.id]?.accuracyPct ?? 0)
    return scores.reduce((a, b) => a + b, 0) / (scores.length || 1) / 100
  })

  const myRank = leaderboard.filter(e => e.accuracyPct >
    (userStats.totalQuestionsAttempted > 0
      ? Math.round((userStats.totalCorrect / userStats.totalQuestionsAttempted) * 100)
      : 0)
  ).length + 1

  const totalPlayers = leaderboard.length + 1

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">

      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-[#ff7c00]/20 flex items-center justify-center">
          <Trophy size={20} className="text-[#ff7c00]" />
        </div>
        <div>
          <h1 className="text-2xl font-black text-white">Leaderboard</h1>
          <p className="text-white/40 text-sm">See where you stand on the UPSCPATH</p>
        </div>
        <div className="ml-auto text-right">
          <p className="text-lg font-black text-[#ff7c00]">#{myRank}</p>
          <p className="text-xs text-white/30">of {totalPlayers} aspirants</p>
        </div>
      </div>

      {/* Radar comparison */}
      <div className="glass p-6 space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <h2 className="text-sm font-bold text-white">Subject Coverage — You vs. Top Player vs. Community</h2>
          <div className="flex items-center gap-4 text-xs text-white/50">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500" /> Target (1.0)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500" /> You
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-orange-400" /> Community Avg
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          {/* Your radar */}
          <div className="space-y-2">
            <p className="text-xs text-center text-white/30">Your Coverage</p>
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

          {/* Top player radar */}
          {top && (
            <div className="space-y-2">
              <p className="text-xs text-center text-white/30">
                🥇 {top.displayName} (Rank #1)
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

      {/* Table */}
      <LeaderboardTable />

      {/* Your rank sticky card */}
      <div className="glass p-4 flex items-center justify-between gap-4 sticky bottom-4">
        <div>
          <p className="text-xs text-white/40">Your Rank</p>
          <p className="text-xl font-black text-[#ff7c00]">#{myRank}</p>
        </div>
        <div className="text-center">
          <p className="text-xs text-white/40">{userStats.displayName}</p>
          <p className="text-sm font-bold text-white">Level {userStats.level}</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-white/40">{userStats.totalXp.toLocaleString()} XP</p>
          <p className="text-xs text-white/30">{totalPlayers} total aspirants</p>
        </div>
      </div>
    </div>
  )
}
