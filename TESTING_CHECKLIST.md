# AI-Powered Family Trivia Host - Testing Checklist

## Pre-Launch Testing Guide

### 🚀 Setup & Installation
- [ ] Run `npm install` successfully
- [ ] Run `npm run dev` without errors
- [ ] Navigate to `http://localhost:3000`
- [ ] Verify no console errors on load

### 📋 Setup Phase Testing

#### Basic Setup
- [ ] Welcome message appears with AI host greeting
- [ ] Setup checklist displays all 5 items
- [ ] Add player form accepts name and age (1-120)
- [ ] Players list updates when adding players
- [ ] Remove player button works
- [ ] Category selection allows 1-4 categories
- [ ] At least one category is always selected (General Knowledge default)

#### Game Settings
- [ ] Difficulty selector works (Easy/Medium/Hard)
- [ ] Game mode selector works (MC/Open/Hybrid)
- [ ] Question count slider works (5-20 range)
- [ ] Hints checkbox toggles correctly
- [ ] Tie-breaker selector works

#### Checklist Progress
- [ ] Item 1 completes when first player added
- [ ] Item 2 completes when categories selected
- [ ] Item 3 completes when settings configured
- [ ] Items 4-5 complete when starting game

#### Edge Cases
- [ ] Cannot start with zero players
- [ ] Age validation (must be 1-120)
- [ ] Cannot have zero categories
- [ ] Game plan summary appears when ready

### 🎮 Gameplay Phase Testing

#### Question Display
- [ ] Questions generate successfully (or fallback to mock questions)
- [ ] Progress bar shows correct percentage
- [ ] Question number displays correctly (e.g., "Question 3 of 9")
- [ ] Category and difficulty badges show correctly
- [ ] Question text is readable and properly formatted

#### Answer Validation - Multiple Choice
- [ ] Can select A/B/C/D options
- [ ] Selected option highlights
- [ ] Submit button activates only when answer selected
- [ ] Correct answer shows ✅ with points
- [ ] Incorrect answer shows ❌ with explanation
- [ ] Explanation displays after submission

#### Answer Validation - Open-Ended
- [ ] Text input appears for Open mode
- [ ] Can type answer
- [ ] Enter key submits answer
- [ ] Case-insensitive matching works
  - [ ] Test: "paris" = "Paris" = "PARIS"
- [ ] Article ignoring works
  - [ ] Test: "the eiffel tower" = "eiffel tower"
- [ ] Punctuation ignored
  - [ ] Test: "don't" = "dont"

#### Advanced Answer Validation
- [ ] **Fuzzy Matching (Typos)**
  - [ ] Test: "Parris" accepted for "Paris" (1 letter off)
  - [ ] Test: "Washingten" accepted for "Washington" (2 letters off for long)
  - [ ] Test: "Marss" rejected for "Mars" (2 letters off for short)
- [ ] **Numeric Tolerance**
  - [ ] Test: Answer "6" accepted for correct "5" (small number ±1)
  - [ ] Test: Answer "105" accepted for correct "100" (large number ±10%)
  - [ ] Test: Answer "95" accepted for correct "100"
- [ ] **Partial Credit**
  - [ ] Close answer shows 🟨 "So Close!"
  - [ ] Awards 50% of base points
- [ ] **Synonyms**
  - [ ] Test: "CO2" accepted for "carbon dioxide"
  - [ ] Test: Multiple acceptable answers work

#### Hint System
- [ ] Hint button appears when enabled
- [ ] Hint displays when requested
- [ ] Hint penalty (-25%) applies to score
- [ ] Hint count tracked per player
- [ ] Cannot request multiple hints per question
- [ ] **Hybrid Mode:** Hint converts to MC

#### Hybrid Mode Specific
- [ ] Starts as open-ended
- [ ] Shows text input initially
- [ ] Converts to MC after hint request
- [ ] Shows MC options after conversion
- [ ] Can still answer after conversion

#### Player Management
- [ ] Player selector shows all players
- [ ] Can switch between players
- [ ] Selected player highlighted
- [ ] Score badge shows current score
- [ ] Single player auto-selected

#### Scoring & Streaks
- [ ] **Base Points:**
  - [ ] Easy questions: 100 points
  - [ ] Medium questions: 150 points
  - [ ] Hard questions: 200 points
