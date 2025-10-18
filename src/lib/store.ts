import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

export type Player = {
  id: string
  name: string
  age: number
  score: number
  streak: number
  maxStreak: number
  hintsUsed: number
  correctAnswers: number
  totalAnswers: number
  skips: number
  categoryPerformance: Record<string, { correct: number; total: number }>
  recentPerformance: boolean[] // Track last 5 answers for dynamic difficulty
}

export type Question = {
  id: string
  number: number
  category: string
  difficulty: 'Easy' | 'Medium' | 'Hard'
  mode: 'MC' | 'Open' | 'Hybrid'
  question: string
  choices?: { A: string; B: string; C: string; D: string }
  correctAnswer: string
  acceptableAnswers: string[]
  explanation: string
  hint?: string
  validation?: {
    pass: boolean
    fail_reasons?: string[]
  }
  source?: string
  tags?: string[]
  readingLevel?: string
}

export type GamePhase = 'setup' | 'gameplay' | 'conclusion'

export type GameSettings = {
  categories: string[]
  difficulty: 'Easy' | 'Medium' | 'Hard'
  mode: 'MC' | 'Open' | 'Hybrid'
  questionCount: number
  hintsEnabled: boolean
  tieBreaker: 'Sudden Death' | 'Closest Number' | "Host's Choice"
}

export type GameState = {
  phase: GamePhase
  players: Player[]
  currentPlayerIndex: number
  settings: GameSettings
  questions: Question[]
  currentQuestionIndex: number
  currentQuestion: Question | null
  showHint: boolean
  convertedToMC: boolean // For Hybrid mode
  gameHistory: {
    questionNumber: number
    playerId: string
    answer: string
    correct: boolean
    partial: boolean
    points: number
    timeTaken?: number
  }[]
  isProcessing: boolean
  hostMessages: {
    phase: string
    message: string
    timestamp: number
  }[]
  phaseChecklist: {
    phase: GamePhase
    items: string[]
    completed: boolean[]
  } | null
  dynamicDifficulty: 'Easy' | 'Medium' | 'Hard'
  showLeaderboard: boolean
}

export type GameActions = {
  // Setup actions
  addPlayer: (name: string, age: number) => void
  removePlayer: (id: string) => void
  updateSettings: (settings: Partial<GameSettings>) => void
  startGame: () => void
  setQuestions: (questions: Question[]) => void
  
  // Gameplay actions
  nextQuestion: () => void
  submitAnswer: (playerId: string, answer: string) => void
  requestHint: () => void
  skipQuestion: () => void
  convertToMC: () => void // For Hybrid mode
  
  // Game management
  resetGame: () => void
  setPhase: (phase: GamePhase) => void
  setProcessing: (processing: boolean) => void
  addHostMessage: (phase: string, message: string) => void
  updateChecklist: (phase: GamePhase, items: string[]) => void
  completeChecklistItem: (index: number) => void
  adjustDifficulty: () => void
  setShowLeaderboard: (show: boolean) => void
}

const DEFAULT_SETTINGS: GameSettings = {
  categories: ['General Knowledge'],
  difficulty: 'Medium',
  mode: 'MC',
  questionCount: 9,
  hintsEnabled: true,
  tieBreaker: 'Sudden Death'
}

const INITIAL_STATE: GameState = {
  phase: 'setup',
  players: [],
  currentPlayerIndex: 0,
  settings: DEFAULT_SETTINGS,
  questions: [],
  currentQuestionIndex: 0,
  currentQuestion: null,
  showHint: false,
  convertedToMC: false,
  gameHistory: [],
  isProcessing: false,
  hostMessages: [],
  phaseChecklist: null,
  dynamicDifficulty: 'Medium',
  showLeaderboard: false
}

