import { NextRequest, NextResponse } from 'next/server'
import ZAI from 'z-ai-web-dev-sdk'
import { buildHostPrompt, type HostContext } from '@/lib/ai-host'

interface HostRequest {
  context: HostContext
  messageType: string
}

export async function POST(request: NextRequest) {
  try {
    const body: HostRequest = await request.json()
    const { context, messageType } = body

    // Validate input
    if (!context || !messageType) {
      return NextResponse.json(
        { error: 'Missing required parameters: context and messageType' },
        { status: 400 }
      )
    }

    // Build the prompt for the AI host
    const prompt = buildHostPrompt(context, messageType)

    try {
      // Generate host message using ZAI SDK
      const zai = await ZAI.create()
      
      const completion = await zai.chat.completions.create({
        messages: [
          {
            role: 'system',
            content: 'You are a warm, energetic family trivia game host. Keep messages brief, positive, and family-friendly.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.8,
        max_tokens: 200
      })

      const message = completion.choices[0]?.message?.content?.trim()

      if (!message) {
        throw new Error('No message generated')
      }

      return NextResponse.json({ message })
    } catch (aiError) {
      console.error('AI generation error:', aiError)
      
      // Provide fallback messages based on message type
      const fallbackMessage = getFallbackMessage(messageType, context)
      return NextResponse.json({ message: fallbackMessage })
    }
  } catch (error) {
    console.error('Error in AI host endpoint:', error)
    return NextResponse.json(
      { error: 'Failed to generate host message' },
      { status: 500 }
    )
  }
}

/**
 * Fallback messages when AI generation fails
 */
function getFallbackMessage(messageType: string, context: HostContext): string {
  const playerNames = context.players.map(p => p.name).join(', ')
  
  switch (messageType) {
    case 'greeting':
      return '🎯 Welcome to Family Trivia Night! Get ready for an amazing trivia adventure filled with fun, learning, and excitement!'
      
    case 'setup_summary':
      return `Alright ${playerNames}, let's get this trivia party started! We've got an awesome game lined up for you! 🚀`
      
    case 'question_intro':
      return `Here comes your next question! Think carefully and good luck! 🎯`
      
    case 'correct_feedback':
      if (context.recentHistory && context.recentHistory.length > 0) {
        const recent = context.recentHistory[context.recentHistory.length - 1]
        return `🎉 Fantastic, ${recent.playerName}! That's absolutely correct! Keep up the great work!`
      }
      return '✅ That\'s right! Excellent work!'
      
    case 'incorrect_feedback':
      if (context.recentHistory && context.recentHistory.length > 0) {
        const recent = context.recentHistory[context.recentHistory.length - 1]
        return `Not quite, ${recent.playerName}, but don't worry! You'll get the next one! Keep that positive energy! 💪`
      }
      return '❌ Not quite, but nice try! You\'ll get the next one!'
      
    case 'partial_feedback':
      if (context.recentHistory && context.recentHistory.length > 0) {
        const recent = context.recentHistory[context.recentHistory.length - 1]
        return `🟨 Wow, ${recent.playerName}! You were so close! That was a great attempt!`
      }
      return '🟨 So close! Great effort!'
      
    case 'leaderboard_intro':
      return '📊 Time to check those scores! Let\'s see who\'s in the lead right now!'
      
    case 'conclusion':
      const sortedPlayers = [...context.players].sort((a, b) => b.score - a.score)
      const winner = sortedPlayers[0]
      return `🏆 What an incredible game! Congratulations ${winner.name}! Thanks to everyone for playing - you all did amazing! 🎉`
      
    case 'tie_announcement':
      const tiedPlayers = context.players.filter(p => p.score === context.players[0].score)
      return `🎯 We have a tie! ${tiedPlayers.map(p => p.name).join(' and ')} are neck and neck! Time for a tie-breaker!`
      
    default:
      return '🎯 Let\'s keep this trivia party going! You\'re all doing great!'
  }
}

