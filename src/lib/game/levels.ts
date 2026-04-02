/**
 * Level system — exponential XP scaling across 20 levels.
 *
 * Formula: xpForLevel(n) = Math.floor(100 * 1.5^(n-1))
 * Level 1 = 0 XP, Level 2 = 100 XP, Level 3 = 250 XP …
 */

export const LEVEL_TITLES: Record<number, string> = {
  1:  'Aspirant',
  2:  'Learner',
  3:  'Student',
  4:  'Reader',
  5:  'Scholar',
  6:  'Analyst',
  7:  'Strategist',
  8:  'Thinker',
  9:  'Debater',
  10: 'Expert',
  11: 'Advisor',
  12: 'Counsellor',
  13: 'Deputy',
  14: 'Director',
  15: 'Secretary',
  16: 'IPS Rank',
  17: 'IFS Rank',
  18: 'IAS Rank',
  19: 'Joint Topper',
  20: 'All India Topper',
}

const MAX_LEVEL = 20

/**
 * Returns the total XP required to reach a given level.
 * Level 1 starts at 0 XP.
 */
export function getXpForLevel(level: number): number {
  if (level <= 1) return 0
  return Math.floor(100 * Math.pow(1.5, level - 1))
}

/** Precompute thresholds for O(1) look-ups */
const XP_THRESHOLDS: number[] = Array.from({ length: MAX_LEVEL + 1 }, (_, i) =>
  getXpForLevel(i + 1)
)

/**
 * Returns the level (1–20) for a given total XP value.
 */
export function getLevel(xp: number): number {
  let level = 1
  for (let i = 0; i < MAX_LEVEL; i++) {
    if (xp >= XP_THRESHOLDS[i]) {
      level = i + 1
    } else {
      break
    }
  }
  return Math.min(level, MAX_LEVEL)
}

export interface XpProgress {
  level: number
  title: string
  current: number   // XP within current level
  required: number  // XP needed to complete current level
  pct: number       // 0–100 percentage progress within level
  totalXp: number   // raw total XP
}

/**
 * Returns a rich progress object for rendering XP bars.
 */
export function getXpProgress(xp: number): XpProgress {
  const level = getLevel(xp)
  const title = LEVEL_TITLES[level] ?? 'Aspirant'

  if (level >= MAX_LEVEL) {
    return {
      level,
      title,
      current: 0,
      required: 0,
      pct: 100,
      totalXp: xp,
    }
  }

  const levelStart = getXpForLevel(level)
  const levelEnd   = getXpForLevel(level + 1)
  const current    = xp - levelStart
  const required   = levelEnd - levelStart
  const pct        = Math.min(100, Math.floor((current / required) * 100))

  return { level, title, current, required, pct, totalXp: xp }
}
