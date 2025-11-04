# Testing Strategy Guide

## Overview

This guide explains the testing strategy for the Flashcard App and provides guidance on how to write effective tests for your features. Testing is a critical part of software development that helps ensure code quality, catch bugs early, and provide confidence when refactoring.

## Table of Contents

- [Why Test?](#why-test)
- [Testing Pyramid](#testing-pyramid)
- [Current Test Coverage](#current-test-coverage)
- [Writing New Tests](#writing-new-tests)
- [Running Tests](#running-tests)
- [Best Practices](#best-practices)
- [Common Testing Patterns](#common-testing-patterns)
- [For Students](#for-students)

---

## Why Test?

### Benefits of Automated Testing

1. **Catch Bugs Early**: Tests run automatically and catch issues before they reach users
2. **Confidence to Refactor**: Change code safely knowing tests will catch breaking changes
3. **Documentation**: Tests show how code should be used
4. **Faster Development**: Automated testing is faster than manual testing
5. **Regression Prevention**: Ensure old bugs don't come back

### Cost vs. Benefit

Not all code needs the same level of testing:
- **High Value**: Core algorithms (SM-2), data integrity, user-facing features
- **Medium Value**: UI components, API endpoints
- **Low Value**: Simple getters/setters, configuration files

---

## Testing Pyramid

The testing pyramid shows the ideal distribution of test types:

```
     /\
    /  \      E2E Tests (Few)
   /    \     - Full user workflows
  /------\    - Slowest, most expensive
 /        \
/  Tests   \  Integration Tests (Some)
|  Pyramid |  - Multiple units working together
|          |  - Database + API + UI
|----------|
|          |  Unit Tests (Many)
|          |  - Individual functions/components
|          |  - Fast, focused, many
└──────────┘
```

### Test Types

#### 1. Unit Tests (Foundation)

Test individual functions or components in isolation.

**Example**: [tests/sm2.test.ts](../tests/sm2.test.ts)

```typescript
it('should calculate correct interval for first review', () => {
  const state = getInitialCardState();
  const result = sm2Update(state, 4);
  expect(result.interval_days).toBe(1);
});
```

**Characteristics**:
- Fast (milliseconds)
- Focused on one piece of logic
- No external dependencies
- Many tests for edge cases

#### 2. Integration Tests

Test how multiple units work together.

**Example**: Testing database operations with real SQLite

```typescript
it('should create deck and add cards', () => {
  const deck = createDeck('Test Deck');
  const card = createCard(deck.id, { prompt: 'Q?', answer: 'A!' });
  expect(getCardsForDeck(deck.id)).toHaveLength(1);
});
```

**Characteristics**:
- Slower (tens to hundreds of milliseconds)
- Test interactions between components
- May use real database or APIs
- Fewer tests, focus on happy paths

#### 3. Component Tests

Test React components with user interactions.

**Example**: [tests/components.test.tsx](../tests/components.test.tsx)

```typescript
it('should submit form when user enters deck name', async () => {
  render(<CreateDeckForm />);
  fireEvent.click(screen.getByText('+ Create New Deck'));
  fireEvent.change(screen.getByLabelText(/Deck Name/), {
    target: { value: 'My Deck' }
  });
  fireEvent.click(screen.getByText('Create Deck'));
  await waitFor(() => {
    expect(createDeck).toHaveBeenCalled();
  });
});
```

**Characteristics**:
- Test from user's perspective
- Verify UI behavior
- Use mocks for server actions
- Check accessibility

#### 4. E2E Tests (Not Yet Implemented)

Test complete user workflows from start to finish.

**Example** (Future):
```typescript
test('user can study flashcards', async ({ page }) => {
  await page.goto('/');
  await page.click('text=Create New Deck');
  await page.fill('#name', 'JavaScript Basics');
  await page.click('text=Create Deck');
  // ... continue testing full workflow
});
```

**Characteristics**:
- Slowest (seconds)
- Test real browser interactions
- Catch integration issues
- Fewest tests, critical paths only

---

## Current Test Coverage

### What's Tested

| Component | Coverage | Test File | Notes |
|-----------|----------|-----------|-------|
| SM-2 Algorithm | ✅ High | `tests/sm2.test.ts` | 30 tests, all edge cases |
| UI Components | ✅ Good | `tests/components.test.tsx` | 18 tests for forms |
| Database Layer | ⚠️ Manual | - | Test manually or with Postman |
| API Actions | ⚠️ Manual | - | Integration tests needed |
| Study Session | ❌ None | - | Good candidate for E2E tests |

### Running Coverage Reports

```bash
npm test -- --coverage
```

This generates a coverage report showing which lines of code are tested:

```
File                    | % Stmts | % Branch | % Funcs | % Lines |
------------------------|---------|----------|---------|---------|
lib/sm2.ts             | 100.00  | 100.00   | 100.00  | 100.00  |
app/CreateDeckForm.tsx | 85.00   | 75.00    | 83.33   | 85.00   |
```

**Goal**: Aim for >80% coverage on critical code paths.

---

## Writing New Tests

### Step 1: Identify What to Test

Ask these questions:
1. What is the expected behavior?
2. What are the edge cases?
3. What could go wrong?
4. How will users interact with this?

### Step 2: Choose Test Type

- **Algorithm or pure function** → Unit test
- **React component** → Component test
- **Database + API interaction** → Integration test
- **Complete user workflow** → E2E test

### Step 3: Write the Test

Follow the **AAA pattern**:

```typescript
it('should do something', () => {
  // Arrange: Set up test data
  const input = { value: 5 };

  // Act: Execute the code
  const result = myFunction(input);

  // Assert: Verify the outcome
  expect(result).toBe(25);
});
```

### Step 4: Make It Fail

Run the test to ensure it fails first (if writing new code). This verifies the test actually tests something.

### Step 5: Make It Pass

Implement the feature until the test passes.

### Step 6: Refactor

Clean up code while keeping tests green.

---

## Running Tests

### Basic Commands

```bash
# Run all tests
npm test

# Run tests once (no watch mode)
npm test -- --run

# Run tests with coverage
npm test -- --coverage

# Run tests in UI mode (interactive)
npm run test:ui

# Run specific test file
npm test -- tests/sm2.test.ts

# Run tests matching a pattern
npm test -- --grep="SM-2"
```

### Watch Mode

By default, `npm test` runs in watch mode:
- Automatically re-runs tests when files change
- Only runs tests related to changed files
- Press `a` to run all tests
- Press `f` to run only failed tests
- Press `q` to quit

---

## Best Practices

### 1. Test Behavior, Not Implementation

**❌ Bad** (tests implementation):
```typescript
it('should call setName', () => {
  const spy = vi.spyOn(component, 'setName');
  component.handleChange('New Name');
  expect(spy).toHaveBeenCalled();
});
```

**✅ Good** (tests behavior):
```typescript
it('should update name when user types', () => {
  render(<CreateDeckForm />);
  const input = screen.getByLabelText(/Deck Name/);
  fireEvent.change(input, { target: { value: 'New Name' } });
  expect(input).toHaveValue('New Name');
});
```

### 2. Keep Tests Independent

Each test should be able to run independently:

**❌ Bad**:
```typescript
let sharedState = {};

it('test 1', () => {
  sharedState.value = 5; // Modifies shared state
});

it('test 2', () => {
  expect(sharedState.value).toBe(5); // Depends on test 1
});
```

**✅ Good**:
```typescript
it('test 1', () => {
  const state = { value: 5 };
  expect(state.value).toBe(5);
});

it('test 2', () => {
  const state = { value: 5 };
  expect(state.value).toBe(5);
});
```

### 3. Use Descriptive Test Names

**❌ Bad**:
```typescript
it('works', () => { ... });
it('test 1', () => { ... });
```

**✅ Good**:
```typescript
it('should return null when deck has no cards', () => { ... });
it('should increase interval on high quality review', () => { ... });
```

### 4. Test Edge Cases

Don't just test the happy path:

```typescript
describe('sm2Update', () => {
  it('should handle quality = 0', () => { ... });
  it('should handle quality = 5', () => { ... });
  it('should throw error for quality < 0', () => { ... });
  it('should throw error for quality > 5', () => { ... });
  it('should enforce minimum e_factor of 1.3', () => { ... });
});
```

### 5. Use Setup and Teardown

```typescript
describe('MyComponent', () => {
  let component;

  beforeEach(() => {
    // Run before each test
    component = createComponent();
  });

  afterEach(() => {
    // Run after each test
    component.destroy();
  });

  it('test 1', () => { ... });
  it('test 2', () => { ... });
});
```

### 6. Mock External Dependencies

When testing a component, mock its dependencies:

```typescript
vi.mock('@/lib/actions', () => ({
  createDeck: vi.fn(),
  createCard: vi.fn(),
}));

it('should call createDeck with correct params', async () => {
  const { createDeck } = await import('@/lib/actions');
  createDeck.mockResolvedValue({ success: true });

  // ... test code
});
```

---

## Common Testing Patterns

### Pattern 1: Testing Async Functions

```typescript
it('should submit review successfully', async () => {
  const result = await submitReview(cardId, 4);
  expect(result.success).toBe(true);
});

// Or with waitFor
it('should show success message', async () => {
  render(<MyComponent />);
  fireEvent.click(screen.getByText('Submit'));

  await waitFor(() => {
    expect(screen.getByText('Success!')).toBeInTheDocument();
  });
});
```

### Pattern 2: Testing Error Handling

```typescript
it('should display error message on failure', async () => {
  const { createDeck } = await import('@/lib/actions');
  createDeck.mockResolvedValue({
    success: false,
    error: 'Deck already exists'
  });

  render(<CreateDeckForm />);
  // ... fill form ...
  fireEvent.click(screen.getByText('Create Deck'));

  await waitFor(() => {
    expect(screen.getByText('Deck already exists')).toBeInTheDocument();
  });
});
```

### Pattern 3: Testing User Interactions

```typescript
it('should toggle form visibility', () => {
  render(<CreateDeckForm />);

  // Initially closed
  expect(screen.queryByLabelText(/Deck Name/)).not.toBeInTheDocument();

  // Click to open
  fireEvent.click(screen.getByText('+ Create New Deck'));
  expect(screen.getByLabelText(/Deck Name/)).toBeInTheDocument();

  // Click to close
  fireEvent.click(screen.getByText('Cancel'));
  expect(screen.queryByLabelText(/Deck Name/)).not.toBeInTheDocument();
});
```

### Pattern 4: Testing Form Validation

```typescript
it('should require deck name', () => {
  render(<CreateDeckForm />);
  fireEvent.click(screen.getByText('+ Create New Deck'));

  const input = screen.getByLabelText(/Deck Name/);
  expect(input).toHaveAttribute('required');
});
```

### Pattern 5: Testing with Multiple Scenarios

```typescript
describe.each([
  { quality: 0, expectedInterval: 1 },
  { quality: 3, expectedInterval: 1 },
  { quality: 5, expectedInterval: 1 },
])('SM-2 first review with quality $quality', ({ quality, expectedInterval }) => {
  it(`should set interval to ${expectedInterval}`, () => {
    const state = getInitialCardState();
    const result = sm2Update(state, quality);
    expect(result.interval_days).toBe(expectedInterval);
  });
});
```

---

## For Students

### Learning Objectives

By working with tests in this project, you'll learn:

1. **Test-Driven Development (TDD)**: Write tests before code
2. **Regression Testing**: Ensure fixes don't break existing features
3. **Mocking**: Isolate code under test from dependencies
4. **Coverage Analysis**: Measure and improve test coverage
5. **CI Integration**: Automatic testing on every commit

### Exercises

#### Exercise 1: Add a Test for Existing Code

1. Pick a function in `lib/selection.ts`
2. Create a new test file or add to existing one
3. Write tests for happy path and edge cases
4. Run tests: `npm test`
5. Check coverage: `npm test -- --coverage`

**Example**:
```typescript
describe('getDeckStats', () => {
  it('should return correct stats for deck with cards', () => {
    // Your test here
  });

  it('should handle empty deck', () => {
    // Your test here
  });
});
```

#### Exercise 2: Test-Driven Development

1. Choose a new feature to add (e.g., "tag cards")
2. Write a failing test first
3. Run test and see it fail
4. Implement the feature
5. Run test and see it pass
6. Refactor if needed

**Example**:
```typescript
// 1. Write test first (will fail)
it('should filter cards by tag', () => {
  const cards = [
    { id: '1', tags: ['math'] },
    { id: '2', tags: ['science'] },
  ];
  const filtered = filterByTag(cards, 'math');
  expect(filtered).toHaveLength(1);
});

// 2. Implement filterByTag function
// 3. Test passes!
```

#### Exercise 3: Improve Coverage

1. Run coverage report: `npm test -- --coverage`
2. Find a file with <80% coverage
3. Look at uncovered lines (shown in report)
4. Write tests to cover those lines
5. Re-run coverage to verify improvement

#### Exercise 4: Test AI-Generated Code

1. Use Claude Code to add a feature
2. Before accepting the code, write tests for it
3. Run tests to verify the AI code works correctly
4. If tests fail, ask Claude Code to fix the implementation
5. Iterate until tests pass

**What you'll learn**: How to validate AI-generated code safely

### Common Mistakes to Avoid

1. **Not running tests after changes**: Always run `npm test` before committing
2. **Testing implementation details**: Focus on behavior users care about
3. **Overly complex setup**: Keep tests simple and readable
4. **Ignoring failed tests**: Fix or update tests immediately
5. **100% coverage obsession**: Focus on valuable tests, not just numbers

---

## Advanced Topics

### Integration Testing with Real Database

For more advanced integration tests:

```typescript
import Database from 'better-sqlite3';

describe('Database Integration', () => {
  let db: Database.Database;

  beforeEach(() => {
    // Create test database
    db = new Database(':memory:');
    db.exec(readFileSync('db/schema.sql', 'utf-8'));
  });

  afterEach(() => {
    db.close();
  });

  it('should maintain foreign key constraints', () => {
    // Test database constraints
  });
});
```

### E2E Testing with Playwright

For end-to-end tests (future enhancement):

```bash
npm install -D @playwright/test
npx playwright install
```

```typescript
import { test, expect } from '@playwright/test';

test('user can create and study deck', async ({ page }) => {
  await page.goto('http://localhost:3000');
  await page.click('text=Create New Deck');
  await page.fill('#name', 'Test Deck');
  await page.click('text=Create Deck');
  await expect(page.locator('text=Test Deck')).toBeVisible();
});
```

### Performance Testing

For algorithm performance:

```typescript
it('should handle 1000 cards efficiently', () => {
  const start = Date.now();
  for (let i = 0; i < 1000; i++) {
    sm2Update(getInitialCardState(), 4);
  }
  const duration = Date.now() - start;
  expect(duration).toBeLessThan(100); // 100ms for 1000 operations
});
```

---

## Resources

- [Vitest Documentation](https://vitest.dev/)
- [Testing Library Best Practices](https://testing-library.com/docs/guiding-principles/)
- [Kent C. Dodds - Common Testing Mistakes](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)
- [Test-Driven Development by Example](https://www.amazon.com/Test-Driven-Development-Kent-Beck/dp/0321146530)

---

## Summary

Good tests:
- ✅ Are fast and run automatically
- ✅ Test behavior, not implementation
- ✅ Are independent and can run in any order
- ✅ Have clear, descriptive names
- ✅ Focus on edge cases and error handling
- ✅ Provide confidence to refactor

Bad tests:
- ❌ Are slow and manual
- ❌ Test internal implementation details
- ❌ Depend on other tests or shared state
- ❌ Have vague names like "test1" or "works"
- ❌ Only test happy paths
- ❌ Break when code is refactored

Remember: **Tests are a tool, not a goal**. Write tests that provide value and confidence, not just to reach a coverage number.

Happy testing! 🧪