- [ ] **Hint Penalty:**
  - [ ] 25% deduction applied
  - [ ] Example: Easy with hint = 75 points
- [ ] **Streak Bonus:**
  - [ ] Activates after 3 correct in a row
  - [ ] +20 points per correct answer
  - [ ] 🔥 flame icon appears at streak ≥3
  - [ ] Streak resets on incorrect answer
- [ ] **Partial Credit:**
  - [ ] 50% points for close answers
  - [ ] Shows 🟨 indicator

#### Dynamic Difficulty
- [ ] Difficulty badge appears when adjusted
- [ ] 🔺 shows when increasing difficulty
- [ ] 🔻 shows when decreasing difficulty
- [ ] Adjustment message displays briefly
- [ ] **Test high accuracy:**
  - [ ] Answer 5+ correctly (>85%)
  - [ ] Difficulty increases (Easy→Medium or Medium→Hard)
- [ ] **Test low accuracy:**
  - [ ] Answer 5+ incorrectly (<50%)
  - [ ] Difficulty decreases (Hard→Medium or Medium→Easy)

#### Leaderboard
- [ ] Leaderboard appears every 3 questions
- [ ] Shows all players sorted by score
- [ ] Shows streaks if ≥3
- [ ] Shows accuracy (X/Y correct)
- [ ] Ranking numbers (1, 2, 3...)
- [ ] Continue button dismisses leaderboard

#### AI Host Messages
- [ ] Question intro message appears (or fallback)
- [ ] Correct answer feedback
- [ ] Incorrect answer feedback
- [ ] Close answer feedback (partial credit)
- [ ] Messages are warm and encouraging
- [ ] Fallback messages work if AI unavailable

#### Skip Functionality
- [ ] Skip button works
- [ ] Moves to next question
- [ ] Tracks skip count per player
- [ ] No penalty (0 points)

#### Progress Checklist
- [ ] Gameplay checklist shows all 5 items
- [ ] Items complete progressively:
  1. Generate and validate
  2. Present question
  3. Accept answer
  4. Evaluate response
  5. Reveal explanation

### 🏆 Conclusion Phase Testing

#### Final Scores
- [ ] Final scores display correctly
- [ ] Players sorted by score (highest first)
- [ ] Winner identified with 🏆 trophy
- [ ] 🥇 gold medal for 1st place
- [ ] 🥈 silver medal for 2nd place
- [ ] 🥉 bronze medal for 3rd place
- [ ] "Winner!" badge on first place
- [ ] Accuracy shown (X/Y correct)
- [ ] Streak shown if ≥3

#### Tie Detection
- [ ] Tie detected when players have same score
- [ ] Tie notification card appears
- [ ] Shows tie-breaker method from settings
- [ ] "Tied!" badge appears

#### AI Host Wrap-Up
- [ ] Host conclusion message appears
- [ ] Celebrates winner(s)
- [ ] Thanks all players
- [ ] Fallback message works

#### Superlatives
- [ ] "Show Awards" button appears if superlatives exist
- [ ] Awards toggle correctly
- [ ] **Sharpshooter:**
  - [ ] Awarded to highest accuracy player
  - [ ] Shows percentage
- [ ] **On a Roll:**
  - [ ] Awarded for longest streak (≥3)
  - [ ] Shows streak count
- [ ] **Hint Ninja:**
  - [ ] Awarded for fewest hints per correct answer
  - [ ] Shows hint count
- [ ] **Category Ace:**
  - [ ] Awarded for best category performance
  - [ ] Shows category name
- [ ] **Comeback Kid:**
  - [ ] Awarded for best second-half improvement
  - [ ] Only shows if game ≥6 questions

#### Game Statistics
- [ ] Total questions played
- [ ] Correct answers count
- [ ] Hints used count
- [ ] Success rate percentage

#### Play Again
- [ ] "Play Again" button works
- [ ] Resets game to setup phase
- [ ] Clears all players and scores
- [ ] Resets settings to defaults

#### Progress Checklist
- [ ] Conclusion checklist shows all 4 items
- [ ] Item 1 completes (Tally scores)
- [ ] Item 2 completes (Announce winner) if no tie
- [ ] Item 3 completes when showing superlatives
- [ ] Item 4 for rematch offer

