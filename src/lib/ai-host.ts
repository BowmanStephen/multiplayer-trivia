/**
 * AI-Powered Trivia Host System
 * Uses ZAI SDK to generate warm, engaging host dialogue and validate questions
 */

import { TRIVIA_CONFIG } from './config'
import { Player, Question, GamePhase } from './store'

export interface HostContext {
  phase: GamePhase
  players: Player[]
  currentQuestion?: Question
  questionNumber?: number
  totalQuestions?: number
  recentHistory?: {
    correct: boolean
    playerName: string
  }[]
  settings?: {
    categories: string[]
    difficulty: string
    mode: string
  }
}

export interface HostResponse {
  message: string
  tone: 'greeting' | 'question_intro' | 'feedback' | 'explanation' | 'celebration' | 'encouragement'
}

/**
 * Generate context-aware host message
 */
export function buildHostPrompt(context: HostContext, messageType: string): string {
  const { persona } = TRIVIA_CONFIG
  
  let prompt = `You are a family trivia game host. Your persona:
- Tone: ${persona.tone}
- Style: ${persona.banter_style}
- Celebration: ${persona.celebration_style}
- Rules: ${persona.consistency_rules.join(', ')}

Current Phase: ${context.phase}
Players: ${context.players.map(p => `${p.name} (age ${p.age}, score: ${p.score})`).join(', ')}
`

  switch (messageType) {
    case 'greeting':
      prompt += `\nTask: Welcome the players warmly to Family Trivia Night! Keep it brief (2-3 sentences), energetic, and family-friendly. Use emojis sparingly.`
      break
      
    case 'setup_summary':
      if (context.settings) {
        prompt += `\nSettings: ${context.totalQuestions} ${context.settings.mode} questions at ${context.settings.difficulty} difficulty
Categories: ${context.settings.categories.join(', ')}

Task: Provide an enthusiastic summary of the game plan before we begin. Keep it concise (2-3 sentences).`
      }
      break
      
    case 'question_intro':
      if (context.currentQuestion) {
        prompt += `\nQuestion #${context.questionNumber} of ${context.totalQuestions}
Category: ${context.currentQuestion.category}
Difficulty: ${context.currentQuestion.difficulty}

Task: Provide a brief, energetic intro to this question (1 sentence). Don't reveal the question itself.`
      }
      break
      
    case 'correct_feedback':
      if (context.recentHistory && context.recentHistory.length > 0) {
        const recent = context.recentHistory[context.recentHistory.length - 1]
        prompt += `\n${recent.playerName} just answered correctly!

Task: Celebrate their success! Keep it brief (1 sentence), warm, and enthusiastic.`
      }
      break
      
    case 'incorrect_feedback':
      if (context.recentHistory && context.recentHistory.length > 0) {
        const recent = context.recentHistory[context.recentHistory.length - 1]
        prompt += `\n${recent.playerName} answered incorrectly.

Task: Provide gentle encouragement (1 sentence). Stay positive and supportive.`
      }
      break
      
    case 'partial_feedback':
      if (context.recentHistory && context.recentHistory.length > 0) {
        const recent = context.recentHistory[context.recentHistory.length - 1]
        prompt += `\n${recent.playerName} was very close!

Task: Acknowledge they were close (1 sentence). Be encouraging!`
      }
      break
      
    case 'leaderboard_intro':
      prompt += `\nTask: Provide a brief, exciting intro to the leaderboard update (1 sentence). Build anticipation!`
      break
      
    case 'conclusion':
      const sortedPlayers = [...context.players].sort((a, b) => b.score - a.score)
      const winner = sortedPlayers[0]
      prompt += `\nFinal Scores: ${sortedPlayers.map(p => `${p.name}: ${p.score}`).join(', ')}
Winner: ${winner.name}

Task: Celebrate the winner and all players! Keep it warm and inclusive (2-3 sentences). Thank everyone for playing.`
      break
      
    case 'tie_announcement':
      const tiedPlayers = context.players.filter(p => p.score === context.players[0].score)
      prompt += `\nTied Players: ${tiedPlayers.map(p => p.name).join(' and ')} with ${tiedPlayers[0].score} points

Task: Announce the tie with excitement (1-2 sentences). Build anticipation for the tie-breaker!`
      break
  }
  
  prompt += `\n\nRespond with ONLY the host message. No formatting, no quotes, just the plain text message with emojis allowed.`
  
  return prompt
}

