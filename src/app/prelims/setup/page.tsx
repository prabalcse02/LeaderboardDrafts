'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Clock, Rocket, ChevronLeft, Tag, Layers } from 'lucide-react'
import { useGameStore } from '@/lib/store/gameStore'
import { getSubjectById } from '@/lib/data/subjects'
import { getQuestionsForSession } from '@/lib/data/questions'
import { ROUTES } from '@/lib/config'

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
    if (selectedSubjectIds.length === 0) router.replace(ROUTES.prelims)
  }, [selectedSubjectIds, router])

  const selectedSubjects = selectedSubjectIds
    .map(id => getSubjectById(id))
    .filter(Boolean) as ReturnType<typeof getSubjectById>[]

  const allTopics = selectedSubjects.flatMap(s => s!.topics)

  const toggleTopic = (id: string) => {
    const next = selectedTopicIds.includes(id)
      ? selectedTopicIds.filter(t => t !== id)
      : [...selectedTopicIds, id]
    setSetup({ selectedTopicIds: next })
  }

  const launch = () => {
    resetSession()
    const questions = getQuestionsForSession(selectedSubjectIds, selectedTopicIds, estimateQuestions(durationMinutes))
    if (questions.length === 0) {
      alert('No questions available for the selected topics yet. Try selecting different topics.')
      return
    }
    startSession(setupState, questions)
    router.push(ROUTES.play)
  }

  const SectionLabel = ({ icon: Icon, label }: { icon: React.ElementType; label: string }) => (
    <p className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text-3)' }}>
      <Icon size={11} />{label}
    </p>
  )

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">

      {/* Back + title */}
      <div className="flex items-center gap-3">
        <button onClick={() => router.back()}
          className="p-2.5 rounded-xl border transition-colors"
          style={{ background: 'var(--elevated)', borderColor: 'var(--border)', color: 'var(--text-3)' }}>
          <ChevronLeft size={17} />
        </button>
        <div>
          <h1 className="font-heading text-xl" style={{ color: 'var(--text)' }}>Mission Setup</h1>
          <p className="text-xs" style={{ color: 'var(--text-3)' }}>Configure your practice session</p>
        </div>
      </div>

      {/* Subjects */}
      <div className="card p-4 space-y-3">
        <SectionLabel icon={Layers} label="Subjects" />
        <div className="flex flex-wrap gap-2">
          {selectedSubjects.map(s => (
            <span key={s!.id}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold bg-gradient-to-r ${s!.color} text-white shadow-sm`}>
              {s!.icon} {s!.name.split(' ')[0]}
            </span>
          ))}
        </div>
      </div>

      {/* Topics */}
      <div className="card p-4 space-y-3">
        <div className="flex items-center justify-between">
          <SectionLabel icon={Tag} label="Topics" />
          {selectedTopicIds.length > 0 && (
            <button onClick={() => setSetup({ selectedTopicIds: [] })}
              className="text-[10px] font-medium transition-colors" style={{ color: 'var(--text-3)' }}>
              Clear all
            </button>
          )}
        </div>
        <p className="text-[11px]" style={{ color: 'var(--text-3)' }}>
          Leave unselected to practise all topics in chosen subjects
        </p>
        <div className="flex flex-wrap gap-2">
          {allTopics.map(t => {
            const active = selectedTopicIds.includes(t.id)
            return (
              <button key={t.id} onClick={() => toggleTopic(t.id)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border transition-all duration-150"
                style={{
                  background:   active ? 'var(--accent-tint)' : 'var(--surface)',
                  borderColor:  active ? 'color-mix(in oklab, var(--accent) 35%, transparent)' : 'var(--border)',
                  color:        active ? 'var(--accent)' : 'var(--text-2)',
                }}>
                <span>{t.icon}</span>
                {t.name}
              </button>
            )
          })}
        </div>
      </div>

      {/* Duration */}
      <div className="card p-4 space-y-3">
        <SectionLabel icon={Clock} label="Duration" />
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {TIME_OPTIONS.map(opt => {
            const active = durationMinutes === opt.minutes
            return (
              <button key={opt.minutes} onClick={() => setSetup({ durationMinutes: opt.minutes })}
                className="relative p-4 rounded-xl border text-left transition-all duration-150"
                style={{
                  background:  active ? 'var(--amber-tint)' : 'var(--surface)',
                  borderColor: active ? 'color-mix(in oklab, var(--amber) 40%, transparent)' : 'var(--border)',
                  boxShadow:   active ? '0 2px 8px color-mix(in oklab, var(--amber) 15%, transparent)' : 'none',
                }}>
                <span className="text-lg mb-1 block">{opt.icon}</span>
                <p className="text-lg font-black" style={{ color: active ? 'var(--amber)' : 'var(--text)' }}>
                  {opt.label}
                </p>
                <p className="text-[10px] font-semibold mt-0.5" style={{ color: active ? 'var(--amber)' : 'var(--text-3)' }}>
                  {opt.tag}
                </p>
                <p className="text-[10px] mt-0.5" style={{ color: 'var(--text-3)' }}>{opt.desc}</p>
                {active && <span className="absolute top-2 right-2 w-2 h-2 rounded-full" style={{ background: 'var(--amber)' }} />}
              </button>
            )
          })}
        </div>
      </div>

      {/* Launch */}
      <button onClick={launch}
        className="btn-amber group w-full flex items-center justify-center gap-2 py-3.5 text-base font-semibold"
        style={{ boxShadow: '0 6px 20px color-mix(in oklab, var(--amber) 28%, transparent)' }}>
        <Rocket size={18} className="transition-transform group-hover:-rotate-12" />
        Launch Session
      </button>
    </div>
  )
}
