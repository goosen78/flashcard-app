# Student Guide: AI Capstone Flashcard App

## 📚 Course Overview

Welcome to the AI Capstone course! This project is designed to teach you how to effectively use AI coding assistants like Claude Code while building real, production-quality software. You'll learn to extend a flashcard application that implements spaced repetition learning, explore AI integration patterns, and develop best practices for AI-assisted development.

---

## 🎯 Learning Objectives

By the end of this module, you will be able to:

1. **Integrate and use Claude Code** in VS Code effectively
2. **Understand unfamiliar codebases** quickly using AI assistance
3. **Add features** to existing applications with AI guidance
4. **Follow professional development practices**:
   - Git branching strategies
   - Test-driven development
   - Continuous integration (CI/CD)
5. **Implement AI integrations** (LLM APIs, local models)
6. **Design and evaluate** educational technology features
7. **Make data-driven decisions** about AI-generated code

---

## 🗺️ Course Structure

This is a **1-2 week homework exercise** organized into progressive milestones:

### Week 1: Foundations
- **Setup & Understanding** (Days 1-2)
- **First Features** (Days 3-4)
- **Testing & CI** (Days 5-6)
- **Review & Reflection** (Day 7)

### Week 2: Advanced Topics (Optional)
- **AI Integration** (Days 8-10)
- **Analytics & Extensions** (Days 11-13)
- **Final Project** (Day 14)

---

## 📋 Prerequisites

Before you begin, ensure you have:

