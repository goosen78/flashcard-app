# Assignment: AI-Assisted Development with Flashcard App

**Course**: AI Capstone (CIS XXXX)
**Semester**: Summer 2026
**Instructor**: [Your Name]
**Due Date**: [Date and Time]
**Points**: 100 points

---

## 📋 Overview

In this assignment, you will learn to use **Claude Code** (an AI coding assistant) to understand and extend a flashcard application. You'll practice professional development workflows including version control, testing, and continuous integration while exploring the intersection of AI and educational technology.

**Time Estimate**: 8-10 hours

---

## 🎯 Learning Objectives

By completing this assignment, you will be able to:

1. Use AI coding assistants effectively and responsibly
2. Understand unfamiliar codebases quickly with AI assistance
3. Add features to existing applications while maintaining code quality
4. Write and run automated tests to verify correctness
5. Use Git for version control with proper branching strategies
6. Critically evaluate AI-generated code
7. Explain spaced repetition algorithms and their application in education

---

## 📚 Background

This assignment uses a **spaced repetition flashcard app** built with Next.js, TypeScript, and SQLite. The app implements the **SM-2 algorithm** to optimize when students review flashcards. This technology is based on research showing that AI-generated flashcards can improve exam performance and student engagement (see the *Learn With Martian* paper in the references).

You will use **Claude Code in VS Code** to help you understand the codebase and add new features.

---

## 🚀 Part 0: Setup (Required, Not Graded)

### Prerequisites

- [ ] Node.js 18+ installed
- [ ] Git installed and configured
- [ ] VS Code installed
- [ ] GitHub account created

### Setup Steps

1. **Fork the repository** on GitHub:
   - Go to: [INSERT REPOSITORY URL]
   - Click "Fork" in the top right
   - This creates your own copy

2. **Clone your fork**:
   ```bash
   git clone https://github.com/YOUR_USERNAME/flashcard-app.git
   cd flashcard-app
   ```

3. **Install dependencies**:
   ```bash
   npm install
   ```

4. **Run the app**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser

5. **Run tests**:
   ```bash
   npm test
   ```
   All tests should pass ✓

6. **Install Claude Code**:
   - Open VS Code
   - Go to Extensions (Cmd+Shift+X / Ctrl+Shift+X)
   - Search for "Claude Code"
   - Click "Install"
   - Sign in with Anthropic account (create one if needed)

**✅ Checkpoint**: You should see the flashcard app running and all tests passing.

---

## 📝 Part 1: Understanding the Codebase (10 points)

**Goal**: Understand how the application works without writing code.

### Tasks

1. **Read the documentation**:
   - [ ] [README.md](README.md)
   - [ ] [DEVELOPMENT.md](DEVELOPMENT.md)
   - [ ] [STUDENT_GUIDE.md](STUDENT_GUIDE.md)

2. **Explore the code** in this order:
   - [ ] `db/schema.sql` - What data is stored?
   - [ ] `lib/sm2.ts` - How is scheduling calculated?
   - [ ] `lib/selection.ts` - How are cards chosen?
   - [ ] `app/page.tsx` - What does the home page show?
   - [ ] `app/study/[id]/StudySession.tsx` - How do study sessions work?

3. **Use Claude Code** to understand the system. Ask these questions:

   **Question 1**:
   ```
   Explain how the SM-2 algorithm works in lib/sm2.ts.
   What are the key variables and how do they change based on quality ratings?
   ```

   **Question 2**:
   ```
   Walk me through the flow of data when a user reviews a card.
   Start from the UI button click in StudySession.tsx and trace through
   to the database update.
   ```

   **Question 3**:
   ```
   Explain the card selection algorithm in lib/selection.ts.
   How does it prioritize due cards vs new cards?
   ```

4. **Use the application**:
   - [ ] Create a new deck
   - [ ] Add 5-10 flashcards
   - [ ] Study the cards
   - [ ] Try different quality ratings (0-5)
   - [ ] Observe how `interval_days` changes

### Deliverable

Write a **1-page summary** (PDF or Markdown) answering:

1. What is spaced repetition and why is it effective for learning?
2. Explain the SM-2 algorithm in your own words. How does it decide when to show a card again?
3. What are the three main tables in the database and what do they store?
4. How does the `selectNextCard()` function choose which card to show?

**Grading Criteria**:
- Correct understanding of SM-2 (4 points)
- Accurate description of data model (3 points)
- Clear explanation of card selection (2 points)
- Writing quality and clarity (1 point)

**Submit**: `understanding-summary.pdf` or `understanding-summary.md`

---

