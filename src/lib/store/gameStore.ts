'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { v4 as uuidv4 } from 'uuid'
import type { Question } from '@/lib/data/questions'
import type { GameSession, UserStats, LeaderboardEntry, SetupState, SubjectScore } from '@/types'
import { calculateScore, calculateXP } from '@/lib/game/scoring'
import { getLevel } from '@/lib/game/levels'

// ─── Mock leaderboard data ────────────────────────────────────────────────────

function makeSubjectScores(
  accuracies: Record<string, number>
): Record<string, SubjectScore> {
  const scores: Record<string, SubjectScore> = {}
  for (const [subjectId, pct] of Object.entries(accuracies)) {
    const attempted = Math.floor(Math.random() * 80) + 20
    const correct   = Math.floor(attempted * (pct / 100))
    scores[subjectId] = {
      subjectId,
      totalAttempted: attempted,
      totalCorrect:   correct,
      accuracyPct:    pct,
      xp:             Math.floor(correct * 5),
    }
  }
  return scores
}

const MOCK_LEADERBOARD: LeaderboardEntry[] = [
  {
    rank: 1, userId: 'u-arjun', displayName: 'Arjun Sharma', avatarUrl: '',
    totalXp: 12800, level: 18, accuracyPct: 82, totalSessions: 145,
    subjectScores: makeSubjectScores({ history: 85, geography: 78, polity: 90, economy: 80, environment: 75, 'science-tech': 70, 'current-affairs': 88, 'art-culture': 65 }),
  },
  {
    rank: 2, userId: 'u-priya', displayName: 'Priya Nair', avatarUrl: '',
    totalXp: 11200, level: 17, accuracyPct: 79, totalSessions: 130,
    subjectScores: makeSubjectScores({ history: 80, geography: 82, polity: 75, economy: 85, environment: 80, 'science-tech': 68, 'current-affairs': 77, 'art-culture': 72 }),
  },
  {
    rank: 3, userId: 'u-rohan', displayName: 'Rohan Verma', avatarUrl: '',
    totalXp: 9750, level: 16, accuracyPct: 76, totalSessions: 118,
    subjectScores: makeSubjectScores({ history: 70, geography: 75, polity: 82, economy: 78, environment: 72, 'science-tech': 80, 'current-affairs': 74, 'art-culture': 60 }),
  },
  {
    rank: 4, userId: 'u-ananya', displayName: 'Ananya Mishra', avatarUrl: '',
    totalXp: 8400, level: 15, accuracyPct: 73, totalSessions: 105,
    subjectScores: makeSubjectScores({ history: 75, geography: 68, polity: 72, economy: 70, environment: 78, 'science-tech': 65, 'current-affairs': 80, 'art-culture': 68 }),
  },
  {
    rank: 5, userId: 'u-karan', displayName: 'Karan Mehta', avatarUrl: '',
    totalXp: 7200, level: 14, accuracyPct: 70, totalSessions: 92,
    subjectScores: makeSubjectScores({ history: 68, geography: 72, polity: 70, economy: 65, environment: 74, 'science-tech': 72, 'current-affairs': 68, 'art-culture': 55 }),
  },
  {
    rank: 6, userId: 'u-divya', displayName: 'Divya Krishnan', avatarUrl: '',
    totalXp: 6100, level: 13, accuracyPct: 68, totalSessions: 80,
    subjectScores: makeSubjectScores({ history: 65, geography: 70, polity: 68, economy: 72, environment: 65, 'science-tech': 60, 'current-affairs': 72, 'art-culture': 70 }),
  },
  {
    rank: 7, userId: 'u-siddharth', displayName: 'Siddharth Rao', avatarUrl: '',
    totalXp: 5000, level: 11, accuracyPct: 65, totalSessions: 68,
    subjectScores: makeSubjectScores({ history: 60, geography: 65, polity: 68, economy: 60, environment: 70, 'science-tech': 65, 'current-affairs': 62, 'art-culture': 58 }),
  },
  {
    rank: 8, userId: 'u-meera', displayName: 'Meera Pillai', avatarUrl: '',
    totalXp: 3800, level: 9, accuracyPct: 61, totalSessions: 55,
    subjectScores: makeSubjectScores({ history: 58, geography: 62, polity: 60, economy: 55, environment: 65, 'science-tech': 58, 'current-affairs': 65, 'art-culture': 55 }),
  },
  {
    rank: 9, userId: 'u-vikram', displayName: 'Vikram Joshi', avatarUrl: '',
    totalXp: 2600, level: 6, accuracyPct: 57, totalSessions: 42,
    subjectScores: makeSubjectScores({ history: 55, geography: 58, polity: 55, economy: 52, environment: 60, 'science-tech': 55, 'current-affairs': 58, 'art-culture': 50 }),
  },
  {
    rank: 10, userId: 'u-sneha', displayName: 'Sneha Patil', avatarUrl: '',
    totalXp: 1400, level: 3, accuracyPct: 52, totalSessions: 28,
    subjectScores: makeSubjectScores({ history: 50, geography: 52, polity: 50, economy: 48, environment: 55, 'science-tech': 50, 'current-affairs': 54, 'art-culture': 45 }),
  },
]

// ─── Default new-user stats ───────────────────────────────────────────────────

