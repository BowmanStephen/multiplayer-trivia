'use client'

import { useState } from 'react'
import { TriviaGame } from '@/components/trivia-game'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Sparkles, Trophy, Users } from 'lucide-react'

export default function Home() {
  const [gameStarted, setGameStarted] = useState(false)

  if (gameStarted) {
    return <TriviaGame />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="relative">
              <Trophy className="w-16 h-16 text-yellow-500 animate-pulse" />
              <Sparkles className="w-6 h-6 text-yellow-400 absolute -top-2 -right-2 animate-spin" />
            </div>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Family Trivia Night
          </h1>
          <p className="text-lg text-gray-600 max-w-md mx-auto">
            Join our warm, energetic host for an exciting trivia adventure that's fun for all ages!
          </p>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-4">
          <Card className="text-center">
            <CardHeader>
              <Users className="w-8 h-8 mx-auto text-blue-500" />
              <CardTitle className="text-lg">Family Friendly</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Safe, inclusive content perfect for players of all ages
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Trophy className="w-8 h-8 mx-auto text-yellow-500" />
              <CardTitle className="text-lg">Dynamic Scoring</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Points, streaks, hints, and exciting bonus opportunities
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Sparkles className="w-8 h-8 mx-auto text-purple-500" />
              <CardTitle className="text-lg">Adaptive Gameplay</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Questions that adapt to your skill level for maximum fun
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        {/* Start Button */}
        <div className="text-center">
          <Button 
            size="lg" 
            onClick={() => setGameStarted(true)}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-4 text-lg font-semibold shadow-lg transform transition hover:scale-105"
          >
            Start Trivia Adventure
          </Button>
          <p className="mt-4 text-sm text-gray-500">
            Get ready for an unforgettable trivia experience! 🎯
          </p>
        </div>
      </div>
    </div>
  )
}