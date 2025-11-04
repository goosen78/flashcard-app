# Flashcard App - AI Capstone (Summer 2026)

A minimal, elegant flashcard application built with Next.js, TypeScript, and SQLite. This app implements spaced repetition using the SM-2 algorithm and serves as a teaching tool for learning to use AI coding assistants like Claude Code in VS Code.

> **📖 New here?** See the [Documentation Index](DOCUMENTATION_INDEX.md) for a complete guide to all available documentation.

## 🎯 Purpose

This application is designed for the AI Capstone course where students will:
1. Learn to integrate Claude Code into VS Code
2. Use AI assistants to understand and extend an unfamiliar codebase
3. Practice good development habits (separate Git branches, testing, CI/CD)
4. Explore educational use cases of LLMs

## 📚 Documentation

**For Students**:
- **[STUDENT_GUIDE.md](STUDENT_GUIDE.md)** - Comprehensive learning guide with assignments, objectives, and grading rubrics
- **[DEVELOPMENT.md](DEVELOPMENT.md)** - Technical development guide and best practices
- **[IMPLEMENTATION_SUMMARY.md](IMPLEMENTATION_SUMMARY.md)** - Overview of what's been built

**For Instructors**:
- **[INSTRUCTOR_GUIDE.md](INSTRUCTOR_GUIDE.md)** - Teaching strategies, grading rubrics, and course management

## 🏗️ Architecture

### Tech Stack
- **Framework**: Next.js 14+ with App Router and Server Actions
- **Language**: TypeScript
- **Database**: SQLite with better-sqlite3
- **Styling**: Tailwind CSS
- **Testing**: Vitest

### Design Philosophy
- **Less code**: Single repository, unified API/UI, minimal abstractions
- **Pure functions**: SM-2 and selection logic are pure, testable functions
- **Predictable behavior**: Clear invariants, deterministic scheduling
- **Zero incidental complexity**: No auth, no separate backend, no ORM ceremony

### Project Structure

```
flashcard-app/
├── app/                    # Next.js pages and UI components
│   ├── page.tsx           # Home page (deck list)
│   ├── decks/[id]/        # Deck management page
│   └── study/[id]/        # Study session page
├── lib/                    # Core logic (pure functions)
│   ├── sm2.ts             # SM-2 scheduling algorithm
│   ├── selection.ts       # Card selection logic
│   └── actions.ts         # Server Actions (state mutations)
├── db/                     # Database setup
│   ├── schema.sql         # SQLite schema
│   └── index.ts           # Database connection and helpers
├── providers/              # LLM integration (extensible)
│   └── llm.ts             # Provider interface and stub
└── tests/                  # Test suite
    └── sm2.test.ts        # SM-2 algorithm tests
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/goosen78/flashcard-app.git
cd flashcard-app
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Running Tests

```bash
# Run tests once
npm test

# Run tests in watch mode
npm run test:ui

