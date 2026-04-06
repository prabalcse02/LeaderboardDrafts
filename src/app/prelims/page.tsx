'use client'

import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { ArrowRight, BookOpen, Sparkles } from 'lucide-react'
import SubjectGrid from '@/components/dashboard/SubjectGrid'
import { useGameStore } from '@/lib/store/gameStore'

type PaperTab = 'gs1' | 'csat' | 'all'

const TABS: { key: PaperTab; label: string; sub: string }[] = [
  { key: 'gs1',  label: 'GS Paper I',    sub: '8 subjects' },
  { key: 'csat', label: 'CSAT Paper II', sub: '1 subject' },
  { key: 'all',  label: 'All',           sub: '9 subjects' },
]

function PrelimsContent() {
  const router     = useRouter()
  useSearchParams()                               // keep searchParams alive in Suspense
  const setSetup   = useGameStore(s => s.setSetupState)
  const setupState = useGameStore(s => s.setupState)

  const [tab, setTab] = useState<PaperTab>('gs1')
  const selected = setupState.selectedSubjectIds

  const toggle = (id: string) => {
    const next = selected.includes(id)
      ? selected.filter(s => s !== id)
      : [...selected, id]
    setSetup({ selectedSubjectIds: next, selectedTopicIds: [] })
  }

  const proceed = () => {
    if (selected.length === 0) return
    router.push('/prelims/setup')
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">

      {/* Header */}
      <div className="space-y-1.5">
        <div className="flex items-center gap-2">
          <Sparkles size={14} className="text-saffron-400" />
          <span className="text-xs font-bold uppercase tracking-widest text-saffron-400">
            Select Subjects
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-white">
          Choose Your <span className="gradient-text">Battlefield</span>
        </h1>
        <p className="text-white/45 text-sm">
          Select one or more subjects to practise. You&apos;ll pick specific topics next.
        </p>
      </div>

      {/* Paper tabs */}
      <div className="flex items-center gap-2 flex-wrap">
        <div className="flex gap-1.5 p-1 bg-white/4 border border-white/8 rounded-xl">
          {TABS.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-150
                ${tab === key
                  ? 'bg-saffron-500 text-white shadow-md shadow-saffron-500/30'
                  : 'text-white/50 hover:text-white/80'}`}
            >
              {label}
            </button>
          ))}
        </div>

        {selected.length > 0 && (
          <span className="ml-auto flex items-center gap-1.5 text-sm font-semibold text-saffron-400 bg-saffron-500/10 border border-saffron-500/20 px-3 py-1.5 rounded-lg">
            <BookOpen size={13} />
            {selected.length} selected
          </span>
        )}
      </div>

      <SubjectGrid
        filter={tab}
        selectable
        selectedIds={selected}
        onToggle={toggle}
      />

      {/* Sticky bottom CTA */}
      {selected.length > 0 && (
        <div className="sticky bottom-6 flex justify-center z-20">
          <button
            onClick={proceed}
            className="group flex items-center gap-3 px-8 py-4
              bg-gradient-to-r from-saffron-500 to-saffron-400
              hover:from-saffron-600 hover:to-saffron-500
              text-white font-black text-base rounded-2xl
              shadow-2xl shadow-saffron-500/40
              transition-all hover:scale-105 active:scale-100"
          >
            <BookOpen size={18} />
            Select Topics
            <ArrowRight size={18} className="transition-transform group-hover:translate-x-0.5" />
          </button>
        </div>
      )}
    </div>
  )
}

export default function PrelimsPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-[60vh] text-white/40 text-sm">
        Loading…
      </div>
    }>
      <PrelimsContent />
    </Suspense>
  )
}
