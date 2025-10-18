'use client'

import { useState, useEffect } from 'react'
import { useGameStore } from '@/lib/store'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { ArrowRight, Lightbulb, SkipForward, Trophy, Target, Clock } from 'lucide-react'

export function GameplayPhase() {
  const {
    players,
    settings,
    questions,
    currentQuestionIndex,
    currentQuestion,
    showHint,
    gameHistory,
    submitAnswer,
    requestHint,
    skipQuestion,
    nextQuestion,
    setProcessing,
    setQuestions,
    isProcessing,
    phase
  } = useGameStore()

  const [selectedAnswer, setSelectedAnswer] = useState('')
  const [selectedPlayer, setSelectedPlayer] = useState('')
  const [showResult, setShowResult] = useState(false)
  const [answerResult, setAnswerResult] = useState<{ correct: boolean; points: number; explanation: string } | null>(null)

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

  const generateQuestions = async () => {
    setProcessing(true)
    try {
      const response = await fetch('/api/generate-questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          categories: settings.categories,
          difficulty: settings.difficulty,
          mode: settings.mode,
          count: settings.questionCount
        })
      })
      
      if (response.ok) {
        const generatedQuestions = await response.json()
        setQuestions(generatedQuestions)
      } else {
        console.error('API response not ok:', response.status, response.statusText)
        throw new Error(`API responded with status: ${response.status}`)
      }
    } catch (error) {
      console.error('Failed to generate questions:', error)
      // Fallback to mock questions
      const mockQuestions = generateMockQuestions()
      setQuestions(mockQuestions)
    } finally {
      setProcessing(false)
    }
  }

  const generateMockQuestions = () => {
    // Mock questions for development
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
        acceptableAnswers: ['carbon dioxide', 'co2'],
        explanation: 'Plants absorb carbon dioxide from the air and use sunlight to convert it into oxygen and glucose through photosynthesis.',
        hint: 'Think about what humans breathe out that plants need!'
      },
      {
        id: '2',
        number: 2,
        category: 'Geography',
        difficulty: 'Easy' as const,
        mode: 'MC' as const,
        question: 'What is the capital of France?',
        choices: {
          A: 'London',
          B: 'Berlin',
          C: 'Paris',
          D: 'Madrid'
        },
        correctAnswer: 'C',
        acceptableAnswers: ['paris'],
        explanation: 'Paris has been the capital of France since 987 AD and is known for the Eiffel Tower.',
        hint: 'This city is famous for the Eiffel Tower!'
      },
      {
        id: '3',
        number: 3,
        category: 'History',
        difficulty: 'Easy' as const,
        mode: 'MC' as const,
        question: 'Who was the first President of the United States?',
        choices: {
          A: 'Thomas Jefferson',
          B: 'George Washington',
          C: 'Abraham Lincoln',
          D: 'John Adams'
        },
        correctAnswer: 'B',
        acceptableAnswers: ['george washington', 'washington'],
        explanation: 'George Washington served as the first President of the United States from 1789 to 1797.',
        hint: 'His face is on the one-dollar bill!'
      },
      {
        id: '4',
        number: 4,
        category: 'Animals',
        difficulty: 'Easy' as const,
        mode: 'MC' as const,
        question: 'What is the largest mammal in the world?',
        choices: {
          A: 'African Elephant',
          B: 'Blue Whale',
          C: 'Giraffe',
          D: 'Polar Bear'
        },
        correctAnswer: 'B',
        acceptableAnswers: ['blue whale', 'whale'],
        explanation: 'The blue whale is the largest mammal ever known to have lived on Earth, reaching lengths of up to 100 feet.',
        hint: 'This mammal lives in the ocean!'
      },
      {
        id: '5',
        number: 5,
        category: 'Movies & TV',
        difficulty: 'Medium' as const,
        mode: 'MC' as const,
        question: 'In the movie "The Lion King", who is Simba\'s father?',
        choices: {
          A: 'Scar',
          B: 'Mufasa',
          C: 'Timon',
          D: 'Rafiki'
        },
        correctAnswer: 'B',
        acceptableAnswers: ['mufasa'],
        explanation: 'Mufasa is Simba\'s father and the king of the Pride Lands until his tragic death.',
        hint: 'His name starts with M and he\'s a noble king!'
      },
      {
        id: '6',
        number: 6,
        category: 'Music',
        difficulty: 'Easy' as const,
        mode: 'MC' as const,
        question: 'How many strings does a standard guitar have?',
        choices: {
          A: '4',
          B: '5',
          C: '6',
          D: '7'
        },
        correctAnswer: 'C',
        acceptableAnswers: ['six', '6'],
        explanation: 'A standard guitar has 6 strings, typically tuned to E-A-D-G-B-E from lowest to highest pitch.',
        hint: 'It\'s more than 5 but less than 7!'
      },
      {
        id: '7',
        number: 7,
        category: 'Sports',
        difficulty: 'Easy' as const,
        mode: 'MC' as const,
        question: 'How many players are on a basketball team on the court at one time?',
        choices: {
          A: '4',
          B: '5',
          C: '6',
          D: '7'
        },
        correctAnswer: 'B',
        acceptableAnswers: ['five', '5'],
        explanation: 'Each basketball team has 5 players on the court during gameplay.',
        hint: 'It\'s the same as the number of fingers on one hand!'
      },
      {
        id: '8',
        number: 8,
        category: 'Space',
        difficulty: 'Medium' as const,
        mode: 'MC' as const,
        question: 'Which planet is known as the "Red Planet"?',
        choices: {
          A: 'Venus',
          B: 'Mars',
          C: 'Jupiter',
          D: 'Saturn'
        },
        correctAnswer: 'B',
        acceptableAnswers: ['mars'],
        explanation: 'Mars is called the "Red Planet" because of iron oxide (rust) on its surface gives it a reddish appearance.',
        hint: 'This planet is named after the Roman god of war!'
      },
      {
        id: '9',
        number: 9,
        category: 'General Knowledge',
        difficulty: 'Easy' as const,
        mode: 'MC' as const,
        question: 'What is the largest ocean on Earth?',
        choices: {
          A: 'Atlantic Ocean',
          B: 'Indian Ocean',
          C: 'Arctic Ocean',
          D: 'Pacific Ocean'
        },
        correctAnswer: 'D',
        acceptableAnswers: ['pacific ocean', 'pacific'],
        explanation: 'The Pacific Ocean is the largest and deepest of the world\'s oceans, covering about 63 million square miles.',
        hint: 'This ocean shares its name with peacefulness!'
      }
    ]
  }

  const handleSubmitAnswer = () => {
    if (!selectedAnswer.trim() || !selectedPlayer || !currentQuestion || showResult) return

    const player = players.find(p => p.id === selectedPlayer)
    if (!player) return

    submitAnswer(selectedPlayer, selectedAnswer)
    
    // Calculate result
    const isCorrect = selectedAnswer.toUpperCase() === currentQuestion.correctAnswer.toUpperCase()
    const basePoints = currentQuestion.difficulty === 'Easy' ? 100 : currentQuestion.difficulty === 'Medium' ? 150 : 200
    const hintPenalty = showHint ? Math.floor(basePoints * 0.25) : 0
    const streakBonus = player.streak >= 3 ? 20 : 0
    const points = isCorrect ? basePoints - hintPenalty + streakBonus : 0

    setAnswerResult({
      correct: isCorrect,
      points,
      explanation: currentQuestion.explanation
    })
    setShowResult(true)
  }

  const handleNext = () => {
    setShowResult(false)
    setSelectedAnswer('')
    setAnswerResult(null)
    nextQuestion()
  }

  const progress = ((currentQuestionIndex + 1) / questions.length) * 100

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
          <Badge variant="outline" className="text-sm">
            Question {currentQuestionIndex + 1} of {questions.length}
          </Badge>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Question Card */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5 text-purple-600" />
              Q#{currentQuestion.number} — {currentQuestion.category} ({currentQuestion.difficulty})
            </CardTitle>
            <Badge variant={currentQuestion.difficulty === 'Easy' ? 'secondary' : currentQuestion.difficulty === 'Medium' ? 'default' : 'destructive'}>
              {currentQuestion.difficulty}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-lg mb-6">{currentQuestion.question}</div>
          
          {currentQuestion.mode === 'MC' && currentQuestion.choices && (
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

          {currentQuestion.mode === 'Open' && (
            <Input
              placeholder="Type your answer here..."
              value={selectedAnswer}
              onChange={(e) => setSelectedAnswer(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSubmitAnswer()}
              disabled={showResult}
            />
          )}

          {currentQuestion.mode === 'Hybrid' && !showHint && !showResult && (
            <Input
              placeholder="Type your answer here..."
              value={selectedAnswer}
              onChange={(e) => setSelectedAnswer(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSubmitAnswer()}
              disabled={showResult}
            />
          )}

          {currentQuestion.mode === 'Hybrid' && (showHint || showResult) && currentQuestion.choices && (
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

          {/* Result */}
          {showResult && answerResult && (
            <div className={`mt-4 p-4 rounded-lg border ${
              answerResult.correct 
                ? 'bg-green-50 border-green-200' 
                : 'bg-red-50 border-red-200'
            }`}>
              <div className="flex items-center gap-2 mb-2">
                {answerResult.correct ? (
                  <span className="text-green-800 font-medium">✅ Correct!</span>
                ) : (
                  <span className="text-red-800 font-medium">❌ Not quite.</span>
                )}
                <span className="text-gray-600">+{answerResult.points} points</span>
              </div>
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
                onClick={requestHint}
                className="flex items-center gap-2"
              >
                <Lightbulb className="w-4 h-4" />
                Request Hint (-25% points)
              </Button>
            )}
            <Button
              onClick={handleSubmitAnswer}
              disabled={!selectedAnswer.trim() || !selectedPlayer}
              className="flex items-center gap-2"
            >
              Submit Answer
              <ArrowRight className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              onClick={skipQuestion}
              className="flex items-center gap-2"
            >
              <SkipForward className="w-4 h-4" />
              Skip Question
            </Button>
          </>
        ) : (
          <Button
            onClick={handleNext}
            className="flex items-center gap-2"
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