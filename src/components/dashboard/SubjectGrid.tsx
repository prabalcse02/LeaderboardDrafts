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
  subject: Subject
  selectable: boolean
  selected: boolean
  accuracy: number | null
  attempted: number
  total: number
  onToggle?: () => void
}) {
  const pct = total > 0 ? Math.round((attempted / total) * 100) : 0

  const cardContent = (
    <div className={`relative group glass glass-hover p-5 space-y-4 transition-all duration-200
      ${selected ? 'ring-2 ring-[#ff7c00] bg-[#ff7c00]/5' : ''}
      ${selectable ? 'cursor-pointer' : ''}`}
      onClick={selectable ? onToggle : undefined}
    >
      {/* Selected checkmark */}
      {selectable && selected && (
        <CheckCircle2 size={18} className="absolute top-3 right-3 text-[#ff7c00]" />
      )}

      {/* Subject header */}
      <div className="flex items-start gap-3">
        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${subject.color}
          flex items-center justify-center text-lg shrink-0`}>
          {subject.icon}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-bold text-white leading-tight truncate">
            {subject.name}
          </h3>
          <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded mt-0.5 inline-block
            ${subject.paper === 'CSAT'
              ? 'bg-slate-500/20 text-slate-400'
              : 'bg-blue-500/20 text-blue-400'}`}>
            {subject.paper}
          </span>
        </div>
      </div>

      {/* Accuracy */}
      <div className="flex items-center justify-between text-xs">
        <span className="text-white/40">{attempted} attempted</span>
        {accuracy !== null ? (
          <span className={`font-bold
            ${accuracy >= 70 ? 'text-green-400' :
              accuracy >= 50 ? 'text-amber-400' : 'text-red-400'}`}>
            {accuracy}% accuracy
          </span>
        ) : (
          <span className="text-white/25">Not started</span>
        )}
      </div>

      {/* Progress bar */}
      <div className="space-y-1">
        <div className="h-1.5 bg-white/8 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full bg-gradient-to-r ${subject.color} transition-all duration-500`}
            style={{ width: `${pct}%` }}
          />
        </div>
        <p className="text-[10px] text-white/25 text-right">{pct}% covered</p>
      </div>

      {/* Topic count */}
      <div className="flex items-center gap-1 text-[11px] text-white/35">
        <BookOpen size={11} />
        <span>{subject.topics.length} topics · {subject.totalQuestions} questions</span>
      </div>
    </div>
  )

  if (selectable) return cardContent

  return (
    <Link href={`/prelims?subject=${subject.id}`} className="block">
      {cardContent}
    </Link>
  )
}

export default function SubjectGrid({ filter = 'all', selectable = false, selectedIds = [], onToggle }: SubjectGridProps) {
  const userStats = useGameStore(s => s.userStats)

  const subjects =
    filter === 'gs1'  ? GS_SUBJECTS :
    filter === 'csat' ? CSAT_SUBJECT :
    [...GS_SUBJECTS, ...CSAT_SUBJECT]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {subjects.map(subj => {
        const stats    = userStats.subjectScores[subj.id]
        const accuracy = stats ? stats.accuracyPct : null
        const attempted = stats ? stats.totalAttempted : 0
        return (
          <SubjectCard
            key={subj.id}
            subject={subj}
            selectable={selectable}
            selected={selectedIds.includes(subj.id)}
            accuracy={accuracy}
            attempted={attempted}
            total={subj.totalQuestions}
            onToggle={() => onToggle?.(subj.id)}
          />
        )
      })}
    </div>
  )
}
