import { Card, CardContent } from '@/components/ui/card'
import { Sparkles } from 'lucide-react'

interface HostMessageProps {
  message: string
  tone?: 'greeting' | 'question_intro' | 'feedback' | 'explanation' | 'celebration' | 'encouragement'
  className?: string
}

export function HostMessage({ message, tone = 'greeting', className = '' }: HostMessageProps) {
  const getToneStyles = () => {
    switch (tone) {
      case 'greeting':
        return 'bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200'
      case 'celebration':
        return 'bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200'
      case 'feedback':
        return 'bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200'
      case 'encouragement':
        return 'bg-gradient-to-r from-green-50 to-teal-50 border-green-200'
      case 'question_intro':
        return 'bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-200'
      default:
        return 'bg-gradient-to-r from-gray-50 to-slate-50 border-gray-200'
    }
  }

  return (
    <Card className={`border-2 ${getToneStyles()} ${className}`}>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0">
            <Sparkles className="w-5 h-5 text-purple-600 mt-0.5" />
          </div>
          <div className="flex-1">
            <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">{message}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}


