'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface TimerProps {
  totalSeconds: number
  onExpire: () => void
  paused?: boolean
}

export default function Timer({ totalSeconds, onExpire, paused = false }: TimerProps) {
  const [remaining, setRemaining] = useState(totalSeconds)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const onExpireRef = useRef(onExpire)
  onExpireRef.current = onExpire

  useEffect(() => {
    setRemaining(totalSeconds)
  }, [totalSeconds])

  useEffect(() => {
    if (paused) {
      if (intervalRef.current) clearInterval(intervalRef.current)
      return
    }
    intervalRef.current = setInterval(() => {
      setRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current!)
          onExpireRef.current()
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [paused])

  const pct              = remaining / totalSeconds
  const circumference    = 2 * Math.PI * 44
  const strokeDashoffset = circumference * (1 - pct)
  const isWarning        = remaining <= 10
  const isCritical       = remaining <= 5

  // Use CSS var strings for SVG stroke — SVG attributes need literal values,
  // so we read the computed value at paint time via currentColor trick.
  // Instead, apply color via style attribute which supports CSS vars.
  const strokeVar = isWarning ? 'var(--error)' : 'var(--accent)'
  const glowColor = isWarning
    ? 'color-mix(in oklab, var(--error) 70%, transparent)'
    : 'color-mix(in oklab, var(--accent) 50%, transparent)'

  return (
    <motion.div
      className="relative inline-flex items-center justify-center"
      animate={isCritical ? { scale: [1, 1.06, 1] } : { scale: 1 }}
      transition={isCritical ? { duration: 0.6, repeat: Infinity } : {}}
    >
      <svg width={72} height={72} viewBox="0 0 100 100" className="-rotate-90">
        {/* Background track */}
        <circle cx={50} cy={50} r={44} fill="none"
          style={{ stroke: 'var(--border)' }} strokeWidth={6} />
        {/* Progress arc */}
        <motion.circle
          cx={50} cy={50} r={44} fill="none"
          style={{ stroke: strokeVar, filter: `drop-shadow(0 0 5px ${glowColor})` }}
          strokeWidth={6} strokeLinecap="round"
          strokeDasharray={circumference}
          animate={{ strokeDashoffset }}
          transition={{ duration: 0.4, ease: 'linear' }}
        />
      </svg>

      {/* Center text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.span
            key={remaining}
            className="text-xl font-extrabold tabular-nums leading-none"
            style={{ color: isWarning ? 'var(--error)' : 'var(--text)' }}
            initial={{ opacity: 0, y: -5, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 5, scale: 0.8 }}
            transition={{ duration: 0.15 }}
          >
            {remaining}
          </motion.span>
        </AnimatePresence>
        <span className="text-[8px] uppercase tracking-wider mt-0.5" style={{ color: 'var(--text-3)' }}>sec</span>
      </div>
    </motion.div>
  )
}
