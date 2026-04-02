'use client'

import { motion } from 'framer-motion'
import { CheckCircle2, XCircle } from 'lucide-react'
import clsx from 'clsx'

type OptionKey = 'A' | 'B' | 'C' | 'D'

interface OptionButtonProps {
  letter: OptionKey
  text: string
  state: 'default' | 'selected' | 'correct' | 'incorrect' | 'reveal-correct'
  onClick?: () => void
  disabled?: boolean
}

const LETTER_COLORS: Record<OptionKey, string> = {
  A: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  B: 'bg-violet-500/20 text-violet-300 border-violet-500/30',
  C: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
  D: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
}

export default function OptionButton({
  letter,
  text,
  state,
  onClick,
  disabled = false,
}: OptionButtonProps) {
  const isCorrect = state === 'correct' || state === 'reveal-correct'
  const isIncorrect = state === 'incorrect'
  const isSelected = state === 'selected'

  return (
    <motion.button
      onClick={onClick}
      disabled={disabled || state === 'correct' || state === 'incorrect' || state === 'reveal-correct'}
      whileTap={!disabled && state === 'default' ? { scale: 0.97 } : {}}
      whileHover={!disabled && state === 'default' ? { scale: 1.01 } : {}}
      transition={{ type: 'spring', stiffness: 400, damping: 20 }}
      className={clsx(
        'w-full flex items-center gap-3 rounded-xl px-4 py-3.5 text-left',
        'border transition-all duration-200 select-none',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-saffron-400',
        // default
        state === 'default' && !disabled && 'border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20 cursor-pointer',
        state === 'default' && disabled && 'border-white/5 bg-white/3 cursor-not-allowed opacity-50',
        // selected (before reveal)
        isSelected && 'border-saffron-400/60 bg-saffron-500/10 cursor-default',
        // correct
        isCorrect && 'border-jade-500/60 bg-jade-500/15 cursor-default',
        // incorrect
        isIncorrect && 'border-rose-500/60 bg-rose-500/15 cursor-default',
      )}
    >
      {/* Letter badge */}
      <span
        className={clsx(
          'flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold border',
          isCorrect
            ? 'bg-jade-500/30 text-jade-400 border-jade-500/50'
            : isIncorrect
            ? 'bg-rose-500/30 text-rose-400 border-rose-500/50'
            : isSelected
            ? 'bg-saffron-500/30 text-saffron-400 border-saffron-500/50'
            : LETTER_COLORS[letter]
        )}
      >
        {letter}
      </span>

      {/* Option text */}
      <span
        className={clsx(
          'flex-1 text-sm font-medium leading-snug',
          isCorrect ? 'text-jade-300' : isIncorrect ? 'text-rose-300' : isSelected ? 'text-saffron-200' : 'text-white/80'
        )}
      >
        {text}
      </span>

      {/* Status icon */}
      {isCorrect && (
        <motion.span
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 500, damping: 20, delay: 0.1 }}
        >
          <CheckCircle2 className="w-5 h-5 text-jade-400 flex-shrink-0" />
        </motion.span>
      )}
      {isIncorrect && (
        <motion.span
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 500, damping: 20, delay: 0.1 }}
        >
          <XCircle className="w-5 h-5 text-rose-400 flex-shrink-0" />
        </motion.span>
      )}
    </motion.button>
  )
}
