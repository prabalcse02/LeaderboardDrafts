'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Flame, Zap, ChevronRight, Trophy } from 'lucide-react'
import { useGameStore } from '@/lib/store/gameStore'
import { calculateScore } from '@/lib/game/scoring'
import OptionButton from './OptionButton'
import Timer from './Timer'
import ProgressBar from './ProgressBar'

type OptionKey = 'A' | 'B' | 'C' | 'D'
const OPTION_KEYS: OptionKey[] = ['A', 'B', 'C', 'D']

export default function QuizEngine() {
  const router = useRouter()
  const { session, submitAnswer, endSession } = useGameStore()

  const [currentIndex,   setCurrentIndex]   = useState(0)
  const [selectedOption, setSelectedOption] = useState<OptionKey | null>(null)
  const [revealed,       setRevealed]       = useState(false)
  const [timerKey,       setTimerKey]       = useState(0)
  const [xpFlash,        setXpFlash]        = useState<{ label: string } | null>(null)
  const [speedLabel,     setSpeedLabel]     = useState<string | null>(null)
  const answerTimeRef  = useRef<number>(Date.now())
  const autoAdvanceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const questions       = session?.questions ?? []
  const currentQuestion = questions[currentIndex]
  const isLastQuestion  = currentIndex === questions.length - 1

  useEffect(() => {
    setSelectedOption(null)
    setRevealed(false)
    setTimerKey(k => k + 1)
    answerTimeRef.current = Date.now()
    return () => { if (autoAdvanceRef.current) clearTimeout(autoAdvanceRef.current) }
  }, [currentIndex])

  const handleNext = useCallback(() => {
    if (autoAdvanceRef.current) clearTimeout(autoAdvanceRef.current)
    if (currentIndex < questions.length - 1) setCurrentIndex(i => i + 1)
    else { endSession(); router.push('/prelims/results') }
  }, [currentIndex, questions.length, endSession, router])

  const handleAnswer = useCallback((option: OptionKey) => {
    if (revealed || !currentQuestion) return
    const timeTaken   = Math.round((Date.now() - answerTimeRef.current) / 1000)
    setSelectedOption(option)
    setRevealed(true)

    const isCorrect   = currentQuestion.correct === option
    const result      = calculateScore(isCorrect, timeTaken, session?.streak ?? 0)
    submitAnswer(currentQuestion.id, option, timeTaken)

    if (isCorrect && result.speedBonus > 0) {
      setSpeedLabel(timeTaken < 10 ? '⚡ Lightning!' : timeTaken < 20 ? '🚀 Fast!' : '✓ Quick')
      setTimeout(() => setSpeedLabel(null), 2000)
    }
    if (result.total > 0) {
      const xp = Math.max(0, Math.floor(result.total * 0.5))
      if (xp > 0) {
        setXpFlash({ label: `+${xp} XP` })
        setTimeout(() => setXpFlash(null), 2000)
      }
    }
    autoAdvanceRef.current = setTimeout(() => handleNext(), 2200)
  }, [revealed, currentQuestion, session?.streak, submitAnswer, handleNext])

  const handleExpire = useCallback(() => {
    if (!revealed && currentQuestion) {
      setRevealed(true)
      autoAdvanceRef.current = setTimeout(() => handleNext(), 2200)
    }
  }, [revealed, currentQuestion, handleNext])

  if (!session || questions.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p style={{ color: 'var(--text-3)' }}>No active session. Please start a new game.</p>
      </div>
    )
  }

  const answeredCount = Object.keys(session.answers).length
  const correctCount  = Object.values(session.answers).filter(a => a.isCorrect).length
  const wrongCount    = answeredCount - correctCount
  const streak        = session.streak

  const getOptionState = (key: OptionKey) => {
    if (!revealed) return selectedOption === key ? 'selected' : 'default'
    if (key === currentQuestion.correct) return 'correct'
    if (key === selectedOption && selectedOption !== currentQuestion.correct) return 'incorrect'
    return 'default'
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-5">

      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <motion.div
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-sm font-bold"
            style={{
              background:  streak >= 3 ? 'var(--terra-tint)' : 'var(--surface)',
              borderColor: streak >= 3 ? 'color-mix(in oklab, var(--terra) 30%, transparent)' : 'var(--border)',
              color:       streak >= 3 ? 'var(--terra)' : 'var(--text-3)',
            }}
            animate={streak >= 3 ? { scale: [1, 1.08, 1] } : { scale: 1 }}
            transition={{ duration: 0.5, repeat: streak >= 5 ? Infinity : 0, repeatDelay: 1.5 }}
          >
            <Flame className="w-4 h-4" style={{ color: streak >= 3 ? 'var(--terra)' : 'var(--text-3)' }} />
            <span>{streak}</span>
          </motion.div>

          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-sm"
            style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
            <Trophy className="w-4 h-4" style={{ color: 'var(--amber)' }} />
            <span className="font-bold tabular-nums" style={{ color: 'var(--text)' }}>{session.score}</span>
          </div>
        </div>

        <Timer key={timerKey} totalSeconds={30} onExpire={handleExpire} paused={revealed} />

        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-sm"
          style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
          <Zap className="w-4 h-4" style={{ color: 'var(--amber)', fill: 'var(--amber)' }} />
          <span className="font-bold tabular-nums" style={{ color: 'var(--amber)' }}>{session.xpEarned}</span>
        </div>
      </div>

      <ProgressBar current={currentIndex + 1} total={questions.length}
        correct={correctCount} wrong={wrongCount} skipped={0} />

      {/* Flash overlays */}
      <div className="relative h-0">
        <AnimatePresence>
          {speedLabel && (
            <motion.div key="speed"
              className="absolute -top-2 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full text-sm font-bold whitespace-nowrap z-10"
              style={{ background: 'var(--accent-tint)', border: '1px solid color-mix(in oklab, var(--accent) 30%, transparent)', color: 'var(--accent)' }}
              initial={{ opacity: 0, y: 8, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -16 }}>
              {speedLabel}
            </motion.div>
          )}
          {xpFlash && (
            <motion.div key="xp"
              className="absolute -top-2 right-0 flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-bold z-10"
              style={{ background: 'var(--amber-tint)', border: '1px solid color-mix(in oklab, var(--amber) 30%, transparent)', color: 'var(--amber)' }}
              initial={{ opacity: 0, scale: 0.5, y: 8 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, y: -16 }}>
              <Zap className="w-3.5 h-3.5" style={{ fill: 'var(--amber)', color: 'var(--amber)' }} />
              {xpFlash.label}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Question card */}
      <AnimatePresence mode="wait">
        <motion.div key={currentQuestion.id}
          className="card rounded-2xl p-6 space-y-5"
          initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -18 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}>

          {/* Meta */}
          <div className="flex items-center gap-2 flex-wrap text-xs">
            <span className="px-2.5 py-1 rounded-lg capitalize font-medium"
              style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text-3)' }}>
              {currentQuestion.subjectId.replace(/-/g, ' ')}
            </span>
            <span className="px-2.5 py-1 rounded-lg capitalize font-medium"
              style={{
                background: currentQuestion.difficulty === 'easy' ? 'var(--success-tint)' : currentQuestion.difficulty === 'medium' ? 'var(--warning-tint)' : 'var(--error-tint)',
                color:      currentQuestion.difficulty === 'easy' ? 'var(--success)' : currentQuestion.difficulty === 'medium' ? 'var(--warning)' : 'var(--error)',
                border:     `1px solid color-mix(in oklab, ${currentQuestion.difficulty === 'easy' ? 'var(--success)' : currentQuestion.difficulty === 'medium' ? 'var(--warning)' : 'var(--error)'} 25%, transparent)`,
              }}>
              {currentQuestion.difficulty}
            </span>
            {currentQuestion.year && (
              <span className="px-2.5 py-1 rounded-lg font-medium"
                style={{ background: 'var(--accent-tint)', color: 'var(--accent)', border: '1px solid color-mix(in oklab, var(--accent) 20%, transparent)' }}>
                UPSC {currentQuestion.year}
              </span>
            )}
            <span className="ml-auto tabular-nums" style={{ color: 'var(--text-3)' }}>{currentIndex + 1}/{questions.length}</span>
          </div>

          {/* Question text */}
          <p className="text-base sm:text-lg font-semibold leading-relaxed" style={{ color: 'var(--text)' }}>
            {currentQuestion.text}
          </p>

          {/* Options */}
          <div className="space-y-2.5">
            {OPTION_KEYS.map(key => (
              <OptionButton key={key} letter={key} text={currentQuestion.options[key]}
                state={getOptionState(key)} onClick={() => handleAnswer(key)} disabled={revealed} />
            ))}
          </div>

          {/* Explanation */}
          <AnimatePresence>
            {revealed && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.3 }} className="overflow-hidden">
                <div className="p-4 rounded-xl text-sm leading-relaxed"
                  style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text-2)' }}>
                  <p className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: 'var(--text-3)' }}>
                    Explanation
                  </p>
                  {currentQuestion.explanation}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </AnimatePresence>

      {/* Manual Next */}
      <AnimatePresence>
        {revealed && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="flex justify-end">
            <button onClick={handleNext}
              className="btn-amber flex items-center gap-2 px-6 py-2.5">
              {isLastQuestion ? <><Trophy className="w-4 h-4" /> Finish Session</> : <>Next <ChevronRight className="w-4 h-4" /></>}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
