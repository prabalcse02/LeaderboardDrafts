/**
 * UPSC Prelims Scoring Engine
 *
 * Base:    +10 correct answer
 * Speed:   +5 if < 10s, +3 if < 20s, +1 if < 30s
 * Streak:  1× (0–2), 1.5× (3–4), 2× (5–9), 3× (10+)
 * Penalty: −3 wrong answer (UPSC negative marking)
 * XP:      score × 0.5, minimum 0
 */

export type ScoreResult = {
  base: number
  speedBonus: number
  penalty: number
  multiplier: number
  total: number
}

export function getStreakMultiplier(streak: number): number {
  if (streak >= 10) return 3
  if (streak >= 5)  return 2
  if (streak >= 3)  return 1.5
  return 1
}

export function getSpeedBonus(timeTaken: number): number {
  if (timeTaken < 10) return 5
  if (timeTaken < 20) return 3
  if (timeTaken < 30) return 1
  return 0
}

/**
 * Calculate the raw score for a single answer.
 *
 * @param isCorrect  Whether the chosen answer is correct
 * @param timeTaken  Seconds taken to answer
 * @param streak     Current correct-answer streak before this answer
 * @returns          Detailed breakdown of points earned/lost
 */
export function calculateScore(
  isCorrect: boolean,
  timeTaken: number,
  streak: number
): ScoreResult {
  if (!isCorrect) {
    return {
      base: 0,
      speedBonus: 0,
      penalty: -3,
      multiplier: 1,
      total: -3,
    }
  }

  const base = 10
  const speedBonus = getSpeedBonus(timeTaken)
  const multiplier = getStreakMultiplier(streak)
  const raw = (base + speedBonus) * multiplier
  // Round to nearest integer
  const total = Math.round(raw)

  return {
    base,
    speedBonus,
    penalty: 0,
    multiplier,
    total,
  }
}

/**
 * Convert accumulated game score to XP.
 * Minimum XP is 0 (negative scores yield 0 XP).
 */
export function calculateXP(totalScore: number): number {
  return Math.max(0, Math.floor(totalScore * 0.5))
}
