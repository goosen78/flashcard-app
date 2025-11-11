# Instructor Guide: AI Capstone Flashcard App

## 📋 Overview

This guide provides instructors with everything needed to effectively teach the AI Capstone flashcard app module. It includes learning objectives, teaching strategies, grading rubrics, common student challenges, and extension ideas.

---

## 🎯 Course Goals

### Primary Learning Outcomes

By the end of this module, students should be able to:

1. **Effectively use AI coding assistants** in professional development workflows
2. **Critically evaluate** AI-generated code for correctness, security, and maintainability
3. **Understand and extend** unfamiliar codebases using AI assistance
4. **Apply software engineering best practices**:
   - Test-driven development
   - Git branching strategies
   - Code review processes
   - CI/CD pipelines
5. **Design and implement AI integrations** using LLM APIs
6. **Evaluate educational technology** through the lens of learning science
7. **Make evidence-based decisions** about when to use AI vs. manual coding

### Secondary Learning Outcomes

- Understanding of spaced repetition algorithms (SM-2)
- Full-stack web development with Next.js
- Database design and SQL
- TypeScript type safety
- React component architecture
- API design and error handling

---

## 📚 Module Structure

### Recommended Timeline

**Week 1: Foundations** (Required)
- Day 1-2: Setup, exploration, understanding
- Day 3-4: First features with AI assistance
- Day 5-6: Testing and CI/CD
- Day 7: Reflection and submission

**Week 2: Advanced Topics** (Optional)
- Days 8-10: AI integration (LLM APIs, document processing)
- Days 11-13: Analytics, extensions, or creative features
- Day 14: Final project presentation

### Flexible Scheduling

The module is designed to be flexible:

- **1-week intensive**: Focus on Week 1 core assignments
- **2-week standard**: Include 2-3 advanced topics from Week 2
- **3-week comprehensive**: Complete all assignments plus final project
- **Semester-long**: Use as running example alongside other AI topics

---

## 🎓 Teaching Strategies

### Week 1: Foundations

#### Day 1-2: Understanding the Codebase

**Learning Objective**: Students can explain the system architecture and SM-2 algorithm.

**Teaching Activities**:

1. **Kickoff Lecture** (45 min):
   - Overview of spaced repetition and learning science
   - Demo of the flashcard app
   - Introduction to Claude Code
   - Example prompting session

2. **Guided Code Exploration** (45 min):
   - Walk through `db/schema.sql` together
   - Trace a review submission from UI → Server Action → Database
   - Explain pure functions vs. side effects
   - Demonstrate using Claude Code to understand code

3. **Independent Exploration** (remainder):
   - Students read documentation
   - Use Claude Code to answer questions
   - Run the app and create test data

**Assessment**: Understanding summary (1 page)

**Common Challenges**:
- Students unfamiliar with Next.js Server Actions
  - *Solution*: Provide Next.js tutorial links, use Claude Code to explain
- Confusion about SM-2 algorithm
  - *Solution*: Walk through example calculations on whiteboard
- Database query syntax
  - *Solution*: Live demo with `sqlite3` command-line tool

---

#### Day 3-4: First Features

**Learning Objective**: Students can add features using AI assistance while maintaining code quality.

**Teaching Activities**:

1. **Live Coding Session** (45 min):
   - Demonstrate adding a feature with Claude Code
   - Show how to review AI-generated code
   - Model testing process
   - Show Git workflow (branch, commit, push)

2. **Pair Programming** (optional, 30 min):
   - Students pair up
   - One "drives" (types), one "navigates" (guides)
   - Switch roles halfway
   - Promotes code review skills

3. **Independent Work**:
   - Students complete Assignments 1-3
   - Instructor circulates for help
   - Encourage students to help each other

**Assessment**: Three working features with tests and Git history

**Common Challenges**:
- Over-reliance on AI without understanding
  - *Solution*: Require code explanations in commits/PR descriptions
- Tests failing due to async issues
  - *Solution*: Review promise handling and async/await
- Git merge conflicts
  - *Solution*: Mini-lecture on resolving conflicts, or use Claude Code

