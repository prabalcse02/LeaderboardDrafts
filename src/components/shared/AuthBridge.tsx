'use client'

/**
 * AuthBridge — seeds the Zustand game store from Supabase auth on mount.
 *
 * In standalone mode (no Supabase env vars) it is a no-op — the store keeps
 * its localStorage-persisted state (or defaults to 'New Aspirant').
 *
 * In embedded mode (upscpath.com with real Supabase creds) it:
 *   1. Reads the logged-in user from Supabase Auth
 *   2. Fetches their profile (display_name, avatar_url) and user_stats from DB
 *   3. Calls setUserStats() to hydrate the store with real data
 *   4. Calls loadLeaderboard() to replace mock entries with live ranked data
 *
 * Place <AuthBridge /> inside the .prelims-root wrapper (layout.tsx).
 */

import { useEffect } from 'react'
import { useGameStore } from '@/lib/store/gameStore'

export default function AuthBridge() {
  const setUserStats   = useGameStore(s => s.setUserStats)
  const loadLeaderboard = useGameStore(s => s.loadLeaderboard)

  useEffect(() => {
    // Guard: skip entirely if Supabase env vars are not configured
    if (
      !process.env.NEXT_PUBLIC_SUPABASE_URL ||
      !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    ) return

    async function bootstrap() {
      try {
        // Dynamically import to avoid bundling Supabase in standalone builds
        const { createClient } = await import('@/lib/supabase/client')
        const supabase = createClient()

        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        // Fetch profile + stats in parallel
        const [profileRes, statsRes, leaderboardRes] = await Promise.all([
          supabase
            .from('profiles')
            .select('display_name, avatar_url')
            .eq('user_id', user.id)
            .single(),
          supabase
            .from('user_stats')
            .select('total_xp, level, total_questions_attempted, total_correct, total_sessions, streak_days, last_played_at')
            .eq('user_id', user.id)
            .single(),
          supabase
            .from('leaderboard_view')
            .select('user_id, display_name, avatar_url, total_xp, level, accuracy_pct, total_sessions, rank')
            .order('rank', { ascending: true })
            .limit(50),
        ])

        const profile = profileRes.data
        const stats   = statsRes.data

        if (stats) {
          setUserStats({
            userId:                  user.id,
            displayName:             profile?.display_name ?? 'Aspirant',
            avatarUrl:               profile?.avatar_url  ?? '',
            totalXp:                 stats.total_xp                  ?? 0,
            level:                   stats.level                     ?? 1,
            totalQuestionsAttempted: stats.total_questions_attempted  ?? 0,
            totalCorrect:            stats.total_correct              ?? 0,
            totalSessions:           stats.total_sessions             ?? 0,
            streakDays:              stats.streak_days                ?? 0,
            lastPlayedAt:            stats.last_played_at
              ? new Date(stats.last_played_at).getTime() : 0,
            subjectScores: {}, // per-subject stats fetched separately on demand
          })
        }

        if (leaderboardRes.data && leaderboardRes.data.length > 0) {
          // Map leaderboard_view rows → LeaderboardEntry shape
          const entries = leaderboardRes.data.map((row, idx) => ({
            rank:          idx + 1,
            userId:        row.user_id        ?? '',
            displayName:   row.display_name   ?? 'Aspirant',
            avatarUrl:     row.avatar_url     ?? '',
            totalXp:       row.total_xp       ?? 0,
            level:         row.level          ?? 1,
            accuracyPct:   Number(row.accuracy_pct ?? 0),
            totalSessions: row.total_sessions ?? 0,
            subjectScores: {},
          }))
          loadLeaderboard(entries)
        }
      } catch (err) {
        // Non-fatal — game works without auth; just log in dev
        if (process.env.NODE_ENV === 'development') {
          console.warn('[AuthBridge] Could not load user data from Supabase:', err)
        }
      }
    }

    bootstrap()
  }, [setUserStats, loadLeaderboard])

  return null
}