# Run tests with coverage
npm run test:coverage
```

### Building for Production

```bash
npm run build
npm start
```

## 📚 Core Concepts

### Spaced Repetition (SM-2 Algorithm)

The app uses the SuperMemo 2 algorithm to optimize learning:

- **E-factor (Ease)**: Difficulty rating (≥1.3), adjusted based on performance
- **Interval**: Days until next review, increases with successful recalls
- **Repetition**: Number of consecutive successful reviews
- **Quality**: Your rating (0-5) of how well you knew the answer

**Key Invariants:**
- Quality ≥3: Card advances, interval increases
- Quality <3: Card resets to beginning (interval = 1 day)
- E-factor stays ≥1.3 (minimum difficulty)
- Due dates are always floored to day boundaries (UTC)

### Card Selection

The selection algorithm is deterministic:

1. **Priority 1**: Due cards (due_at ≤ now), ordered by due date
2. **Priority 2**: New cards (never studied), ordered by creation date
3. **Respects limits**: 
   - `new_cards_per_day` (default: 20)
   - `review_limit_per_day` (default: 100)

### Database Schema

**Decks**: Containers for cards with study settings
- `id`, `name`, `description`
- `new_cards_per_day`, `review_limit_per_day`
- `release_state` (draft/released)

**Cards**: Individual flashcard items
- `id`, `deck_id`, `type` (basic/mcq/cloze/code)
- `prompt`, `answer`, `source` (manual/generated)
- Scheduling: `e_factor`, `interval_days`, `repetition`, `due_at`
- `suspended`, `version` (for tracking edits)

**Reviews**: Immutable history of student responses
- `id`, `card_id`, `reviewed_at`
- `quality` (0-5), `latency_ms`, `user_answer`
- `grader` (self/llm/none), `correctness`

## 🛠️ Development Workflow

### Using Claude Code in VS Code

1. **Install Claude Code extension** in VS Code
2. **Create a feature branch** for AI-generated code:
   ```bash
   git checkout -b feature/my-feature
   ```
3. **Use Claude Code to**:
   - Explain unfamiliar code: "Explain how the SM-2 algorithm works"
   - Add features: "Add a dark mode toggle to the UI"
   - Write tests: "Write property-based tests for card selection"
   - Refactor: "Extract this logic into a reusable hook"

4. **Review AI changes** before committing
5. **Run tests** to verify behavior:
   ```bash
   npm test
   ```
6. **Create a PR** and merge after review

### Making Changes

All state mutations go through Server Actions in `lib/actions.ts`:

- `createDeck()`, `updateDeck()`, `deleteDeck()`
- `createCard()`, `updateCard()`, `deleteCard()`
- `submitReview()` - atomic: inserts review + updates card scheduling
- `getNextCard()` - selects next card to study

### Adding New Features

**Example: Add a new card type**

1. Update the schema in `db/schema.sql`
2. Add the type to the Card interface in `lib/selection.ts`
3. Update the CreateCardForm component
4. Add rendering logic in StudySession
5. Write tests
6. Run `npm test` to verify

**Example: Add LLM-based question generation**

1. Implement a provider adapter in `providers/` (e.g., `openai.ts`)
2. Add generation UI in deck management page
3. Store generated cards with `source: 'generated'`
4. Add curation workflow (approve/reject)
5. Test with stub provider first

## 🧪 Testing Strategy

### Unit Tests
- SM-2 algorithm: exhaustive coverage of all quality values
- Selection logic: due vs new, suspension, limits
- Helper functions: date handling, validation

### Property-Based Tests
- SM-2 invariants: E-factor bounds, interval monotonicity
- Stability: no NaN or invalid states after random sequences

### Integration Tests
- Server Actions: transactionality, error handling
- Database constraints: foreign keys, uniqueness

### Running Tests

```bash
# Watch mode (recommended during development)
npm run test:ui

# Single run
npm test

# With coverage
npm run test:coverage
```

## 📊 Future Extensions

### M1: LLM Integration
- Implement OpenAI/Anthropic/Ollama adapters
- Add document preprocessing (PDF → text)
- Build curation UI for generated questions
- Style enforcement and quality filters

### M2: Analytics
- Per-deck statistics dashboard
- Item Response Theory (IRT) implementation
- Lapse rate tracking
- Study time analysis

### M3: Advanced Features
- Interactive cards (code execution, visualizations)
- Freeform answer grading with LLM
- Multi-user support with authentication
- LMS integration (Canvas, Moodle)
- Agent frameworks (DSpy, LangChain, Kani)

## 🔧 Configuration

### Environment Variables

Create a `.env.local` file (not committed):

```bash
# Database path (optional, defaults to ./flashcards.db)
DATABASE_PATH=./data/flashcards.db

# LLM Provider API keys (for future use)
OPENAI_API_KEY=your_key_here
ANTHROPIC_API_KEY=your_key_here
```

### Deck Settings

Edit in the UI or directly in the database:
- `new_cards_per_day`: How many new cards to introduce daily
- `review_limit_per_day`: Maximum reviews per day
- `release_state`: 'draft' (editing) or 'released' (studying)

## 🤝 Contributing

This is a teaching tool. Students should:

1. Fork the repository
2. Create a feature branch
3. Make changes with AI assistance
4. Write tests
5. Submit a PR with clear description
6. Ensure CI passes

## 📖 Resources

- [Learn With Martian Paper](https://www.cis.upenn.edu/~ccb/publications/learn-with-martian.pdf) - Research on AI-generated flashcards
- [Net Ninja Claude Code Tutorial](https://www.youtube.com/watch?v=SUysp3sJHbA&list=PL4cUxeGkcC9g4YJeBqChhFJwKQ9TRiivY) - Using Claude Code
- [SuperMemo 2 Algorithm](https://www.supermemo.com/en/archives1990-2015/english/ol/sm2) - Original SM-2 paper
- [Next.js Documentation](https://nextjs.org/docs) - Framework docs
- [Vitest Documentation](https://vitest.dev/) - Testing framework

## 📝 License

ISC License - see LICENSE file for details

## 🎓 Course Information

**AI Capstone (Summer 2026)**  
University of Pennsylvania  
This project teaches practical AI coding assistant usage and educational AI applications.

---

**Happy Learning! 🚀**
