'use client'

import { motion } from 'framer-motion'
import { CheckCircle2, XCircle } from 'lucide-react'

type OptionKey = 'A' | 'B' | 'C' | 'D'

interface OptionButtonProps {
  letter: OptionKey
  text: string
  state: 'default' | 'selected' | 'correct' | 'incorrect' | 'reveal-correct'
  onClick?: () => void
  disabled?: boolean
}

export default function OptionButton({
  letter,
  text,
  state,
  onClick,
  disabled = false,
}: OptionButtonProps) {
  const isCorrect   = state === 'correct' || state === 'reveal-correct'
  const isIncorrect = state === 'incorrect'
  const isSelected  = state === 'selected'
  const isDefault   = state === 'default'

  const containerStyle = isCorrect
    ? { background: 'color-mix(in oklab, var(--success) 12%, var(--elevated))', borderColor: 'color-mix(in oklab, var(--success) 45%, transparent)' }
    : isIncorrect
    ? { background: 'color-mix(in oklab, var(--error) 12%, var(--elevated))', borderColor: 'color-mix(in oklab, var(--error) 45%, transparent)' }
    : isSelected
    ? { background: 'color-mix(in oklab, var(--amber) 10%, var(--elevated))', borderColor: 'color-mix(in oklab, var(--amber) 45%, transparent)' }
    : { background: 'var(--elevated)', borderColor: 'var(--border)' }

  const badgeStyle = isCorrect
    ? { background: 'color-mix(in oklab, var(--success) 20%, transparent)', color: 'var(--success)', borderColor: 'color-mix(in oklab, var(--success) 40%, transparent)' }
    : isIncorrect
    ? { background: 'color-mix(in oklab, var(--error) 20%, transparent)', color: 'var(--error)', borderColor: 'color-mix(in oklab, var(--error) 40%, transparent)' }
    : isSelected
    ? { background: 'color-mix(in oklab, var(--amber) 20%, transparent)', color: 'var(--amber)', borderColor: 'color-mix(in oklab, var(--amber) 40%, transparent)' }
    : { background: 'var(--surface)', color: 'var(--text-3)', borderColor: 'var(--border)' }

  const textColor = isCorrect
    ? 'var(--success)'
    : isIncorrect
    ? 'var(--error)'
    : isSelected
    ? 'var(--amber)'
    : 'var(--text-2)'

  return (
    <motion.button
      onClick={onClick}
      disabled={disabled || isCorrect || isIncorrect}
      whileTap={!disabled && isDefault ? { scale: 0.97 } : {}}
      whileHover={!disabled && isDefault ? { scale: 1.01 } : {}}
      transition={{ type: 'spring', stiffness: 400, damping: 20 }}
      className="w-full flex items-center gap-3 rounded-xl px-4 py-3.5 text-left border transition-all duration-200 select-none focus:outline-none"
      style={{
        ...containerStyle,
        cursor: disabled ? 'default' : isDefault ? 'pointer' : 'default',
        opacity: disabled && isDefault ? 0.5 : 1,
      }}
    >
      {/* Letter badge */}
      <span
        className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold border"
        style={badgeStyle}
      >
        {letter}
      </span>

      {/* Option text */}
      <span className="flex-1 text-sm font-medium leading-snug" style={{ color: textColor }}>
        {text}
      </span>

      {/* Status icon */}
      {isCorrect && (
        <motion.span
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 500, damping: 20, delay: 0.1 }}
        >
          <CheckCircle2 className="w-5 h-5 flex-shrink-0" style={{ color: 'var(--success)' }} />
        </motion.span>
      )}
      {isIncorrect && (
        <motion.span
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 500, damping: 20, delay: 0.1 }}
        >
          <XCircle className="w-5 h-5 flex-shrink-0" style={{ color: 'var(--error)' }} />
        </motion.span>
      )}
    </motion.button>
  )
}