## 🔧 Part 2: Feature Implementation (40 points)

**Goal**: Add three features using Claude Code assistance.

### Important: Git Workflow

For each feature:

1. **Create a new branch**:
   ```bash
   git checkout main
   git pull origin main
   git checkout -b feature/FEATURE-NAME
   ```

2. **Make changes** with Claude Code

3. **Commit** with clear messages:
   ```bash
   git add .
   git commit -m "Add FEATURE with AI assistance

   - Describe what was added
   - List key changes
   - Note any challenges"
   ```

4. **Push** to GitHub:
   ```bash
   git push origin feature/FEATURE-NAME
   ```

---

### Feature 1: Reset Card Progress (15 points)

**Requirement**: Add a button to reset a card's learning progress to initial state.

**Specifications**:
- Add a "Reset Progress" button next to each card in the deck management view
- Clicking it resets the card's SM-2 state:
  - `e_factor`: 2.5
  - `interval_days`: 0
  - `repetition`: 0
  - `due_at`: NULL (becomes a "new" card again)
- Show a confirmation dialog before resetting
- Update the UI immediately after reset

**Suggested Claude Code Prompt**:
```
Add a "Reset Progress" button to each card in app/decks/[id]/CardList.tsx.

When clicked:
1. Show a confirmation dialog
2. Call a new Server Action resetCardProgress(cardId) in lib/actions.ts
3. Reset the card's SM-2 state to initial values (e_factor=2.5, interval_days=0, repetition=0, due_at=NULL)
4. Revalidate the page to show updated state

Add the Server Action to lib/actions.ts following the existing pattern.
Include error handling.
```

**Testing**:
- [ ] Button appears next to each card
- [ ] Confirmation dialog shows before reset
- [ ] Card resets to initial state (check database or UI)
- [ ] Card appears as "new" in study mode after reset

**Grading Criteria**:
- Feature works correctly (8 points)
- Code quality and style (4 points)
- Git commit message quality (2 points)
- Error handling (1 point)

---

### Feature 2: Deck Statistics (15 points)

**Requirement**: Display statistics about each deck on the deck management page.

**Specifications**:
- Show at the top of the deck page:
  - **Total cards** in deck
  - **Due cards** (cards that should be reviewed today)
  - **New cards** (never studied)
  - **Completion rate** (percentage of cards with repetition > 0)
- Display in a clean, card-based layout
- Update automatically when cards are added/removed/studied

**Suggested Claude Code Prompt**:
```
Add a statistics section to app/decks/[id]/page.tsx that displays:

1. Total cards in deck
2. Cards due for review (due_at <= now)
3. New cards not yet studied (due_at IS NULL)
4. Completion rate (cards with repetition > 0 / total cards)

Create a new Server Action getDeckStatistics(deckId) in lib/actions.ts
that queries the database and returns these metrics.

Display the statistics in a grid of 4 cards above the card list,
styled with Tailwind CSS to match the existing design.
```

**Testing**:
- [ ] Statistics display correctly for empty deck (0s and 0%)
- [ ] Total increases when cards are added
- [ ] Due count updates after studying
- [ ] Completion rate calculates correctly

**Grading Criteria**:
- All 4 statistics correct (8 points)
- UI design and layout (4 points)
- Updates dynamically (2 points)
- Edge case handling (empty deck) (1 point)

---

### Feature 3: Card Search and Filter (10 points)

**Requirement**: Allow users to search and filter cards in a deck.

**Specifications**:
- Add a search input that filters cards by:
  - Prompt text (case-insensitive)
  - Answer text (case-insensitive)
- Add filter buttons:
  - All cards (default)
  - Due cards only
  - New cards only
- Display count of visible cards
- Filters work together (search + filter button)

**Suggested Claude Code Prompt**:
```
Add search and filter functionality to app/decks/[id]/page.tsx:

1. Add a search input box above the card list
2. Filter cards by prompt or answer text (case-insensitive)
3. Add filter buttons: All | Due | New
4. Show count of visible cards
5. Use React state to manage search term and filter selection
6. Filter cards on the client side (no new Server Actions needed)

Style with Tailwind CSS to match the existing design.
```

**Testing**:
- [ ] Search filters by prompt text
- [ ] Search filters by answer text
- [ ] Search is case-insensitive
- [ ] Filter buttons work (All, Due, New)
- [ ] Search + filter work together
- [ ] Card count updates correctly

**Grading Criteria**:
- Search functionality works (4 points)
- Filter buttons work (3 points)
- UI design (2 points)
- Count display (1 point)

---

## 🧪 Part 3: Testing (30 points)

