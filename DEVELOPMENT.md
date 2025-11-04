# Development Guide

This guide will help you understand the codebase and make your first changes.

## Understanding the Code

### 1. Start with the Data Flow

The application follows a clear data flow:

1. **Database (`db/`)**: SQLite stores all persistent data
2. **Pure Functions (`lib/sm2.ts`, `lib/selection.ts`)**: Calculate scheduling and selection
3. **Server Actions (`lib/actions.ts`)**: Handle all state mutations
4. **UI Components (`app/`)**: Display data and capture user input

### 2. Key Files to Read First

Read these files in order to understand the system:

1. `db/schema.sql` - Database structure
2. `lib/sm2.ts` - Scheduling algorithm (SM-2)
3. `lib/selection.ts` - Card selection logic
4. `lib/actions.ts` - All state changes
5. `app/page.tsx` - Home page (deck list)
6. `app/study/[id]/StudySession.tsx` - Study interface

### 3. How State Changes Work

All writes to the database go through Server Actions:

```typescript
// Example: Submitting a review
await submitReview(cardId, quality, latencyMs);
```

Server Actions are async functions marked with `'use server'` that:
- Run on the server (never exposed to client)
- Can mutate database state
- Automatically revalidate cached data
- Return results to the client

## Making Your First Change

### Example 1: Add a Card Difficulty Filter

**Goal**: Let users filter cards by difficulty (E-factor)

1. **Update the UI** (`app/decks/[id]/page.tsx`):
   ```typescript
   // Add filter state
   const [difficultyFilter, setDifficultyFilter] = useState<'all' | 'easy' | 'hard'>('all');
   ```

2. **Modify the query** (`lib/selection.ts`):
   ```typescript
   export function getCardsForDeck(deckId: string, difficulty?: string): Card[] {
     // Add WHERE clause based on difficulty
   }
   ```

3. **Write tests** (`tests/selection.test.ts`):
   ```typescript
   it('should filter cards by difficulty', () => {
     // Test the new functionality
   });
   ```

4. **Run tests**:
   ```bash
   npm test
   ```

### Example 2: Add a "Suspend Card" Button

**Goal**: Let users temporarily suspend problematic cards

1. **Add Server Action** (`lib/actions.ts`):
   ```typescript
   export async function toggleCardSuspension(cardId: string) {
     // Update suspended field
   }
   ```

2. **Add UI Button** (`app/decks/[id]/CardList.tsx`):
   ```typescript
   <button onClick={() => toggleCardSuspension(card.id)}>
     {card.suspended ? 'Unsuspend' : 'Suspend'}
   </button>
   ```

3. **Test manually**: Create a card, suspend it, verify it doesn't appear in study

### Example 3: Implement Basic LLM Generation

**Goal**: Generate flashcards from pasted text

1. **Create provider adapter** (`providers/openai.ts`):
   ```typescript
   export class OpenAIProvider implements LLMProvider {
     async generateQuestions(inputText: string): Promise<CandidateCard[]> {
       // Call OpenAI API
     }
   }
   ```

2. **Add generation UI** (`app/decks/[id]/page.tsx`):
   ```typescript
   <textarea placeholder="Paste text here..." />
   <button onClick={handleGenerate}>Generate Cards</button>
   ```

3. **Store generated cards** (use existing `createCard` action):
   ```typescript
   cards.forEach(card => createCard(deckId, { ...card, source: 'generated' }));
   ```

## Using Claude Code

### Getting Started

1. **Install Claude Code** extension in VS Code
2. **Open this project** in VS Code
3. **Start a conversation**: Click the Claude icon in the sidebar

### Effective Prompts

**Understanding Code**:
```
Explain how the SM-2 algorithm works in lib/sm2.ts
```

**Adding Features**:
```
Add a "reset progress" button to each card that resets its scheduling state
to the initial values. Update both the UI and the server action.
```

**Writing Tests**:
```
Write comprehensive tests for the card selection logic in lib/selection.ts,
covering due cards, new cards, suspension, and daily limits.
```