**Pro Tips**:
- Encourage students to use Claude Code for refactoring, not just new code
- Show how to iterate on prompts when first response isn't ideal
- Emphasize reading diffs before committing

---

#### Day 5-6: Testing & CI/CD

**Learning Objective**: Students understand why testing is critical for AI-generated code.

**Teaching Activities**:

1. **Testing Philosophy Lecture** (30 min):
   - Why tests matter more with AI code
   - Unit vs. integration vs. property-based tests
   - Test-driven development workflow
   - Coverage metrics (what they mean and don't mean)

2. **Live Testing Demo** (30 min):
   - Write a test first (TDD)
   - Use Claude Code to implement the feature
   - Run tests, debug failures
   - Show coverage report

3. **CI/CD Workshop** (30 min):
   - Explain GitHub Actions
   - Walk through `.github/workflows/ci.yml`
   - Trigger a workflow, view results
   - Discuss why CI is important

4. **Independent Work**:
   - Students complete Assignments 4-5
   - Write comprehensive tests
   - Achieve >80% coverage

**Assessment**: Test suite with >80% coverage, all tests passing in CI

**Common Challenges**:
- Students write shallow tests that don't catch bugs
  - *Solution*: Require edge case testing, use code review
- Property-based tests are confusing
  - *Solution*: Provide examples, explain invariants
- CI failures due to environment differences
  - *Solution*: Teach about reproducible builds, environment variables

**Pro Tips**:
- Show examples of bugs AI code introduced that tests caught
- Use `npm run test:ui` for interactive debugging
- Discuss test naming conventions ("should do X when Y")

---

#### Day 7: Reflection

**Learning Objective**: Students critically reflect on AI-assisted development.

**Teaching Activities**:

1. **Group Discussion** (45 min):
   - What did Claude Code excel at?
   - What mistakes did it make?
   - How did you verify correctness?
   - When would you not use AI?

2. **Peer Code Review** (45 min):
   - Students review each other's pull requests
   - Look for: code quality, test coverage, commit messages
   - Provide constructive feedback

3. **Reflection Writing**:
   - Students write 2-3 page reflection
   - Use provided prompts in STUDENT_GUIDE.md

**Assessment**: Reflection paper (see grading rubric below)

**Discussion Prompts**:
- "Describe a time Claude Code generated incorrect code. How did you catch it?"
- "What was the most useful explanation Claude Code provided?"
- "How did tests change your confidence in AI-generated code?"
- "Would you use AI assistants in a production codebase? Why or why not?"

---

### Week 2: Advanced Topics (Optional)

#### Days 8-10: AI Integration

**Learning Objective**: Students can integrate LLM APIs and evaluate output quality.

**Teaching Activities**:

1. **LLM APIs Lecture** (45 min):
   - Overview of major providers (OpenAI, Anthropic, Ollama)
   - API authentication and rate limits
   - Prompt engineering for question generation
   - Handling errors and retries
   - Cost considerations

2. **Prompt Engineering Workshop** (45 min):
   - Design prompt for flashcard generation
   - Test with different models
   - Compare outputs
   - Iterate to improve quality

3. **Quality Evaluation Discussion** (30 min):
   - What makes a good flashcard?
   - How to detect hallucinations?
   - Human-in-the-loop curation
   - Metrics for automated quality assessment

4. **Independent Work**:
   - Students implement Assignment 7 or 8
   - Test with real content
   - Evaluate quality

**Assessment**: Working LLM integration with quality report

**Common Challenges**:
- API keys and billing setup
  - *Solution*: Provide test accounts or use Ollama (free, local)
- Poor quality generated questions
  - *Solution*: Workshop on prompt engineering, provide examples
- Handling API errors and rate limits
  - *Solution*: Teach retry logic and exponential backoff

**Pro Tips**:
- Use Ollama for students without API access
- Provide a budget if using paid APIs
- Show examples of good vs. poor generated flashcards

---

#### Days 11-13: Analytics & Extensions

**Learning Objective**: Students can design and implement novel features.

**Teaching Activities**:

1. **Analytics Lecture** (optional, 30 min):
   - Introduction to Item Response Theory (IRT)
   - Learning analytics and dashboards
   - Privacy and ethics in educational data

2. **Feature Design Workshop** (45 min):
   - Students brainstorm extensions
   - Sketch UI mockups
   - Design data models
   - Identify challenges

3. **Independent Work**:
   - Students choose 1-2 advanced assignments
   - Or propose their own feature (with approval)

**Assessment**: Working feature with documentation

**Suggested Projects** (if students struggle with ideas):
- Dark mode toggle
- Export deck to PDF/Anki format
- Deck templates (pre-made question sets)
- Voice recording for pronunciation cards
- Image occlusion cards
- Collaborative decks with sharing

---

#### Day 14: Final Presentations

**Learning Objective**: Students can communicate technical work effectively.

**Format**:

- 5 minutes per student
- 3-minute demo + 2-minute Q&A
- Required: show feature, explain design decisions, discuss challenges

**Grading Criteria**:
- Clarity of explanation
- Depth of technical understanding
- Creativity/novelty of feature
- Code quality

---

## 📊 Grading Rubrics

### Assignment Grading (Week 1)

#### Assignment 1-3: Features (10 points each)

| Criteria | Excellent (9-10) | Good (7-8) | Adequate (5-6) | Poor (0-4) |
|----------|------------------|------------|----------------|------------|
| **Functionality** | Feature works perfectly, handles edge cases | Feature works with minor issues | Feature works but has significant bugs | Feature doesn't work or is incomplete |
| **Code Quality** | Clean, readable, follows existing patterns | Mostly clean with minor style issues | Inconsistent style or unclear code | Poor code quality, hard to understand |
| **Testing** | Comprehensive tests, >80% coverage | Good tests, 60-80% coverage | Minimal tests, <60% coverage | No tests or tests don't pass |
| **Git Usage** | Clean commits, good messages, proper branching | Commits are okay, some unclear messages | Poor commit hygiene, large commits | No version control or single commit |

#### Assignment 4-5: Testing (10 points each)

| Criteria | Excellent (9-10) | Good (7-8) | Adequate (5-6) | Poor (0-4) |
|----------|------------------|------------|----------------|------------|
| **Coverage** | >90% coverage, all edge cases | 80-90% coverage, most edge cases | 60-80% coverage, basic cases only | <60% coverage or tests don't pass |
| **Test Quality** | Meaningful assertions, good descriptions | Assertions are okay, descriptions adequate | Weak assertions, unclear descriptions | Trivial tests that don't validate behavior |
| **Edge Cases** | Comprehensive edge case testing | Good edge case coverage | Some edge cases tested | No edge case testing |
| **Property Tests** | Tests meaningful invariants, finds bugs | Tests some invariants | Minimal property testing | No property testing or doesn't work |

#### Reflection Paper (10 points)

| Criteria | Excellent (9-10) | Good (7-8) | Adequate (5-6) | Poor (0-4) |
|----------|------------------|------------|----------------|------------|
| **Depth** | Deep insights, nuanced analysis | Good analysis, some insights | Surface-level analysis | Superficial or missing |
| **Evidence** | Specific examples from experience | Some examples provided | Vague references | No examples |
| **Critical Thinking** | Questions assumptions, considers trade-offs | Some critical thinking | Mostly descriptive | No critical analysis |
| **Writing Quality** | Clear, well-organized, no errors | Mostly clear, minor errors | Unclear at times, several errors | Poor writing, many errors |

---

### Advanced Topics Grading (Week 2)

#### LLM Integration / PDF Processing (15 points)

| Criteria | Points | Description |
|----------|--------|-------------|
| **Implementation** | 0-6 | Works reliably, handles errors, good architecture |
| **Quality** | 0-4 | Generated content quality, prompt engineering |
| **Documentation** | 0-3 | Clear report, explains decisions |
| **Testing** | 0-2 | Tests edge cases, validates output |

#### Analytics / Interactive Cards / IRT (10 points)

| Criteria | Points | Description |
|----------|--------|-------------|
| **Implementation** | 0-5 | Feature works correctly, good UX |
| **Complexity** | 0-3 | Demonstrates technical depth |
| **Documentation** | 0-2 | Clear code, helpful comments |

#### Final Project (5 points)

| Criteria | Points | Description |
|----------|--------|-------------|
| **Creativity** | 0-2 | Novel idea or unique implementation |
| **Execution** | 0-2 | Works well, polished |
| **Learning** | 0-1 | Demonstrates growth and learning |

---

## 🎯 Learning Assessment

### Formative Assessment (Throughout)

- **Code reviews**: Check Git commits regularly
- **Office hours**: Gauge understanding through questions
- **Test results**: Monitor CI/CD pipeline
- **Peer discussions**: Observe group work

### Summative Assessment (End of Week 1)

- **Features working**: Demonstrates technical skill
- **Test coverage**: Shows understanding of quality
- **Reflection paper**: Reveals critical thinking
- **Git history**: Indicates professional practices

### Advanced Assessment (Week 2, if applicable)

- **Feature complexity**: Demonstrates depth
- **Quality of AI integration**: Shows prompt engineering skill
- **Documentation**: Indicates communication ability
- **Presentation**: Reveals understanding and articulation

---

## 🔧 Technical Setup for Instructors

### Before Class

1. **Test the starter repo**:
   ```bash
   git clone https://github.com/goosen78/flashcard-app.git
   cd flashcard-app
   npm install
   npm test
   npm run build
   npm run dev
   ```

2. **Set up demo accounts**:
   - OpenAI API (if using)
   - Anthropic API (if using)
   - GitHub organization for student forks

3. **Create example content**:
   - Sample decks with 20-30 cards
   - Test PDFs for document processing
   - Example prompts for LLM integration

4. **Prepare environment**:
   - GitHub Classroom setup (optional)
   - Autograder configuration (optional)
   - Discussion forum/Slack channel

### During Class

**Live Coding Environment**:
- VS Code with Claude Code installed
- Terminal visible for commands
- Browser with React DevTools
- Database viewer (e.g., DB Browser for SQLite)

**Demo Data**:
- Pre-created deck with various card types
- Cards at different intervals (due, new, future)
- Review history for analytics demos

**Backup Plans**:
- Recorded demos if live coding fails
- Offline documentation
- Local Ollama if APIs are down

---

## 🚨 Common Student Issues & Solutions

### Technical Issues

| Issue | Solution |
|-------|----------|
| "npm install fails" | Check Node version (18+), clear npm cache, delete node_modules |
| "Database locked" | Close all connections, restart dev server |
| "Tests timeout" | Increase timeout in vitest.config.ts, check for infinite loops |
| "CI fails but tests pass locally" | Check environment variables, Node version, timezone issues |
| "Claude Code isn't working" | Check API key, internet connection, VS Code extension version |

### Conceptual Issues

| Issue | Solution |
|-------|----------|
| "I don't understand SM-2" | Walk through calculation example, use Claude Code to explain |
| "What's a Server Action?" | Explain server vs. client, show Network tab in browser |
| "Why are tests important?" | Show example of AI bug that tests caught |
| "How do I know if AI code is correct?" | Teach verification strategies: read, test, review |

### Workflow Issues

| Issue | Solution |
|-------|----------|
| "I have merge conflicts" | Git workshop, use Claude Code for help |
| "My commits are messy" | Teach `git rebase -i` or start over with clean branch |
| "I can't think of a prompt" | Provide examples, pair students to brainstorm |
| "AI keeps generating wrong code" | Teach iterative prompting, adding more context |

---

## 💡 Extension Ideas for Advanced Students

### Technical Challenges

1. **Performance Optimization**:
   - Profile the app with 100,000 cards
   - Implement virtual scrolling
   - Add database indexes
   - Benchmark query performance

2. **Security Audit**:
   - Review for SQL injection vulnerabilities
   - Implement input validation
   - Add rate limiting
   - Security headers

3. **Accessibility**:
   - Full keyboard navigation
   - Screen reader support
   - WCAG 2.1 AA compliance
   - Color contrast checking

4. **Internationalization**:
   - Multi-language UI
   - RTL layout support
   - Locale-specific date formatting
   - Translation management

### Research Projects

1. **Algorithm Comparison**:
   - Implement Anki's FSRS algorithm
   - A/B test SM-2 vs. FSRS
   - Analyze which performs better
   - Write research paper

2. **LLM Evaluation**:
   - Compare GPT-4 vs. Claude vs. local models
   - Evaluate question quality
   - Measure cost per card
   - Optimize prompts

3. **Learning Analytics**:
   - Implement IRT model
   - Predict student performance
   - Identify at-risk students
   - Recommend interventions

4. **UI/UX Research**:
   - User testing with real students
   - Iterate on design
   - Measure learning outcomes
   - Report findings

---

## 📚 Supplementary Materials

### Recommended Readings

**Spaced Repetition**:
- Wozniak, P. A. (1990). "SuperMemo 2 Algorithm"
- Kornell, N., & Bjork, R. A. (2008). "Learning Concepts and Categories"
- Bahrick, H. P. (1979). "Maintenance of Knowledge"

**AI in Education**:
- "Learn With Martian" paper (provided)
- Roll, I., & Wylie, R. (2016). "Evolution and Revolution in AI in Education"
- Holstein, K., et al. (2019). "Student Learning Benefits of AI"

**AI Coding Assistants**:
- Barke, S., et al. (2022). "Grounded Copilot"
- Vaithilingam, P., et al. (2022). "Expectation vs. Experience with Copilot"
- Prather, J., et al. (2023). "Copilot in CS Education"

### Video Resources

- Net Ninja Claude Code Tutorial (linked in STUDENT_GUIDE.md)
- Next.js 14 App Router Tutorial
- TypeScript for React Developers
- Testing JavaScript with Vitest
- Git & GitHub for Beginners

### Tools & Services

**Development**:
- [VS Code](https://code.visualstudio.com/)
- [Claude Code Extension](https://marketplace.visualstudio.com/)
- [DB Browser for SQLite](https://sqlitebrowser.org/)

**APIs**:
- [OpenAI Platform](https://platform.openai.com/)
- [Anthropic Console](https://console.anthropic.com/)
- [Ollama](https://ollama.ai/)

**Deployment**:
- [Vercel](https://vercel.com/) - Easy Next.js hosting
- [Railway](https://railway.app/) - Database hosting
- [Render](https://render.com/) - Alternative hosting

---

## 🎓 Pedagogical Notes

### Course Philosophy

This module teaches **AI-assisted software engineering**, not just coding. Key principles:

1. **AI as a tool, not a replacement**: Students must understand code, not just generate it
2. **Verification is critical**: Tests and code review are non-negotiable
3. **Learn by doing**: Hands-on work with real systems
4. **Reflection matters**: Metacognition about AI use is valuable
5. **Professional practices**: Git, testing, CI/CD are essential

### Active Learning Strategies

- **Live coding**: Model thinking process, not just final code
- **Pair programming**: Promotes discussion and peer learning
- **Code reviews**: Students learn by reviewing others' work
- **Think-alouds**: Verbalize reasoning while problem-solving
- **Productive struggle**: Let students wrestle with problems before helping

### Differentiation

**For struggling students**:
- More scaffolding (detailed prompts, pair programming)
- Focus on Week 1 core assignments
- Extra office hours or tutoring
- Allow revisions after feedback

**For advanced students**:
- Week 2 advanced topics
- Open-ended final project
- Research paper option
- Peer tutoring role

### Assessment Philosophy

- **Formative > summative**: Emphasize learning over grades
- **Process > product**: Value reflection and iteration
- **Growth mindset**: Encourage learning from mistakes
- **Authentic tasks**: Real-world skills and tools

---

## 📅 Sample Syllabus Section

**Module: AI-Assisted Development with Flashcard App (Weeks 4-5)**

**Overview**: Learn to use AI coding assistants effectively while building a spaced repetition flashcard application. Develop skills in code review, testing, and professional development workflows.

**Prerequisites**: JavaScript/TypeScript basics, Git fundamentals, React knowledge helpful but not required.

**Time Commitment**: 8-10 hours per week (1-week module) or 15-20 hours (2-week module)

**Deliverables**:
- Week 1: Three feature implementations, test suite, reflection paper
- Week 2 (optional): AI integration, advanced feature, final presentation

**Grading**:
- Features & Tests: 60%
- Reflection: 10%
- Advanced Topics: 20% (if Week 2)
- Presentation: 10% (if Week 2)
- Code Quality & Git: Bonus up to 15%

**Resources**:
- [Starter repository](https://github.com/goosen78/flashcard-app)
- [STUDENT_GUIDE.md](STUDENT_GUIDE.md)
- Office hours: [days/times]
- Discussion forum: [link]

---

## ❓ FAQ for Instructors

### Q: How much time should I expect to spend grading?

**A**: Approximately 30-45 minutes per student for Week 1 (review features, tests, reflection). Week 2 adds another 15-30 minutes (review advanced feature, watch presentation).

**Grading tips**:
- Use GitHub's code review interface
- Check CI status first (tests passing?)
- Skim test coverage reports
- Focus on reflection paper for critical thinking

---

### Q: What if students copy each other's code?

**A**: This is actually difficult in this assignment because:
1. Each student's AI prompts will be slightly different
2. Git history shows when code was written
3. Reflection papers reveal understanding (or lack thereof)

**If suspected**:
- Check Git commit times and messages
- Ask students to explain their code in office hours
- Compare reflection papers for similarity

---

### Q: Should I provide API keys or have students get their own?

**A**: Options:

1. **Students get their own** (recommended):
   - Teaches real-world setup
   - No cost to department
   - Use Ollama for students without credit cards

2. **Provide test accounts**:
   - Easier for students
   - Control costs with quotas
   - Requires setup and monitoring

3. **Hybrid**:
   - Students get their own for advanced work
   - Provide test accounts for demos/workshops

---

### Q: What if the Next.js or other dependencies break with updates?

**A**: Lock dependencies in `package.json` (already done). If you need to update:

```bash
# Test before assigning
npm install
npm test
npm run build
npm run dev

# If issues, rollback or update STUDENT_GUIDE.md
```

---

### Q: How do I handle students who finish early?

**A**: Provide extension challenges:

- "Refactor the code to improve performance"
- "Add comprehensive error handling"
- "Write documentation for a new developer"
- "Implement one of the advanced topics"
- "Help peer review other students' code"

---

### Q: Can this module be shortened to a single class session?

**A**: Yes, for a demo/intro session:

**3-Hour Workshop**:
- Hour 1: Lecture on AI assistants + demo
- Hour 2: Guided hands-on (install, explore, one feature)
- Hour 3: Share results, discuss experiences

**Homework**: Reflection on experience (1 page)

---

### Q: What preparation is needed if I'm not familiar with Next.js?

**A**: Recommended preparation (4-6 hours):

1. Complete the [Next.js tutorial](https://nextjs.org/learn) (2-3 hours)
2. Read about Server Actions (30 min)
3. Run the flashcard app yourself (1 hour)
4. Try adding a feature with Claude Code (1-2 hours)

The codebase is small and well-documented, so it's learnable quickly.

---

## 🎉 Conclusion

This module provides a comprehensive learning experience in AI-assisted development. Students will:

- Gain practical skills in using AI coding assistants
- Learn professional development workflows
- Understand the importance of testing and verification
- Explore educational technology applications of AI
- Develop critical thinking about AI capabilities and limitations

The flashcard app provides a **real, useful application** (students can use it to study!) while teaching **fundamental software engineering practices**.

**Good luck with your course! 🚀**

---

## 📧 Instructor Support

For questions or improvements to this guide:

- **GitHub Issues**: [Repository link]
- **Email**: [Contact email]
- **Discussion**: [Instructor forum/Slack]

---

**Built with ❤️ for AI Capstone (Summer 2026)**
*University of Pennsylvania*
