'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useGameStore } from '@/lib/store/gameStore'
import QuizEngine from '@/components/quiz/QuizEngine'

import { ROUTES } from '@/lib/config'

export default function PlayPage() {
  const router  = useRouter()
  const session = useGameStore(s => s.session)

  useEffect(() => {
    if (!session || session.status !== 'active' || session.questions.length === 0) {
      router.replace(ROUTES.prelims)
    }
  }, [session, router])

  if (!session || session.questions.length === 0) return null

  return <QuizEngine />
}
