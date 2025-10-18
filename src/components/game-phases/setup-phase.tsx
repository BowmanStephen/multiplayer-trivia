'use client'

import { useState } from 'react'
import { useGameStore } from '@/lib/store'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { UserPlus, Users, Settings, Play, Sparkles } from 'lucide-react'

const CATEGORIES = [
  'Science', 'History', 'Geography', 'Sports', 'Animals', 
  'Movies & TV', 'Music', 'Literature', 'Space', 'Math', 'General Knowledge'
]

const DIFFICULTIES = ['Easy', 'Medium', 'Hard'] as const
const MODES = ['MC', 'Open', 'Hybrid'] as const
const TIE_BREAKERS = ['Sudden Death', 'Closest Number', "Host's Choice"] as const

export function SetupPhase() {
  const { 
    players, 
    settings, 
    addPlayer, 
    removePlayer, 
    updateSettings, 
    startGame 
  } = useGameStore()
  
  const [newPlayerName, setNewPlayerName] = useState('')
  const [newPlayerAge, setNewPlayerAge] = useState('')
  const [selectedCategories, setSelectedCategories] = useState<string[]>(['General Knowledge'])

  const handleAddPlayer = () => {
    if (newPlayerName.trim() && newPlayerAge) {
      const age = parseInt(newPlayerAge)
      if (age >= 1 && age <= 120) {
        addPlayer(newPlayerName.trim(), age)
        setNewPlayerName('')
        setNewPlayerAge('')
      }
    }
  }

  const handleCategoryToggle = (category: string) => {
    setSelectedCategories(prev => {
      const updated = prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
      
      if (updated.length === 0) {
        return ['General Knowledge'] // Always keep at least one category
      }
      
      updateSettings({ categories: updated })
      return updated
    })
  }

  const canStartGame = players.length > 0 && selectedCategories.length > 0

  return (
    <div className="container mx-auto p-4 max-w-6xl">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex justify-center mb-4">
          <Users className="w-12 h-12 text-purple-600" />
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
          Welcome to Family Trivia Night!
        </h1>
        <p className="text-lg text-gray-600">
          Let's get you set up for an amazing trivia adventure! 🎯
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Players Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserPlus className="w-5 h-5" />
              Players & Teams
            </CardTitle>
            <CardDescription>
              Add everyone who wants to play!
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Add Player Form */}
            <div className="flex gap-2">
              <div className="flex-1">
                <Input
                  placeholder="Player name"
                  value={newPlayerName}
                  onChange={(e) => setNewPlayerName(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddPlayer()}
                />
              </div>
              <div className="w-20">
                <Input
                  type="number"
                  placeholder="Age"
                  value={newPlayerAge}
                  onChange={(e) => setNewPlayerAge(e.target.value)}
                  min="1"
                  max="120"
                />
              </div>
              <Button onClick={handleAddPlayer} size="sm">
                <UserPlus className="w-4 h-4" />
              </Button>
            </div>

            {/* Players List */}
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {players.length === 0 ? (
                <p className="text-gray-500 text-center py-4">
                  No players added yet. Add your first player above!
                </p>
              ) : (
                players.map((player) => (
                  <div
                    key={player.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div>
                      <span className="font-medium">{player.name}</span>
                      <span className="text-sm text-gray-500 ml-2">Age: {player.age}</span>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => removePlayer(player.id)}
                    >
                      Remove
                    </Button>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Game Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Game Settings
            </CardTitle>
            <CardDescription>
              Customize your trivia experience
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Categories */}
            <div>
              <Label className="text-sm font-medium mb-2 block">
                Categories (Select 1-4)
              </Label>
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map((category) => (
                  <Badge
                    key={category}
                    variant={selectedCategories.includes(category) ? "default" : "outline"}
                    className="cursor-pointer hover:bg-purple-100"
                    onClick={() => handleCategoryToggle(category)}
                  >
                    {category}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Difficulty */}
            <div>
              <Label className="text-sm font-medium mb-2 block">
                Difficulty Level
              </Label>
              <Select
                value={settings.difficulty}
                onValueChange={(value: typeof DIFFICULTIES[number]) =>
                  updateSettings({ difficulty: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {DIFFICULTIES.map((diff) => (
                    <SelectItem key={diff} value={diff}>
                      {diff}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Game Mode */}
            <div>
              <Label className="text-sm font-medium mb-2 block">
                Question Mode
              </Label>
              <Select
                value={settings.mode}
                onValueChange={(value: typeof MODES[number]) =>
                  updateSettings({ mode: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="MC">Multiple Choice</SelectItem>
                  <SelectItem value="Open">Open-ended</SelectItem>
                  <SelectItem value="Hybrid">Hybrid (Start open, MC if needed)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Question Count */}
            <div>
              <Label className="text-sm font-medium mb-2 block">
                Number of Questions: {settings.questionCount}
              </Label>
              <input
                type="range"
                min="5"
                max="20"
                value={settings.questionCount}
                onChange={(e) => updateSettings({ questionCount: parseInt(e.target.value) })}
                className="w-full"
              />
            </div>

            {/* Hints */}
            <div className="flex items-center space-x-2">
              <Checkbox
                id="hints"
                checked={settings.hintsEnabled}
                onCheckedChange={(checked) =>
                  updateSettings({ hintsEnabled: checked as boolean })
                }
              />
              <Label htmlFor="hints" className="text-sm font-medium">
                Enable hints (25% point penalty)
              </Label>
            </div>

            {/* Tie Breaker */}
            <div>
              <Label className="text-sm font-medium mb-2 block">
                Tie Breaker Method
              </Label>
              <Select
                value={settings.tieBreaker}
                onValueChange={(value: typeof TIE_BREAKERS[number]) =>
                  updateSettings({ tieBreaker: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TIE_BREAKERS.map((method) => (
                    <SelectItem key={method} value={method}>
                      {method}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Game Summary */}
      {canStartGame && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5" />
              Game Plan Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm space-y-1">
              <p><strong>Players:</strong> {players.map(p => p.name).join(', ')}</p>
              <p><strong>Questions:</strong> {settings.questionCount} {settings.mode} questions at {settings.difficulty} difficulty</p>
              <p><strong>Categories:</strong> {selectedCategories.join(', ')}</p>
              <p><strong>Hints:</strong> {settings.hintsEnabled ? 'Enabled' : 'Disabled'}</p>
              <p><strong>Tie Breaker:</strong> {settings.tieBreaker}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Start Button */}
      <div className="text-center mt-8">
        <Button
          size="lg"
          onClick={startGame}
          disabled={!canStartGame}
          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-3 text-lg font-semibold shadow-lg transform transition hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Play className="w-5 h-5 mr-2" />
          Start Trivia Game
        </Button>
        {!canStartGame && (
          <p className="mt-2 text-sm text-gray-500">
            Add at least one player and select categories to start
          </p>
        )}
      </div>
    </div>
  )
}