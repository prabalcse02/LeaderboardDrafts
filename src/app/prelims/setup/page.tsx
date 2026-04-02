'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Clock, Rocket, ChevronLeft } from 'lucide-react'
import { useGameStore } from '@/lib/store/gameStore'
import { getSubjectById } from '@/lib/data/subjects'
import { getQuestionsForSession } from '@/lib/data/questions'

const TIME_OPTIONS = [
  { minutes: 5,   label: '5 min',  tag: 'Micro',    desc: '~10 questions' },
  { minutes: 10,  label: '10 min', tag: 'Quick',     desc: '~20 questions' },
  { minutes: 20,  label: '20 min', tag: 'Standard',  desc: '~40 questions' },
  { minutes: 30,  label: '30 min', tag: 'Full Set',  desc: '~60 questions' },
]

// Roughly 2 questions per minute
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
      <div className="flex items-center gap-3">
        <button onClick={() => router.back()}
          className="p-2 glass glass-hover rounded-lg text-white/50">
          <ChevronLeft size={18} />
        </button>
        <div>
          <h1 className="text-xl font-black text-white">Mission Setup</h1>
          <p className="text-white/40 text-xs">Configure your practice session</p>
        </div>
      </div>

      {/* Selected subjects */}
      <div className="glass p-4 space-y-3">
        <p className="text-xs font-bold text-white/40 uppercase tracking-wider">Subjects</p>
        <div className="flex flex-wrap gap-2">
          {selectedSubjects.map(s => (
            <span key={s!.id}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-sm
                bg-gradient-to-r ${s!.color} text-white font-semibold`}>
              {s!.icon} {s!.name.split(' ')[0]}
            </span>
          ))}
        </div>
      </div>

      {/* Topic selection */}
      <div className="glass p-4 space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-xs font-bold text-white/40 uppercase tracking-wider">Topics</p>
          <button onClick={() => setSetup({ selectedTopicIds: [] })}
            className="text-[10px] text-white/30 hover:text-white/60 transition-colors">
            Clear all
          </button>
        </div>
        <p className="text-[11px] text-white/30">Leave unselected to practice all topics</p>
        <div className="flex flex-wrap gap-2">
          {allTopics.map(t => {
            const active = selectedTopicIds.includes(t.id)
            return (
              <button key={t.id} onClick={() => toggleTopic(t.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium
                  border transition-all
                  ${active
                    ? 'bg-[#ff7c00]/20 border-[#ff7c00]/50 text-[#ff7c00]'
                    : 'bg-white/4 border-white/10 text-white/60 hover:border-white/25 hover:text-white/80'}`}>
                <span>{t.icon}</span>
                {t.name}
              </button>
            )
          })}
        </div>
      </div>

      {/* Time selection */}
      <div className="glass p-4 space-y-3">
        <p className="text-xs font-bold text-white/40 uppercase tracking-wider flex items-center gap-1.5">
          <Clock size={12} /> Duration
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {TIME_OPTIONS.map(opt => (
            <button key={opt.minutes} onClick={() => setSetup({ durationMinutes: opt.minutes })}
              className={`p-4 rounded-xl border text-left transition-all
                ${durationMinutes === opt.minutes
                  ? 'bg-[#ff7c00]/15 border-[#ff7c00]/50'
                  : 'bg-white/3 border-white/10 hover:border-white/20'}`}>
              <p className={`text-lg font-black ${durationMinutes === opt.minutes ? 'text-[#ff7c00]' : 'text-white'}`}>
                {opt.label}
              </p>
              <p className={`text-[10px] font-bold ${durationMinutes === opt.minutes ? 'text-[#ff7c00]/70' : 'text-white/40'}`}>
                {opt.tag}
              </p>
              <p className="text-[10px] text-white/25 mt-0.5">{opt.desc}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Launch button */}
      <button onClick={launch}
        className="w-full flex items-center justify-center gap-3 py-4
          bg-gradient-to-r from-[#ff7c00] to-[#ffb84d]
          hover:from-[#e05f00] hover:to-[#ff9a1f]
          text-white font-black text-lg rounded-2xl
          shadow-2xl shadow-[#ff7c00]/30 transition-all
          hover:scale-[1.02] active:scale-100">
        <Rocket size={22} />
        Launch Mission
      </button>
    </div>
  )
}