**Goal**: Write comprehensive tests to verify code correctness.

### Assignment 4: Test Coverage (20 points)

**Requirement**: Write tests for the card selection logic.

**Specifications**:
- Create `tests/selection.test.ts`
- Test the `selectNextCard()` function
- Achieve **>80% coverage** for `lib/selection.ts`
- Cover these scenarios:
  - Returns due cards first (oldest due date first)
  - Returns new cards when no due cards
  - Respects `new_cards_per_day` limit
  - Respects `review_limit_per_day` limit
  - Skips suspended cards
  - Returns `null` when limits reached
  - Handles empty deck

**Suggested Claude Code Prompt**:
```
Write comprehensive tests for lib/selection.ts in a new file tests/selection.test.ts.

Test the selectNextCard() function covering:
1. Returns due cards first, ordered by due_at (oldest first)
2. Returns new cards when no due cards exist
3. Respects new_cards_per_day limit
4. Respects review_limit_per_day limit
5. Skips suspended cards
6. Returns null when daily limits are reached
7. Handles empty deck (returns null)

Use Vitest and follow the testing patterns in tests/sm2.test.ts.
```

**Running Tests**:
```bash
# Watch mode (recommended)
npm run test:ui

# Check coverage
npm run test:coverage
```

**Testing**:
- [ ] All tests pass
- [ ] Coverage >80% for `lib/selection.ts`
- [ ] Tests have clear descriptions
- [ ] Edge cases covered

**Grading Criteria**:
- Test coverage >80% (8 points)
- All scenarios tested (8 points)
- Test quality (clear, meaningful) (3 points)
- Edge case handling (1 point)

---

### Assignment 5: Property-Based Testing (10 points)

**Requirement**: Test SM-2 algorithm invariants with random inputs.

**Specifications**:
- Add tests to `tests/sm2.test.ts`
- Test these invariants:
  1. E-factor is **always ≥1.3** (even after many bad reviews)
  2. Interval **never decreases** for quality ≥3
  3. Interval **resets to 1** for quality <3
  4. Applying SM-2 updates 1000 times with random quality never produces NaN or invalid states

**Suggested Claude Code Prompt**:
```
Add property-based tests to tests/sm2.test.ts that verify SM-2 invariants:

1. Test that e_factor never goes below 1.3, even after 100 quality=0 reviews
2. Test that interval_days never decreases when quality >= 3
3. Test that interval_days resets to 1 when quality < 3
4. Test that applying sm2Update() 1000 times with random quality (0-5)
   never produces NaN, Infinity, or negative values

Generate random quality values using Math.floor(Math.random() * 6).
```

**Testing**:
- [ ] All property tests pass
- [ ] Tests use randomized inputs
- [ ] Invariants are verified

**Grading Criteria**:
- E-factor invariant tested (3 points)
- Interval behavior tested (4 points)
- Stability/validity tested (2 points)
- Test quality (1 point)

---

## 🔄 Part 4: CI/CD (10 points)

**Goal**: Ensure tests run automatically on every push.

### Tasks

1. **Review CI configuration**:
   - Open `.github/workflows/ci.yml`
   - Understand what it does

2. **Trigger CI**:
   - Push any branch to GitHub
   - Go to your repo → "Actions" tab
   - Watch the workflow run

3. **Fix any failures**:
   - If tests fail in CI, fix them locally
   - Commit and push again
   - Verify CI passes ✓

**Testing**:
- [ ] CI runs on every push
- [ ] All checks pass (tests, lint, build)
- [ ] Green checkmark on your commits ✓

**Grading Criteria**:
- CI successfully runs (5 points)
- All checks pass (5 points)

**Deliverable**: GitHub repository URL with passing CI

---

## 📖 Part 5: Reflection (10 points)

**Goal**: Reflect critically on AI-assisted development.

### Deliverable

Write a **2-3 page reflection** (PDF or Markdown) addressing:

1. **AI Effectiveness** (1/2 page):
   - What tasks was Claude Code most helpful for?
   - What tasks did you do better manually?
   - Give specific examples from your experience

2. **Code Verification** (1/2 page):
   - How did you verify that AI-generated code was correct?
   - Describe at least one bug or issue Claude Code introduced
   - How did you catch and fix it?

3. **Learning Experience** (1/2 page):
   - Did Claude Code help you understand the codebase faster? How?
   - What concept(s) did you learn about (SM-2, Server Actions, etc.)?
   - Would you use the flashcard app to study? Why or why not?

4. **Best Practices** (1/2 page):
   - How did Git branching help manage your work?
   - Why is testing important when using AI code generation?
   - What role does CI play in your confidence?

