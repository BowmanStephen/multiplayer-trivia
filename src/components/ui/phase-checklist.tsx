import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircle2, Circle } from 'lucide-react'

interface PhaseChecklistProps {
  title: string
  items: string[]
  completed: boolean[]
  className?: string
}

export function PhaseChecklist({ title, items, completed, className = '' }: PhaseChecklistProps) {
  return (
    <Card className={`border-2 border-purple-200 bg-gradient-to-br from-purple-50/50 to-pink-50/50 ${className}`}>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-semibold text-purple-900 flex items-center gap-2">
          <span>📋</span>
          <span>{title}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {items.map((item, index) => (
          <div
            key={index}
            className={`flex items-start gap-2 text-sm transition-all duration-300 ${
              completed[index] 
                ? 'text-gray-500 line-through' 
                : 'text-gray-800 font-medium'
            }`}
          >
            {completed[index] ? (
              <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
            ) : (
              <Circle className="w-4 h-4 text-purple-400 flex-shrink-0 mt-0.5" />
            )}
            <span className="flex-1">{item}</span>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}