**Debugging**:
```
The study session isn't advancing to the next card after I rate it.
Help me debug the issue in app/study/[id]/StudySession.tsx
```

### Best Practices

1. **Be specific**: "Add a dark mode toggle" is better than "improve the UI"
2. **Provide context**: Reference specific files and functions
3. **Request tests**: Always ask for tests with new features
4. **Review changes**: Don't blindly accept AI suggestions - understand them
5. **Iterate**: If the first solution isn't right, refine your prompt

## Git Workflow

### Working with AI-Generated Code

1. **Create a branch**:
   ```bash
   git checkout -b feature/ai-generated-feature
   ```

2. **Make changes** with Claude Code assistance

3. **Review the diff**:
   ```bash
   git diff
   ```

4. **Run tests**:
   ```bash
   npm test
   npm run build
   ```

5. **Commit**:
   ```bash
   git add .
   git commit -m "Add dark mode toggle with AI assistance"
   ```

6. **Push and create PR**:
   ```bash
   git push origin feature/ai-generated-feature
   ```

### Handling Merge Conflicts

If you get merge conflicts:

1. **Fetch latest main**:
   ```bash
   git fetch origin main
   ```

2. **Rebase** (or merge):
   ```bash
   git rebase origin/main
   ```

3. **Fix conflicts** in your editor

4. **Continue**:
   ```bash
   git rebase --continue
   ```

5. **Force push** (only to your feature branch):
   ```bash
   git push --force origin feature/ai-generated-feature
   ```

## Testing

### Running Tests

```bash
# Watch mode (recommended during development)
npm run test:ui

# Single run
npm test

# With coverage
npm run test:coverage
```

### Writing Tests

Tests use Vitest. Example:

```typescript
import { describe, it, expect } from 'vitest';
import { sm2Update } from '../lib/sm2';

describe('SM-2 Algorithm', () => {
  it('should increase interval for quality >= 3', () => {
    const state = { e_factor: 2.5, interval_days: 1, repetition: 1 };
    const result = sm2Update(state, 4);
    expect(result.interval_days).toBeGreaterThan(state.interval_days);
  });
});
```

### Test Categories

- **Unit tests**: Pure functions (sm2, helpers)
- **Integration tests**: Server Actions with database
- **Property-based tests**: Invariants and edge cases
- **E2E tests** (optional): Full user flows with Playwright

## Common Tasks

### Adding a New Field to Cards

1. **Update schema** (`db/schema.sql`)
2. **Drop and recreate DB** (or write migration)
3. **Update types** (`lib/selection.ts`)
4. **Update UI** (forms, display)
5. **Write tests**

### Customizing the SM-2 Algorithm

1. **Modify constants** in `lib/sm2.ts`
2. **Update tests** with new expected values
3. **Run tests** to verify behavior
4. **Document changes** in comments

### Adding a New Card Type

1. **Update schema** (`db/schema.sql`) - add to enum
2. **Update type** in `lib/selection.ts`
3. **Add rendering** in `StudySession.tsx`
4. **Add form option** in `CreateCardForm.tsx`
5. **Update provider interface** if needed

## Debugging Tips

### Database Issues

View the database:
```bash
sqlite3 flashcards.db
.tables
.schema cards
SELECT * FROM cards LIMIT 5;
```

### Server Action Issues

Server Actions run on the server. Check:
1. Server logs in terminal
2. Network tab in browser dev tools
3. Add `console.log()` statements (they appear in terminal)

### Build Issues

Clear cache and rebuild:
```bash
rm -rf .next
npm run build
```

### Test Issues

Run a single test file:
```bash
npm test -- tests/sm2.test.ts
```

## Additional Resources

- [Next.js Server Actions](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions)
- [SQLite Documentation](https://www.sqlite.org/docs.html)
- [Vitest Documentation](https://vitest.dev/)
- [Tailwind CSS](https://tailwindcss.com/docs)

## Getting Help

1. **Read the code**: Most questions are answered by reading the implementation
2. **Use Claude Code**: Ask it to explain confusing parts
3. **Run tests**: They document expected behavior
4. **Check git history**: See how similar features were added

Happy coding! 🚀
