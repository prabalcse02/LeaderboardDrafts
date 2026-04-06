'use client'

import { motion } from 'framer-motion'

interface ProgressBarProps {
  current: number      // 1-based current question index
  total: number
  correct: number
  wrong: number
  skipped: number
  className?: string
}

export default function ProgressBar({
  current, total, correct, wrong, skipped, className,
}: ProgressBarProps) {
  const answered = correct + wrong + skipped

  return (
    <div className={`space-y-2 ${className ?? ''}`}>
      {/* Question counter */}
      <div className="flex items-center justify-between text-sm">
        <span style={{ color: 'var(--text-3)' }}>
          Question{' '}
          <span className="font-bold" style={{ color: 'var(--text)' }}>{current}</span>
          {' '}of{' '}
          <span className="font-bold" style={{ color: 'var(--text)' }}>{total}</span>
        </span>
        <div className="flex items-center gap-3 text-xs">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full" style={{ background: 'var(--success)' }} />
            <span className="font-semibold" style={{ color: 'var(--success)' }}>{correct}</span>
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full" style={{ background: 'var(--error)' }} />
            <span className="font-semibold" style={{ color: 'var(--error)' }}>{wrong}</span>
          </span>
          {skipped > 0 && (
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full" style={{ background: 'var(--border)' }} />
              <span className="font-semibold" style={{ color: 'var(--text-3)' }}>{skipped}</span>
            </span>
          )}
        </div>
      </div>

      {/* Segmented progress bar */}
      <div className="h-2 rounded-full overflow-hidden flex gap-px" style={{ background: 'var(--surface)' }}>
        <motion.div className="h-full rounded-l-full"
          style={{ background: 'var(--success)' }}
          initial={{ width: 0 }}
          animate={{ width: `${(correct / total) * 100}%` }}
          transition={{ duration: 0.4, ease: 'easeOut' }} />
        <motion.div className="h-full"
          style={{ background: 'var(--error)' }}
          initial={{ width: 0 }}
          animate={{ width: `${(wrong / total) * 100}%` }}
          transition={{ duration: 0.4, ease: 'easeOut', delay: 0.05 }} />
        <motion.div className="h-full rounded-r-full"
          style={{ background: 'var(--border)' }}
          initial={{ width: 0 }}
          animate={{ width: `${(skipped / total) * 100}%` }}
          transition={{ duration: 0.4, ease: 'easeOut', delay: 0.1 }} />
      </div>

      {/* Tick marks */}
      <div className="flex gap-0.5">
        {Array.from({ length: total }).map((_, i) => {
          let bg = 'var(--surface)'
          if (i < correct)                bg = 'color-mix(in oklab, var(--success) 65%, transparent)'
          else if (i < correct + wrong)   bg = 'color-mix(in oklab, var(--error) 65%, transparent)'
          else if (i < answered)          bg = 'var(--border)'
          else if (i === answered)        bg = 'var(--amber)'
          return (
            <div key={i} className={`flex-1 h-1 rounded-sm transition-colors duration-300 ${i === answered ? 'animate-pulse' : ''}`}
              style={{ background: bg }} />
          )
        })}
      </div>
    </div>
  )
}