export const useGameStore = create<GameState & GameActions>()(
  devtools(
    (set, get) => ({
      ...INITIAL_STATE,
      
      addPlayer: (name: string, age: number) => {
        set((state) => ({
          players: [...state.players, {
            id: crypto.randomUUID(),
            name,
            age,
            score: 0,
            streak: 0,
            maxStreak: 0,
            hintsUsed: 0,
            correctAnswers: 0,
            totalAnswers: 0,
            skips: 0,
            categoryPerformance: {},
            recentPerformance: []
          }]
        }))
      },
      
      removePlayer: (id: string) => {
        set((state) => ({
          players: state.players.filter(p => p.id !== id)
        }))
      },
      
      updateSettings: (newSettings: Partial<GameSettings>) => {
        set((state) => ({
          settings: { ...state.settings, ...newSettings }
        }))
      },
      
      startGame: () => {
        set({ phase: 'gameplay', currentQuestionIndex: 0 })
      },
      
      setQuestions: (questions: Question[]) => {
        set({ 
          questions, 
          currentQuestion: questions[0] || null 
        })
      },
      
      nextQuestion: () => {
        const state = get()
        if (state.currentQuestionIndex < state.questions.length - 1) {
          const nextIndex = state.currentQuestionIndex + 1
          // Check if we should show leaderboard (every 3 questions)
          const showLeaderboard = (nextIndex) % 3 === 0 && nextIndex > 0
          set({
            currentQuestionIndex: nextIndex,
            currentQuestion: state.questions[nextIndex],
            showHint: false,
            convertedToMC: false,
            showLeaderboard
          })
        } else {
          set({ phase: 'conclusion' })
        }
      },
      
      submitAnswer: (playerId: string, answer: string) => {
        const state = get()
        if (!state.currentQuestion) return
        
        const player = state.players.find(p => p.id === playerId)
        if (!player) return
        
        const evaluation = evaluateAnswerAdvanced(answer, state.currentQuestion)
        const basePoints = getBasePoints(state.currentQuestion.difficulty)
        const hintPenalty = state.showHint ? Math.floor(basePoints * 0.25) : 0
        const streakBonus = player.streak >= 3 ? 20 : 0
        
        let points = 0
        if (evaluation.isCorrect) {
          points = basePoints - hintPenalty + streakBonus
        } else if (evaluation.isPartial) {
          points = Math.floor(basePoints * 0.5) - hintPenalty
        }
        
        const category = state.currentQuestion.category
        const newRecentPerformance = [...player.recentPerformance, evaluation.isCorrect].slice(-5)
        
        // Update player stats
        set((prevState) => ({
          players: prevState.players.map(p => 
            p.id === playerId 
              ? {
                  ...p,
                  score: p.score + points,
                  streak: evaluation.isCorrect ? p.streak + 1 : 0,
                  maxStreak: Math.max(p.maxStreak, evaluation.isCorrect ? p.streak + 1 : 0),
                  hintsUsed: state.showHint ? p.hintsUsed + 1 : p.hintsUsed,
                  correctAnswers: evaluation.isCorrect ? p.correctAnswers + 1 : p.correctAnswers,
                  totalAnswers: p.totalAnswers + 1,
                  categoryPerformance: {
                    ...p.categoryPerformance,
                    [category]: {
                      correct: (p.categoryPerformance[category]?.correct || 0) + (evaluation.isCorrect ? 1 : 0),
                      total: (p.categoryPerformance[category]?.total || 0) + 1
                    }
                  },
                  recentPerformance: newRecentPerformance
                }
              : p
          ),
          gameHistory: [...prevState.gameHistory, {
            questionNumber: state.currentQuestion.number,
            playerId,
            answer,
            correct: evaluation.isCorrect,
            partial: evaluation.isPartial,
            points
          }]
        }))
      },
      
      requestHint: () => {
        set({ showHint: true })
      },
      
      skipQuestion: () => {
        const state = get()
        // Track skip in player stats
        if (state.players.length > 0) {
          set((prevState) => ({
            players: prevState.players.map((p, index) => 
              index === state.currentPlayerIndex
                ? { ...p, skips: p.skips + 1 }
                : p
            )
          }))
        }
        get().nextQuestion()
      },
      
      convertToMC: () => {
        set({ convertedToMC: true })
      },
      
      resetGame: () => {
        set(INITIAL_STATE)
      },
      
      setPhase: (phase: GamePhase) => {
        set({ phase })
      },
      
      setProcessing: (processing: boolean) => {
        set({ isProcessing: processing })
      },
      
      addHostMessage: (phase: string, message: string) => {
        set((state) => ({
          hostMessages: [...state.hostMessages, {
            phase,
            message,
            timestamp: Date.now()
          }]
        }))
      },
      
      updateChecklist: (phase: GamePhase, items: string[]) => {
        set({
          phaseChecklist: {
            phase,
            items,
            completed: items.map(() => false)
          }
        })
      },
      
      completeChecklistItem: (index: number) => {
        set((state) => {
          if (!state.phaseChecklist) return state
          const newCompleted = [...state.phaseChecklist.completed]
          newCompleted[index] = true
          return {
            phaseChecklist: {
              ...state.phaseChecklist,
              completed: newCompleted
            }
          }
        })
      },
      
      adjustDifficulty: () => {
        const state = get()
        // Calculate recent accuracy across all players
        const allRecent = state.players.flatMap(p => p.recentPerformance)
        if (allRecent.length < 5) return
        
        const recentAccuracy = allRecent.filter(Boolean).length / allRecent.length * 100
        
        if (recentAccuracy > 85 && state.dynamicDifficulty !== 'Hard') {
          const newDifficulty = state.dynamicDifficulty === 'Easy' ? 'Medium' : 'Hard'
          set({ dynamicDifficulty: newDifficulty })
        } else if (recentAccuracy < 50 && state.dynamicDifficulty !== 'Easy') {
          const newDifficulty = state.dynamicDifficulty === 'Hard' ? 'Medium' : 'Easy'
          set({ dynamicDifficulty: newDifficulty })
        }
      },
      
      setShowLeaderboard: (show: boolean) => {
        set({ showLeaderboard: show })
      }
    }),
    {
      name: 'trivia-game-store'
    }
  )
)

