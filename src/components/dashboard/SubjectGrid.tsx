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
  const hasStarted = attempted > 0

  const accColor =
    !hasStarted ? 'text-white/20' :
    accuracy! >= 70 ? 'text-green-400' :
    accuracy! >= 50 ? 'text-amber-400' : 'text-rose-400'

  const barColor =
    !hasStarted ? 'bg-white/8' :
    accuracy! >= 70 ? 'bg-gradient-to-r from-green-600 to-green-400' :
    accuracy! >= 50 ? 'bg-gradient-to-r from-amber-600 to-amber-400' :
    'bg-gradient-to-r from-rose-700 to-rose-500'

  const cardContent = (
    <div
      onClick={selectable ? onToggle : undefined}
      className={[
        'relative group glass p-5 space-y-4 transition-all duration-200',
        selectable ? 'cursor-pointer' : '',
        selected
          ? 'ring-1 ring-saffron-400/50 bg-saffron-500/6 border-saffron-500/25'
          : 'hover:border-white/15 hover:bg-white/6 hover:-translate-y-0.5',
      ].join(' ')}
    >
      {/* Selected badge */}
      {selectable && selected && (
        <div className="absolute top-3 right-3">
          <CheckCircle2 size={17} className="text-saffron-400 fill-saffron-400/20" />
        </div>
      )}

      {/* Header */}
      <div className="flex items-start gap-3">
        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${subject.color}
          flex items-center justify-center text-lg shrink-0 shadow-sm`}>
          {subject.icon}
        </div>
        <div className="flex-1 min-w-0 pt-0.5">
          <h3 className="text-sm font-bold text-white leading-tight line-clamp-2">
            {subject.name}
          </h3>
          <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded mt-1 inline-block uppercase tracking-wider
            ${subject.paper === 'CSAT'
              ? 'bg-slate-500/15 text-slate-400 border border-slate-500/20'
              : 'bg-blue-500/15 text-blue-400 border border-blue-500/20'}`}>
            {subject.paper}
          </span>
        </div>
      </div>

      {/* Accuracy + attempted */}
      <div className="flex items-center justify-between text-xs">
        <span className="text-white/35">{attempted} attempted</span>
        <span className={`font-bold ${accColor}`}>
          {hasStarted ? `${accuracy}%` : 'Not started'}
        </span>
      </div>

      {/* Progress bar */}
      <div className="space-y-1">
        <div className="h-1.5 bg-white/6 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-700 ${barColor}`}
            style={{ width: `${pct}%` }}
          />
        </div>
        <p className="text-[10px] text-white/20 text-right">{pct}% coverage</p>
      </div>

      {/* Topic count */}
      <div className="flex items-center gap-1.5 text-[11px] text-white/30">
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

export default function SubjectGrid({
  filter = 'all',
  selectable = false,
  selectedIds = [],
  onToggle,
}: SubjectGridProps) {
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
        const attempted = stats?.totalAttempted ?? 0
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
