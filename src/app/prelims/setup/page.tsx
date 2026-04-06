'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Clock, Rocket, ChevronLeft, Tag, Layers } from 'lucide-react'
import { useGameStore } from '@/lib/store/gameStore'
import { getSubjectById } from '@/lib/data/subjects'
import { getQuestionsForSession } from '@/lib/data/questions'

const TIME_OPTIONS = [
  { minutes: 5,  label: '5 min',  tag: 'Micro',   desc: '~10 Qs', icon: '⚡' },
  { minutes: 10, label: '10 min', tag: 'Quick',    desc: '~20 Qs', icon: '🚀' },
  { minutes: 20, label: '20 min', tag: 'Standard', desc: '~40 Qs', icon: '📚' },
  { minutes: 30, label: '30 min', tag: 'Full Set', desc: '~60 Qs', icon: '🏆' },
]

function estimateQuestions(minutes: number) {
  return Math.max(5, Math.round(minutes * 2))
}

export default function SetupPage() {
  const router       = useRouter()
  const setupState   = useGameStore(s => s.setupState)
  const setSetup     = useGameStore(s => s.setSetupState)
  const startSession = useGameStore(s => s.startSession)
  const resetSession = useGameStore(s => s.resetSession)

  const { selectedSubjectIds, selectedTopicIds, durationMinutes } = setupState

  useEffect(() => {
    if (selectedSubjectIds.length === 0) router.replace('/prelims')
  }, [selectedSubjectIds, router])

  const selectedSubjects = selectedSubjectIds
    .map(id => getSubjectById(id))
    .filter(Boolean) as ReturnType<typeof getSubjectById>[]

  const allTopics = selectedSubjects.flatMap(s => s!.topics)

  const toggleTopic = (topicId: string) => {
    const next = selectedTopicIds.includes(topicId)
      ? selectedTopicIds.filter(t => t !== topicId)
      : [...selectedTopicIds, topicId]
    setSetup({ selectedTopicIds: next })
  }

  const launch = () => {
    resetSession()
    const qCount    = estimateQuestions(durationMinutes)
    const questions = getQuestionsForSession(selectedSubjectIds, selectedTopicIds, qCount)
    if (questions.length === 0) {
      alert('No questions available for the selected topics yet. Try selecting different topics.')
      return
    }
    startSession(setupState, questions)
    router.push('/prelims/play')
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">

      {/* Back + title */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => router.back()}
          className="p-2.5 glass glass-hover rounded-xl text-white/50 hover:text-white border border-white/8"
        >
          <ChevronLeft size={17} />
        </button>
        <div>
          <h1 className="text-xl font-black text-white">Mission Setup</h1>
          <p className="text-white/35 text-xs">Configure your practice session</p>
        </div>
      </div>

      {/* Selected subjects pill row */}
      <div className="glass p-4 space-y-3">
        <p className="flex items-center gap-1.5 text-xs font-bold text-white/40 uppercase tracking-wider">
          <Layers size={11} /> Subjects
        </p>
        <div className="flex flex-wrap gap-2">
          {selectedSubjects.map(s => (
            <span
              key={s!.id}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm
                bg-gradient-to-r ${s!.color} text-white font-semibold shadow-sm`}
            >
              {s!.icon} {s!.name.split(' ')[0]}
            </span>
          ))}
        </div>
      </div>

      {/* Topic chips */}
      <div className="glass p-4 space-y-3">
        <div className="flex items-center justify-between">
          <p className="flex items-center gap-1.5 text-xs font-bold text-white/40 uppercase tracking-wider">
            <Tag size={11} /> Topics
          </p>
          {selectedTopicIds.length > 0 && (
            <button
              onClick={() => setSetup({ selectedTopicIds: [] })}
              className="text-[10px] text-saffron-400/60 hover:text-saffron-400 transition-colors font-medium"
            >
              Clear all
            </button>
          )}
        </div>
        <p className="text-[11px] text-white/25">Leave unselected to practice all topics in chosen subjects</p>
        <div className="flex flex-wrap gap-2">
          {allTopics.map(t => {
            const active = selectedTopicIds.includes(t.id)
            return (
              <button
                key={t.id}
                onClick={() => toggleTopic(t.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium
                  border transition-all duration-150
                  ${active
                    ? 'bg-saffron-500/15 border-saffron-500/40 text-saffron-300'
                    : 'bg-white/4 border-white/8 text-white/55 hover:border-white/20 hover:text-white/80'}`}
              >
                <span>{t.icon}</span>
                {t.name}
              </button>
            )
          })}
        </div>
      </div>

      {/* Duration picker */}
      <div className="glass p-4 space-y-3">
        <p className="flex items-center gap-1.5 text-xs font-bold text-white/40 uppercase tracking-wider">
          <Clock size={11} /> Duration
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {TIME_OPTIONS.map(opt => {
            const active = durationMinutes === opt.minutes
            return (
              <button
                key={opt.minutes}
                onClick={() => setSetup({ durationMinutes: opt.minutes })}
                className={`relative p-4 rounded-xl border text-left transition-all duration-150
                  ${active
                    ? 'bg-saffron-500/12 border-saffron-500/45 shadow-lg shadow-saffron-500/10'
                    : 'bg-white/3 border-white/8 hover:border-white/18 hover:bg-white/5'}`}
              >
                <span className="text-lg mb-1 block">{opt.icon}</span>
                <p className={`text-lg font-black ${active ? 'text-saffron-400' : 'text-white'}`}>
                  {opt.label}
                </p>
                <p className={`text-[10px] font-semibold mt-0.5 ${active ? 'text-saffron-400/70' : 'text-white/35'}`}>
                  {opt.tag}
                </p>
                <p className="text-[10px] text-white/22 mt-0.5">{opt.desc}</p>
                {active && (
                  <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-saffron-400" />
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* Launch */}
      <button
        onClick={launch}
        className="group w-full flex items-center justify-center gap-3 py-4
          bg-gradient-to-r from-saffron-500 to-saffron-400
          hover:from-saffron-600 hover:to-saffron-500
          text-white font-black text-lg rounded-2xl
          shadow-2xl shadow-saffron-500/30
          transition-all hover:scale-[1.02] active:scale-100"
      >
        <Rocket size={22} className="transition-transform group-hover:-rotate-12" />
        Launch Mission
      </button>
    </div>
  )
}
