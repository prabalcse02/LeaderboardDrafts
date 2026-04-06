'use client'

import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Zap } from 'lucide-react'
import { getXpProgress } from '@/lib/game/levels'
import clsx from 'clsx'

interface XPBarProps {
  totalXp?: number
  xp?:      number
  className?: string
  compact?: boolean
}

export default function XPBar({ totalXp, xp, className, compact = false }: XPBarProps) {
  const resolvedXp = totalXp ?? xp ?? 0
  const progress   = getXpProgress(resolvedXp)
  const [animated, setAnimated] = useState(false)
  const prevXp = useRef(resolvedXp)

  useEffect(() => {
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
        <span className="text-xs font-bold" style={{ color: 'var(--amber)' }}>Lv.{progress.level}</span>
        <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: 'var(--border)' }}>
          <motion.div className="h-full rounded-full" style={{ background: 'var(--amber)' }}
            initial={{ width: 0 }}
            animate={{ width: animated ? `${pct}%` : 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          />
        </div>
        <span className="text-xs" style={{ color: 'var(--text-3)' }}>{pct}%</span>
      </div>
    )
  }

  return (
    <div className={clsx('card rounded-2xl p-5', className)}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-12 h-12 rounded-xl font-heading text-xl"
            style={{ background: 'var(--amber-tint)', color: 'var(--amber)', border: '1.5px solid color-mix(in oklab, var(--amber) 30%, transparent)' }}>
            {progress.level}
          </div>
          <div>
            <p className="font-bold" style={{ color: 'var(--text)' }}>{progress.title}</p>
            <p className="text-xs" style={{ color: 'var(--text-3)' }}>Level {progress.level} of 20</p>
          </div>
        </div>
        <div className="text-right">
          <div className="flex items-center gap-1 justify-end">
            <Zap className="w-4 h-4" style={{ color: 'var(--amber)', fill: 'var(--amber)' }} />
            <span className="font-black text-lg tabular-nums" style={{ color: 'var(--amber)' }}>
              {resolvedXp.toLocaleString()}
            </span>
          </div>
          <p className="text-xs" style={{ color: 'var(--text-3)' }}>Total XP</p>
        </div>
      </div>

      <div className="space-y-1.5">
        <div className="h-3 rounded-full overflow-hidden border" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
          <motion.div
            className="h-full rounded-full relative overflow-hidden"
            style={{ background: 'linear-gradient(90deg, var(--amber), var(--terra))' }}
            initial={{ width: 0 }}
            animate={{ width: animated ? `${pct}%` : 0 }}
            transition={{ duration: 1.0, ease: [0.34, 1.56, 0.64, 1] }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
          </motion.div>
        </div>
        <div className="flex justify-between text-xs" style={{ color: 'var(--text-3)' }}>
          {progress.level < 20 ? (
            <>
              <span>{progress.current.toLocaleString()} XP</span>
              <span>{progress.required.toLocaleString()} XP to next level</span>
            </>
          ) : (
            <span className="font-semibold" style={{ color: 'var(--amber)' }}>MAX LEVEL REACHED</span>
          )}
        </div>
      </div>
    </div>
  )
}
