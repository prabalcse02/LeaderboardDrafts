'use client'

import { motion } from 'framer-motion'
import clsx from 'clsx'

interface ProgressBarProps {
  current: number      // 1-based current question index
  total: number
  correct: number
  wrong: number
  skipped: number
  className?: string
}

export default function ProgressBar({
  current,
  total,
  correct,
  wrong,
  skipped,
  className,
}: ProgressBarProps) {
  const answered = correct + wrong + skipped
  const pct = total > 0 ? (answered / total) * 100 : 0

  return (
    <div className={clsx('space-y-2', className)}>
      {/* Question counter */}
      <div className="flex items-center justify-between text-sm">
        <span className="text-white/50">
          Question{' '}
          <span className="font-bold text-white">{current}</span>
          {' '}of{' '}
          <span className="font-bold text-white">{total}</span>
        </span>
        <div className="flex items-center gap-3 text-xs">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-jade-500" />
            <span className="text-jade-400 font-semibold">{correct}</span>
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-rose-500" />
            <span className="text-rose-400 font-semibold">{wrong}</span>
          </span>
          {skipped > 0 && (
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-white/30" />
              <span className="text-white/40 font-semibold">{skipped}</span>
            </span>
          )}
        </div>
      </div>

      {/* Segmented progress bar */}
      <div className="h-2 bg-white/8 rounded-full overflow-hidden flex gap-px">
        {/* Correct segment */}
        <motion.div
          className="h-full bg-jade-500 rounded-l-full"
          initial={{ width: 0 }}
          animate={{ width: `${(correct / total) * 100}%` }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
        />
        {/* Wrong segment */}
        <motion.div
          className="h-full bg-rose-500"
          initial={{ width: 0 }}
          animate={{ width: `${(wrong / total) * 100}%` }}
          transition={{ duration: 0.4, ease: 'easeOut', delay: 0.05 }}
        />
        {/* Skipped segment */}
        <motion.div
          className="h-full bg-white/25 rounded-r-full"
          initial={{ width: 0 }}
          animate={{ width: `${(skipped / total) * 100}%` }}
          transition={{ duration: 0.4, ease: 'easeOut', delay: 0.1 }}
        />
      </div>

      {/* Tick marks for individual questions */}
      <div className="flex gap-0.5">
        {Array.from({ length: total }).map((_, i) => {
          let bg = 'bg-white/10'
          if (i < correct) bg = 'bg-jade-500/70'
          else if (i < correct + wrong) bg = 'bg-rose-500/70'
          else if (i < answered) bg = 'bg-white/20'
          else if (i === answered) bg = 'bg-saffron-400 animate-pulse'
          return (
            <div
              key={i}
              className={clsx('flex-1 h-1 rounded-sm transition-colors duration-300', bg)}
            />
          )
        })}
      </div>
    </div>
  )
}
