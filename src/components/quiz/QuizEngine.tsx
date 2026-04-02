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

export default function QuizEngine() {
  const router = useRouter()
  const { session, submitAnswer, endSession } = useGameStore()

  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedOption, setSelectedOption] = useState<OptionKey | null>(null)
  const [revealed, setRevealed] = useState(false)
  const [timerKey, setTimerKey] = useState(0)
  const [startTime, setStartTime] = useState<number>(Date.now())
  const [xpFlash, setXpFlash] = useState<{ amount: number; label: string } | null>(null)
  const [speedLabel, setSpeedLabel] = useState<string | null>(null)
  const answerTimeRef = useRef<number>(Date.now())

  const questions = session?.questions ?? []
  const currentQuestion = questions[currentIndex]

  // Reset timer on question change
  useEffect(() => {
    setSelectedOption(null)
    setRevealed(false)
    setTimerKey((k) => k + 1)
    setStartTime(Date.now())
    answerTimeRef.current = Date.now()
  }, [currentIndex])

  const handleAnswer = useCallback(
    (option: OptionKey) => {
      if (revealed || !currentQuestion) return

      const timeTaken = Math.round((Date.now() - answerTimeRef.current) / 1000)
      setSelectedOption(option)
      setRevealed(true)

      const isCorrect = currentQuestion.correct === option
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
    },
    [revealed, currentQuestion, session?.streak, submitAnswer]
  )

  const handleExpire = useCallback(() => {
    if (!revealed && currentQuestion) {
      // Auto-advance on time expire without answer
      setRevealed(true)
    }
  }, [revealed, currentQuestion])

  const handleNext = useCallback(() => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((i) => i + 1)
    } else {
      // Session complete
      endSession()
      router.push('/prelims/results')
    }
  }, [currentIndex, questions.length, endSession, router])

  if (!session || questions.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-white/50">No active session. Please start a new game.</p>
      </div>
    )
  }

  const answeredCount = Object.keys(session.answers).length
  const correctCount = Object.values(session.answers).filter((a) => a.isCorrect).length
  const wrongCount = answeredCount - correctCount
  const streak = session.streak

  // Count current stats
  const optionKeys: OptionKey[] = ['A', 'B', 'C', 'D']

  const getOptionState = (key: OptionKey) => {
    if (!revealed) {
      return selectedOption === key ? 'selected' : 'default'
    }
    if (key === currentQuestion.correct) return 'correct'
    if (key === selectedOption && selectedOption !== currentQuestion.correct) return 'incorrect'
    return 'default'
  }

  const isLastQuestion = currentIndex === questions.length - 1

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
      {/* Header stats row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {/* Streak */}
          <motion.div
            className={clsx(
              'flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-sm font-bold',
              streak >= 3
                ? 'bg-orange-500/15 border-orange-500/30 text-orange-300'
                : 'bg-white/5 border-white/10 text-white/50'
            )}
            animate={streak >= 3 ? { scale: [1, 1.08, 1] } : { scale: 1 }}
            transition={{ duration: 0.5, repeat: streak >= 5 ? Infinity : 0, repeatDelay: 1.5 }}
          >
            <Flame className={clsx('w-4 h-4', streak >= 3 ? 'text-orange-400' : 'text-white/30')} />
            <span>{streak}</span>
          </motion.div>

          {/* Score */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-sm">
            <Trophy className="w-4 h-4 text-saffron-400" />
            <span className="font-bold text-white">{session.score}</span>
          </div>
        </div>

        {/* Timer */}
        <Timer
          key={timerKey}
          totalSeconds={30}
          onExpire={handleExpire}
          paused={revealed}
        />

        {/* XP earned */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-sm">
          <Zap className="w-4 h-4 text-saffron-400 fill-saffron-400" />
          <span className="font-bold text-saffron-300">{session.xpEarned}</span>
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

      {/* Speed/XP flash overlays */}
      <div className="relative h-0">
        <AnimatePresence>
          {speedLabel && (
            <motion.div
              key="speed"
              className="absolute -top-2 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-blue-500/20 border border-blue-500/40 text-blue-300 text-sm font-bold whitespace-nowrap z-10"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              {speedLabel}
            </motion.div>
          )}
          {xpFlash && (
            <motion.div
              key="xp"
              className="absolute -top-2 right-0 flex items-center gap-1 px-3 py-1.5 rounded-full bg-saffron-500/20 border border-saffron-500/40 text-saffron-300 text-sm font-bold z-10"
              initial={{ opacity: 0, scale: 0.5, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
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
          className="glass rounded-2xl p-6 space-y-5"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {/* Meta: subject + difficulty */}
          <div className="flex items-center gap-2 text-xs text-white/40">
            <span className="px-2 py-0.5 rounded-md bg-white/8 capitalize">{currentQuestion.subjectId.replace('-', ' ')}</span>
            <span
              className={clsx(
                'px-2 py-0.5 rounded-md capitalize',
                currentQuestion.difficulty === 'easy' && 'bg-jade-500/15 text-jade-400',
                currentQuestion.difficulty === 'medium' && 'bg-amber-500/15 text-amber-400',
                currentQuestion.difficulty === 'hard' && 'bg-rose-500/15 text-rose-400'
              )}
            >
              {currentQuestion.difficulty}
            </span>
            {currentQuestion.year && (
              <span className="px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-400">UPSC {currentQuestion.year}</span>
            )}
          </div>

          {/* Question text */}
          <p className="text-lg font-medium text-white leading-relaxed">
            {currentQuestion.text}
          </p>

          {/* Options */}
          <div className="space-y-2.5">
            {optionKeys.map((key) => (
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

          {/* Explanation (revealed after answer) */}
          <AnimatePresence>
            {revealed && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.35 }}
                className="overflow-hidden"
              >
                <div className="mt-1 p-4 rounded-xl bg-white/5 border border-white/10 text-sm text-white/70 leading-relaxed">
                  <p className="text-white/40 text-xs font-semibold uppercase tracking-wider mb-2">Explanation</p>
                  {currentQuestion.explanation}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </AnimatePresence>

      {/* Next button */}
      <AnimatePresence>
        {revealed && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex justify-end"
          >
            <button
              onClick={handleNext}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-saffron-500 hover:bg-saffron-600 text-white font-bold transition-colors shadow-lg shadow-saffron-500/25"
            >
              {isLastQuestion ? (
                <>
                  <Trophy className="w-4 h-4" />
                  Finish Session
                </>
              ) : (
                <>
                  Next Question
                  <ChevronRight className="w-4 h-4" />
                </>
              )}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
