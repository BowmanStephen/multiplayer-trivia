/**
 * Dynamic Difficulty Adjustment System
 * Monitors player performance and adjusts question difficulty
 */

import { TRIVIA_CONFIG } from './config'
import { Player } from './store'

export type Difficulty = 'Easy' | 'Medium' | 'Hard'

export interface DifficultyAnalysis {
  currentDifficulty: Difficulty
  suggestedDifficulty: Difficulty
  shouldAdjust: boolean
  reason: string
  recentAccuracy: number
}

/**
 * Analyze player performance and suggest difficulty adjustment
 */
export function analyzeDifficulty(
  players: Player[],
  currentDifficulty: Difficulty
): DifficultyAnalysis {
  const config = TRIVIA_CONFIG.mechanics.dynamic_difficulty
  
  // Gather all recent performance data
  const allRecentPerformance = players.flatMap(p => p.recentPerformance)
  
  // Need at least k questions to make a decision
  if (allRecentPerformance.length < config.raise_if_last_k_correct_percent_over.k) {
    return {
      currentDifficulty,
      suggestedDifficulty: currentDifficulty,
      shouldAdjust: false,
      reason: 'Not enough data yet',
      recentAccuracy: 0
    }
  }
  
  // Calculate recent accuracy percentage
  const correctCount = allRecentPerformance.filter(Boolean).length
  const recentAccuracy = (correctCount / allRecentPerformance.length) * 100
  
  // Check if we should raise difficulty
  if (
    recentAccuracy > config.raise_if_last_k_correct_percent_over.threshold &&
    currentDifficulty !== 'Hard'
  ) {
    const newDifficulty: Difficulty = currentDifficulty === 'Easy' ? 'Medium' : 'Hard'
    return {
      currentDifficulty,
      suggestedDifficulty: newDifficulty,
      shouldAdjust: true,
      reason: `Players are doing great! (${Math.round(recentAccuracy)}% accuracy)`,
      recentAccuracy
    }
  }
  
  // Check if we should lower difficulty
  if (
    recentAccuracy < config.lower_if_last_k_correct_percent_under.threshold &&
    currentDifficulty !== 'Easy'
  ) {
    const newDifficulty: Difficulty = currentDifficulty === 'Hard' ? 'Medium' : 'Easy'
    return {
      currentDifficulty,
      suggestedDifficulty: newDifficulty,
      shouldAdjust: true,
      reason: `Let's adjust to keep the fun going! (${Math.round(recentAccuracy)}% accuracy)`,
      recentAccuracy
    }
  }
  
  // No adjustment needed
  return {
    currentDifficulty,
    suggestedDifficulty: currentDifficulty,
    shouldAdjust: false,
    reason: `Difficulty is just right! (${Math.round(recentAccuracy)}% accuracy)`,
    recentAccuracy
  }
}

/**
 * Get appropriate age-adjusted difficulty
 */
export function getAgeAdjustedDifficulty(players: Player[], requestedDifficulty: Difficulty): Difficulty {
  if (players.length === 0) return requestedDifficulty
  
  const youngestAge = Math.min(...players.map(p => p.age))
  
  // If youngest player is under 10, prefer easier difficulties
  if (youngestAge < 10) {
    if (requestedDifficulty === 'Hard') {
      return 'Medium'
    }
  }
  
  return requestedDifficulty
}

/**
 * Format difficulty adjustment announcement
 */
export function getDifficultyAdjustmentMessage(
  oldDifficulty: Difficulty,
  newDifficulty: Difficulty,
  reason: string
): string {
  if (oldDifficulty === newDifficulty) {
    return ''
  }
  
  const isHarder = ['Easy', 'Medium', 'Hard'].indexOf(newDifficulty) > ['Easy', 'Medium', 'Hard'].indexOf(oldDifficulty)
  
  if (isHarder) {
    return `🎯 Great job everyone! We're bumping up to ${newDifficulty} difficulty. ${reason}`
  } else {
    return `📊 Adjusting to ${newDifficulty} difficulty to keep things fun! ${reason}`
  }
}


