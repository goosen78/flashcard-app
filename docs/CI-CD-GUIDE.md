# CI/CD Workflows Guide

## Overview

This document explains the Continuous Integration and Continuous Deployment (CI/CD) workflows for the Flashcard App. These workflows help ensure code quality, catch bugs early, and maintain a healthy codebase throughout development.

## Table of Contents

- [What is CI/CD?](#what-is-cicd)
- [Our CI/CD Pipeline](#our-cicd-pipeline)
- [Workflow Configuration](#workflow-configuration)
- [Best Practices](#best-practices)
- [Troubleshooting](#troubleshooting)
- [For Students](#for-students)

---

## What is CI/CD?

**Continuous Integration (CI)** is the practice of automatically testing code changes whenever developers push commits or create pull requests. This helps catch issues early before they reach production.

**Continuous Deployment (CD)** automates the process of deploying tested code to production environments. For this educational project, we focus primarily on CI.

### Benefits

- **Early Bug Detection**: Automated tests catch issues before they're merged
- **Code Quality**: Linting and formatting checks maintain consistent code style
- **Confidence**: Developers can refactor and add features knowing tests will catch regressions
- **Documentation**: Workflow status badges show project health at a glance
- **Learning**: Students experience real-world development practices

---

## Our CI/CD Pipeline

Our pipeline runs automatically on:
- **Push events** to `main` branch or any `copilot/**` branches
- **Pull requests** targeting the `main` branch

### Pipeline Stages

```
┌─────────────────┐
│   Code Pushed   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Checkout Code  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Setup Node.js  │
│  (Multiple      │
│   Versions)     │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│    Install      │
│  Dependencies   │
└────────┬────────┘
         │
         ├──────────────────────┐
         │                      │
         ▼                      ▼
┌─────────────────┐    ┌─────────────────┐
│   Run Linter    │    │  Type Checking  │
└────────┬────────┘    └────────┬────────┘
         │                      │
         └──────────┬───────────┘
                    │
                    ▼
         ┌─────────────────┐
         │   Run Tests     │
         │  (Unit + E2E)   │
         └────────┬────────┘
                  │
                  ▼
         ┌─────────────────┐
         │  Build Project  │
         └────────┬────────┘
                  │
                  ▼
         ┌─────────────────┐
         │ Upload Coverage │
         └────────┬────────┘
                  │
                  ▼
              ┌───────┐
              │ Done! │
              └───────┘
```

---

## Workflow Configuration

### File Location

The workflow is defined in [`.github/workflows/ci.yml`](../.github/workflows/ci.yml).

### Node.js Version Matrix

We test against multiple Node.js versions to ensure compatibility:

```yaml
strategy:
  matrix:
    node-version: [22.x, 23.x]
```

This creates a **matrix build** where tests run in parallel on:
- Node.js 22.x (Current LTS)
- Node.js 23.x (Latest Stable)

**Why multiple versions?**
- Catches compatibility issues early
- Ensures the app works for developers using different Node versions
- Provides confidence when upgrading dependencies

### Jobs and Steps

#### 1. **Checkout Code**

```yaml
- uses: actions/checkout@v4
```

Downloads the repository code to the CI runner.

#### 2. **Setup Node.js**

```yaml
- name: Use Node.js ${{ matrix.node-version }}
  uses: actions/setup-node@v4
  with:
    node-version: ${{ matrix.node-version }}
    cache: 'npm'
```

- Installs the specified Node.js version
- **Caching**: `cache: 'npm'` speeds up builds by caching `node_modules` and npm cache

#### 3. **Install Dependencies**

```yaml
- name: Install dependencies
  run: npm ci
```

**Why `npm ci` instead of `npm install`?**
- Faster and more reliable in CI environments
- Uses exact versions from `package-lock.json`
- Removes existing `node_modules` before installing (clean slate)
- Fails if `package.json` and `package-lock.json` are out of sync

#### 4. **Run Linter**

```yaml
- name: Run linter
  run: npm run lint
  continue-on-error: true
```

Runs ESLint to check code style and catch common errors.

**Note**: `continue-on-error: true` means linting failures won't fail the entire build (useful during development).

#### 5. **Type Checking**

```yaml
- name: Type check
  run: npx tsc --noEmit
```

Verifies TypeScript types without generating output files. Catches type errors early.

#### 6. **Run Tests**

```yaml
- name: Run tests
  run: npm test -- --run --coverage
```

Executes the test suite using Vitest with:
- `--run`: Run tests once (no watch mode)
- `--coverage`: Generate coverage reports

#### 7. **Build Project**

```yaml
- name: Build
  run: npm run build
```

Attempts to build the Next.js application. This catches build-time errors that tests might miss.

#### 8. **Upload Coverage**

```yaml
- name: Upload coverage
  uses: codecov/codecov-action@v4
  if: matrix.node-version == '23.x'
  with:
    files: ./coverage/coverage-final.json
    token: ${{ secrets.CODECOV_TOKEN }}
```

Uploads test coverage to Codecov (only for Node 23.x to avoid duplicate reports).

**Setting up Codecov:**
1. Sign up at [codecov.io](https://codecov.io)
2. Add your repository
3. Add `CODECOV_TOKEN` to GitHub repository secrets

---

## Best Practices

### 1. **Keep Builds Fast**

Slow CI pipelines frustrate developers and slow down development.

**Strategies:**
- Use caching (`cache: 'npm'` in setup-node)
- Run tests in parallel when possible
- Only run expensive checks (like E2E tests) on PR branches

### 2. **Fail Fast**

Configure jobs to fail quickly when issues are detected:

```yaml
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - name: Run tests
        run: npm test
        # No continue-on-error - fail immediately on test failures
```

### 3. **Test Multiple Environments**

Use matrix builds to test across:
- Different Node.js versions
- Different operating systems (Linux, macOS, Windows)
- Different database configurations

### 4. **Enforce Branch Protection**

In GitHub repository settings, require:
- ✅ Status checks must pass before merging
- ✅ Branches must be up to date before merging
- ✅ At least one review approval

### 5. **Use Semantic Versioning**

Follow [Semantic Versioning](https://semver.org/):
- `MAJOR.MINOR.PATCH` (e.g., `1.2.3`)
- Increment MAJOR for breaking changes
- Increment MINOR for new features
- Increment PATCH for bug fixes

### 6. **Keep Dependencies Updated**

Regularly update dependencies to get security patches:

```bash
npm outdated
npm update
npm audit fix
```

Consider using **Dependabot** to automate dependency updates.

### 7. **Write Meaningful Commit Messages**

Good commit messages help with debugging and code review:

```bash
# Bad
git commit -m "fix bug"

# Good
git commit -m "fix: correct SM-2 interval calculation for quality < 3"
```

Follow [Conventional Commits](https://www.conventionalcommits.org/):
- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `test:` Adding tests
- `refactor:` Code refactoring

---

## Troubleshooting

### Build Failing on CI but Passing Locally?

**Common causes:**
1. **Environment differences**: CI uses clean environment, local machine might have cached files
2. **Different Node versions**: Check Node version locally vs CI
3. **Missing environment variables**: CI needs secrets configured in GitHub

**Solutions:**
- Run `npm ci` locally instead of `npm install`
- Delete `node_modules` and reinstall: `rm -rf node_modules package-lock.json && npm install`
- Check Node version: `node --version`

### Tests Timing Out?

Increase timeout in `vitest.config.ts`:

```typescript
export default defineConfig({
  test: {
    testTimeout: 30000, // 30 seconds
  },
});
```

### Linter Errors?

Run linter locally and fix issues:

```bash
npm run lint
npm run lint -- --fix  # Auto-fix some issues
```

### Build Succeeds but App Doesn't Work?

CI might not catch runtime issues. Consider:
- Adding integration/E2E tests
- Testing in staging environment before production
- Using feature flags to deploy incrementally

---

## For Students

### Learning Objectives

By working with this CI/CD pipeline, you'll learn:

1. **Automated Testing**: How tests run automatically on every change
2. **Code Quality**: Tools that enforce consistent code style
3. **Version Control**: How branches and pull requests fit into development workflow
4. **DevOps Practices**: Industry-standard deployment practices

### Exercises

#### Exercise 1: Break the Build (Intentionally!)

1. Create a new branch: `git checkout -b test-ci-failure`
2. Introduce a failing test in `tests/sm2.test.ts`
3. Push the branch and create a pull request
4. Observe the CI failure
5. Fix the test and see CI pass

**What you'll learn**: How CI catches issues before they reach main branch

#### Exercise 2: Add a New Test

1. Create a branch: `git checkout -b add-card-test`
2. Add a test in `tests/selection.test.ts` for card selection logic
3. Run tests locally: `npm test`
4. Push and create PR
5. Watch CI validate your test

**What you'll learn**: Test-driven development workflow

#### Exercise 3: Improve Coverage

1. Run coverage locally: `npm test -- --coverage`
2. Find an untested function
3. Write tests to cover it
4. Push and see coverage improve in Codecov

**What you'll learn**: Measuring and improving code quality

#### Exercise 4: Using Claude Code with CI

1. Ask Claude Code to add a feature
2. Keep changes in a separate branch (e.g., `copilot/feature-name`)
3. Let CI validate the AI-generated code
4. Review and refine based on CI feedback

**What you'll learn**: How to safely integrate AI-generated code

### Working with Branches

For AI-assisted development, use the `copilot/**` branch pattern:

```bash
# Create a feature branch
git checkout -b copilot/add-card-tags

# Make changes with Claude Code
# ...

# Commit changes
git add .
git commit -m "feat: add tagging system for flashcards"

# Push branch
git push origin copilot/add-card-tags

# Create pull request on GitHub
```

CI will automatically run on your branch, ensuring AI-generated code meets quality standards.

---

## Additional Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Vitest Documentation](https://vitest.dev/)
- [Next.js Testing Documentation](https://nextjs.org/docs/testing)
- [Learn With Martian Paper](https://www.cis.upenn.edu/~ccb/publications/learn-with-martian.pdf)

---

## Questions?

If you encounter issues with CI/CD:
1. Check the Actions tab on GitHub for detailed logs
2. Search for similar issues in the repository
3. Ask your instructor or TA
4. Consult the resources above

Remember: CI/CD is a **learning tool**, not just a gatekeeper. Use it to improve your code quality and development skills!
