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
import clsx from 'clsx'

type OptionKey = 'A' | 'B' | 'C' | 'D'
const OPTION_KEYS: OptionKey[] = ['A', 'B', 'C', 'D']

export default function QuizEngine() {
  const router = useRouter()
  const { session, submitAnswer, endSession } = useGameStore()

  const [currentIndex, setCurrentIndex]     = useState(0)
  const [selectedOption, setSelectedOption] = useState<OptionKey | null>(null)
  const [revealed, setRevealed]             = useState(false)
  const [timerKey, setTimerKey]             = useState(0)
  const [xpFlash, setXpFlash]               = useState<{ amount: number; label: string } | null>(null)
  const [speedLabel, setSpeedLabel]         = useState<string | null>(null)
  const answerTimeRef = useRef<number>(Date.now())
  const autoAdvanceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const questions       = session?.questions ?? []
  const currentQuestion = questions[currentIndex]
  const isLastQuestion  = currentIndex === questions.length - 1

  // Reset per-question state
  useEffect(() => {
    setSelectedOption(null)
    setRevealed(false)
    setTimerKey(k => k + 1)
    answerTimeRef.current = Date.now()
    return () => {
      if (autoAdvanceRef.current) clearTimeout(autoAdvanceRef.current)
    }
  }, [currentIndex])

  const handleNext = useCallback(() => {
    if (autoAdvanceRef.current) clearTimeout(autoAdvanceRef.current)
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(i => i + 1)
    } else {
      endSession()
      router.push('/prelims/results')
    }
  }, [currentIndex, questions.length, endSession, router])

  const handleAnswer = useCallback(
    (option: OptionKey) => {
      if (revealed || !currentQuestion) return

      const timeTaken = Math.round((Date.now() - answerTimeRef.current) / 1000)
      setSelectedOption(option)
      setRevealed(true)

      const isCorrect  = currentQuestion.correct === option
      const scoreResult = calculateScore(isCorrect, timeTaken, session?.streak ?? 0)
      submitAnswer(currentQuestion.id, option, timeTaken)

      // Speed flash
      if (isCorrect && scoreResult.speedBonus > 0) {
        const label = timeTaken < 10 ? '⚡ Lightning!' : timeTaken < 20 ? '🚀 Fast!' : '✓ Quick'
        setSpeedLabel(label)
        setTimeout(() => setSpeedLabel(null), 2000)
      }

      // XP flash
      if (scoreResult.total > 0) {
        const xpGained = Math.max(0, Math.floor(scoreResult.total * 0.5))
        if (xpGained > 0) {
          setXpFlash({ amount: xpGained, label: `+${xpGained} XP` })
          setTimeout(() => setXpFlash(null), 2000)
        }
      }

      // Auto-advance after 2s once answer is revealed
      autoAdvanceRef.current = setTimeout(() => handleNext(), 2000)
    },
    [revealed, currentQuestion, session?.streak, submitAnswer, handleNext]
  )

  // Timer expire — reveal without answer, then auto-advance
  const handleExpire = useCallback(() => {
    if (!revealed && currentQuestion) {
      setRevealed(true)
      autoAdvanceRef.current = setTimeout(() => handleNext(), 2000)
    }
  }, [revealed, currentQuestion, handleNext])

  if (!session || questions.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-white/50">No active session. Please start a new game.</p>
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

      {/* Header stats row */}
      <div className="flex items-center justify-between gap-3">

        {/* Streak + Score */}
        <div className="flex items-center gap-2">
          <motion.div
            className={clsx(
              'flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-sm font-bold',
              streak >= 3
                ? 'bg-orange-500/15 border-orange-500/30 text-orange-300'
                : 'bg-white/5 border-white/8 text-white/40'
            )}
            animate={streak >= 3 ? { scale: [1, 1.08, 1] } : { scale: 1 }}
            transition={{ duration: 0.5, repeat: streak >= 5 ? Infinity : 0, repeatDelay: 1.5 }}
          >
            <Flame className={clsx('w-4 h-4', streak >= 3 ? 'text-orange-400' : 'text-white/25')} />
            <span>{streak}</span>
          </motion.div>

          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 border border-white/8 text-sm">
            <Trophy className="w-4 h-4 text-saffron-400" />
            <span className="font-bold text-white tabular-nums">{session.score}</span>
          </div>
        </div>

        {/* Timer — centered */}
        <Timer
          key={timerKey}
          totalSeconds={30}
          onExpire={handleExpire}
          paused={revealed}
        />

        {/* XP earned */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 border border-white/8 text-sm">
          <Zap className="w-4 h-4 text-saffron-400 fill-saffron-400" />
          <span className="font-bold text-saffron-300 tabular-nums">{session.xpEarned}</span>
        </div>
      </div>

      {/* Progress bar */}
      <ProgressBar
        current={currentIndex + 1}
        total={questions.length}
        correct={correctCount}
        wrong={wrongCount}
        skipped={0}
      />

      {/* Speed / XP flash overlays */}
      <div className="relative h-0">
        <AnimatePresence>
          {speedLabel && (
            <motion.div
              key="speed"
              className="absolute -top-2 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full
                bg-blue-500/20 border border-blue-500/40 text-blue-300 text-sm font-bold
                whitespace-nowrap z-10 shadow-lg"
              initial={{ opacity: 0, y: 8, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -16 }}
            >
              {speedLabel}
            </motion.div>
          )}
          {xpFlash && (
            <motion.div
              key="xp"
              className="absolute -top-2 right-0 flex items-center gap-1 px-3 py-1.5 rounded-full
                bg-saffron-500/20 border border-saffron-500/40 text-saffron-300 text-sm font-bold z-10"
              initial={{ opacity: 0, scale: 0.5, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
            >
              <Zap className="w-3.5 h-3.5 fill-saffron-400 text-saffron-400" />
              {xpFlash.label}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Question card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestion.id}
          className="glass rounded-2xl p-6 space-y-5 border border-white/8"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -18 }}
          transition={{ duration: 0.28, ease: 'easeOut' }}
        >
          {/* Meta */}
          <div className="flex items-center gap-2 flex-wrap text-xs">
            <span className="px-2.5 py-1 rounded-lg bg-white/6 border border-white/8 text-white/50 capitalize font-medium">
              {currentQuestion.subjectId.replace(/-/g, ' ')}
            </span>
            <span className={clsx(
              'px-2.5 py-1 rounded-lg capitalize font-medium',
              currentQuestion.difficulty === 'easy'   && 'bg-jade-500/12 text-jade-400 border border-jade-500/20',
              currentQuestion.difficulty === 'medium' && 'bg-amber-500/12 text-amber-400 border border-amber-500/20',
              currentQuestion.difficulty === 'hard'   && 'bg-rose-500/12 text-rose-400 border border-rose-500/20',
            )}>
              {currentQuestion.difficulty}
            </span>
            {currentQuestion.year && (
              <span className="px-2.5 py-1 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 font-medium">
                UPSC {currentQuestion.year}
              </span>
            )}
            <span className="ml-auto text-white/25 tabular-nums">{currentIndex + 1}/{questions.length}</span>
          </div>

          {/* Question text */}
          <p className="text-base sm:text-lg font-semibold text-white leading-relaxed">
            {currentQuestion.text}
          </p>

          {/* Options */}
          <div className="space-y-2.5">
            {OPTION_KEYS.map(key => (
              <OptionButton
                key={key}
                letter={key}
                text={currentQuestion.options[key]}
                state={getOptionState(key)}
                onClick={() => handleAnswer(key)}
                disabled={revealed}
              />
            ))}
          </div>

          {/* Explanation */}
          <AnimatePresence>
            {revealed && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="p-4 rounded-xl bg-white/4 border border-white/8 text-sm text-white/65 leading-relaxed">
                  <p className="text-white/35 text-[10px] font-bold uppercase tracking-widest mb-2">
                    Explanation
                  </p>
                  {currentQuestion.explanation}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </AnimatePresence>

      {/* Manual Next button (fallback if auto-advance not fired) */}
      <AnimatePresence>
        {revealed && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex justify-end"
          >
            <button
              onClick={handleNext}
              className="flex items-center gap-2 px-6 py-3 rounded-xl
                bg-saffron-500 hover:bg-saffron-600 text-white font-bold
                transition-colors shadow-lg shadow-saffron-500/25"
            >
              {isLastQuestion ? (
                <><Trophy className="w-4 h-4" /> Finish Session</>
              ) : (
                <>Next <ChevronRight className="w-4 h-4" /></>
              )}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
