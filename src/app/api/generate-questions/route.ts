import { NextRequest, NextResponse } from 'next/server'
import ZAI from 'z-ai-web-dev-sdk'

interface QuestionRequest {
  categories: string[]
  difficulty: 'Easy' | 'Medium' | 'Hard'
  mode: 'MC' | 'Open' | 'Hybrid'
  count: number
}

interface Question {
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

const QUESTION_TEMPLATES = {
  Science: {
    Easy: [
      {
        question: "What gas do plants primarily absorb from the atmosphere for photosynthesis?",
        choices: { A: "Oxygen", B: "Carbon dioxide", C: "Nitrogen", D: "Hydrogen" },
        correct: "B",
        explanation: "Plants absorb carbon dioxide from the air and use sunlight to convert it into oxygen and glucose through photosynthesis.",
        hint: "Think about what humans breathe out that plants need!"
      },
      {
        question: "What is the largest planet in our solar system?",
        choices: { A: "Earth", B: "Mars", C: "Jupiter", D: "Saturn" },
        correct: "C",
        explanation: "Jupiter is the largest planet in our solar system, with a mass more than 300 times that of Earth.",
        hint: "This planet has a Great Red Spot storm!"
      }
    ],
    Medium: [
      {
        question: "What is the chemical symbol for gold?",
        choices: { A: "Go", B: "Gd", C: "Au", D: "Ag" },
        correct: "C",
        explanation: "The chemical symbol for gold is Au, which comes from the Latin word 'aurum' meaning gold.",
        hint: "The symbol comes from the Latin word for gold!"
      }
    ],
    Hard: [
      {
        question: "What is the speed of light in a vacuum?",
        choices: { A: "299,792 km/s", B: "150,000 km/s", C: "399,792 km/s", D: "199,792 km/s" },
        correct: "A",
        explanation: "The speed of light in a vacuum is exactly 299,792,458 meters per second (approximately 299,792 km/s).",
        hint: "It's approximately 300,000 kilometers per second."
      }
    ]
  },
  Geography: {
    Easy: [
      {
        question: "What is the capital of France?",
        choices: { A: "London", B: "Berlin", C: "Paris", D: "Madrid" },
        correct: "C",
        explanation: "Paris has been the capital of France since 987 AD and is known for the Eiffel Tower.",
        hint: "This city is famous for the Eiffel Tower!"
      },
      {
        question: "Which ocean is the largest?",
        choices: { A: "Atlantic", B: "Indian", C: "Arctic", D: "Pacific" },
        correct: "D",
        explanation: "The Pacific Ocean is the largest and deepest of the world's oceans, covering about 63 million square miles.",
        hint: "This ocean shares its name with peacefulness!"
      }
    ],
    Medium: [
      {
        question: "What is the smallest country in the world?",
        choices: { A: "Monaco", B: "Vatican City", C: "San Marino", D: "Liechtenstein" },
        correct: "B",
        explanation: "Vatican City is the smallest country in the world, with an area of just 0.44 square kilometers.",
        hint: "This country is located within Rome, Italy!"
      }
    ],
    Hard: [
      {
        question: "What is the highest mountain in Africa?",
        choices: { A: "Mount Kenya", B: "Mount Kilimanjaro", C: "Atlas Mountains", D: "Drakensberg" },
        correct: "B",
        explanation: "Mount Kilimanjaro in Tanzania is the highest mountain in Africa, with a height of 5,895 meters (19,341 feet).",
        hint: "This mountain is located in Tanzania!"
      }
    ]
  },
  History: {
    Easy: [
      {
        question: "Who was the first President of the United States?",
        choices: { A: "Thomas Jefferson", B: "George Washington", C: "Abraham Lincoln", D: "John Adams" },
        correct: "B",
        explanation: "George Washington served as the first President of the United States from 1789 to 1797.",
        hint: "His face is on the one-dollar bill!"
      }
    ],
    Medium: [
      {
        question: "In which year did World War II end?",
        choices: { A: "1943", B: "1944", C: "1945", D: "1946" },
        correct: "C",
        explanation: "World War II ended in 1945 with the surrender of Japan in September following the atomic bombings.",
        hint: "It was in the mid-1940s!"
      }
    ]
  },
  Animals: {
    Easy: [
      {
        question: "What is the largest mammal in the world?",
        choices: { A: "African Elephant", B: "Blue Whale", C: "Giraffe", D: "Polar Bear" },
        correct: "B",
        explanation: "The blue whale is the largest mammal ever known to have lived on Earth, reaching lengths of up to 100 feet.",
        hint: "This mammal lives in the ocean!"
      }
    ],
    Medium: [
      {
        question: "Which bird is known for its ability to mimic human speech?",
        choices: { A: "Eagle", B: "Parrot", C: "Owl", D: "Penguin" },
        correct: "B",
        explanation: "Parrots, especially African grey parrots, are renowned for their ability to mimic human speech and sounds.",
        hint: "This colorful bird is often kept as a pet!"
      }
    ]
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: QuestionRequest = await request.json()
    const { categories, difficulty, mode, count } = body

    // Validate input
    if (!categories || categories.length === 0) {
      return NextResponse.json(
        { error: 'At least one category must be selected' },
        { status: 400 }
      )
    }

    if (!['Easy', 'Medium', 'Hard'].includes(difficulty)) {
      return NextResponse.json(
        { error: 'Invalid difficulty level' },
        { status: 400 }
      )
    }

    if (!['MC', 'Open', 'Hybrid'].includes(mode)) {
      return NextResponse.json(
        { error: 'Invalid game mode' },
        { status: 400 }
      )
    }

    if (count < 1 || count > 20) {
      return NextResponse.json(
        { error: 'Question count must be between 1 and 20' },
        { status: 400 }
      )
    }

    // Generate questions using templates and AI
    const questions: Question[] = []
    
    for (let i = 0; i < count; i++) {
      const category = categories[i % categories.length]
      console.log(`🎯 Generating question ${i + 1}/${count} for category: ${category}, difficulty: ${difficulty}`)
      
      try {
        const question = await generateQuestion(category, difficulty, mode, i + 1)
        questions.push(question)
        console.log(`✅ Successfully generated question ${i + 1}`)
      } catch (error) {
        console.error(`❌ Failed to generate question ${i + 1}:`, error)
        // Add a fallback question
        const fallbackQuestion = {
          id: crypto.randomUUID(),
          number: i + 1,
          category,
          difficulty,
          mode,
          question: `Sample question about ${category}`,
          choices: mode === 'Open' ? undefined : {
            A: "Option A",
            B: "Option B",
            C: "Option C", 
            D: "Option D"
          },
          correctAnswer: "A",
          acceptableAnswers: ["a", "option a"],
          explanation: "This is a fallback question.",
          hint: "Try option A!"
        }
        questions.push(fallbackQuestion)
      }
    }

    return NextResponse.json(questions)
  } catch (error) {
    console.error('Error generating questions:', error)
    return NextResponse.json(
      { error: 'Failed to generate questions' },
      { status: 500 }
    )
  }
}

async function generateQuestion(
  category: string, 
  difficulty: 'Easy' | 'Medium' | 'Hard', 
  mode: 'MC' | 'Open' | 'Hybrid',
  number: number
): Promise<Question> {
  // First try to use template questions
  const templateQuestions = QUESTION_TEMPLATES[category as keyof typeof QUESTION_TEMPLATES]?.[difficulty]
  
  if (templateQuestions && templateQuestions.length > 0) {
    console.log(`📋 Using template question for ${category} ${difficulty}`)
    const template = templateQuestions[Math.floor(Math.random() * templateQuestions.length)]
    
    return {
      id: crypto.randomUUID(),
      number,
      category,
      difficulty,
      mode,
      question: template.question,
      choices: mode === 'Open' ? undefined : template.choices,
      correctAnswer: template.correct,
      acceptableAnswers: [template.correct.toLowerCase()],
      explanation: template.explanation,
      hint: template.hint
    }
  }

  console.log(`🤖 No template found for ${category} ${difficulty}, using AI generation`)
  
  // If no template available, use AI to generate
  try {
    const zai = await ZAI.create()
    
    const prompt = `Generate a family-friendly trivia question with the following specifications:
    - Category: ${category}
    - Difficulty: ${difficulty}
    - Mode: ${mode}
    - Reading level: ${difficulty === 'Easy' ? 'Grade 6 or below' : difficulty === 'Medium' ? 'Grade 8 or below' : 'Grade 10 or below'}
    
    The question must be:
    1. Factually accurate and commonly known
    2. Family-friendly and appropriate for all ages
    3. Clear and unambiguous
    4. Engaging and interesting
    
    ${mode === 'MC' ? 'Provide 4 multiple choice options (A, B, C, D) with one clearly correct answer and 3 plausible but incorrect distractors.' : ''}
    ${mode === 'Open' ? 'Provide an open-ended question with a clear, specific answer.' : ''}
    ${mode === 'Hybrid' ? 'Provide an open-ended question that can also work as multiple choice if needed.' : ''}
    
    Also provide:
    - A brief, clear explanation of the correct answer
    - A helpful hint that doesn't give away the answer
    - A list of acceptable answer variations (synonyms, alternate spellings, etc.)
    
    Format your response as JSON:
    {
      "question": "The question text",
      ${mode === 'MC' ? '"choices": {"A": "Option A", "B": "Option B", "C": "Option C", "D": "Option D"},' : ''}
      "correctAnswer": "The correct answer (A/B/C/D for MC, or the actual answer for Open)",
      "acceptableAnswers": ["answer1", "answer2", "answer3"],
      "explanation": "Brief explanation",
      "hint": "Helpful hint"
    }`

    const completion = await zai.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: 'You are a trivia question generator specializing in family-friendly content. Always ensure questions are accurate, appropriate, and engaging.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 500
    })

