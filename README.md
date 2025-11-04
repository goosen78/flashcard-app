# Flashcard App

A minimal, elegant flashcard application with spaced repetition for the AI Capstone (Summer 2026).

## Philosophy

This app is designed with the following principles:
- **Minimal complexity**: Less code, fewer moving parts
- **Pure functions**: Core logic is testable and mathematically clear
- **Zero incidental complexity**: Every line serves a purpose
- **Strong invariants**: Behavior is predictable and correct
- **Test coverage**: Comprehensive tests make correctness obvious

## Architecture

The application is structured in three layers:

### 1. Core Pure Functions (`lib/flashcard.ts`)
All business logic is implemented as pure functions with no side effects:
- `createCard()`, `updateCardBox()` - Card management
- `createDeck()`, `addCardToDeck()`, `updateCardInDeck()` - Deck operations
- `getCardsForReview()`, `shuffleCards()` - Study session logic
- `createStudySession()`, `updateStudySession()` - Session tracking

**Key invariants:**
- Cards exist in boxes 0-4 (Leitner system)
- Correct answers move cards forward (max box 4)
- Incorrect answers reset cards to box 0
- All functions are immutable - return new objects, never mutate

### 2. Thin UI Components (`components/`)
Simple React components that call pure functions:
- `Flashcard` - Display and flip cards
- `DeckStats` - Show deck statistics
- `SessionSummary` - Display session results

### 3. Main Application (`app/page.tsx`)
Orchestrates UI state and connects components to core functions.

## Features

- **Spaced Repetition**: Uses the Leitner system (5-box algorithm)
- **Interactive Cards**: Click to flip between question and answer
- **Progress Tracking**: See your accuracy and card distribution
- **Immediate Feedback**: Mark cards as correct/incorrect
- **Session Statistics**: Review your performance after each session

## Getting Started

### Prerequisites
- Node.js 18+ installed

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch
```

## Project Structure

```
flashcard-app/
├── lib/
│   ├── types.ts           # TypeScript type definitions
│   └── flashcard.ts       # Core pure functions (100% test coverage)
├── components/
│   ├── Flashcard.tsx      # Card display component
│   ├── DeckStats.tsx      # Statistics display
│   └── SessionSummary.tsx # Session results
├── app/
│   ├── page.tsx           # Main application page
│   └── layout.tsx         # Root layout
├── data/
│   └── sampleDeck.ts      # Example flashcard deck
└── __tests__/
    └── flashcard.test.ts  # Comprehensive test suite
```

## How It Works

### The Leitner System

Cards are organized into 5 boxes (0-4):
- **Box 0**: New cards (reviewed every session)
- **Box 1**: Learning (reviewed frequently)
- **Box 2-3**: Reviewing (reviewed periodically)
- **Box 4**: Mastered (reviewed rarely)

When you answer correctly, the card moves to the next box.
When you answer incorrectly, the card returns to box 0.

### Pure Function Design

All core logic is pure functions, making them:
1. **Easy to test**: No mocking or setup required
2. **Easy to understand**: Clear inputs and outputs
3. **Easy to debug**: No hidden state or side effects
4. **Easy to extend**: Compose functions for new features

Example:
```typescript
// Pure function - always returns the same output for the same input
const updatedCard = updateCardBox(card, 'correct');
// Original card is unchanged, updatedCard is a new object
```

## Extending the App

Students can easily extend this app:

### Add New Features
- **Custom Decks**: Import/export deck files
- **More Algorithms**: Implement SM-2 or other spaced repetition algorithms
- **Statistics**: Add more detailed progress tracking
- **Themes**: Customize the appearance

### Add New Tests
Tests are in `__tests__/flashcard.test.ts`. Follow the existing pattern:
```typescript
it('should do something specific', () => {
  const result = myFunction(input);
  expect(result).toEqual(expectedOutput);
});
```

### Modify the Algorithm
The spaced repetition logic is in `lib/flashcard.ts`:
- `updateCardBox()` - Change how cards move between boxes
- `getCardsForReview()` - Change which cards are shown

## Development Guidelines

1. **Keep functions pure**: No side effects, no mutations
2. **Test everything**: Every function should have tests
3. **Keep it simple**: If it's complex, it's probably wrong
4. **Document invariants**: What must always be true?

## Testing Strategy

The test suite verifies:
- ✅ Function behavior (correct outputs)
- ✅ Immutability (no mutations)
- ✅ Edge cases (empty arrays, boundaries)
- ✅ Integration (functions compose correctly)

Run `npm test` to see 39 passing tests with 100% coverage.

## License

See [LICENSE](LICENSE) file for details.