// Helper functions
function evaluateAnswer(answer: string, question: Question): boolean {
  const normalizedAnswer = normalizeAnswer(answer)
  const normalizedCorrect = normalizeAnswer(question.correctAnswer)
  
  if (normalizedAnswer === normalizedCorrect) return true
  
  return question.acceptableAnswers.some(acceptable => 
    normalizeAnswer(acceptable) === normalizedAnswer
  )
}

/**
 * Advanced answer evaluation with fuzzy matching and partial credit
 */
function evaluateAnswerAdvanced(answer: string, question: Question): {
  isCorrect: boolean
  isPartial: boolean
  confidence: number
} {
  const normalizedAnswer = normalizeAnswer(answer)
  const normalizedCorrect = normalizeAnswer(question.correctAnswer)
  
  // Exact match
  if (normalizedAnswer === normalizedCorrect) {
    return { isCorrect: true, isPartial: false, confidence: 1.0 }
  }
  
  // Check acceptable answers
  const acceptableMatch = question.acceptableAnswers.some(acceptable => 
    normalizeAnswer(acceptable) === normalizedAnswer
  )
  if (acceptableMatch) {
    return { isCorrect: true, isPartial: false, confidence: 1.0 }
  }
  
  // Numeric tolerance check
  const numericResult = checkNumericTolerance(normalizedAnswer, normalizedCorrect)
  if (numericResult.match) {
    return { isCorrect: true, isPartial: false, confidence: 0.95 }
  }
  
  // Fuzzy matching with Levenshtein distance
  const distance = levenshteinDistance(normalizedAnswer, normalizedCorrect)
  const maxLength = Math.max(normalizedAnswer.length, normalizedCorrect.length)
  const threshold = normalizedAnswer.length <= 6 ? 1 : 2
  
  if (distance <= threshold && distance < maxLength * 0.3) {
    return { isCorrect: false, isPartial: true, confidence: 0.7 }
  }
  
  // Check fuzzy match against acceptable answers
  for (const acceptable of question.acceptableAnswers) {
    const normalizedAcceptable = normalizeAnswer(acceptable)
    const dist = levenshteinDistance(normalizedAnswer, normalizedAcceptable)
    const maxLen = Math.max(normalizedAnswer.length, normalizedAcceptable.length)
    const thresh = normalizedAnswer.length <= 6 ? 1 : 2
    
    if (dist <= thresh && dist < maxLen * 0.3) {
      return { isCorrect: false, isPartial: true, confidence: 0.7 }
    }
  }
  
  return { isCorrect: false, isPartial: false, confidence: 0.0 }
}

/**
 * Calculate Levenshtein distance between two strings
 */
function levenshteinDistance(str1: string, str2: string): number {
  const len1 = str1.length
  const len2 = str2.length
  const matrix: number[][] = []
  
  // Initialize matrix
  for (let i = 0; i <= len1; i++) {
    matrix[i] = [i]
  }
  for (let j = 0; j <= len2; j++) {
    matrix[0][j] = j
  }
  
  // Fill matrix
  for (let i = 1; i <= len1; i++) {
    for (let j = 1; j <= len2; j++) {
      const cost = str1[i - 1] === str2[j - 1] ? 0 : 1
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,      // deletion
        matrix[i][j - 1] + 1,      // insertion
        matrix[i - 1][j - 1] + cost // substitution
      )
    }
  }
  
  return matrix[len1][len2]
}

/**
 * Check if numeric answer is within tolerance
 */
function checkNumericTolerance(answer: string, correct: string): {
  match: boolean
  difference?: number
} {
  const answerNum = parseFloat(answer)
  const correctNum = parseFloat(correct)
  
  // Not numeric values
  if (isNaN(answerNum) || isNaN(correctNum)) {
    return { match: false }
  }
  
  // Small numbers: ±1
  if (correctNum < 10) {
    const diff = Math.abs(answerNum - correctNum)
    return { match: diff <= 1, difference: diff }
  }
  
  // Larger numbers: ±10%
  const diff = Math.abs(answerNum - correctNum)
  const tolerance = correctNum * 0.1
  return { match: diff <= tolerance, difference: diff }
}

function normalizeAnswer(answer: string): string {
  return answer
    .toLowerCase()
    .replace(/^(a|an|the)\s+/, '') // Remove leading articles
    .replace(/[^\w\s]/g, '') // Remove punctuation
    .replace(/\s+/g, ' ') // Normalize whitespace
    .trim()
}

function getBasePoints(difficulty: 'Easy' | 'Medium' | 'Hard'): number {
  switch (difficulty) {
    case 'Easy': return 100
    case 'Medium': return 150
    case 'Hard': return 200
    default: return 150
  }
}