const DEFAULT_USER_STATS: UserStats = {
  userId:                   'local-user',
  displayName:              'New Aspirant',
  avatarUrl:                '',
  totalXp:                  0,
  level:                    1,
  totalQuestionsAttempted:  0,
  totalCorrect:             0,
  totalSessions:            0,
  streakDays:               0,
  lastPlayedAt:             0,
  subjectScores:            {},
}

const DEFAULT_SETUP: SetupState = {
  selectedSubjectIds: [],
  selectedTopicIds:   [],
  durationMinutes:    10,
}

// ─── Store interface ──────────────────────────────────────────────────────────

interface GameStore {
  session:     GameSession | null
  setupState:  SetupState
  userStats:   UserStats
  leaderboard: LeaderboardEntry[]

  // Actions
  startSession:   (setup: SetupState, questions: Question[]) => void
  submitAnswer:   (questionId: string, chosen: string, timeTaken: number) => void
  endSession:     () => void
  setSetupState:  (partial: Partial<SetupState>) => void
  loadLeaderboard: (entries: LeaderboardEntry[]) => void
  setUserStats:   (stats: UserStats) => void
  resetSession:   () => void
}

// ─── Zustand store ────────────────────────────────────────────────────────────

export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
      session:     null,
      setupState:  DEFAULT_SETUP,
      userStats:   DEFAULT_USER_STATS,
      leaderboard: MOCK_LEADERBOARD,

      startSession(setup, questions) {
        const session: GameSession = {
          id:              uuidv4(),
          userId:          get().userStats.userId,
          subjectIds:      setup.selectedSubjectIds,
          topicIds:        setup.selectedTopicIds,
          durationMinutes: setup.durationMinutes,
          startedAt:       Date.now(),
          questions,
          answers:         {},
          score:           0,
          xpEarned:        0,
          streak:          0,
          maxStreak:       0,
          status:          'active',
        }
        set({ session })
      },

      submitAnswer(questionId, chosen, timeTaken) {
        const { session } = get()
        if (!session || session.status !== 'active') return

        const question = session.questions.find(q => q.id === questionId)
        if (!question) return

        const isCorrect   = question.correct === chosen
        const scoreResult = calculateScore(isCorrect, timeTaken, session.streak)
        const newStreak   = isCorrect ? session.streak + 1 : 0
        const newScore    = session.score + scoreResult.total

        set({
          session: {
            ...session,
            answers: {
              ...session.answers,
              [questionId]: { chosen, timeTaken, isCorrect },
            },
            score:     newScore,
            xpEarned:  calculateXP(newScore),
            streak:    newStreak,
            maxStreak: Math.max(session.maxStreak, newStreak),
          },
        })
      },

      endSession() {
        const { session, userStats } = get()
        if (!session) return

        const completedSession: GameSession = {
          ...session,
          endedAt: Date.now(),
          status:  'completed',
          xpEarned: calculateXP(session.score),
        }

        // Update per-subject stats
        const updatedSubjectScores = { ...userStats.subjectScores }
        for (const question of session.questions) {
          const answer = session.answers[question.id]
          if (!answer) continue
          const sid = question.subjectId
          const existing = updatedSubjectScores[sid] ?? {
            subjectId: sid, totalAttempted: 0, totalCorrect: 0, accuracyPct: 0, xp: 0,
          }
          const newAttempted = existing.totalAttempted + 1
          const newCorrect   = existing.totalCorrect + (answer.isCorrect ? 1 : 0)
          updatedSubjectScores[sid] = {
            subjectId:      sid,
            totalAttempted: newAttempted,
            totalCorrect:   newCorrect,
            accuracyPct:    Math.round((newCorrect / newAttempted) * 100),
            xp:             existing.xp + (answer.isCorrect ? Math.floor(calculateScore(true, answer.timeTaken, 0).total * 0.5) : 0),
          }
        }

        const newTotalXp       = userStats.totalXp + completedSession.xpEarned
        const newTotalAttempted = userStats.totalQuestionsAttempted + session.questions.length
        const newTotalCorrect   = userStats.totalCorrect + Object.values(session.answers).filter(a => a.isCorrect).length

        const updatedStats: UserStats = {
          ...userStats,
          totalXp:                  newTotalXp,
          level:                    getLevel(newTotalXp),
          totalQuestionsAttempted:  newTotalAttempted,
          totalCorrect:             newTotalCorrect,
          totalSessions:            userStats.totalSessions + 1,
          lastPlayedAt:             Date.now(),
          subjectScores:            updatedSubjectScores,
        }

        set({ session: completedSession, userStats: updatedStats })
      },

      setSetupState(partial) {
        set(s => ({ setupState: { ...s.setupState, ...partial } }))
      },

      loadLeaderboard(entries) {
        set({ leaderboard: entries })
      },

      setUserStats(stats) {
        set({ userStats: stats })
      },

      resetSession() {
        set({ session: null })
      },
    }),
    {
      name:    'upscpath-game',
      version: 1,
      // Don't persist the active session's questions (can be large) — re-derive on load
      partialize: (s) => ({
        setupState:  s.setupState,
        userStats:   s.userStats,
        leaderboard: s.leaderboard,
        // persist session without full question bank
        session: s.session
          ? {
              ...s.session,
              questions: [],
            }
          : null,
      }),
    }
  )
)
