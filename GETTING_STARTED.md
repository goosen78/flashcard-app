# Getting Started with the Flashcard App

This guide will help you understand and extend the flashcard application.

## Quick Start

```bash
# Install dependencies
npm install

# Run tests
npm test

# Start development server
npm run dev
```

Then open http://localhost:3000 in your browser.

## Understanding the Code

### 1. Core Functions (`lib/flashcard.ts`)

The heart of the app is pure functions. Each function:
- Takes inputs
- Returns outputs
- Has no side effects
- Always produces the same output for the same input

Example:
```typescript
// Pure function - testable and predictable
export function updateCardBox(card: Card, result: ReviewResult): Card {
  const newBox = result === 'correct' 
    ? Math.min(card.box + 1, 4)  // Move forward
    : 0;                          // Reset on incorrect
  
  return { ...card, box: newBox }; // Return new object
}
```

**Why pure functions?**
- Easy to test (no mocks needed)
- Easy to understand (no hidden state)
- Easy to debug (deterministic behavior)
- Easy to compose (combine multiple functions)

### 2. The Leitner System

Cards move through 5 boxes (0-4):

```
Box 0: New cards     ──correct──> Box 1: Learning
Box 1: Learning      ──correct──> Box 2: Review
Box 2: Review        ──correct──> Box 3: Review
Box 3: Review        ──correct──> Box 4: Mastered
Any box ──incorrect──> Box 0: Start over
```

The algorithm is simple:
- Correct answer: `newBox = min(currentBox + 1, 4)`
- Incorrect answer: `newBox = 0`

### 3. UI Components

Components are thin wrappers that:
1. Call pure functions
2. Display results
3. Handle user interactions

Example:
```typescript
// Component calls pure function
const handleReview = (result: ReviewResult) => {
  const updatedCard = updateCardBox(currentCard, result);
  const updatedDeck = updateCardInDeck(deck, updatedCard);
  setDeck(updatedDeck);
};
```

## Common Extensions

### Add New Deck

Create a new file in `data/`:

```typescript
import { createCard, createDeck } from '@/lib/flashcard';

const myCards = [
  createCard('1', 'What is...?', 'Answer'),
  createCard('2', 'Define...', 'Definition'),
];

export const myDeck = createDeck('My Deck', myCards);
```

### Modify the Algorithm

Change `updateCardBox()` in `lib/flashcard.ts`:

```typescript
// Example: 3-box system instead of 5
export function updateCardBox(card: Card, result: ReviewResult): Card {
  const newBox = result === 'correct' 
    ? Math.min(card.box + 1, 2)  // Max 2 instead of 4
    : 0;
  
  return { ...card, box: newBox };
}
```

### Add New Statistics

Add a function to `lib/flashcard.ts`:

```typescript
export function getAverageAccuracy(sessions: StudySession[]): number {
  if (sessions.length === 0) return 0;
  
  const totalAccuracy = sessions.reduce(
    (sum, session) => sum + getSessionAccuracy(session),
    0
  );
  
  return Math.round(totalAccuracy / sessions.length);
}
```

Then add a test:

```typescript
describe('getAverageAccuracy', () => {
  it('should calculate average across sessions', () => {
    const sessions = [
      { cardsReviewed: 10, cardsCorrect: 8, cardsIncorrect: 2 },
      { cardsReviewed: 10, cardsCorrect: 6, cardsIncorrect: 4 },
    ];
    expect(getAverageAccuracy(sessions)).toBe(70); // (80 + 60) / 2
  });
});
```

## Testing Your Changes

Always test your changes:

```bash
# Run all tests
npm test

# Run tests in watch mode (runs on file save)
npm run test:watch
```

Tests should:
- Cover the happy path (normal usage)
- Cover edge cases (empty arrays, boundaries)
- Verify immutability (original objects unchanged)
- Test error conditions

## Debugging Tips

1. **Check the tests first** - They show how functions should work
2. **Use console.log** - Print inputs and outputs
3. **Verify immutability** - Original objects should never change
4. **Check types** - TypeScript catches many errors

Example debugging:

```typescript
const handleReview = (result: ReviewResult) => {
  console.log('Before:', currentCard); // Log before
  const updatedCard = updateCardBox(currentCard, result);
  console.log('After:', updatedCard); // Log after
  console.log('Original unchanged?', currentCard.box); // Verify immutability
};
```

## Project Structure Summary

```
flashcard-app/
├── lib/                    # Core logic (pure functions)
│   ├── types.ts           # Type definitions
│   └── flashcard.ts       # All business logic
├── components/            # UI components
│   ├── Flashcard.tsx     # Card display
│   ├── DeckStats.tsx     # Statistics
│   └── SessionSummary.tsx # Results
├── app/                   # Next.js app
│   ├── page.tsx          # Main page
│   └── layout.tsx        # Root layout
├── data/                  # Sample data
│   └── sampleDeck.ts     # Example cards
└── __tests__/            # Test suite
    └── flashcard.test.ts # All tests
```

## Key Principles

1. **Keep functions pure** - No side effects
2. **Test everything** - Every function needs tests
3. **Keep it simple** - If it's complex, simplify it
4. **Document invariants** - What must always be true?

## Need Help?

- Read the tests - they show how to use functions
- Check the README - comprehensive documentation
- Look at existing code - follow the patterns
- Run tests often - catch errors early

Happy coding! 🎓
