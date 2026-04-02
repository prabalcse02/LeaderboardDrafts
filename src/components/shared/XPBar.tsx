'use client'

import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Zap } from 'lucide-react'
import { getXpProgress } from '@/lib/game/levels'
import clsx from 'clsx'

interface XPBarProps {
  totalXp?: number
  xp?: number  // alias for totalXp (for backwards compat)
  className?: string
  compact?: boolean
}

export default function XPBar({ totalXp, xp, className, compact = false }: XPBarProps) {
  const resolvedXp = totalXp ?? xp ?? 0
  const progress = getXpProgress(resolvedXp)
  const [animated, setAnimated] = useState(false)
  const prevXp = useRef(resolvedXp)

  useEffect(() => {
    // Trigger fill animation whenever XP changes
    if (resolvedXp !== prevXp.current) {
      setAnimated(false)
      const t = setTimeout(() => setAnimated(true), 50)
      prevXp.current = resolvedXp
      return () => clearTimeout(t)
    } else {
      setAnimated(true)
    }
  }, [resolvedXp])

  const pct = progress.pct

  if (compact) {
    return (
      <div className={clsx('flex items-center gap-2', className)}>
        <span className="text-xs font-bold text-saffron-400">Lv.{progress.level}</span>
        <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-saffron-500 to-saffron-400 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: animated ? `${pct}%` : 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          />
        </div>
        <span className="text-xs text-white/40">{pct}%</span>
      </div>
    )
  }

  return (
    <div className={clsx('glass rounded-2xl p-4', className)}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          {/* Level badge */}
          <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-saffron-500 to-saffron-600 shadow-lg shadow-saffron-500/25">
            <span className="text-lg font-extrabold text-white">{progress.level}</span>
          </div>
          <div>
            <p className="font-bold text-white">{progress.title}</p>
            <p className="text-xs text-white/40">Level {progress.level}</p>
          </div>
        </div>

        {/* XP display */}
        <div className="text-right">
          <div className="flex items-center gap-1 justify-end">
            <Zap className="w-4 h-4 text-saffron-400 fill-saffron-400" />
            <span className="font-bold text-saffron-300 text-lg">
              {resolvedXp.toLocaleString()}
            </span>
          </div>
          <p className="text-xs text-white/40">Total XP</p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="space-y-1.5">
        <div className="h-3 bg-white/8 rounded-full overflow-hidden border border-white/5">
          <motion.div
            className="h-full rounded-full relative overflow-hidden"
            style={{
              background: 'linear-gradient(90deg, #ff7c00 0%, #ffb84d 50%, #ff9a1f 100%)',
            }}
            initial={{ width: 0 }}
            animate={{ width: animated ? `${pct}%` : 0 }}
            transition={{ duration: 1.0, ease: [0.34, 1.56, 0.64, 1] }}
          >
            {/* Shimmer effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
          </motion.div>
        </div>

        <div className="flex justify-between text-xs text-white/40">
          {progress.level < 20 ? (
            <>
              <span>{progress.current.toLocaleString()} XP</span>
              <span>{progress.required.toLocaleString()} XP to next level</span>
            </>
          ) : (
            <span className="text-saffron-400 font-semibold">MAX LEVEL REACHED</span>
          )}
        </div>
      </div>
    </div>
  )
}