    const content = completion.choices[0]?.message?.content
    if (!content) {
      throw new Error('No content generated')
    }

    // Parse the AI response
    let cleanedContent = content.trim()
    
    // Remove markdown code blocks if present
    if (cleanedContent.startsWith('```json')) {
      cleanedContent = cleanedContent.replace(/```json\s*/, '').replace(/```\s*$/, '')
    } else if (cleanedContent.startsWith('```')) {
      cleanedContent = cleanedContent.replace(/```\s*/, '').replace(/```\s*$/, '')
    }
    
    const aiQuestion = JSON.parse(cleanedContent)
    
    return {
      id: crypto.randomUUID(),
      number,
      category,
      difficulty,
      mode,
      question: aiQuestion.question,
      choices: mode === 'Open' ? undefined : aiQuestion.choices,
      correctAnswer: aiQuestion.correctAnswer,
      acceptableAnswers: aiQuestion.acceptableAnswers || [aiQuestion.correctAnswer.toLowerCase()],
      explanation: aiQuestion.explanation,
      hint: aiQuestion.hint
    }
  } catch (error) {
    console.error('Error generating AI question:', error)
    
    // Fallback to a simple default question
    return {
      id: crypto.randomUUID(),
      number,
      category,
      difficulty,
      mode,
      question: `What is the capital of ${category}?`,
      choices: mode === 'Open' ? undefined : {
        A: "Option A",
        B: "Option B", 
        C: "Option C",
        D: "Option D"
      },
      correctAnswer: mode === 'MC' ? "A" : "Answer",
      acceptableAnswers: ["answer"],
      explanation: "This is a fallback question due to generation issues.",
      hint: "Think about the most famous city in this context."
    }
  }
}