/**
 * Validate question quality before presenting to players
 */
export function validateQuestionQuality(question: Question): {
  pass: boolean
  reasons: string[]
} {
  const reasons: string[] = []
  
  // Check question clarity
  if (question.question.length < 10) {
    reasons.push('Question too short')
  }
  
  if (question.question.includes('?') === false) {
    reasons.push('Question missing question mark')
  }
  
  // Check for family-friendly content
  const disallowed = TRIVIA_CONFIG.content_filter.disallowed
  const questionLower = question.question.toLowerCase()
  
  for (const term of ['explicit', 'violence', 'kill', 'death', 'blood']) {
    if (questionLower.includes(term)) {
      reasons.push('May contain inappropriate content')
      break
    }
  }
  
  // Check multiple choice quality
  if (question.mode === 'MC' && question.choices) {
    const choices = Object.values(question.choices)
    if (choices.length !== 4) {
      reasons.push('Must have exactly 4 choices')
    }
    
    // Check for "All/None of the above"
    if (choices.some(c => c.toLowerCase().includes('all of the above') || c.toLowerCase().includes('none of the above'))) {
      reasons.push('Should not use "All/None of the above"')
    }
    
    // Check for duplicates
    const uniqueChoices = new Set(choices.map(c => c.toLowerCase()))
    if (uniqueChoices.size !== choices.length) {
      reasons.push('Duplicate choices detected')
    }
  }
  
  // Check acceptable answers
  if (!question.acceptableAnswers || question.acceptableAnswers.length === 0) {
    reasons.push('Missing acceptable answers')
  }
  
  // Check explanation
  if (!question.explanation || question.explanation.length < 10) {
    reasons.push('Explanation too short or missing')
  }
  
  return {
    pass: reasons.length === 0,
    reasons
  }
}

/**
 * Generate appropriate hint based on question mode
 */
export function generateHint(question: Question, usedHints: number): string | null {
  if (usedHints >= TRIVIA_CONFIG.mechanics.hints.max_per_question) {
    return null
  }
  
  // Return existing hint if available
  if (question.hint) {
    return question.hint
  }
  
  // Generate hint based on mode
  if (question.mode === 'MC' && question.choices) {
    // For MC: suggest 50/50 (would need to be implemented in UI)
    return 'Two of these options can be eliminated...'
  } else {
    // For Open: give first letter
    const correctAnswer = question.correctAnswer
    if (correctAnswer.length > 0) {
      return `The answer starts with "${correctAnswer[0].toUpperCase()}"`
    }
  }
  
  return 'Think carefully about the key details in the question.'
}

/**
 * Format leaderboard message
 */
export function formatLeaderboard(players: Player[], questionNumber: number): string {
  const sorted = [...players].sort((a, b) => b.score - a.score)
  
  let message = `📊 Leaderboard after Question ${questionNumber}:\n\n`
  
  sorted.forEach((player, index) => {
    const position = index + 1
    const emoji = position === 1 ? '🥇' : position === 2 ? '🥈' : position === 3 ? '🥉' : '  '
    message += `${emoji} ${position}. ${player.name}: ${player.score} points`
    
    if (player.streak >= 3) {
      message += ` 🔥${player.streak}`
    }
    
    message += '\n'
  })
  
  return message
}

/**
 * Select appropriate superlative message
 */
export function getSuperlativeMessage(key: string, playerName: string, value?: string): string {
  const superlative = TRIVIA_CONFIG.superlatives.find(s => s.key === key)
  if (!superlative) return ''
  
  const messages: Record<string, string> = {
    most_accurate: `🎯 ${superlative.label}: ${playerName}${value ? ` (${value})` : ''}!`,
    longest_streak: `🔥 ${superlative.label}: ${playerName}${value ? ` (${value} in a row)` : ''}!`,
    category_ace: `⭐ ${superlative.label}: ${playerName}${value ? ` in ${value}` : ''}!`,
    comeback_kid: `🚀 ${superlative.label}: ${playerName}!`,
    hint_ninja: `🥷 ${superlative.label}: ${playerName}!`,
    team_spirit: `🤝 ${superlative.label}: ${playerName}!`
  }
  
  return messages[key] || `${superlative.label}: ${playerName}!`
}


