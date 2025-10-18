import { NextRequest, NextResponse } from 'next/server'
import ZAI from 'z-ai-web-dev-sdk'
import { buildHostPrompt, HostContext } from '@/lib/ai-host'

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
        { error: 'Missing context or messageType' },
        { status: 400 }
      )
    }

    // Build the prompt for the AI host
    const prompt = buildHostPrompt(context, messageType)

    // Generate host message using ZAI
    try {
      const zai = await ZAI.create()
      
      const completion = await zai.chat.completions.create({
        messages: [
          {
            role: 'system',
            content: 'You are a warm, energetic, and fair family trivia game host. Keep messages concise, upbeat, and family-friendly. Use emojis sparingly to add personality.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.8,
        max_tokens: 150
      })

      const message = completion.choices[0]?.message?.content?.trim()
      
      if (!message) {
        throw new Error('No content generated')
      }

      return NextResponse.json({
        message,
        tone: messageType
      })
    } catch (aiError) {
      console.error('AI generation error:', aiError)
      
      // Fallback to template messages
      const fallbackMessage = getFallbackMessage(messageType, context)
      
      return NextResponse.json({
        message: fallbackMessage,
        tone: messageType,
        fallback: true
      })
    }
  } catch (error) {
    console.error('Error generating host message:', error)
    return NextResponse.json(
      { error: 'Failed to generate host message' },
      { status: 500 }
    )
  }
}

/**
 * Fallback messages when AI is unavailable
 */
function getFallbackMessage(messageType: string, context: HostContext): string {
  switch (messageType) {
    case 'greeting':
      return `Welcome to Family Trivia Night! 🎯 Get ready for some fun questions and friendly competition!`
      
    case 'setup_summary':
      return `Great! Let's get started with ${context.totalQuestions} questions. Good luck everyone! 🌟`
      
    case 'question_intro':
      return `Here comes question #${context.questionNumber}! 🎯`
      
    case 'correct_feedback':
      return `✅ That's correct! Great job!`
      
    case 'incorrect_feedback':
      return `Not quite, but keep trying! You've got this! 💪`
      
    case 'partial_feedback':
      return `🟨 So close! You're on the right track!`
      
    case 'leaderboard_intro':
      return `Let's see how everyone's doing! 📊`
      
    case 'conclusion':
      const winner = [...context.players].sort((a, b) => b.score - a.score)[0]
      return `🏆 Congratulations ${winner.name}! Thanks everyone for playing Family Trivia Night! 🎉`
      
    case 'tie_announcement':
      return `It's a tie! Time for a tie-breaker round! 🏆`
      
    default:
      return `Let's keep the fun going! 🎯`
  }
}


