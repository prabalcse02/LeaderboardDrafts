'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import clsx from 'clsx'

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

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [paused])

  const pct = remaining / totalSeconds
  const circumference = 2 * Math.PI * 44 // r=44
  const strokeDashoffset = circumference * (1 - pct)

  const isWarning = remaining <= 10
  const isCritical = remaining <= 5

  const strokeColor = isWarning ? '#f43f5e' : '#3b82f6'
  const textColor = isWarning ? 'text-rose-400' : 'text-white'

  return (
    <motion.div
      className="relative inline-flex items-center justify-center"
      animate={isCritical ? { scale: [1, 1.06, 1] } : { scale: 1 }}
      transition={isCritical ? { duration: 0.6, repeat: Infinity } : {}}
    >
      <svg width={100} height={100} viewBox="0 0 100 100" className="-rotate-90">
        {/* Background track */}
        <circle
          cx={50}
          cy={50}
          r={44}
          fill="none"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth={6}
        />
        {/* Progress arc */}
        <motion.circle
          cx={50}
          cy={50}
          r={44}
          fill="none"
          stroke={strokeColor}
          strokeWidth={6}
          strokeLinecap="round"
          strokeDasharray={circumference}
          animate={{ strokeDashoffset }}
          transition={{ duration: 0.4, ease: 'linear' }}
          style={{ filter: isWarning ? 'drop-shadow(0 0 6px rgba(244,63,94,0.7))' : 'drop-shadow(0 0 4px rgba(59,130,246,0.5))' }}
        />
      </svg>

      {/* Center text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.span
            key={remaining}
            className={clsx('text-2xl font-extrabold tabular-nums leading-none', textColor)}
            initial={{ opacity: 0, y: -6, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.8 }}
            transition={{ duration: 0.15 }}
          >
            {remaining}
          </motion.span>
        </AnimatePresence>
        <span className="text-[9px] uppercase tracking-wider text-white/30 mt-0.5">sec</span>
      </div>
    </motion.div>
  )
}
