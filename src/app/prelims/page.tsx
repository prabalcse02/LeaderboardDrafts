'use client'

import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { ArrowRight, BookOpen, Sparkles } from 'lucide-react'
import { ROUTES } from '@/lib/config'
import SubjectGrid from '@/components/dashboard/SubjectGrid'
import { useGameStore } from '@/lib/store/gameStore'

type PaperTab = 'gs1' | 'csat' | 'all'

const TABS: { key: PaperTab; label: string }[] = [
  { key: 'gs1',  label: 'GS Paper I' },
  { key: 'csat', label: 'CSAT Paper II' },
  { key: 'all',  label: 'All' },
]

function PrelimsContent() {
  const router     = useRouter()
  useSearchParams()
  const setSetup   = useGameStore(s => s.setSetupState)
  const setupState = useGameStore(s => s.setupState)

  const [tab, setTab] = useState<PaperTab>('gs1')
  const selected      = setupState.selectedSubjectIds

  const toggle = (id: string) => {
    const next = selected.includes(id)
      ? selected.filter(s => s !== id)
      : [...selected, id]
    setSetup({ selectedSubjectIds: next, selectedTopicIds: [] })
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">

      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Sparkles size={14} style={{ color: 'var(--amber)' }} />
          <span className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--amber)' }}>
            Select Subjects
          </span>
        </div>
        <h1 className="font-heading text-3xl" style={{ color: 'var(--text)' }}>
          Choose Your <span className="gradient-text">Battlefield</span>
        </h1>
        <p className="text-sm" style={{ color: 'var(--text-3)' }}>
          Select one or more subjects to practise. You&apos;ll pick specific topics next.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 flex-wrap">
        <div className="flex gap-1 p-1 rounded-xl border" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
          {TABS.map(({ key, label }) => (
            <button key={key} onClick={() => setTab(key)}
              className="px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-150"
              style={{
                background: tab === key ? 'var(--amber)' : 'transparent',
                color:      tab === key ? 'var(--amber-on)' : 'var(--text-3)',
                boxShadow:  tab === key ? '0 2px 8px color-mix(in oklab, var(--amber) 25%, transparent)' : 'none',
              }}>
              {label}
            </button>
          ))}
        </div>

        {selected.length > 0 && (
          <span className="ml-auto flex items-center gap-1.5 text-sm font-semibold px-3 py-1.5 rounded-xl border"
            style={{ color: 'var(--accent)', background: 'var(--accent-tint)', borderColor: 'color-mix(in oklab, var(--accent) 25%, transparent)' }}>
            <BookOpen size={13} />
            {selected.length} selected
          </span>
        )}
      </div>

      <SubjectGrid filter={tab} selectable selectedIds={selected} onToggle={toggle} />

      {/* Sticky CTA */}
      {selected.length > 0 && (
        <div className="sticky bottom-6 flex justify-center z-20">
          <button onClick={() => router.push(ROUTES.setup)}
            className="btn-amber group flex items-center gap-2 px-7 py-3"
            style={{ boxShadow: '0 6px 20px color-mix(in oklab, var(--amber) 28%, transparent)' }}>
            <BookOpen size={15} />
            Select Topics
            <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
          </button>
        </div>
      )}
    </div>
  )
}

export default function PrelimsPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-[60vh] text-sm" style={{ color: 'var(--text-3)' }}>
        Loading…
      </div>
    }>
      <PrelimsContent />
    </Suspense>
  )
}