5. **Future Use** (1/2 page):
   - How will you use AI assistants in future projects?
   - What prompting strategies worked best for you?
   - What would you do differently next time?

**Grading Criteria**:
- Depth of reflection (4 points)
- Specific examples and evidence (3 points)
- Critical thinking (2 points)
- Writing quality (1 point)

**Submit**: `reflection.pdf` or `reflection.md`

---

## 📦 Submission Instructions

### What to Submit

Submit via [INSERT SUBMISSION PLATFORM]:

1. **GitHub repository URL** containing:
   - All feature branches pushed
   - Passing CI (green checkmarks)
   - All tests passing

2. **Understanding summary** (Part 1)
   - `understanding-summary.pdf` or `.md`

3. **Reflection paper** (Part 5)
   - `reflection.pdf` or `.md`

### Submission Checklist

Before submitting, verify:

- [ ] All 3 features implemented and working
- [ ] All feature branches pushed to GitHub
- [ ] Tests written and passing (`npm test`)
- [ ] Coverage >80% for selection.ts (`npm run test:coverage`)
- [ ] Build succeeds (`npm run build`)
- [ ] CI pipeline is green ✓
- [ ] Understanding summary completed
- [ ] Reflection paper completed
- [ ] Repository is public or instructor has access

---

## 📊 Grading Summary

| Component | Points |
|-----------|--------|
| **Part 1: Understanding Summary** | 10 |
| **Part 2: Feature 1 - Reset Progress** | 15 |
| **Part 2: Feature 2 - Statistics** | 15 |
| **Part 2: Feature 3 - Search/Filter** | 10 |
| **Part 3: Test Coverage** | 20 |
| **Part 3: Property Tests** | 10 |
| **Part 4: CI/CD** | 10 |
| **Part 5: Reflection** | 10 |
| **Total** | **100** |

### Bonus Points (Up to +15)

- **Code Quality** (+10): Consistent style, clear names, helpful comments
- **Git Hygiene** (+5): Meaningful commits, logical history, good PR descriptions

---

## 🆘 Getting Help

### Resources

1. **Documentation**:
   - [STUDENT_GUIDE.md](STUDENT_GUIDE.md) - Comprehensive guide
   - [DEVELOPMENT.md](DEVELOPMENT.md) - Technical reference
   - [QUICK_REFERENCE.md](QUICK_REFERENCE.md) - Cheat sheet

2. **Claude Code**:
   - Use it! Ask questions when stuck
   - Example: "I'm getting this error: [paste error]. How do I fix it?"

3. **Office Hours**:
   - [INSERT TIMES]
   - Bring specific questions
   - Share your screen

4. **Discussion Forum**:
   - [INSERT LINK]
   - Help each other (but don't share code directly)

### Academic Integrity

**Allowed**:
- ✅ Using Claude Code or other AI assistants
- ✅ Discussing concepts with classmates
- ✅ Asking for help in office hours
- ✅ Searching documentation and Stack Overflow

**Not Allowed**:
- ❌ Copying code from classmates
- ❌ Sharing your solution code with others
- ❌ Submitting AI-generated code you don't understand
- ❌ Copying solutions from the internet

**When in doubt, ask the instructor!**

---

## 📅 Timeline

| Date | Milestone |
|------|-----------|
| [DATE] | Assignment released |
| [DATE] | Part 1 understanding due (early submission for feedback) |
| [DATE] | Features 1-2 recommended completion |
| [DATE] | All parts due by 11:59 PM |

**Late Policy**: [INSERT POLICY]

---

## ❓ FAQ

**Q: Can I use GitHub Copilot instead of Claude Code?**
A: Yes! Any AI assistant is fine. Mention which one you used in your reflection.

**Q: What if Claude Code generates incorrect code?**
A: This is expected! Part of the assignment is learning to verify and fix AI code.

**Q: Can I add more than 3 features?**
A: Yes! Extra features can earn bonus points (with approval).

**Q: What if my CI fails?**
A: Debug it! Check the Actions tab for logs. Ask Claude Code for help.

**Q: How much time should this take?**
A: Approximately 8-10 hours total. Start early!

---

## 🎯 Learning Goals Reminder

This assignment is about learning to **collaborate with AI**, not just complete tasks quickly. Take time to:

- **Understand** what the code does
- **Verify** that AI suggestions are correct
- **Learn** about spaced repetition and web development
- **Reflect** on when AI helps vs. when it doesn't

**Good luck and happy learning! 🚀**

---

*Assignment version 1.0*
*Last updated: [DATE]*