### 🔧 Edge Cases & Error Handling

#### Network Failures
- [ ] AI host falls back to template messages
- [ ] Question generation falls back to mock questions
- [ ] No crashes on API failures
- [ ] Appropriate error logging

#### Invalid States
- [ ] Cannot submit without selected player (multiplayer)
- [ ] Cannot submit without answer
- [ ] Cannot request more than 1 hint per question
- [ ] Handles empty answer gracefully

#### Performance
- [ ] Game runs smoothly with 1 player
- [ ] Game runs smoothly with 5+ players
- [ ] No lag when generating questions
- [ ] Transitions are smooth
- [ ] No memory leaks over long sessions

### 📱 Responsive Design
- [ ] Mobile view (< 640px) works correctly
- [ ] Tablet view (640-1024px) works correctly
- [ ] Desktop view (> 1024px) works correctly
- [ ] Touch interactions work on mobile
- [ ] Buttons are appropriately sized for touch

### ♿ Accessibility
- [ ] Keyboard navigation works
- [ ] Focus states visible
- [ ] Color contrast sufficient
- [ ] Screen reader compatible
- [ ] ARIA labels present
- [ ] Range slider has aria-label

### 🎨 Visual & UX
- [ ] Loading states show properly
- [ ] Animations are smooth
- [ ] Gradient backgrounds render correctly
- [ ] Icons display properly
- [ ] Emojis render correctly
- [ ] Card shadows and borders look good
- [ ] Hover states work
- [ ] Active states work

### 🐛 Known Issues to Document
- [ ] List any discovered bugs
- [ ] Note any performance issues
- [ ] Document any browser-specific problems
- [ ] Record any accessibility gaps

## Test Scenarios

### Scenario 1: Single Player, Easy Mode
1. Add one player (age 8)
2. Select 3 categories
3. Set difficulty to Easy
4. Set mode to MC
5. Set 9 questions
6. Enable hints
7. Play through answering most correctly
8. Verify difficulty doesn't change
9. Check final superlatives

### Scenario 2: Multiplayer, Dynamic Difficulty
1. Add 3 players (ages 10, 12, 15)
2. Select 4 categories
3. Set difficulty to Medium
4. Set mode to Open
5. Set 15 questions
6. Play with varying accuracy
7. Verify difficulty adjustments
8. Check leaderboard updates
9. Verify streaks work

### Scenario 3: Hybrid Mode with Hints
1. Add 2 players
2. Set mode to Hybrid
3. Enable hints
4. Try answering open-ended
5. Request hint → verify MC conversion
6. Complete game
7. Check hint ninja superlative

### Scenario 4: Fuzzy Matching Test
1. Set mode to Open
2. Test deliberate typos:
   - "Parris" for "Paris"
   - "Washingten" for "Washington"
3. Test numeric tolerance:
   - "6" for "5"
   - "95" for "100"
4. Verify partial credit awards

### Scenario 5: Tie-Breaker
1. Add 2 players
2. Manipulate scores to create tie
3. Verify tie detection
4. Check tie-breaker notification
5. Note: Actual tie-breaker execution not implemented

## Performance Benchmarks

- [ ] Initial load < 2 seconds
- [ ] Question generation < 3 seconds
- [ ] AI host message < 2 seconds
- [ ] Answer submission immediate
- [ ] Phase transitions smooth (< 500ms)

## Browser Compatibility

- [ ] Chrome/Edge (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Mobile Safari (iOS)
- [ ] Chrome Mobile (Android)

## Success Criteria

✅ **Must Have:**
- All core features work
- No critical bugs
- Smooth user experience
- AI host functional (with fallbacks)
- Answer validation works correctly

✅ **Should Have:**
- Dynamic difficulty adjusts properly
- Superlatives calculate correctly
- Leaderboards display accurately
- Progress checklists update

✅ **Nice to Have:**
- Perfect fuzzy matching
- Optimal AI responses
- Flawless animations
- Zero edge cases

---

**Testing Status:** [ ] Not Started | [ ] In Progress | [ ] Complete

**Tested By:** _____________

**Date:** _____________

**Notes:**