- [ ] **Node.js 18+** installed ([download here](https://nodejs.org/))
- [ ] **Git** installed and configured
- [ ] **VS Code** installed ([download here](https://code.visualstudio.com/))
- [ ] **Claude Code extension** installed in VS Code
- [ ] Basic knowledge of:
  - JavaScript/TypeScript
  - React fundamentals
  - Git commands
  - Command line basics

---

## 🚀 Getting Started

### Step 1: Fork and Clone the Repository

```bash
# Fork the repository on GitHub (click "Fork" button)
# Then clone your fork:
git clone https://github.com/YOUR_USERNAME/flashcard-app.git
cd flashcard-app
```

### Step 2: Install Dependencies

```bash
npm install
```

### Step 3: Run the Application

```bash
# Start the development server
npm run dev

# Open your browser to http://localhost:3000
```

### Step 4: Run Tests

```bash
# Run tests once
npm test

# Run tests in watch mode (recommended)
npm run test:ui
```

### Step 5: Install Claude Code

1. Open VS Code
2. Go to Extensions (Cmd+Shift+X / Ctrl+Shift+X)
3. Search for "Claude Code"
4. Click "Install"
5. Sign in with your Anthropic account

---

## 📖 Understanding the Codebase

### Architecture at a Glance

```
flashcard-app/
├── app/              # Next.js pages & React components
│   ├── page.tsx      # Home page: list all decks
│   ├── decks/[id]/   # Deck management: view/edit cards
│   └── study/[id]/   # Study session: review cards
├── lib/              # Core business logic (PURE FUNCTIONS)
│   ├── sm2.ts        # Spaced repetition algorithm
│   ├── selection.ts  # Card selection logic
│   └── actions.ts    # Server Actions (state mutations)
├── db/               # Database layer
│   ├── schema.sql    # SQLite table definitions
│   └── index.ts      # Database connection & helpers
├── providers/        # LLM integration (extensible)
│   └── llm.ts        # Provider interface
└── tests/            # Test suite
    └── sm2.test.ts   # Algorithm tests
```

### Key Concepts

#### 1. Spaced Repetition (SM-2 Algorithm)

The app uses the SuperMemo 2 algorithm to optimize when you should review each card:

- **E-factor (Ease)**: How difficult the card is (higher = easier)
- **Interval**: Days until next review (increases with success)
- **Repetition**: Consecutive successful reviews
- **Quality**: Your rating (0-5) of recall quality

**Rule**: Quality ≥3 advances the card; Quality <3 resets it.

#### 2. Pure Functions vs. Side Effects

- **Pure functions** (`lib/sm2.ts`, `lib/selection.ts`):
  - No database access
  - Deterministic (same input → same output)
  - Easy to test

- **Server Actions** (`lib/actions.ts`):
  - Handle all database mutations
  - Marked with `'use server'`
  - Run on the server only

#### 3. Server Actions (Next.js)

```typescript
'use server'

export async function submitReview(cardId: string, quality: number) {
  // This runs on the server!
  // Can access database directly
  // Automatically revalidates cached data
}
```

---

## 🎓 Learning Path

### Phase 1: Understanding (Days 1-2)

**Goal**: Understand how the application works without writing code.

#### Tasks

1. **Read the documentation**:
   - [ ] [README.md](README.md) - Overview and setup
   - [ ] [DEVELOPMENT.md](DEVELOPMENT.md) - Development guide
   - [ ] [IMPLEMENTATION_SUMMARY.md](IMPLEMENTATION_SUMMARY.md) - What's built

2. **Explore the code** (in this order):
   - [ ] `db/schema.sql` - What data is stored?
   - [ ] `lib/sm2.ts` - How is scheduling calculated?
   - [ ] `lib/selection.ts` - How are cards chosen?
   - [ ] `lib/actions.ts` - How is state changed?
   - [ ] `app/page.tsx` - What does the UI look like?
   - [ ] `app/study/[id]/StudySession.tsx` - How do study sessions work?

3. **Use Claude Code to understand**:

   **Prompt 1**:
   ```
   Explain how the SM-2 algorithm works in lib/sm2.ts.
   What are the key variables and how do they change based on quality ratings?
   ```

   **Prompt 2**:
   ```
   Walk me through the flow of data when a user reviews a card.
   Start from the UI button click in StudySession.tsx and trace through to the database update.
   ```

   **Prompt 3**:
   ```
   Explain the card selection algorithm in lib/selection.ts.
   How does it prioritize due cards vs new cards? What are daily limits?
   ```

4. **Run the application**:
   - [ ] Create a new deck
   - [ ] Add 5-10 cards
   - [ ] Study the cards
   - [ ] Try different quality ratings (0-5)
   - [ ] Observe how intervals change

5. **Explore the database**:
   ```bash
   sqlite3 flashcards.db

   # List tables
   .tables

   # View schema
   .schema cards

   # Query data
   SELECT id, prompt, interval_days, due_at FROM cards LIMIT 5;

   # Exit
   .quit
   ```

#### Deliverable

Write a **1-page summary** answering:
- What is spaced repetition and why is it effective?
- How does the SM-2 algorithm work?
- What are the three main tables in the database?
- How does the card selection algorithm choose which card to show?

---

### Phase 2: First Features (Days 3-4)

**Goal**: Add features to the application using Claude Code.

#### Assignment 1: Add a "Reset Progress" Feature

**Requirement**: Add a button to reset a card's learning progress.

**Steps**:

1. **Create a feature branch**:
   ```bash
   git checkout -b feature/reset-card-progress
   ```

2. **Use Claude Code**:
   ```
   Add a "Reset Progress" button to each card in the deck management view.
   When clicked, it should reset the card's SM-2 state to initial values:
   - e_factor: 2.5
   - interval_days: 0
   - repetition: 0
   - due_at: NULL

   Create a new Server Action called resetCardProgress() in lib/actions.ts
   and add the button UI to app/decks/[id]/CardList.tsx.
   ```

3. **Review the changes**:
   - Read the code Claude Code generated
   - Understand each line
   - Ask questions if anything is unclear

4. **Test manually**:
   - Reset a card's progress
   - Verify it appears as a "new" card in study mode
   - Check the database to confirm changes

5. **Write a test**:
   ```
   Write a test in tests/sm2.test.ts that verifies resetCardProgress()
   sets all SM-2 fields to their initial values.
   ```

6. **Commit and push**:
   ```bash
   npm test  # Ensure all tests pass
   git add .
   git commit -m "Add reset card progress feature with AI assistance"
   git push origin feature/reset-card-progress
   ```

#### Assignment 2: Add Statistics Dashboard

**Requirement**: Show deck statistics (total cards, due cards, new cards, completion rate).

**Use Claude Code**:
```
Add a statistics section to the deck management page (app/decks/[id]/page.tsx)
that displays:
- Total cards in deck
- Cards due for review today
- New cards not yet studied
- Completion rate (cards with repetition > 0)

Fetch this data using a new Server Action called getDeckStatistics().
Display it in a clean, card-based layout above the card list.
```

**Test checklist**:
- [ ] Statistics update when cards are added
- [ ] Due count updates after studying
- [ ] New count decreases after first review
- [ ] Completion rate is accurate

#### Assignment 3: Add Card Search/Filter

**Requirement**: Allow users to search and filter cards in a deck.

**Use Claude Code**:
```
Add a search bar to the deck management page that filters cards by:
- Prompt text (case-insensitive)
- Answer text (case-insensitive)

Also add filter buttons for:
- All cards
- Due cards only
- New cards only
- Suspended cards only

Implement the UI in app/decks/[id]/page.tsx using React state
for the search term and filter selection. Filter cards on the client side.
```

---

### Phase 3: Testing & Best Practices (Days 5-6)

**Goal**: Learn professional testing and CI/CD practices.

#### Assignment 4: Write Comprehensive Tests

**Requirement**: Achieve >80% test coverage for `lib/selection.ts`.

**Steps**:

1. **Check current coverage**:
   ```bash
   npm run test:coverage
   ```

2. **Use Claude Code**:
   ```
   Write comprehensive tests for lib/selection.ts covering:

   1. selectNextCard():
      - Returns due cards first (oldest first)
      - Returns new cards when no due cards
      - Respects new_cards_per_day limit
      - Respects review_limit_per_day limit
      - Skips suspended cards
      - Returns null when limits reached

   2. Edge cases:
      - Empty deck
      - All cards suspended
      - Exactly at limit
      - Mixed due and new cards

   Create the file tests/selection.test.ts with these test cases.
   ```

3. **Review and understand** each test case

4. **Run tests**:
   ```bash
   npm run test:ui
   ```

5. **Fix any failing tests** with Claude Code's help

#### Assignment 5: Add Property-Based Tests

**Requirement**: Test SM-2 invariants with random inputs.

**Use Claude Code**:
```
Add property-based tests to tests/sm2.test.ts that verify:

1. E-factor is always >= 1.3 (even after many quality=0 reviews)
2. Interval never decreases for quality >= 3
3. Interval resets to 1 for quality < 3
4. Applying sm2Update() 1000 times with random quality values
   never produces NaN or invalid states

You can generate random quality values (0-5) in the test loops.
```

#### Assignment 6: Set Up GitHub Actions CI

**Requirement**: Ensure tests run on every push.

**Already set up!** Check `.github/workflows/ci.yml`:

1. **Trigger the workflow**:
   ```bash
   git push origin your-branch
   ```

2. **View results** on GitHub:
   - Go to your repo → "Actions" tab
   - Click on your commit
   - Verify all checks pass ✓

3. **Fix any CI failures** using Claude Code

---

### Phase 4: Reflection (Day 7)

**Goal**: Reflect on your learning and AI-assisted development.

#### Reflection Questions

Write a **2-3 page reflection** addressing:

1. **Claude Code Effectiveness**:
   - What tasks was Claude Code most helpful for?
   - What tasks did you do better manually?
   - How did you verify AI-generated code?

2. **Code Quality**:
   - How did you ensure AI code was correct?
   - What bugs did Claude Code introduce?
   - How did tests help catch issues?

3. **Learning Process**:
   - Did Claude Code help you understand the codebase faster?
   - What concepts were clarified by AI explanations?
   - What did you learn about spaced repetition?

4. **Best Practices**:
   - How did branching help manage changes?
   - Why is testing important for AI code?
   - What role does CI play in confidence?

5. **Future Use**:
   - How will you use AI assistants in future projects?
   - What prompting strategies worked best?
   - What would you do differently?

---

## 🚀 Advanced Topics (Week 2 - Optional)

### Assignment 7: LLM Integration - Generate Flashcards

**Requirement**: Implement AI-generated flashcards from text input.

**Choose one provider**:
- OpenAI GPT-4
- Anthropic Claude
- Ollama (local)

**Steps**:

1. **Create provider adapter**:
   ```
   Create a new file providers/openai.ts (or anthropic.ts, or ollama.ts)
   that implements the LLMProvider interface from providers/llm.ts.

   The generateQuestions() method should:
   1. Accept input text (e.g., lecture notes)
   2. Send to the LLM API with a prompt like:
      "Generate 5 flashcards from this text. Return JSON array with
       {type, prompt, answer} objects."
   3. Parse the response
   4. Return CandidateCard[] array

   Add error handling and validation.
   ```

2. **Add generation UI**:
   ```
   Add a "Generate Cards" section to app/decks/[id]/page.tsx:
   - Textarea for input text
   - Dropdown to select card type (basic/mcq/cloze)
   - Button to trigger generation
   - Preview area for generated cards
   - Approve/Edit/Reject buttons for each card

   Only save approved cards to the database with source='generated'.
   ```

3. **Add environment variables**:
   ```bash
   # .env.local
   OPENAI_API_KEY=your_key_here
   # or
   ANTHROPIC_API_KEY=your_key_here
   ```

4. **Test with real content**:
   - Paste a paragraph from a textbook
   - Generate cards
   - Review quality
   - Iterate on the prompt

**Deliverable**: Write a 1-page report:
- Which provider did you choose and why?
- How did you design the prompt?
- What quality issues did you encounter?
- How did you address hallucinations?

---

### Assignment 8: Document Preprocessing - PDF to Cards

**Requirement**: Extract text from PDFs and generate flashcards.

**Steps**:

1. **Install PDF parser**:
   ```bash
   npm install pdf-parse
   ```

2. **Use Claude Code**:
   ```
   Create a new file lib/pdf-processor.ts that:

   1. Accepts a PDF file buffer
   2. Extracts text using pdf-parse
   3. Chunks text into logical sections (by heading or paragraph)
   4. Returns array of text chunks

   Add types and error handling.
   ```

3. **Add upload UI**:
   ```
   Add a file upload button to the deck management page:
   - Accept PDF files only
   - Show upload progress
   - Process PDF on upload
   - Pass chunks to LLM for card generation
   - Display preview of generated cards
   ```

4. **Test with real PDFs**:
   - Use a textbook chapter or lecture slides
   - Upload and process
   - Review generated cards
   - Measure processing time

---

### Assignment 9: Analytics Dashboard

**Requirement**: Implement learning analytics with charts.

**Steps**:

1. **Install chart library**:
   ```bash
   npm install recharts
   ```

2. **Use Claude Code**:
   ```
   Create a new page app/decks/[id]/analytics/page.tsx that displays:

   1. Review history chart (reviews per day over last 30 days)
   2. Card difficulty distribution (histogram of E-factors)
   3. Interval distribution (how many cards at each interval)
   4. Average quality rating over time
   5. Study time estimates

   Fetch data using new Server Actions:
   - getReviewHistory(deckId, days)
   - getCardDistributions(deckId)

   Use Recharts for visualizations.
   ```

3. **Add navigation link** from deck page to analytics

---

### Assignment 10: Interactive Card Types

**Requirement**: Create an interactive code execution card.

**Steps**:

1. **Use Claude Code**:
   ```
   Add support for a new card type: 'code_execution'

   Cards of this type should:
   - Show a coding prompt
   - Provide a code editor (textarea)
   - Have a "Run Code" button
   - Execute JavaScript code in a sandboxed environment
   - Compare output to expected answer
   - Auto-grade (correct/incorrect)

   Update:
   - db/schema.sql (add to card_type enum)
   - lib/selection.ts (add CodeExecutionCard type)
   - app/study/[id]/StudySession.tsx (add rendering)
   - app/decks/[id]/CreateCardForm.tsx (add form option)
   ```

2. **Security consideration**:
   ```
   How can you safely execute user code?
   - Option 1: Use eval() with try-catch (limited safety)
   - Option 2: Use Web Workers
   - Option 3: Server-side sandboxing (vm2 or similar)

   Discuss trade-offs in your submission.
   ```

3. **Test with coding challenges**:
   - "Write a function that returns the sum of an array"
   - "Implement FizzBuzz"
   - "Reverse a string"

---

### Assignment 11: Implement Item Response Theory (IRT)

**Requirement**: Add question difficulty calibration using IRT.

**Background**: IRT models estimate:
- **Item difficulty**: How hard is each question?
- **Student ability**: How skilled is each student?
- **Discrimination**: How well does the question differentiate students?

**Steps**:

1. **Research IRT**:
   - Read about the 2-parameter logistic model (2PL)
   - Understand parameter estimation

2. **Use Claude Code**:
   ```
   Create lib/irt.ts that implements:

   1. estimateItemDifficulty(reviews: Review[]): number
      - Uses response data to estimate difficulty
      - Returns difficulty parameter (b)

   2. estimateDiscrimination(reviews: Review[]): number
      - Estimates how well item differentiates ability
      - Returns discrimination parameter (a)

   3. predictProbability(ability, difficulty, discrimination): number
      - 2PL model: P(correct) = 1 / (1 + exp(-a*(ability - b)))

   Add these as new columns in the cards table:
   - difficulty (default: 0)
   - discrimination (default: 1)

   Update after every N reviews (e.g., N=10).
   ```

3. **Visualize in analytics**:
   - Plot difficulty vs. success rate
   - Show which cards need revision

**Deliverable**: Explain IRT in a 2-page report with examples.

---

### Assignment 12: Multi-User Support

**Requirement**: Add authentication and user-specific progress.

**Steps**:

1. **Choose auth provider**:
   - NextAuth.js with GitHub OAuth
   - Clerk
   - Supabase Auth

2. **Update schema**:
   ```sql
   CREATE TABLE users (
     id TEXT PRIMARY KEY,
     email TEXT NOT NULL UNIQUE,
     name TEXT,
     created_at INTEGER NOT NULL
   );

   -- Add user_id to cards table
   ALTER TABLE cards ADD COLUMN user_id TEXT REFERENCES users(id);

   -- Separate user progress from card definition
   CREATE TABLE user_card_progress (
     id TEXT PRIMARY KEY,
     user_id TEXT NOT NULL REFERENCES users(id),
     card_id TEXT NOT NULL REFERENCES cards(id),
     e_factor REAL NOT NULL DEFAULT 2.5,
     interval_days INTEGER NOT NULL DEFAULT 0,
     repetition INTEGER NOT NULL DEFAULT 0,
     due_at INTEGER,
     UNIQUE(user_id, card_id)
   );
   ```

3. **Use Claude Code**:
   ```
   1. Install and configure NextAuth.js
   2. Add login/logout UI
   3. Update Server Actions to filter by current user
   4. Migrate existing data to a default user
   5. Add user profile page
   ```

---

## 🎯 Final Project: Build Your Own Extension

**Requirement**: Design and implement a unique feature.

### Ideas

1. **Gamification**:
   - XP points and levels
   - Achievement badges
   - Streak tracking
   - Leaderboards (if multi-user)

2. **Collaborative Decks**:
   - Share decks with other users
   - Community ratings
   - Upvote/downvote cards

3. **Mobile App**:
   - React Native version
   - Sync with web app
   - Offline support

4. **Browser Extension**:
   - Create cards from selected text
   - Quick-add to deck
   - Review notifications

5. **Advanced Scheduling**:
   - Implement Anki's FSRS algorithm
   - A/B test SM-2 vs FSRS
   - Personalized difficulty adjustments

6. **Content Sources**:
   - Import from Quizlet
   - Scrape Wikipedia
   - YouTube transcript → cards
   - Podcast notes → cards

### Requirements

1. **Proposal** (1 page):
   - What problem does it solve?
   - Who is the target user?
   - What's the implementation plan?

2. **Implementation**:
   - Use Claude Code for development
   - Write tests
   - Document your code

3. **Demo Video** (3-5 minutes):
   - Show the feature in action
   - Explain key design decisions
   - Discuss challenges

4. **Reflection** (2-3 pages):
   - How did Claude Code help?
   - What did you learn?
   - What would you improve?

---

## 🛠️ Tips for Success

### Working with Claude Code

**DO**:
- ✅ Be specific in your prompts
- ✅ Reference exact file paths and function names
- ✅ Ask for tests along with features
- ✅ Request explanations when confused
- ✅ Iterate on responses that aren't quite right
- ✅ Review all generated code carefully

**DON'T**:
- ❌ Blindly copy-paste AI code without understanding
- ❌ Skip writing tests because AI generates them
- ❌ Trust AI for security-critical code without review
- ❌ Use vague prompts like "make it better"
- ❌ Commit code that doesn't pass tests
- ❌ Forget to check for edge cases

### Effective Prompting

**Bad Prompt**:
```
Add a feature to the app
```

**Good Prompt**:
```
Add a "favorite cards" feature to app/decks/[id]/page.tsx:

1. Add a star icon button next to each card
2. Create a Server Action toggleCardFavorite(cardId) in lib/actions.ts
3. Add a 'favorite' boolean column to the cards table schema
4. Add a filter button to show only favorites
5. Style favorited cards with a yellow star
6. Write tests for the toggle action

Ensure the implementation follows the existing code patterns.
```

### Testing Strategy

1. **Write tests FIRST** (or ask AI to):
   ```
   Before implementing X, write tests that define the expected behavior
   ```

2. **Run tests frequently**:
   ```bash
   npm run test:ui  # Leave this running in a terminal
   ```

3. **Check coverage**:
   ```bash
   npm run test:coverage
   ```

4. **Test edge cases**:
   - Empty states
   - Boundary values
   - Invalid inputs
   - Concurrent operations

### Git Best Practices

1. **One feature per branch**:
   ```bash
   git checkout -b feature/specific-feature-name
   ```

2. **Commit often** with clear messages:
   ```bash
   git commit -m "Add reset card progress feature

   - Create resetCardProgress() Server Action
   - Add reset button to CardList component
   - Add test coverage for reset functionality
   - Update database transaction handling"
   ```

3. **Pull before push**:
   ```bash
   git pull origin main
   git push origin feature/your-feature
   ```

4. **Use pull requests** for code review

### Debugging

1. **Use console.log** strategically:
   ```typescript
   console.log('Card state:', card);
   console.log('Quality rating:', quality);
   ```

2. **Check the browser console** for client errors

3. **Check the terminal** for server errors (Server Actions)

4. **Use the React DevTools** extension

5. **Ask Claude Code**:
   ```
   I'm getting this error: [paste error]
   Here's my code: [paste relevant code]
   What's causing this and how do I fix it?
   ```

---

## 📊 Grading Rubric

### Week 1 Assignments (70%)

| Component | Points | Criteria |
|-----------|--------|----------|
| Understanding Summary | 10 | Demonstrates comprehension of SM-2, architecture, data flow |
| Assignment 1: Reset Progress | 10 | Feature works correctly, code is clean, tests pass |
| Assignment 2: Statistics | 10 | Accurate calculations, good UI, handles edge cases |
| Assignment 3: Search/Filter | 10 | Filters work correctly, good UX, responsive |
| Assignment 4: Test Coverage | 10 | >80% coverage, meaningful tests, edge cases |
| Assignment 5: Property Tests | 10 | Tests invariants, finds bugs, good randomization |
| Reflection Paper | 10 | Thoughtful analysis, specific examples, insights |

### Week 2 Advanced Topics (30%)

| Component | Points | Criteria |
|-----------|--------|----------|
| LLM Integration OR PDF Processing | 15 | Works reliably, handles errors, good prompts |
| Analytics OR Interactive Cards OR IRT | 10 | Implemented correctly, useful visualizations/features |
| Final Project OR Multi-User | 5 | Creative, well-documented, demonstrates learning |

### Code Quality (Bonus +10%)

- Consistent style
- Clear variable names
- Helpful comments
- No unused code
- Follows existing patterns

### Git Hygiene (Bonus +5%)

- Meaningful commit messages
- Logical commits (not "fixed stuff")
- Clean branch history
- Pull requests with descriptions

---

## 📚 Resources

### Documentation
- [Next.js Docs](https://nextjs.org/docs)
- [React Docs](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Vitest Docs](https://vitest.dev/)
- [SQLite Docs](https://www.sqlite.org/docs.html)

### Spaced Repetition
- [SuperMemo 2 Algorithm](https://www.supermemo.com/en/archives1990-2015/english/ol/sm2)
- [Learn With Martian Paper](https://www.cis.upenn.edu/~ccb/publications/learn-with-martian.pdf)
- [Anki's FSRS Algorithm](https://github.com/open-spaced-repetition/fsrs4anki)

### AI Assistants
- [Claude Code Tutorial (Net Ninja)](https://www.youtube.com/watch?v=SUysp3sJHbA&list=PL4cUxeGkcC9g4YJeBqChhFJwKQ9TRiivY)
- [OpenAI API Docs](https://platform.openai.com/docs)
- [Anthropic API Docs](https://docs.anthropic.com/)
- [Ollama Docs](https://github.com/ollama/ollama)

### Testing
- [Testing Library Docs](https://testing-library.com/)
- [Property-Based Testing Guide](https://hypothesis.works/articles/what-is-property-based-testing/)

---

## ❓ FAQ

### Q: Can I use other AI assistants besides Claude Code?

**A**: Yes! GitHub Copilot, ChatGPT, or others are fine. However, the course focuses on Claude Code, so document your experience with the tool you choose.

### Q: What if Claude Code generates incorrect code?

**A**: This is expected! Part of the learning is recognizing and fixing AI errors. Always:
1. Read and understand generated code
2. Run tests
3. Test manually
4. Ask follow-up questions to Claude Code

### Q: How much code should I write myself vs. AI?

**A**: There's no fixed ratio. Use AI as a **learning tool** and **productivity booster**, not a replacement for understanding. If you can't explain what the code does, you're over-relying on AI.

### Q: Can I work with a partner?

**A**: Check with your instructor. If allowed, clearly document who contributed what.

### Q: What if I want to use a different database?

**A**: Advanced students can migrate to PostgreSQL or MySQL, but SQLite is sufficient for learning.

### Q: How do I deploy this app?

**A**: Try [Vercel](https://vercel.com/) (easiest for Next.js) or [Railway](https://railway.app/). You'll need to configure the database for production.

### Q: The app is slow with 10,000+ cards. How do I optimize?

**A**: Great problem to explore! Try:
- Database indexes (already added)
- Pagination
- Virtual scrolling
- Caching strategies

---

## 🎉 Conclusion

This course is about learning to **collaborate with AI** effectively. You'll discover:

- When AI excels (boilerplate, tests, explanations)
- When humans excel (architecture, trade-offs, creativity)
- How to verify AI output
- How to learn faster with AI tutoring

**Remember**: The goal isn't to complete assignments as fast as possible. It's to **learn deeply** about software engineering, educational technology, and AI-assisted development.

Take your time. Experiment. Break things. Ask questions.

**Happy learning! 🚀**

---

## 📧 Getting Help

- **Technical issues**: Open a GitHub issue
- **Conceptual questions**: Use Claude Code or ask your instructor
- **Course logistics**: Contact your TA or instructor

**Office Hours**: [Insert schedule]

**Discussion Forum**: [Insert link]

---

**Built with ❤️ for AI Capstone (Summer 2026)**
*University of Pennsylvania*
