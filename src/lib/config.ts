/**
 * UPSCPATH Prelims — Integration Config
 *
 * When embedding into upscpath.com, set NEXT_PUBLIC_PRELIMS_BASE to the
 * mount path in the parent app's .env.  Examples:
 *
 *   Standalone (default):          NEXT_PUBLIC_PRELIMS_BASE=""
 *   Mounted at /practice:          NEXT_PUBLIC_PRELIMS_BASE="/practice"
 *   Mounted at /prelims/practice:  NEXT_PUBLIC_PRELIMS_BASE="/prelims/practice"
 *
 * All internal <Link href> and router.push() calls use ROUTES below so that
 * every navigation is relative to the mount point — never hardcoded to `/`.
 */
export const BASE = (process.env.NEXT_PUBLIC_PRELIMS_BASE ?? '').replace(/\/$/, '')

export const ROUTES = {
  dashboard:  `${BASE}/`,
  prelims:    `${BASE}/prelims`,
  setup:      `${BASE}/prelims/setup`,
  play:       `${BASE}/prelims/play`,
  results:    `${BASE}/prelims/results`,
  leaderboard:`${BASE}/leaderboard`,
} as const
