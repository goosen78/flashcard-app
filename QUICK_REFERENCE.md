# Quick Reference Card - Flashcard App

*Print this page for easy reference while working!*

---

## 🚀 Essential Commands

```bash
# Start development server
npm run dev

# Run tests (watch mode - keep running while coding)
npm run test:ui

# Run tests once
npm test

# Check test coverage
npm run test:coverage

# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint
```

---

## 📂 Project Structure

```
app/              → Pages & UI (React components)
  page.tsx        → Home page (deck list)
  decks/[id]/     → Deck management
  study/[id]/     → Study session

lib/              → Core logic (PURE FUNCTIONS)
  sm2.ts          → Spaced repetition algorithm
  selection.ts    → Card selection logic
  actions.ts      → Server Actions (database mutations)

db/               → Database
  schema.sql      → Table definitions
  index.ts        → DB connection

tests/            → Test suite
  sm2.test.ts     → Algorithm tests
```

---

## 🔧 Git Workflow

```bash
# Create feature branch
git checkout -b feature/my-feature-name

# Check status
git status

# Stage changes
git add .

# Commit with message
git commit -m "Add feature X with AI assistance"

# Push to GitHub
git push origin feature/my-feature-name

# Update from main
git pull origin main
```

---

## 🤖 Using Claude Code Effectively

### Good Prompts ✅

```
Explain how the SM-2 algorithm works in lib/sm2.ts

Add a "reset progress" button to app/decks/[id]/CardList.tsx
that calls a new Server Action resetCardProgress() in lib/actions.ts

Write comprehensive tests for lib/selection.ts covering
due cards, new cards, suspension, and daily limits
```

### Bad Prompts ❌

```
Make the app better
Fix the bug
Add a feature
Help me
```

### Verification Checklist

- [ ] Read and understand the generated code
- [ ] Run tests: `npm test`
- [ ] Test manually in browser
- [ ] Check for edge cases
- [ ] Review code style
- [ ] Ensure no security issues

---

## 🧪 Testing Tips

```typescript
// Test file structure
import { describe, it, expect } from 'vitest';

describe('Feature Name', () => {
  it('should do X when Y', () => {
    // Arrange
    const input = ...;

    // Act
    const result = functionToTest(input);

    // Assert
    expect(result).toBe(expected);
  });
});
```

**Test Categories**:
- **Happy path**: Normal, expected usage
- **Edge cases**: Empty, null, boundary values
- **Error cases**: Invalid inputs, failures

---

## 📊 SM-2 Algorithm Quick Reference

**Variables**:
- `e_factor`: Ease factor (≥1.3) - how hard the card is
- `interval_days`: Days until next review
- `repetition`: Consecutive successful reviews
- `quality`: Your rating (0-5)

**Rules**:
- Quality **≥3**: Card advances (interval increases)
- Quality **<3**: Card resets (interval → 1 day)
- E-factor stays **≥1.3** (minimum difficulty)

**Quality Scale**:
- 0: Complete blackout
- 1: Incorrect, but familiar
- 2: Incorrect, but remembered after seeing answer
- 3: Correct with difficulty
- 4: Correct after hesitation
- 5: Perfect recall

---

## 🗄️ Database Quick Reference

```bash
# Open database
sqlite3 flashcards.db

# List tables
.tables

# View schema
.schema cards

# Query examples
SELECT * FROM decks;
SELECT id, prompt, interval_days, due_at FROM cards LIMIT 10;
SELECT * FROM reviews ORDER BY reviewed_at DESC LIMIT 10;

# Exit
.quit
```

**Tables**:
- `decks`: Containers for cards
- `cards`: Flashcard items with SM-2 state
- `reviews`: History of all responses

---

## 🛠️ Server Actions Pattern

```typescript
// lib/actions.ts
'use server'

export async function myAction(param: string) {
  // This runs on the server!
  const db = getDb();

  // Do database operations
  const result = db.prepare('...').run(param);

  // Revalidate cached data
  revalidatePath('/path');

  return result;
}
```

**Usage in component**:
```typescript
// app/SomeComponent.tsx
import { myAction } from '@/lib/actions';

export function SomeComponent() {
  const handleClick = async () => {
    await myAction('value');
  };

  return <button onClick={handleClick}>Do Action</button>;
}
```

---

## 🎨 Tailwind CSS Common Classes

```
Layout:      flex, grid, container
Spacing:     p-4 (padding), m-2 (margin), space-y-4 (vertical gap)
Text:        text-lg, font-bold, text-center, text-gray-700
Colors:      bg-blue-500, text-white, border-gray-300
Borders:     border, rounded, rounded-lg
Sizing:      w-full, h-screen, max-w-md
Display:     block, hidden, hover:opacity-75
```

[Full Tailwind Docs](https://tailwindcss.com/docs)

---

## 🐛 Common Issues & Fixes

| Issue | Fix |
|-------|-----|
| **Port 3000 in use** | `lsof -ti:3000 \| xargs kill` (Mac/Linux) |
| **Database locked** | Close all connections, restart dev server |
| **Tests fail but code works** | Check async/await, use `await` in tests |
| **Type errors** | Run `npm run build` to see all errors |
| **Git merge conflict** | Ask Claude Code: "Help me resolve this merge conflict" |
| **CI fails** | Check GitHub Actions tab, read error logs |

---

## 📦 Assignment Checklist

### Before Submitting

- [ ] All tests pass: `npm test`
- [ ] Build succeeds: `npm run build`
- [ ] Code is committed with clear messages
- [ ] Pushed to GitHub: `git push origin my-branch`
- [ ] CI pipeline is green ✓
- [ ] Feature works manually (tested in browser)
- [ ] Edge cases tested
- [ ] Code is clean and readable
- [ ] No console errors
- [ ] Reflection paper completed (if required)

---

## 🆘 Getting Help

1. **Check documentation**:
   - [STUDENT_GUIDE.md](STUDENT_GUIDE.md)
   - [DEVELOPMENT.md](DEVELOPMENT.md)

2. **Use Claude Code**:
   ```
   I'm getting this error: [paste error]
   Here's my code: [paste code]
   What's wrong and how do I fix it?
   ```

3. **Search error messages**:
   - Google/Stack Overflow
   - GitHub Issues

4. **Ask a peer**:
   - Pair programming
   - Code review

5. **Office hours**:
   - Bring specific questions
   - Share your screen

---

## 🎯 Week 1 Assignments

1. ✅ **Understanding Summary** - Explain SM-2 and architecture
2. ✅ **Reset Progress** - Add reset button with Server Action
3. ✅ **Statistics** - Show deck stats (total, due, new, completion)
4. ✅ **Search/Filter** - Filter cards by text and status
5. ✅ **Test Coverage** - Achieve >80% coverage
6. ✅ **Property Tests** - Test SM-2 invariants
7. ✅ **Reflection** - 2-3 page paper on experience

---

## 🚀 Week 2 Advanced (Optional)

8. 🔬 **LLM Integration** - Generate cards from text (OpenAI/Claude/Ollama)
9. 📄 **PDF Processing** - Extract text from PDFs → flashcards
10. 📊 **Analytics** - Charts and visualizations (Recharts)
11. 💻 **Interactive Cards** - Code execution or other interactive types
12. 📈 **IRT** - Item Response Theory for question calibration
13. 👥 **Multi-User** - Authentication and user-specific progress
14. 🎨 **Final Project** - Your own creative extension!

---

**Good luck! 🍀**

*For full details, see [STUDENT_GUIDE.md](STUDENT_GUIDE.md)*
