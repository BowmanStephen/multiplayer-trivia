import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

export type Player = {
  id: string
  name: string
  age: number
  score: number
  streak: number
  hintsUsed: number
  correctAnswers: number
  totalAnswers: number
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
  gameHistory: {
    questionNumber: number
    playerId: string
    answer: string
    correct: boolean
    points: number
    timeTaken?: number
  }[]
  isProcessing: boolean
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
  
  // Game management
  resetGame: () => void
  setPhase: (phase: GamePhase) => void
  setProcessing: (processing: boolean) => void
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
  gameHistory: [],
  isProcessing: false
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
            hintsUsed: 0,
            correctAnswers: 0,
            totalAnswers: 0
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
          set({
            currentQuestionIndex: nextIndex,
            currentQuestion: state.questions[nextIndex],
            showHint: false
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
        
        const isCorrect = evaluateAnswer(answer, state.currentQuestion)
        const basePoints = getBasePoints(state.currentQuestion.difficulty)
        const hintPenalty = state.showHint ? Math.floor(basePoints * 0.25) : 0
        const streakBonus = player.streak >= 3 ? 20 : 0
        const points = isCorrect ? basePoints - hintPenalty + streakBonus : 0
        
        // Update player stats
        set((prevState) => ({
          players: prevState.players.map(p => 
            p.id === playerId 
              ? {
                  ...p,
                  score: p.score + points,
                  streak: isCorrect ? p.streak + 1 : 0,
                  hintsUsed: state.showHint ? p.hintsUsed + 1 : p.hintsUsed,
                  correctAnswers: isCorrect ? p.correctAnswers + 1 : p.correctAnswers,
                  totalAnswers: p.totalAnswers + 1
                }
              : p
          ),
          gameHistory: [...prevState.gameHistory, {
            questionNumber: state.currentQuestion.number,
            playerId,
            answer,
            correct: isCorrect,
            points
          }]
        }))
      },
      
      requestHint: () => {
        set({ showHint: true })
      },
      
      skipQuestion: () => {
        get().nextQuestion()
      },
      
      resetGame: () => {
        set(INITIAL_STATE)
      },
      
      setPhase: (phase: GamePhase) => {
        set({ phase })
      },
      
      setProcessing: (processing: boolean) => {
        set({ isProcessing: processing })
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

function normalizeAnswer(answer: string): string {
  return answer
    .toLowerCase()
    .replace(/^(a|an|the)\s+/, '') // Remove leading articles
    .replace(/[^\w\s]/g, '') // Remove punctuation
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