'use client'

import { useState, useEffect } from 'react'
import { useGameStore } from '@/lib/store'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { ArrowRight, Lightbulb, SkipForward, Trophy, Target, TrendingUp, TrendingDown } from 'lucide-react'
import { HostMessage } from '@/components/ui/host-message'
import { PhaseChecklist } from '@/components/ui/phase-checklist'
import { TRIVIA_CONFIG } from '@/lib/config'
import { formatLeaderboard } from '@/lib/ai-host'
import { analyzeDifficulty, getDifficultyAdjustmentMessage } from '@/lib/difficulty-adjuster'

export function GameplayPhase() {
  const {
    players,
    settings,
    questions,
    currentQuestionIndex,
    currentQuestion,
    showHint,
    convertedToMC,
    gameHistory,
    submitAnswer,
    requestHint,
    skipQuestion,
    nextQuestion,
    setProcessing,
    setQuestions,
    isProcessing,
    phase,
    updateChecklist,
    completeChecklistItem,
    phaseChecklist,
    dynamicDifficulty,
    adjustDifficulty,
    showLeaderboard,
    setShowLeaderboard,
    convertToMC
  } = useGameStore()

  const [selectedAnswer, setSelectedAnswer] = useState('')
  const [selectedPlayer, setSelectedPlayer] = useState('')
  const [showResult, setShowResult] = useState(false)
  const [answerResult, setAnswerResult] = useState<{ 
    correct: boolean
    partial: boolean
    points: number
    explanation: string 
  } | null>(null)
  const [hostMessage, setHostMessage] = useState('')
  const [difficultyMessage, setDifficultyMessage] = useState('')

  // Initialize with first player
  useEffect(() => {
    if (players.length > 0 && !selectedPlayer) {
      setSelectedPlayer(players[0].id)
    }
  }, [players, selectedPlayer])

  // Generate questions when game starts
  useEffect(() => {
    if (phase === 'gameplay' && questions.length === 0 && settings.categories.length > 0) {
      generateQuestions()
    }
  }, [phase, questions.length, settings.categories.length])

  // Initialize gameplay checklist
  useEffect(() => {
    if (phase === 'gameplay' && !phaseChecklist) {
      updateChecklist('gameplay', TRIVIA_CONFIG.phases.gameplay.checklist)
    }
  }, [phase])

  // Check for dynamic difficulty adjustment
  useEffect(() => {
    if (players.length > 0 && currentQuestionIndex > 0 && currentQuestionIndex % 3 === 0) {
      const analysis = analyzeDifficulty(players, dynamicDifficulty)
      if (analysis.shouldAdjust) {
        const message = getDifficultyAdjustmentMessage(
          analysis.currentDifficulty,
          analysis.suggestedDifficulty,
          analysis.reason
        )
        setDifficultyMessage(message)
        adjustDifficulty()
        
        // Clear message after 5 seconds
        setTimeout(() => setDifficultyMessage(''), 5000)
      }
    }
  }, [currentQuestionIndex])

  const generateQuestions = async () => {
    setProcessing(true)
    completeChecklistItem(0) // Generate and validate
    
    try {
      const response = await fetch('/api/generate-questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          categories: settings.categories,
          difficulty: dynamicDifficulty,
          mode: settings.mode,
          count: settings.questionCount
        })
      })
      
      if (response.ok) {
        const generatedQuestions = await response.json()
        setQuestions(generatedQuestions)
        completeChecklistItem(1) // Present question
      } else {
        throw new Error(`API responded with status: ${response.status}`)
      }
    } catch (error) {
      console.error('Failed to generate questions:', error)
      const mockQuestions = generateMockQuestions()
      setQuestions(mockQuestions)
    } finally {
      setProcessing(false)
    }
  }

  const generateMockQuestions = () => {
    return [
      {
        id: '1',
        number: 1,
        category: 'Science',
        difficulty: 'Medium' as const,
        mode: 'MC' as const,
        question: 'What gas do plants primarily absorb from the atmosphere for photosynthesis?',
        choices: {
          A: 'Oxygen',
          B: 'Carbon dioxide',
          C: 'Nitrogen',
          D: 'Hydrogen'
        },
        correctAnswer: 'B',
        acceptableAnswers: ['carbon dioxide', 'co2', 'b'],
        explanation: 'Plants absorb carbon dioxide from the air and use sunlight to convert it into oxygen and glucose through photosynthesis.',
        hint: 'Think about what humans breathe out that plants need!'
      }
    ]
  }

  const handleSubmitAnswer = async () => {
    if (!selectedAnswer.trim() || !selectedPlayer || !currentQuestion || showResult) return

    completeChecklistItem(2) // Accept answer

    const player = players.find(p => p.id === selectedPlayer)
    if (!player) return

    submitAnswer(selectedPlayer, selectedAnswer)
    
    // Get the evaluation from game history
    const lastEntry = gameHistory[gameHistory.length]
    
    // Calculate result (simplified - actual logic is in store)
    const normalizedAnswer = selectedAnswer.toLowerCase().trim()
    const isCorrect = currentQuestion.mode === 'MC' 
      ? normalizedAnswer === currentQuestion.correctAnswer.toLowerCase()
      : currentQuestion.acceptableAnswers.some(a => a.toLowerCase() === normalizedAnswer)
    
    const basePoints = currentQuestion.difficulty === 'Easy' ? 100 : currentQuestion.difficulty === 'Medium' ? 150 : 200
    const hintPenalty = showHint ? Math.floor(basePoints * 0.25) : 0
    const streakBonus = player.streak >= 3 ? 20 : 0
    const points = isCorrect ? basePoints - hintPenalty + streakBonus : 0

    setAnswerResult({
      correct: isCorrect,
      partial: false,
      points,
      explanation: currentQuestion.explanation
    })
    setShowResult(true)
    completeChecklistItem(3) // Evaluate response
    completeChecklistItem(4) // Reveal explanation

    // Load AI feedback
    loadHostFeedback(isCorrect, player.name)
  }

  const loadHostFeedback = async (correct: boolean, playerName: string) => {
    try {
      const messageType = correct ? 'correct_feedback' : 'incorrect_feedback'
      const response = await fetch('/api/ai-host', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          context: {
            phase: 'gameplay',
            players,
            currentQuestion,
            questionNumber: currentQuestionIndex + 1,
            totalQuestions: questions.length,
            recentHistory: [{ correct, playerName }]
          },
          messageType
        })
      })
      
      if (response.ok) {
        const data = await response.json()
        setHostMessage(data.message)
      }
    } catch (error) {
      console.error('Failed to load host feedback:', error)
    }
  }

  const handleNext = () => {
    setShowResult(false)
    setSelectedAnswer('')
    setAnswerResult(null)
    setHostMessage('')
    nextQuestion()
    
    // Reset checklist for next question
    updateChecklist('gameplay', TRIVIA_CONFIG.phases.gameplay.checklist)
  }

  const handleRequestHint = () => {
    if (settings.mode === 'Hybrid' && !convertedToMC) {
      // For Hybrid mode, convert to MC after hint request
      convertToMC()
    }
    requestHint()
  }

  const handleSkip = () => {
    skipQuestion()
    setShowResult(false)
    setSelectedAnswer('')
    setAnswerResult(null)
    setHostMessage('')
  }

  const progress = ((currentQuestionIndex + 1) / questions.length) * 100
  const currentMode = (currentQuestion?.mode === 'Hybrid' && (showHint || convertedToMC)) ? 'MC' : currentQuestion?.mode

  if (isProcessing) {
    return (
      <div className="container mx-auto p-4 max-w-4xl">
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
          <p className="mt-4 text-lg text-gray-600">Generating amazing questions for you...</p>
        </div>
      </div>
    )
  }

  if (!currentQuestion) {
    return (
      <div className="container mx-auto p-4 max-w-4xl">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800">No questions available</h2>
          <p className="text-gray-600 mt-2">Please check your settings and try again.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      {/* Header */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-gray-800">Let's begin!</h1>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-sm">
              Question {currentQuestionIndex + 1} of {questions.length}
            </Badge>
            {dynamicDifficulty !== settings.difficulty && (
              <Badge className="text-sm bg-purple-500">
                {dynamicDifficulty}
                {dynamicDifficulty > settings.difficulty ? 
                  <TrendingUp className="w-3 h-3 ml-1" /> : 
                  <TrendingDown className="w-3 h-3 ml-1" />
                }
              </Badge>
            )}
          </div>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Checklist */}
      {phaseChecklist && phaseChecklist.phase === 'gameplay' && (
        <div className="mb-4">
          <PhaseChecklist
            title="Question Progress"
            items={phaseChecklist.items}
            completed={phaseChecklist.completed}
          />
        </div>
      )}

      {/* Difficulty Adjustment Message */}
      {difficultyMessage && (
        <div className="mb-4">
          <HostMessage message={difficultyMessage} tone="encouragement" />
        </div>
      )}

      {/* Leaderboard Modal */}
      {showLeaderboard && (
        <div className="mb-6">
          <Card className="border-2 border-yellow-200 bg-gradient-to-r from-yellow-50 to-orange-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="w-6 h-6 text-yellow-500" />
                Leaderboard Check!
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="whitespace-pre-wrap text-sm">
                {formatLeaderboard(players, currentQuestionIndex)}
              </div>
              <Button
                onClick={() => setShowLeaderboard(false)}
                className="mt-4"
                size="sm"
              >
                Continue
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Question Card */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5 text-purple-600" />
              Q#{currentQuestion.number} — {currentQuestion.category} ({currentQuestion.difficulty})
            </CardTitle>
            <Badge variant={
              currentQuestion.difficulty === 'Easy' ? 'secondary' : 
              currentQuestion.difficulty === 'Medium' ? 'default' : 
              'destructive'
            }>
              {currentQuestion.difficulty}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-lg mb-6 font-medium">{currentQuestion.question}</div>
          
          {/* MC Mode or Converted Hybrid */}
          {currentMode === 'MC' && currentQuestion.choices && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {Object.entries(currentQuestion.choices).map(([key, value]) => (
                <Button
                  key={key}
                  variant={selectedAnswer === key ? 'default' : 'outline'}
                  className="justify-start h-auto p-4 text-left"
                  onClick={() => setSelectedAnswer(key)}
                  disabled={showResult}
                >
                  <span className="font-semibold mr-2">{key})</span> {value}
                </Button>
              ))}
            </div>
          )}

          {/* Open Mode */}
          {currentMode === 'Open' && (
            <Input
              placeholder="Type your answer here..."
              value={selectedAnswer}
              onChange={(e) => setSelectedAnswer(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSubmitAnswer()}
              disabled={showResult}
              className="text-lg"
            />
          )}

          {/* Hint */}
          {showHint && currentQuestion.hint && (
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-center gap-2 text-yellow-800">
                <Lightbulb className="w-4 h-4" />
                <span className="font-medium">Hint:</span>
              </div>
              <p className="text-yellow-700 mt-1">{currentQuestion.hint}</p>
            </div>
          )}

          {/* Host Feedback */}
          {hostMessage && showResult && (
            <div className="mt-4">
              <HostMessage 
                message={hostMessage} 
                tone={answerResult?.correct ? 'celebration' : 'encouragement'} 
              />
            </div>
          )}

          {/* Result */}
          {showResult && answerResult && (
            <div className={`mt-4 p-4 rounded-lg border ${
              answerResult.correct 
                ? 'bg-green-50 border-green-200' 
                : answerResult.partial
                ? 'bg-yellow-50 border-yellow-200'
                : 'bg-red-50 border-red-200'
            }`}>
              <div className="flex items-center gap-2 mb-2">
                {answerResult.correct ? (
                  <span className="text-green-800 font-medium">✅ Correct!</span>
                ) : answerResult.partial ? (
                  <span className="text-yellow-800 font-medium">🟨 So Close!</span>
                ) : (
                  <span className="text-red-800 font-medium">❌ Not quite.</span>
                )}
                <span className="text-gray-600">+{answerResult.points} points</span>
              </div>
              <p className="text-gray-700 font-medium mb-1">
                {currentQuestion.mode === 'MC' 
                  ? `Correct answer: ${currentQuestion.correctAnswer}` 
                  : `Correct answer: ${currentQuestion.acceptableAnswers[0]}`
                }
              </p>
              <p className="text-gray-700">{answerResult.explanation}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Player Selection */}
      {players.length > 1 && !showResult && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Who's answering?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {players.map((player) => (
                <Button
                  key={player.id}
                  variant={selectedPlayer === player.id ? 'default' : 'outline'}
                  onClick={() => setSelectedPlayer(player.id)}
                  className="justify-between"
                >
                  <span>{player.name}</span>
                  <Badge variant="secondary">{player.score}</Badge>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3 justify-center">
        {!showResult ? (
          <>
            {settings.hintsEnabled && !showHint && (
              <Button
                variant="outline"
                onClick={handleRequestHint}
                className="flex items-center gap-2"
              >
                <Lightbulb className="w-4 h-4" />
                Request Hint (-25% points)
              </Button>
            )}
            <Button
              onClick={handleSubmitAnswer}
              disabled={!selectedAnswer.trim() || !selectedPlayer}
              className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700"
            >
              Submit Answer
              <ArrowRight className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              onClick={handleSkip}
              className="flex items-center gap-2"
            >
              <SkipForward className="w-4 h-4" />
              Skip Question
            </Button>
          </>
        ) : (
          <Button
            onClick={handleNext}
            className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700"
          >
            Next Question
            <ArrowRight className="w-4 h-4" />
          </Button>
        )}
      </div>

      {/* Scoreboard */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-500" />
            Scoreboard
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {players
              .sort((a, b) => b.score - a.score)
              .map((player, index) => (
                <div
                  key={player.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-lg text-gray-500">#{index + 1}</span>
                    <div>
                      <span className="font-medium">{player.name}</span>
                      {player.streak >= 3 && (
                        <Badge className="ml-2" variant="secondary">
                          🔥 {player.streak} streak
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-lg">{player.score}</div>
                    <div className="text-xs text-gray-500">
                      {player.correctAnswers}/{player.totalAnswers} correct
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
