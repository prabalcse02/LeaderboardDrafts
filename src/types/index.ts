export interface GameSession {
  id: string
  userId: string
  subjectIds: string[]
  topicIds: string[]
  durationMinutes: number
  startedAt: number
  endedAt?: number
  questions: import('@/lib/data/questions').Question[]
  answers: Record<string, { chosen: string; timeTaken: number; isCorrect: boolean }>
  score: number
  xpEarned: number
  streak: number
  maxStreak: number
  status: 'active' | 'completed' | 'abandoned'
}

export interface UserStats {
  userId: string
  displayName: string
  avatarUrl: string
  totalXp: number
  level: number
  totalQuestionsAttempted: number
  totalCorrect: number
  totalSessions: number
  streakDays: number
  lastPlayedAt: number
  subjectScores: Record<string, SubjectScore> // subjectId -> score
}

export interface SubjectScore {
  subjectId: string
  totalAttempted: number
  totalCorrect: number
  accuracyPct: number  // 0-100
  xp: number
}

export interface LeaderboardEntry {
  rank: number
  userId: string
  displayName: string
  avatarUrl: string
  totalXp: number
  level: number
  accuracyPct: number
  totalSessions: number
  subjectScores: Record<string, SubjectScore>
}

export interface SetupState {
  selectedSubjectIds: string[]
  selectedTopicIds: string[]
  durationMinutes: number
}
