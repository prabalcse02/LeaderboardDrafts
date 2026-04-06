'use client'

import Link from 'next/link'
import { BookOpen, CheckCircle2 } from 'lucide-react'
import { GS_SUBJECTS, CSAT_SUBJECT, type Subject } from '@/lib/data/subjects'
import { useGameStore } from '@/lib/store/gameStore'

type FilterTab = 'all' | 'gs1' | 'csat'

interface SubjectGridProps {
  filter?: FilterTab
  selectable?: boolean
  selectedIds?: string[]
  onToggle?: (subjectId: string) => void
}

function SubjectCard({
  subject, selectable, selected, accuracy, attempted, total, onToggle,
}: {
  subject: Subject; selectable: boolean; selected: boolean
  accuracy: number | null; attempted: number; total: number; onToggle?: () => void
}) {
  const pct        = total > 0 ? Math.round((attempted / total) * 100) : 0
  const hasStarted = attempted > 0
  const accColor   = !hasStarted ? 'var(--text-3)'
    : (accuracy! >= 70) ? 'var(--success)'
    : (accuracy! >= 50) ? 'var(--warning)'
    : 'var(--error)'
  const barColor   = !hasStarted ? 'var(--border)'
    : (accuracy! >= 70) ? 'var(--success)'
    : (accuracy! >= 50) ? 'var(--warning)'
    : 'var(--error)'

  const cardContent = (
    <div
      onClick={selectable ? onToggle : undefined}
      className={`relative group p-5 space-y-4 rounded-2xl border transition-all duration-200 ${selectable ? 'cursor-pointer' : ''}`}
      style={{
        background:   selected ? 'color-mix(in oklab, var(--accent) 6%, var(--elevated))' : 'var(--elevated)',
        borderColor:  selected ? 'color-mix(in oklab, var(--accent) 40%, var(--border))' : 'var(--border)',
        boxShadow:    selected ? '0 0 0 1px color-mix(in oklab, var(--accent) 15%, transparent)' : 'none',
      }}
      onMouseEnter={e => {
        if (!selected) (e.currentTarget as HTMLDivElement).style.borderColor = 'color-mix(in oklab, var(--accent) 25%, var(--border))'
      }}
      onMouseLeave={e => {
        if (!selected) (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--border)'
      }}
    >
      {selected && (
        <div className="absolute top-3 right-3">
          <CheckCircle2 size={17} style={{ color: 'var(--accent)' }} />
        </div>
      )}

      {/* Header */}
      <div className="flex items-start gap-3">
        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${subject.color} flex items-center justify-center text-lg shrink-0 shadow-sm`}>
          {subject.icon}
        </div>
        <div className="flex-1 min-w-0 pt-0.5">
          <h3 className="text-sm font-bold leading-tight line-clamp-2" style={{ color: 'var(--text)' }}>
            {subject.name}
          </h3>
          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded mt-1 inline-block uppercase tracking-wider"
            style={{
              background:  subject.paper === 'CSAT' ? 'var(--surface)' : 'var(--accent-tint)',
              color:       subject.paper === 'CSAT' ? 'var(--text-3)' : 'var(--accent)',
              border:      `1px solid ${subject.paper === 'CSAT' ? 'var(--border)' : 'color-mix(in oklab, var(--accent) 20%, transparent)'}`,
            }}>
            {subject.paper}
          </span>
        </div>
      </div>

      {/* Accuracy */}
      <div className="flex items-center justify-between text-xs">
        <span style={{ color: 'var(--text-3)' }}>{attempted} attempted</span>
        <span className="font-bold" style={{ color: accColor }}>
          {hasStarted ? `${accuracy}%` : 'Not started'}
        </span>
      </div>

      {/* Progress bar */}
      <div className="space-y-1">
        <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
          <div className="h-full rounded-full transition-all duration-700"
            style={{ width: `${pct}%`, background: barColor }} />
        </div>
        <p className="text-[10px] text-right" style={{ color: 'var(--text-3)' }}>{pct}% coverage</p>
      </div>

      {/* Topics */}
      <div className="flex items-center gap-1.5 text-[11px]" style={{ color: 'var(--text-3)' }}>
        <BookOpen size={11} />
        <span>{subject.topics.length} topics · {subject.totalQuestions} questions</span>
      </div>
    </div>
  )

  if (selectable) return cardContent
  return <Link href={`/prelims?subject=${subject.id}`} className="block">{cardContent}</Link>
}

export default function SubjectGrid({
  filter = 'all', selectable = false, selectedIds = [], onToggle,
}: SubjectGridProps) {
  const userStats = useGameStore(s => s.userStats)

  const subjects =
    filter === 'gs1'  ? GS_SUBJECTS :
    filter === 'csat' ? CSAT_SUBJECT :
    [...GS_SUBJECTS, ...CSAT_SUBJECT]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {subjects.map(subj => {
        const stats   = userStats.subjectScores[subj.id]
        return (
          <SubjectCard
            key={subj.id}
            subject={subj}
            selectable={selectable}
            selected={selectedIds.includes(subj.id)}
            accuracy={stats?.accuracyPct ?? null}
            attempted={stats?.totalAttempted ?? 0}
            total={subj.totalQuestions}
            onToggle={() => onToggle?.(subj.id)}
          />
        )
      })}
    </div>
  )
}
