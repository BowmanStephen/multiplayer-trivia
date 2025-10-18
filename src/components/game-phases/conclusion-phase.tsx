'use client'

import { useState } from 'react'
import { useGameStore } from '@/lib/store'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Trophy, Medal, Star, RotateCcw, Sparkles, Target, Zap } from 'lucide-react'

interface Superlative {
  key: string
  label: string
  icon: React.ReactNode
  winner: string
  description: string
}

export function ConclusionPhase() {
  const { players, gameHistory, resetGame } = useGameStore()
  const [showSuperlatives, setShowSuperlatives] = useState(false)

  const sortedPlayers = [...players].sort((a, b) => b.score - a.score)
  const winner = sortedPlayers[0]
  const isTie = sortedPlayers.length > 1 && sortedPlayers[0].score === sortedPlayers[1].score

  const calculateSuperlatives = (): Superlative[] => {
    const superlatives: Superlative[] = []

    // Sharpshooter (Most Accurate)
    const mostAccurate = players.reduce((prev, current) => {
      const prevRate = prev.totalAnswers > 0 ? prev.correctAnswers / prev.totalAnswers : 0
      const currentRate = current.totalAnswers > 0 ? current.correctAnswers / current.totalAnswers : 0
      return currentRate > prevRate ? current : prev
    })
    superlatives.push({
      key: 'most_accurate',
      label: 'Sharpshooter',
      icon: <Target className="w-5 h-5 text-blue-500" />,
      winner: mostAccurate.name,
      description: `Highest accuracy rate (${Math.round((mostAccurate.correctAnswers / mostAccurate.totalAnswers) * 100)}%)`
    })

    // On a Roll (Longest Streak)
    const longestStreak = players.reduce((prev, current) => 
      current.streak > prev.streak ? current : prev
    )
    if (longestStreak.streak >= 3) {
      superlatives.push({
        key: 'longest_streak',
        label: 'On a Roll',
        icon: <Zap className="w-5 h-5 text-yellow-500" />,
        winner: longestStreak.name,
        description: `Longest streak of ${longestStreak.streak} correct answers`
      })
    }

    // Hint Ninja (Fewest hints per correct answer)
    const playersWithCorrectAnswers = players.filter(p => p.correctAnswers > 0)
    if (playersWithCorrectAnswers.length > 0) {
      const hintNinja = playersWithCorrectAnswers.reduce((prev, current) => {
        const prevRatio = prev.hintsUsed / prev.correctAnswers
        const currentRatio = current.hintsUsed / current.correctAnswers
        return currentRatio < prevRatio ? current : prev
      })
      superlatives.push({
        key: 'hint_ninja',
        label: 'Hint Ninja',
        icon: <Star className="w-5 h-5 text-purple-500" />,
        winner: hintNinja.name,
        description: `Used the fewest hints per correct answer`
      })
    }

    return superlatives
  }

  const superlatives = calculateSuperlatives()

  const handlePlayAgain = () => {
    resetGame()
  }

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex justify-center mb-4">
          <Trophy className="w-16 h-16 text-yellow-500 animate-pulse" />
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
          And that's a wrap!
        </h1>
        <p className="text-lg text-gray-600">
          Time for final scores and celebrations! 🎉
        </p>
      </div>

      {/* Final Scores */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <Trophy className="w-6 h-6 text-yellow-500" />
            Final Scores
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {sortedPlayers.map((player, index) => (
              <div
                key={player.id}
                className={`flex items-center justify-between p-4 rounded-lg ${
                  index === 0 ? 'bg-gradient-to-r from-yellow-50 to-yellow-100 border border-yellow-200' :
                  index === 1 ? 'bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200' :
                  index === 2 ? 'bg-gradient-to-r from-orange-50 to-orange-100 border border-orange-200' :
                  'bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  {index === 0 && <Trophy className="w-8 h-8 text-yellow-500" />}
                  {index === 1 && <Medal className="w-8 h-8 text-gray-400" />}
                  {index === 2 && <Medal className="w-8 h-8 text-orange-400" />}
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-lg">{player.name}</span>
                      {index === 0 && !isTie && (
                        <Badge className="bg-yellow-500 text-white">Winner!</Badge>
                      )}
                      {isTie && index === 0 && (
                        <Badge className="bg-blue-500 text-white">Tied!</Badge>
                      )}
                    </div>
                    <div className="text-sm text-gray-600">
                      {player.correctAnswers}/{player.totalAnswers} correct
                      {player.streak >= 3 && ` • 🔥 ${player.streak} streak`}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-2xl">{player.score}</div>
                  <div className="text-xs text-gray-500">points</div>
                </div>
              </div>
            ))}
          </div>

          {isTie && (
            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center gap-2 text-blue-800 font-medium">
                <Trophy className="w-5 h-5" />
                It's a tie!
              </div>
              <p className="text-blue-700 mt-1">
                {sortedPlayers.filter(p => p.score === winner.score).map(p => p.name).join(' and ')} 
                are tied with {winner.score} points each!
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Superlatives */}
      {superlatives.length > 0 && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <Sparkles className="w-6 h-6 text-purple-500" />
              Special Awards
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              {superlatives.map((superlative) => (
                <div
                  key={superlative.key}
                  className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg"
                >
                  <div className="flex items-center gap-2 mb-2">
                    {superlative.icon}
                    <span className="font-bold text-purple-800">{superlative.label}</span>
                  </div>
                  <div className="font-medium text-gray-800">{superlative.winner}</div>
                  <div className="text-sm text-gray-600">{superlative.description}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Game Stats */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg">Game Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="font-bold text-2xl text-purple-600">{gameHistory.length}</div>
              <div className="text-sm text-gray-600">Questions Played</div>
            </div>
            <div>
              <div className="font-bold text-2xl text-green-600">
                {gameHistory.filter(h => h.correct).length}
              </div>
              <div className="text-sm text-gray-600">Correct Answers</div>
            </div>
            <div>
              <div className="font-bold text-2xl text-blue-600">
                {players.reduce((sum, p) => sum + p.hintsUsed, 0)}
              </div>
              <div className="text-sm text-gray-600">Hints Used</div>
            </div>
            <div>
              <div className="font-bold text-2xl text-yellow-600">
                {Math.round((gameHistory.filter(h => h.correct).length / gameHistory.length) * 100)}%
              </div>
              <div className="text-sm text-gray-600">Success Rate</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="text-center space-y-4">
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            size="lg"
            onClick={handlePlayAgain}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-3 font-semibold shadow-lg transform transition hover:scale-105"
          >
            <RotateCcw className="w-5 h-5 mr-2" />
            Play Again
          </Button>
          
          {superlatives.length > 0 && (
            <Button
              variant="outline"
              size="lg"
              onClick={() => setShowSuperlatives(!showSuperlatives)}
              className="px-8 py-3 font-semibold"
            >
              <Sparkles className="w-5 h-5 mr-2" />
              {showSuperlatives ? 'Hide' : 'Show'} Awards
            </Button>
          )}
        </div>
        
        <p className="text-gray-600">
          Thanks for playing Family Trivia Night! 🎯✨
        </p>
      </div>
    </div>
  )
}