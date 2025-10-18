'use client'

import { useEffect } from 'react'
import { useGameStore } from '@/lib/store'
import { SetupPhase } from './game-phases/setup-phase'
import { GameplayPhase } from './game-phases/gameplay-phase'
import { ConclusionPhase } from './game-phases/conclusion-phase'
import { Loader2 } from 'lucide-react'

export function TriviaGame() {
  const { phase, setProcessing } = useGameStore()

  useEffect(() => {
    // Handle any global loading states
    setProcessing(false)
  }, [setProcessing])

  const renderPhase = () => {
    switch (phase) {
      case 'setup':
        return <SetupPhase />
      case 'gameplay':
        return <GameplayPhase />
      case 'conclusion':
        return <ConclusionPhase />
      default:
        return <SetupPhase />
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      {renderPhase()}
    </div>
  )
}