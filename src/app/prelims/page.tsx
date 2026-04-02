'use client'

import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { ArrowRight, BookOpen } from 'lucide-react'
import SubjectGrid from '@/components/dashboard/SubjectGrid'
import { useGameStore } from '@/lib/store/gameStore'

type PaperTab = 'all' | 'gs1' | 'csat'

function PrelimsContent() {
  const router      = useRouter()
  const params      = useSearchParams()
  const setSetup    = useGameStore(s => s.setSetupState)
  const setupState  = useGameStore(s => s.setupState)

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

  const TABS: { key: PaperTab; label: string }[] = [
    { key: 'gs1',  label: 'GS Paper I' },
    { key: 'csat', label: 'CSAT Paper II' },
    { key: 'all',  label: 'All' },
  ]

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-black text-white">Choose Your Battlefield</h1>
        <p className="text-white/50 text-sm">
          Select one or more subjects to practise. You&apos;ll pick specific topics next.
        </p>
      </div>

      {/* Paper tabs */}
      <div className="flex items-center gap-2">
        {TABS.map(({ key, label }) => (
          <button key={key} onClick={() => setTab(key)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all
              ${tab === key
                ? 'bg-[#ff7c00] text-white'
                : 'glass text-white/50 hover:text-white'}`}>
            {label}
          </button>
        ))}

        {selected.length > 0 && (
          <span className="ml-auto text-sm text-[#ff7c00] font-semibold">
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
        <div className="sticky bottom-6 flex justify-center">
          <button onClick={proceed}
            className="flex items-center gap-2 px-8 py-3.5
              bg-[#ff7c00] hover:bg-[#e05f00] text-white font-bold rounded-2xl
              shadow-2xl shadow-[#ff7c00]/30 transition-all
              hover:scale-105 active:scale-100">
            <BookOpen size={18} />
            Select Topics
            <ArrowRight size={18} />
          </button>
        </div>
      )}
    </div>
  )
}

export default function PrelimsPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-[60vh] text-white/40">Loading…</div>}>
      <PrelimsContent />
    </Suspense>
  )
}
